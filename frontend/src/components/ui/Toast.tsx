import React, { useState, useEffect } from 'react';

export type ToastType = 'session' | 'suggestion' | 'daily' | 'streak' | 'patch';

interface ToastProps {
    id: string;
    type: ToastType;
    message: React.ReactNode;
    onClose: (id: string) => void;
}

const Toast = ({ id, type, message, onClose }: ToastProps) => {
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;

        const timer = setTimeout(() => {
            onClose(id);
        }, 4000);

        return () => clearTimeout(timer);
    }, [id, onClose, isHovered]);

    let borderClass = '';
    let icon = '';

    switch (type) {
        case 'session':
            borderClass = 'border-l-[#E0E0E0]';
            icon = '👥';
            break;
        case 'suggestion':
            borderClass = 'border-l-[#E0E0E0]';
            icon = '💡';
            break;
        case 'daily':
            borderClass = 'border-l-[#E0E0E0]';
            icon = '🐛';
            break;
        case 'streak':
            borderClass = 'border-l-[#E0E0E0]';
            icon = '🔥';
            break;
        case 'patch':
            borderClass = 'border-l-[#E0E0E0]';
            icon = '✓';
            break;
    }

    return (
        <div
            className={`bg-[#030303F2] border border-[#E0E0E066] rounded-[10px] px-[18px] py-[14px] backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-[12px] min-w-[300px] max-w-[380px] border-l-[4px] ${borderClass} animate-[toast-in_0.3s_ease-out] mb-2 pointer-events-auto`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="text-xl">{icon}</span>
            <div className="font-body text-[14px] text-[#E0E0E0]">
                {message}
            </div>
        </div>
    );
};

// Simplified Toast Container for MVP
export const ToastContainer = ({ toasts, onClose }: { toasts: any[], onClose: (id: string) => void }) => {
    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
            {toasts.map(toast => (
                <Toast key={toast.id} {...toast} onClose={onClose} />
            ))}
        </div>
    );
};

export default Toast;
