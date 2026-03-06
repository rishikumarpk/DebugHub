
type Decision = {
    id: string;
    label: string;
    outcome: string;
    feedback: string;
};

type DecisionBarProps = {
    decisions: Decision[];
    onDecision: (decision: Decision) => void;
    disabled?: boolean;
};

export const DecisionBar = ({ decisions, onDecision, disabled }: DecisionBarProps) => {
    return (
        <div className="flex space-x-4 bg-gray-900 p-4 border-t border-gray-800 h-full w-full justify-center items-center">
            {decisions.map(d => (
                <button
                    key={d.id}
                    disabled={disabled}
                    onClick={() => onDecision(d)}
                    className="flex-1 max-w-sm bg-gray-800 hover:bg-gray-700 active:bg-gray-600 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-md border border-gray-700 transition-colors shadow-sm"
                >
                    {d.label}
                </button>
            ))}
        </div>
    );
};
