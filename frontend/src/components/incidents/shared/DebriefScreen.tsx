import { DEBRIEF } from '../../../data/incidents/knightCapitalData';
import { ArrowLeft, RefreshCw, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DebriefScreen = ({
    success,
    timeTaken,
    plLost,
    onRetry,
    onReset
}: {
    success: boolean,
    timeTaken: number,
    plLost: number,
    onRetry: () => void,
    onReset: () => void
}) => {
    const navigate = useNavigate();

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

    return (
        <div className="w-full h-full overflow-y-auto bg-black p-8">
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className={`p-6 rounded-lg border-l-4 mb-8 ${success ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                    <h1 className={`text-4xl font-bold mb-4 ${success ? 'text-green-500' : 'text-red-500'}`}>
                        {success ? 'INCIDENT RESOLVED' : 'INCIDENT FAILED'}
                    </h1>
                    <div className="grid grid-cols-2 gap-4 text-gray-300">
                        <div>
                            <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">Time Elapsed</p>
                            <p className="text-2xl font-mono">{Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, '0')}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">Total Impact</p>
                            <p className="text-2xl font-mono text-red-400">{formatter.format(plLost)}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8 text-gray-300">
                    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-4">Real World Outcome</h2>
                        <p className="leading-relaxed">{DEBRIEF.incidentSummary}</p>
                        <p className="mt-4 font-bold text-red-400">{DEBRIEF.realWorldOutcome}</p>
                    </div>

                    {success ? (
                        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                            <h2 className="text-xl font-bold text-white mb-4">Correct Resolution Path</h2>
                            <ul className="space-y-3">
                                {DEBRIEF.correctResolutionPath.map((step) => (
                                    <li key={step.step} className="flex items-start">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center text-sm font-bold mt-1 mr-3 border border-blue-700">{step.step}</span>
                                        <span>{step.action}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-4">Lessons Learned</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            {DEBRIEF.lessonsLearned.map((lesson, idx) => (
                                <li key={idx}>{lesson}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex space-x-4 border-t border-gray-800 pt-8">
                    <button
                        onClick={onRetry}
                        className="flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {success ? 'Retry Same Role' : 'Retry Incident'}
                    </button>
                    <button
                        onClick={onReset}
                        className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        {success ? 'Next Incident' : 'Try Different Role'}
                    </button>
                    <div className="flex-1"></div>
                    <button
                        onClick={() => navigate('/incidents')}
                        className="flex items-center px-6 py-3 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 rounded font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Exit to Platform
                    </button>
                </div>
            </div>
        </div>
    );
};
