import { useState } from 'react';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';

export const RoleSelector = ({ onStart }: any) => {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const roles = [
        {
            id: "Systems Engineer",
            title: "On-Call Systems Engineer",
            icon: <Terminal className="w-6 h-6 mb-2" />,
            desc: "Monitor raw infrastructure logs and system process states.",
            diff: "Hard"
        },
        {
            id: "Risk Officer",
            title: "Risk & Trading Operations Officer",
            icon: <ShieldAlert className="w-6 h-6 mb-2" />,
            desc: "Analyze real-time market exposure and order flow velocity.",
            diff: "Medium"
        },
        {
            id: "DevOps Engineer",
            title: "DevOps Release Engineer",
            icon: <Cpu className="w-6 h-6 mb-2" />,
            desc: "Inspect deployment pipelines and multi-environment configurations.",
            diff: "Easy"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 text-gray-300">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-wide">
                    Knight Capital Group — August 1, 2012
                </h1>
                <div className="flex items-center space-x-3 mb-6">
                    <span className="bg-red-900 text-red-400 text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">Critical Impact</span>
                    <span className="text-gray-500 text-sm">Simulation Duration: 45:00</span>
                </div>

                <div className="bg-red-900/20 border-l-4 border-red-500 p-6 rounded text-red-200 text-lg leading-relaxed shadow-lg mb-10">
                    <p>
                        A faulty deployment has just gone live. A missing config flag has reactivated 8 decommissioned trading modules.
                        Orders are firing uncontrolled across 154 NYSE stocks. You have 45 minutes to contain the blast radius.
                    </p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Select Your Role</h2>
            <div className="grid grid-cols-3 gap-6 mb-10">
                {roles.map(r => (
                    <button
                        key={r.id}
                        onClick={() => setSelectedRole(r.id)}
                        className={`flex flex-col items-center justify-center p-6 rounded-lg text-center transition-all border-2 ${selectedRole === r.id ? 'bg-blue-900/30 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105' : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'}`}
                    >
                        <div className={selectedRole === r.id ? 'text-blue-400' : 'text-gray-400'}>{r.icon}</div>
                        <h3 className={`font-bold mb-2 ${selectedRole === r.id ? 'text-white' : 'text-gray-300'}`}>{r.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{r.desc}</p>
                        <div className="mt-auto flex space-x-1">
                            <span className={`h-1.5 w-6 rounded-full block ${r.diff === 'Easy' ? 'bg-green-500' : r.diff === 'Medium' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                            <span className="text-[10px] uppercase text-gray-500 font-bold ml-2">{r.diff}</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex justify-center">
                <button
                    disabled={!selectedRole}
                    onClick={() => onStart(selectedRole)}
                    className={`px-12 py-4 rounded-full font-bold text-lg uppercase tracking-widest transition-all ${selectedRole ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                >
                    Initialize Simulation
                </button>
            </div>
        </div>
    );
};
