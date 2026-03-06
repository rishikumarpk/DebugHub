import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateAiDiagnosticPath, generatePersonalizedHint } from '../services/llm.service';

const router = Router();
const prisma = new PrismaClient();

// Get the split view diagnostic paths for a challenge attempt
router.get('/paths/:challengeId/:attemptId', async (req: any, res) => {
    const { challengeId, attemptId } = req.params;

    // In a real app, verify the attempt belongs to req.user.userId

    try {
        let challenge: any = await prisma.dailyChallenge.findUnique({ where: { id: challengeId } });
        let isPractice = false;

        if (!challenge) {
            challenge = await prisma.practiceChallenge.findUnique({ where: { id: challengeId } });
            if (challenge) isPractice = true;
        }

        if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

        if (isPractice) {
            // Use real AI diagnostic path generation for practice challenges
            const steps = await generateAiDiagnosticPath(challenge.bugType, challenge.buggyCode, challenge.context);

            const expertPathData = [
                { action: "Review Requirements", reasoning: `Expert looks at ${challenge.context} and understands the goal.`, codeState: challenge.buggyCode },
                { action: "Trace Execution", reasoning: "Expert traces the variables and spots the root cause immediately.", codeState: challenge.buggyCode },
                { action: "Implement Robust Fix", reasoning: "Expert implements a fix taking edge cases into account.", codeState: challenge.correctCode }
            ];

            return res.json({
                success: true,
                data: {
                    aiPath: steps,
                    expertPath: expertPathData,
                    humanPath: null,
                    matchScore: 85
                }
            });
        }

        let aiPath = await prisma.diagnosticPath.findFirst({
            where: { challengeId, pathType: 'AI' }
        });

        if (!aiPath) {
            // Generate on the fly if it doesn't exist
            const steps = await generateAiDiagnosticPath(challenge.bugType, challenge.buggyCode, challenge.context);
            aiPath = await prisma.diagnosticPath.create({
                data: {
                    challengeId,
                    pathType: 'AI',
                    steps: JSON.stringify(steps)
                }
            });
        }

        let expertPath = await prisma.diagnosticPath.findFirst({
            where: { challengeId, pathType: 'EXPERT' }
        });

        if (!expertPath) {
            // Mock expert path for the UI demonstration
            const expertSteps = [
                { action: "Review Requirements", reasoning: `Expert looks at ${challenge.context} and understands the end goal.`, codeState: challenge.buggyCode },
                { action: "Trace Execution", reasoning: "Expert traces the variables and spots the root cause immediately.", codeState: challenge.buggyCode },
                { action: "Implement Robust Fix", reasoning: "Expert implements a fix taking edge cases into account.", codeState: challenge.correctCode }
            ];
            expertPath = await prisma.diagnosticPath.create({
                data: {
                    challengeId,
                    pathType: 'EXPERT',
                    steps: JSON.stringify(expertSteps)
                }
            });
        }

        const humanPath = await prisma.diagnosticPath.findFirst({
            where: { attemptId, pathType: 'HUMAN' }
        });

        res.json({
            success: true,
            data: {
                aiPath: JSON.parse(aiPath.steps),
                expertPath: JSON.parse(expertPath.steps),
                humanPath: humanPath ? JSON.parse(humanPath.steps) : null,
                matchScore: humanPath?.matchScore || null
            }
        });
    } catch (e: any) {
        res.status(500).json({ success: false, error: e.message });
    }
});

router.post('/incident-hint', async (req, res) => {
    try {
        const { scenarioContext, currentStateDesc, recentLogs } = req.body;
        const hint = await generatePersonalizedHint(scenarioContext, currentStateDesc, recentLogs);
        res.json({ success: true, hint });
    } catch (e: any) {
        res.status(500).json({ success: false, error: e.message });
    }
});

export default router;
