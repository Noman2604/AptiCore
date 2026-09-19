interface WarningModalProps {
  isOpen: boolean
  warningMessage: string
  onClose: () => void
}

export function WarningModal({
  isOpen,
  warningMessage,
  onClose,
}: WarningModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-red-500/50 bg-white dark:bg-[#10151d] p-6 text-center shadow-[0_20px_60px_rgba(239,68,68,0.2)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h3 className="font-[Space_Grotesk,sans-serif] text-xl font-bold text-red-500">
          Warning: Tab Switch Detected
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-[#8a96a8]">
          {warningMessage}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-red-500 py-3 font-bold text-white transition hover:bg-red-600"
        >
          I Understand, Continue Test
        </button>
      </div>
    </div>
  )
}
