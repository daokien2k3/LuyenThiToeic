"use client";

import { useState, useRef, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import PartTabs from "./PartTabs";
import QuestionContent from "./QuestionContent";
import RightSidebar from "./RightSideBar";
import Header from "./Header";

export default function TOEICTestInterface({
    testName,
    currentPart,
    onPartChange,
    selectedAnswers,
    onAnswerSelect,
    timeRemaining,
    testData
}) {
    const [currentQuestion, setCurrentQuestion] = useState(0);

    // 👉 Chỉ part có trong đề
    const partList = testData.parts;
    const partIds = partList.map(p => p.id);

    const mediaList = testData.mediaQuestions.filter(
        (m) => m.PartID === currentPart
    );

    const questions = testData.questions.filter((q) =>
        mediaList.some((m) => m.ID === q.MediaQuestionID)
    );

    const partCounts = testData.parts.map((p) => {
        const media = testData.mediaQuestions.filter(m => m.PartID === p.id);
        return testData.questions.filter(q =>
            media.some(m => m.ID === q.MediaQuestionID)
        ).length;
    });

    const cumulativeCounts = partCounts.reduce((acc, len) => {
        const prev = acc.length ? acc[acc.length - 1] : 0;
        acc.push(prev + len);
        return acc;
    }, []);

    const partIndex = Math.max(0, Math.min((currentPart || 1) - 1, partCounts.length - 1));
    const baseIndex = partIndex === 0 ? 0 : cumulativeCounts[partIndex - 1];

    const pendingJumpRef = useRef(null);

    const scrollToQuestionId = (globalNumber) => {
        const el = document.getElementById(`q-${globalNumber}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            el.classList.add("ring-2", "ring-blue-200");
            setTimeout(() => el.classList.remove("ring-2", "ring-blue-200"), 900);
        }
    };

    const handleJumpToQuestion = (globalQuestionNumber) => {
        let targetPart = 1;
        for (let i = 0; i < cumulativeCounts.length; i++) {
            if (globalQuestionNumber <= cumulativeCounts[i]) {
                targetPart = testData.parts[i].id;
                break;
            }
        }

        if (targetPart !== currentPart) {
            pendingJumpRef.current = globalQuestionNumber;
            onPartChange(targetPart);
            const prevTotal = cumulativeCounts[testData.parts.findIndex(p => p.id === targetPart) - 1] || 0;
            setCurrentQuestion(globalQuestionNumber - prevTotal - 1);
        } else {
            scrollToQuestionId(globalQuestionNumber);
        }
    };

    useEffect(() => {
        if (pendingJumpRef.current) {
            const id = requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                    scrollToQuestionId(pendingJumpRef.current);
                    pendingJumpRef.current = null;
                })
            );
            return () => cancelAnimationFrame(id);
        }
    }, [currentPart, baseIndex]);

    const handlePartChange = (part) => {
        onPartChange(part);
        setCurrentQuestion(0);
        pendingJumpRef.current = null;
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Header testName={testName} />

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col overflow-auto">

                    <PartTabs
                        currentPart={currentPart}
                        onPartChange={handlePartChange}
                        parts={partList}   // ⬅ chỉ part có trong đề
                    />

                    <QuestionContent
                        part={currentPart}
                        questions={questions}
                        baseIndex={baseIndex}
                        selectedAnswers={selectedAnswers}
                        onAnswerSelect={onAnswerSelect}
                        testData={testData}
                        mediaList={mediaList}
                    />
                </div>

                <RightSidebar
                    timeRemaining={timeRemaining}
                    currentPart={currentPart}
                    selectedAnswers={selectedAnswers}
                    onJumpToQuestion={handleJumpToQuestion}
                    testData={testData}
                />
            </div>
        </div>
    );
}



// "use client"

// import { useState, useRef, useEffect } from "react"
// import AudioPlayer from "./AudioPlayer"
// import PartTabs from "./PartTabs"
// import QuestionContent from "./QuestionContent"
// import RightSidebar from "./RightSideBar"
// import Header from "./Header"

// export default function TOEICTestInterface({
//   testName,
//   currentPart,
//   onPartChange,
//   selectedAnswers,
//   onAnswerSelect,
//   timeRemaining,
//   testData,
//   mode,                // <-- QUAN TRỌNG
// }) {
//   const [currentQuestion, setCurrentQuestion] = useState(0)
//   const [highlightEnabled, setHighlightEnabled] = useState(true)

//   const isPractice = mode === "practice"      // <-- tiện dùng

//   const partList = isPractice
//     ? testData.parts.filter(p =>
//         testData.mediaQuestions.some(m => m.PartID === p.id)
//       )
//     : testData.parts;


//   const partIds = partList.map((p) => p.id)

//   const partData =
//     (testData?.parts || []).find((p) => p.id === currentPart) || {}

//   // =========================
//   //   LỌC MEDIA VÀ QUESTION
//   // =========================
//   const mediaList = (testData?.mediaQuestions || []).filter(
//     (m) => m.PartID === currentPart
//   )

//   const questions = (testData?.questions || []).filter((q) =>
//     mediaList.some((m) => m.ID === q.MediaQuestionID)
//   )

//   // Nếu practice: chỉ cần số lượng câu trong part hiện tại
//   let partCounts = []

//   if (isPractice) {
//     partCounts = [questions.length]          // 1 part duy nhất
//   } else {
//     // full test → tính toàn bộ
//     partCounts = (testData?.parts || []).map((p) => {
//       const media = (testData?.mediaQuestions || []).filter(
//         (m) => m.PartID === p.id
//       )
//       return (testData?.questions || []).filter((q) =>
//         media.some((m) => m.ID === q.MediaQuestionID)
//       ).length
//     })
//   }

//   const cumulativeCounts = partCounts.reduce((acc, len) => {
//     const prev = acc.length ? acc[acc.length - 1] : 0
//     acc.push(prev + len)
//     return acc
//   }, [])

//   const partIndex = isPractice
//     ? 0
//     : Math.max(0, Math.min((currentPart || 1) - 1, partCounts.length - 1))

//   const baseIndex = partIndex === 0 ? 0 : cumulativeCounts[partIndex - 1]

//   // jump ref
//   const pendingJumpRef = useRef(null)

//   // =============================
//   //   NHẢY ĐẾN CÂU HỎI THEO SIDEBAR
//   // =============================
//   const scrollToQuestionId = (globalNumber) => {
//     const el = document.getElementById(`q-${globalNumber}`)
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth", block: "start" })
//       el.classList.add("ring-2", "ring-blue-200")
//       setTimeout(() => el.classList.remove("ring-2", "ring-blue-200"), 900)
//     }
//   }

//   const handleJumpToQuestion = (globalQuestionNumber) => {
//     // 🔥 PRACTICE: không nhảy sang part khác
//     if (isPractice) {
//       scrollToQuestionId(globalQuestionNumber)
//       return
//     }

//     // FULL TEST logic cũ
//     let targetPart = 1
//     for (let i = 0; i < cumulativeCounts.length; i++) {
//       if (globalQuestionNumber <= cumulativeCounts[i]) {
//         targetPart = i + 1
//         break
//       }
//     }

//     if (targetPart !== currentPart) {
//       pendingJumpRef.current = globalQuestionNumber
//       onPartChange(targetPart)
//       const prevTotal = targetPart > 1 ? cumulativeCounts[targetPart - 2] : 0
//       setCurrentQuestion(globalQuestionNumber - prevTotal - 1)
//     } else {
//       scrollToQuestionId(globalQuestionNumber)
//     }
//   }

//   useEffect(() => {
//     if (pendingJumpRef.current) {
//       const id = requestAnimationFrame(() =>
//         requestAnimationFrame(() => {
//           scrollToQuestionId(pendingJumpRef.current)
//           pendingJumpRef.current = null
//         })
//       )
//       return () => cancelAnimationFrame(id)
//     }
//   }, [currentPart, baseIndex])

//   // ======================
//   //  CHUYỂN PART
//   // ======================
//   const handlePartChange = (part) => {
//     // PRACTICE: KHÔNG ĐƯỢC CHO CHUYỂN PART
//     if (isPractice) return

//     onPartChange(part)
//     setCurrentQuestion(0)
//     pendingJumpRef.current = null
//   }

//   return (
//     <div className="flex flex-col h-screen bg-gray-50">
//       <Header testName={testName} />

//       <div className="flex-1 flex overflow-hidden">
//         <div className="flex-1 flex flex-col overflow-auto">

//           {/* ẨN PART TABS KHI PRACTICE */}
//           {!isPractice && (
//             <PartTabs currentPart={currentPart} onPartChange={handlePartChange} />
//           )}

//           <QuestionContent
//             part={currentPart}
//             questions={questions}
//             baseIndex={baseIndex}
//             selectedAnswers={selectedAnswers}
//             onAnswerSelect={onAnswerSelect}
//             testData={testData}
//             mediaList={mediaList}
//           />
//         </div>

//         <RightSidebar
//           timeRemaining={timeRemaining}
//           currentPart={currentPart}
//           selectedAnswers={selectedAnswers}
//           onJumpToQuestion={handleJumpToQuestion}
//           testData={testData}
//           mode={mode}            // để sidebar biết đang luyện tập
//         />
//       </div>
//     </div>
//   )
// }