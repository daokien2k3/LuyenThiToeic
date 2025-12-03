"use client"

export default function PartTabs({ currentPart = 1, onPartChange }) {
  const parts = Array.from({ length: 7 }, (_, i) => i + 1)

  // đảm bảo currentPart luôn trong khoảng hợp lệ
  const safeCurrentPart = Math.min(Math.max(currentPart, 1), 7)

  return (
    <div className="bg-white border-b border-gray-200 px-6">
      <div className="flex gap-8">
        {parts.map((part) => (
          <button
            key={part}
            onClick={() => onPartChange(part)}
            className={`py-4 px-2 font-medium transition-colors border-b-2 ${
              safeCurrentPart === part
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Part {part}
          </button>
        ))}
      </div>
    </div>
  )
}
