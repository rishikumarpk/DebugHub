import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { BugOff } from 'lucide-react';

export function Navbar() {
    const { user, isAuthenticated } = useAuthStore();

    return (
        <nav className="border-b border-gray-800 bg-gray-950 p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    <BugOff className="text-emerald-500" />
                    DebugHub
                </Link>
                <div className="flex items-center gap-6">
                    <Link to="/community" className="hidden sm:block text-[#E0E0E0] hover:text-[#E0E0E0] font-medium transition-colors">Community</Link>
                    <Link to="/portfolio" className="hidden sm:block text-[#E0E0E0] hover:text-[#E0E0E0] font-medium transition-colors">Portfolio</Link>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Link to="/portfolio" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <span className="text-[#E0E0E0] font-medium">{user?.username}</span>
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border border-gray-700" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-sm">
                                        {user?.username?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </Link>
                        </div>
                    ) : (
                        <Link to="/login" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-[#E0E0E0] rounded-md font-medium transition-colors">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
