import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

import path from 'path';
import fs from 'fs';

dotenv.config();
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

import challengeRoutes from './routes/challenges';
import aiRoutes from './routes/ai';
import roomsRoutes from './routes/rooms';

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'mock',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || (process.env.NODE_ENV === 'production' ? '/auth/google/callback' : 'http://localhost:3001/auth/google/callback')
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0].value || '';
            // Find or create user
            let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
            if (!user) {
                // If googleId not found, fallback to email check (rare but safe)
                user = await prisma.user.findUnique({ where: { email } });
                if (user) {
                    // Update existing user with googleId
                    user = await prisma.user.update({
                        where: { id: user.id },
                        data: { googleId: profile.id, avatarUrl: profile.photos?.[0].value }
                    });
                } else {
                    // First login: create User and DebugStreak
                    user = await prisma.user.create({
                        data: {
                            email,
                            googleId: profile.id,
                            username: `user_${Math.floor(Math.random() * 100000)}`, // simple unique username
                            avatarUrl: profile.photos?.[0].value,
                            streak: {
                                create: { currentStreak: 0, longestStreak: 0, rhythmScore: 0, avgReasoningScore: 0 }
                            }
                        }
                    });
                }
            }
            return done(null, user);
        } catch (error) {
            return done(error as Error, undefined);
        }
    }
));

// Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req: any, res: any) => {
        // Issue JWT
        const user = req.user;
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        // Set httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });

        // Redirect to frontend dashboard
        const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5173');
        res.redirect(frontendUrl);
    }
);

// Auth Middleware
export const authenticateJWT = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = user;
        next();
    });
};

app.get('/auth/me', authenticateJWT, async (req: any, res: any) => {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Use getValidStreak to ensure streak resets are handled on-read
    const { getValidStreak } = require('./services/streak.service');
    const streak = await getValidStreak(userId);

    res.json({ success: true, data: { ...user, streak } });
});

// Mock Login for local dev if google auth isn't configured
app.post('/auth/mock-login', async (req, res) => {
    let user = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'demo@example.com',
                username: 'DemoUser',
                streak: { create: { currentStreak: 0, longestStreak: 0, rhythmScore: 0, avgReasoningScore: 0 } }
            }
        });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7
    });
    res.json({ success: true, data: user });
});

app.post('/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
});

// User Preferences
app.patch('/api/preferences', authenticateJWT, async (req: any, res: any) => {
    const { preferredLanguage } = req.body;
    const validLanguages = ['python', 'java', 'cpp'];
    if (preferredLanguage && !validLanguages.includes(preferredLanguage)) {
        return res.status(400).json({ error: `Invalid language. Choose from: ${validLanguages.join(', ')}` });
    }
    const updated = await prisma.user.update({
        where: { id: req.user.userId },
        data: { ...(preferredLanguage && { preferredLanguage }) },
        include: { streak: true }
    });
    res.json({ success: true, data: updated });
});

// Public AI Routes (No JWT needed for simulator hints)
import { generatePersonalizedHint } from './services/llm.service';
app.post('/api/ai/incident-hint', async (req, res) => {
    try {
        const { scenarioContext, currentStateDesc, recentLogs } = req.body;
        const hint = await generatePersonalizedHint(scenarioContext, currentStateDesc, recentLogs);
        res.json({ success: true, hint });
    } catch (e: any) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.use('/api/challenges', authenticateJWT, challengeRoutes);
app.use('/api/ai', authenticateJWT, aiRoutes);
app.use('/api/rooms', authenticateJWT, roomsRoutes);

app.get('/', (req, res) => {
    res.json({
        status: "online",
        message: "DebugHub API is running",
        timestamp: new Date().toISOString()
    });
});

// Serve Static Files in Production
if (process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true') {
    const frontendPath = path.resolve(__dirname, '../../../frontend/dist');

    app.use(express.static(frontendPath));
    app.use((req, res, next) => {
        if (!req.path.startsWith('/api') && !req.path.startsWith('/auth')) {
            res.sendFile(path.join(frontendPath, 'index.html'));
        } else {
            next();
        }
    });
}

// Scheduling Reminders (node-cron)
import cron from 'node-cron';
import { sendDailyReminder } from './services/email.service';

// Run every day at 14:30 UTC (20:00 IST) - 4 hours before IST day-end
cron.schedule('30 14 * * *', async () => {
    console.log('[CRON] Running daily reminder check at 8 PM IST...');
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const challenge = await prisma.dailyChallenge.findFirst({ where: { date: today } });
    if (!challenge) {
        console.log('[CRON] No official daily challenge found for today.');
        return;
    }

    // Find users who haven't solved today's challenge
    const users = await prisma.user.findMany({
        where: {
            attempts: {
                none: {
                    challengeId: challenge.id,
                    solved: true
                }
            }
        }
    });

    console.log(`[CRON] Found ${users.length} users who haven't solved today's bug yet.`);
    for (const user of users) {
        await sendDailyReminder(user.email, user.username || 'Debugger');
    }
});

const server = app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
