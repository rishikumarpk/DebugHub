export const CrashOverlay = ({ visible }: { visible: boolean }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-red-600/30 animate-[flash_0.2s_ease-in-out_infinite]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] mix-blend-overlay opacity-50 bg-repeat"></div>

            <div className="relative bg-black/80 border-4 border-red-600 px-12 py-8 translate-y-[-10%] animate-[shake_0.5s_ease-in-out_infinite]">
                <h1 className="text-6xl font-black text-red-600 tracking-widest uppercase">
                    SYSTEM FAILURE
                </h1>
            </div>
            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        @keyframes flash {
          0%, 50%, 100% { opacity: 0.8; }
          25%, 75% { opacity: 0.3; }
        }
      `}</style>
        </div>
    );
};
