// Topbar includes logo, streak, theme toggle, and user controls
import { useState } from 'react';
import { LogOut, Crown } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { API_URL, getAuthHeaders } from '../../config';
import PricingModal from '../ui/PricingModal';

const Topbar = () => {
    const { user, setUser } = useAuthStore();
    const [showPricing, setShowPricing] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders()
            });
        } catch (e) { }
        localStorage.removeItem('auth_token');
        setUser(null);
    };



    return (
        <>
            <header className="h-12 bg-[var(--topbar-bg)] backdrop-blur-[16px] border-b border-[var(--border-primary)] flex items-center justify-between px-6 shrink-0 relative z-40 transition-colors duration-300">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        {/* Logo */}
                        <span className="font-display font-bold text-[var(--text-primary)] text-lg cursor-pointer">
                            DebugHub
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Streak */}
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🔥</span>
                        <span className="font-display font-bold text-[var(--text-primary)] text-lg">{user?.streak?.currentStreak || 0} streak</span>
                    </div>

                    {/* Get Pro Button */}
                    <button
                        onClick={() => setShowPricing(true)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-body text-[12px] font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 cursor-pointer"
                        style={{
                            background: 'linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(139,92,246,0.08) 100%)',
                            border: '1px solid rgba(167,139,250,0.35)',
                            color: '#A78BFA',
                            animation: 'pro-glow 3s ease-in-out infinite',
                        }}
                    >
                        <Crown size={13} />
                        Get Pro
                    </button>

                    {/* Progress Rhythm */}
                    <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--lavender-purple)] rounded-full transition-all duration-500"
                                style={{ width: `${user?.streak?.rhythmScore || 0}%` }}
                            ></div>
                        </div>
                        <span className="font-body text-xs text-[var(--text-muted)] uppercase tracking-wider">{user?.streak?.rhythmScore || 0}% rhythm</span>
                    </div>

                    {/* Today tick */}
                    <div className="flex items-center gap-1 text-[var(--text-muted)] font-body text-xs whitespace-nowrap">
                        Today <span className="text-[var(--text-primary)] font-bold">✓</span>
                    </div>

                    {/* Avatar & Logout */}
                    <div className="flex items-center gap-4 ml-2">
                        <div className="w-8 h-8 rounded-full border border-[var(--border-primary)] bg-[var(--surface-primary)] overflow-hidden cursor-pointer transition-transform hover:scale-105">
                            <img src={user?.avatarUrl || import.meta.env.VITE_DEFAULT_AVATAR_URL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="User Avatar" className="w-full h-full object-cover" />
                        </div>
                        <button onClick={handleLogout} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Pricing Modal */}
            <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
        </>
    );
};

export default Topbar;
