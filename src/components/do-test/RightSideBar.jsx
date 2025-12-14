"use client";
import { Clock } from "lucide-react";

export default function RightSidebar({
  timeRemaining,
  currentPart,
  selectedAnswers,
  onJumpToQuestion,
  testData,
  onSubmitTest,
  onExit,
  isSubmitting = false,
  isExiting = false,
}) {
  const parts = testData.parts || [];
  const questions = testData.questions || [];

  // Tạo mapping từ Question ID -> Global Number (bỏ qua OrderIndex)
  const questionNumberMap = new Map();
  let globalCounter = 1;
  
  // Duyệt qua tất cả parts theo thứ tự
  const sortedParts = [...parts].sort((a, b) => Number(a) - Number(b));
  
  sortedParts.forEach(p => {
    const partQuestions = questions.filter(
      q => String(q.Media?.Section) === String(p)
    );
    
    partQuestions.forEach(q => {
      questionNumberMap.set(q.ID, globalCounter);
      globalCounter++;
    });
  });

  // Kiểm tra câu hỏi đã được trả lời chưa - so sánh theo Question ID
  const getQuestionStatus = (questionId) => {
    return selectedAnswers[questionId] !== undefined && selectedAnswers[questionId] !== null;
  };

  // Tính tổng số câu đã trả lời
  const totalAnswered = questions.filter(q => getQuestionStatus(q.ID)).length;
  const totalQuestions = questions.length;

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      {/* Timer */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={18} className="text-gray-600" />
          <p className="text-sm text-gray-600 font-medium">Thời gian còn lại</p>
        </div>
        <p className="text-4xl font-bold text-gray-900 tabular-nums">{timeRemaining}</p>
        
        {/* Progress Summary */}
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tiến độ</span>
            <span className="font-bold text-blue-600">{totalAnswered}/{totalQuestions}</span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${(totalAnswered / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {sortedParts.map((part) => {
            const questionsInPart = questions.filter(q => String(q.Media?.Section) === String(part));
            
            // Đếm số câu đã trả lời trong part này
            const answeredInPart = questionsInPart.filter(q => getQuestionStatus(q.ID)).length;

            return (
              <div key={part} className="space-y-3">
                {/* Part Header */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">Part {part}</p>
                  <p className="text-xs text-gray-500">
                    {answeredInPart}/{questionsInPart.length}
                  </p>
                </div>

                {/* Question Buttons Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {questionsInPart.map((question) => {
                    const globalNumber = questionNumberMap.get(question.ID);
                    const answered = getQuestionStatus(question.ID);

                    return (
                      <button
                        key={question.ID}
                        onClick={() => onJumpToQuestion(globalNumber)}
                        className={`aspect-square flex items-center justify-center text-sm font-semibold rounded-lg border-2 transition-all ${
                          answered
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm hover:bg-blue-700"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                        }`}
                      >
                        {globalNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & Action Buttons */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-center gap-6 text-xs mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded border-2 border-blue-600"></div>
            <span className="text-gray-600">Đã làm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded border-2 border-gray-300"></div>
            <span className="text-gray-600">Chưa làm</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onSubmitTest}
            disabled={isSubmitting || isExiting}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang nộp bài...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Nộp bài</span>
              </>
            )}
          </button>

          <button
            onClick={onExit}
            disabled={isSubmitting || isExiting}
            className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isExiting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang thoát...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Thoát</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}