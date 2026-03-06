import { DEPLOYMENT_METADATA, CONFIG_DIFF, MODULE_REGISTRY } from '../../../data/incidents/knightCapitalData';

export const DevOpsEngineerView = ({ phase }: any) => {
    return (
        <div className="h-full flex flex-col pt-4 pb-4 px-4 overflow-hidden">
            <div className="flex-none mb-4">
                <div className="bg-gray-900 border border-gray-700 rounded-md p-4 flex justify-between items-center text-sm">
                    <div className="flex space-x-6 text-gray-300">
                        <div><span className="text-gray-500 uppercase text-xs font-bold">Release</span> <span className="font-mono ml-2 text-white">{DEPLOYMENT_METADATA.version}</span></div>
                        <div><span className="text-gray-500 uppercase text-xs font-bold">Time</span> <span className="font-mono ml-2 text-white">{DEPLOYMENT_METADATA.deployedAt}</span></div>
                        <div><span className="text-gray-500 uppercase text-xs font-bold">Deployer</span> <span className="font-mono ml-2 text-white">{DEPLOYMENT_METADATA.deployedBy}</span></div>
                    </div>
                    <div className={`px-3 py-1 text-xs font-bold rounded ${phase === 'INCIDENT' ? 'bg-red-900/50 text-red-500 animate-[pulse_1s_ease-in-out_infinite]' : 'bg-green-900/50 text-green-500'}`}>
                        {phase === 'INCIDENT' ? 'PRODUCTION INCIDENT' : 'NOMINAL'}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden mb-4">
                <div className="w-[50%] flex flex-col bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 text-xs font-bold text-gray-400 uppercase border-b border-gray-700 tracking-wider">
                        Staging VS Production Diff
                    </div>
                    <div className="flex-1 overflow-auto bg-[#1e1e1e] p-4 text-xs font-mono">
                        {CONFIG_DIFF.diffLines.map((L, i) => (
                            <div key={i} className={`flex px-2 ${L.type === 'removed' ? 'bg-red-900/40 text-red-400' : 'text-gray-300'}`}>
                                <div className="w-8 text-right text-gray-600 select-none mr-4">{L.line}</div>
                                <div className="whitespace-pre">{L.content}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-[50%] flex flex-col bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 text-xs font-bold text-gray-400 uppercase border-b border-gray-700 tracking-wider">
                        Module Registry Validations
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                        <table className="w-full text-xs text-left">
                            <thead className="text-gray-500">
                                <tr>
                                    <th className="pb-2 font-bold uppercase">Module</th>
                                    <th className="pb-2 font-bold uppercase">Expected</th>
                                    <th className="pb-2 font-bold uppercase">Current</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800 space-y-2">
                                {MODULE_REGISTRY.map((m, i) => {
                                    const current = phase === 'NORMAL' ? m.currentStatePhase1 : m.currentStatePhase2;
                                    const isMatch = m.expectedState === current;
                                    return (
                                        <tr key={i} className="h-10">
                                            <td className="text-gray-300 font-medium">{m.label}</td>
                                            <td className="text-gray-500 font-mono">{m.expectedState}</td>
                                            <td className="font-mono">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${isMatch ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500 animate-pulse'}`}>
                                                    {current}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
