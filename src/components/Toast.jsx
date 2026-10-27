import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#FFFDFA] border border-[#D8D2C8] p-4 shadow-xl animate-in slide-in-from-bottom-5 duration-300"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start space-x-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[#62694A] mt-1.5 shrink-0"></div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-[#62694A] font-mono font-semibold">
            AURA Notification
          </p>
          <p className="text-sm text-[#292923] mt-1 leading-relaxed font-sans">
            {message}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-[#4A463D] hover:text-[#292923] p-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#62694A]"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
