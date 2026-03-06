export const TimerBar = ({ timeLeft }: { timeLeft: number }) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const mString = minutes.toString().padStart(2, '0');
    const sString = seconds.toString().padStart(2, '0');

    let colorClass = 'text-green-500';
    if (timeLeft <= 5 * 60) {
        colorClass = 'text-red-500 font-bold animate-pulse';
    } else if (timeLeft <= 10 * 60) {
        colorClass = 'text-amber-500 font-bold';
    }

    return (
        <div className="flex items-center space-x-2 bg-gray-900 border border-gray-700 px-4 py-2 rounded-md">
            <span className="text-gray-400 uppercase text-sm tracking-wider">Time Remaining:</span>
            <span className={`font-mono text-xl ${colorClass}`}>
                {mString}:{sString}
            </span>
        </div>
    );
};
