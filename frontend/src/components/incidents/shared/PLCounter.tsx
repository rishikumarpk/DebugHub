export const PLCounter = ({ losses }: { losses: number }) => {
    const isLoss = losses < 0;
    const formattedLosses = Math.abs(losses).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });

    return (
        <div className="flex items-center space-x-2 bg-gray-900 border border-gray-700 px-4 py-2 rounded-md">
            <span className="text-gray-400 uppercase text-sm tracking-wider">Current P&L Impact:</span>
            <span className={`font-mono text-xl font-bold ${isLoss ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                {isLoss ? '-' : ''}{formattedLosses}
            </span>
        </div>
    );
};
