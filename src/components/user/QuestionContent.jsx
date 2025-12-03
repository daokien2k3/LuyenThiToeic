"use client";

import AnswerOptions from "./AnswerOptions";

export default function QuestionContent({
  part,
  questions,
  baseIndex = 0,
  selectedAnswers,
  onAnswerSelect,
  testData,
  mediaList,
}) {
  const groupByMedia = () => {
    const groups = {};

    questions.forEach((q) => {
      if (!groups[q.MediaQuestionID]) groups[q.MediaQuestionID] = [];
      groups[q.MediaQuestionID].push(q);
    });

    return groups;
  };

  const groupedQuestions = groupByMedia();

  return (
    <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto space-y-12">
        {Object.entries(groupedQuestions).map(([mediaId, qs]) => {
          const media = mediaList.find((m) => m.ID == mediaId);

          const isPart5 = part === 5;

          return (
            <div
              key={mediaId}
              className={`bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-6 ${
                isPart5 ? "md:flex-col" : ""
              }`}
            >
              {/* ===== MEDIA BÊN TRÁI (ẩn với part 5) ===== */}
              {!isPart5 && (
                <div className="md:w-1/3 flex-shrink-0 space-y-4">
                  {media?.Script && (
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm whitespace-pre-line font-medium text-gray-800">
                      {media.Script}
                    </div>
                  )}
                  {media?.AudioUrl && (
                    <audio controls className="w-full rounded-md">
                      <source src={`/${media.AudioUrl}`} type="audio/mp3" />
                    </audio>
                  )}
                  {media?.ImageUrl && (
                    <img
                      src={`/${media.ImageUrl}`}
                      alt="media-img"
                      className="w-full rounded-lg border border-gray-200 object-cover"
                    />
                  )}
                </div>
              )}

              {/* ===== CÂU HỎI BÊN PHẢI (hoặc full width với part 5) ===== */}
              <div className={`${isPart5 ? "w-full" : "md:w-2/3 flex-1"} flex flex-col gap-6`}>
                {qs.map((question, idx) => {
                  const questionNumber =
                    baseIndex +
                    questions.findIndex((x) => x.ID === question.ID) +
                    1;

                  const choiceRaw =
                    testData?.choices?.filter(
                      (c) => c.QuestionID === question.ID
                    ) || [];

                  const options =
                    part <= 2
                      ? ["", "", "", ""]
                      : choiceRaw.map((c) => c.Content ?? "");

                  return (
                    <div
                      key={question.ID}
                      id={`q-${questionNumber}`}
                      className="p-4 bg-gray-50 rounded-lg shadow-sm"
                    >
                      <p className="text-xl font-bold mb-3 text-indigo-700">
                        Question {questionNumber}
                      </p>

                      {part > 2 && (
                        <p className="text-gray-800 mb-4 leading-relaxed font-medium">
                          {question.QuestionText ?? "Không có nội dung câu hỏi"}
                        </p>
                      )}

                      <AnswerOptions
                        options={options}
                        part={part}
                        inputName={`q-${questionNumber}`}
                        selectedAnswer={selectedAnswers[questionNumber]}
                        onAnswerSelect={(ans) =>
                          onAnswerSelect(questionNumber, ans)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



// "use client";

// import AnswerOptions from "./AnswerOptions";

// export default function QuestionContent({
//   part,
//   questions,
//   baseIndex = 0,
//   selectedAnswers,
//   onAnswerSelect,
//   testData,
//   mediaList,
// }) {
//   const groupByMedia = () => {
//     const groups = {};

//     questions.forEach((q) => {
//       if (!groups[q.MediaQuestionID]) groups[q.MediaQuestionID] = [];
//       groups[q.MediaQuestionID].push(q);
//     });

//     return groups;
//   };

//   const groupedQuestions = groupByMedia();

//   return (
//     <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className="max-w-4xl mx-auto">
//         {Object.entries(groupedQuestions).map(([mediaId, qs], groupIdx) => {
//           const media = mediaList.find((m) => m.ID == mediaId);

//           return (
//             <div key={mediaId} className="mb-16 pb-10 border-b-2 border-gray-300 shadow-lg rounded-lg bg-white p-6">
//               {/* ======================================================
//                  MEDIA DISPLAY (HIỂN THỊ 1 lần duy nhất)
//               ====================================================== */}
//               <div className="mb-8">
//                 {/* Script = MediaQuestionText */}
//                 {media?.Script && (
//                   <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-xl mb-6 shadow-md whitespace-pre-line leading-relaxed text-gray-800 font-medium">
//                     {media.Script}
//                   </div>
//                 )}

//                 {media?.AudioUrl && (
//                   <div className="mb-6 flex justify-center">
//                     <audio controls className="w-full max-w-md rounded-lg shadow-md">
//                       <source src={`/${media.AudioUrl}`} type="audio/mp3" />
//                     </audio>
//                   </div>
//                 )}

//                 {media?.ImageUrl && (
//                   <div className="flex justify-center mb-6">
//                     <img
//                       src={`/${media.ImageUrl}`}
//                       alt="media-img"
//                       className="w-full max-w-2xl rounded-xl shadow-lg object-cover border-2 border-gray-200"
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* ======================================================
//                  RENDER TẤT CẢ CÂU HỎI THUỘC MEDIA GROUP
//               ====================================================== */}
//               {qs.map((question, idx) => {
//                 const questionNumber =
//                   baseIndex +
//                   questions.findIndex((x) => x.ID === question.ID) +
//                   1;

//                 // lấy đáp án từ testData
//                 const choiceRaw = testData?.choices?.filter(
//                   (c) => c.QuestionID === question.ID
//                 ) || [];

//                 const options =
//                   part <= 2
//                     ? ["", "", "", ""] // part 1–2 không hiển thị nội dung đáp án
//                     : choiceRaw.map((c) => c.Content);

//                 return (
//                   <div key={question.ID} id={`q-${questionNumber}`} className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
//                     <p className="text-xl font-bold mb-3 text-indigo-700">
//                       Question {questionNumber}
//                     </p>

//                     {/* Part 3–7 hiển thị nội dung câu hỏi */}
//                     {part > 2 && (
//                       <p className="text-gray-800 mb-4 leading-relaxed font-medium">{question.QuestionText}</p>
//                     )}

//                     <AnswerOptions
//                       options={options}
//                       part={part}
//                       inputName={`q-${questionNumber}`}
//                       selectedAnswer={selectedAnswers[questionNumber]}
//                       onAnswerSelect={(ans) => onAnswerSelect(questionNumber, ans)}
//                     />
//                   </div>
//                 );
//               })}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }