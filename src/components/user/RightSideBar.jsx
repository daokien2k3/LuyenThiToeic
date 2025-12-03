"use client"

import { Send } from "lucide-react"

export default function RightSidebar({
  timeRemaining,
  currentPart,
  selectedAnswers,
  onJumpToQuestion,
  testData,
}) {
  const parts = testData?.parts || []
  
  // Lấy số câu thực tế của từng part dựa vào media
  const partCounts = parts.map((p) => {
    const mediaInPart = (testData.mediaQuestions || []).filter((m) => m.PartID === p.id)
    const questionsInPart = (testData.questions || []).filter((q) =>
      mediaInPart.some((m) => m.ID === q.MediaQuestionID)
    )
    return questionsInPart.length
  })

  const cumulativeCounts = partCounts.reduce((acc, count) => {
    const last = acc.length ? acc[acc.length - 1] : 0
    acc.push(last + count)
    return acc
  }, [])

  const getQuestionStatus = (qNum) => (selectedAnswers[qNum] !== undefined ? "answered" : "unanswered")

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      <div className="border-b border-gray-200 p-6">
        <p className="text-sm text-gray-600 mb-1">Thời gian còn lại:</p>
        <p className="text-4xl font-bold text-gray-900">{timeRemaining}</p>
      </div>

      <div className="border-b border-gray-200 p-6">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          <Send size={18} />
          NỘP BÀI
        </button>
      </div>

      <div className="border-b border-gray-200 p-6">
        <p className="text-sm text-red-600 font-semibold mb-2">Khôi phục/lưu bài làm</p>
        <p className="text-xs text-yellow-600">Click vào số câu để chuyển nhanh</p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {parts.map((part, idx) => {
            const partNumber = idx + 1
            const totalBefore = idx === 0 ? 0 : cumulativeCounts[idx - 1]
            const questionsInPart = partCounts[idx]

            return (
              <div key={partNumber}>
                <p className="text-sm font-semibold text-gray-900 mb-2">Part {partNumber}</p>

                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: questionsInPart }, (_, i) => {
                    const globalQ = totalBefore + i + 1
                    const answered = getQuestionStatus(globalQ) === "answered"

                    return (
                      <button
                        key={globalQ}
                        onClick={() => onJumpToQuestion(globalQ)}
                        className={`aspect-square flex items-center justify-center text-sm font-semibold rounded border-2 transition-colors ${
                          answered
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {globalQ}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-3 bg-red-50 rounded-lg">
          <p className="text-xs text-red-700 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-600 rounded-full"></span>
            Từ điển
          </p>
        </div>
      </div>
    </div>
  )
}
