"use client";

import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import TOEICTestInterface from "../../components/user/ToeicTestInterface";

export default function DoTest() {
    const { id } = useParams();
    const location = useLocation();

    // 👉 lấy thời gian từ TestDetail (được truyền qua navigate)
    const timeFromDetail = location.state?.timeExam || null;

    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);

    const [testData, setTestData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [mediaQuestions, setMediaQuestions] = useState([]);
    const [examInfo, setExamInfo] = useState(null);

    const [partsInExam, setPartsInExam] = useState([]);
    const [currentPart, setCurrentPart] = useState(null);

    useEffect(() => {
        fetch("/data/toeicPractice.json")
            .then(res => res.json())
            .then(data => {
                const { exams, questions: allQuestions, mediaQuestions: allMedia, mediaQuestion_Exam } = data;

                const exam = exams.find(e => e.ID === Number(id));
                setExamInfo(exam);

                const mediaIds = mediaQuestion_Exam
                    .filter(me => me.ExamID === exam.ID)
                    .map(me => me.MediaQuestionID);

                const examMediaQuestions = allMedia.filter(mq =>
                    mediaIds.includes(mq.ID)
                );

                const examQuestions = allQuestions.filter(q =>
                    examMediaQuestions.some(m => m.ID === q.MediaQuestionID)
                );

                setQuestions(examQuestions);
                setMediaQuestions(examMediaQuestions);

                // 👉 Lọc part có thật trong đề
                const realParts = data.parts.filter(p =>
                    examMediaQuestions.some(m => m.PartID === p.id)
                );
                setPartsInExam(realParts);

                // 👉 Set part đầu tiên có trong đề
                if (realParts.length > 0) setCurrentPart(realParts[0].id);

                setTestData(data);

                // 👉 Nếu TestDetail truyền thời gian thì dùng,
                // không thì dùng thời gian trong JSON
                const examTime = timeFromDetail || (exam.TimeExam * 60);
                setTimeRemaining(examTime);
            });
    }, [id]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleAnswerSelect = (questionId, answer) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answer,
        }));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (!testData || !examInfo || !currentPart)
        return <div className="p-5">Đang tải đề thi...</div>;

    const filteredTestData = {
        exams: [examInfo],
        mediaQuestions,
        questions,
        parts: partsInExam,   // ⬅ chỉ part thật
        choices: testData.choices,
    };

    return (
        <TOEICTestInterface
            testName={examInfo.Title}
            currentPart={currentPart}
            onPartChange={setCurrentPart}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={handleAnswerSelect}
            timeRemaining={formatTime(timeRemaining)}
            testData={filteredTestData}
        />
    );
}




// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import TOEICTestInterface from "../../components/user/ToeicTestInterface";

// export default function DoTest() {
//     const { id, mode, parts } = useParams();

//     const [selectedAnswers, setSelectedAnswers] = useState({});
//     const [timeRemaining, setTimeRemaining] = useState(0);

//     const [testData, setTestData] = useState(null);
//     const [questions, setQuestions] = useState([]);
//     const [mediaQuestions, setMediaQuestions] = useState([]);
//     const [examInfo, setExamInfo] = useState(null);

//     const [currentPart, setCurrentPart] = useState(1);

//     useEffect(() => {
//         fetch("/data/toeicPractice.json")
//             .then(res => res.json())
//             .then(data => {
//                 const { exams, questions: allQuestions, mediaQuestions: allMedia, mediaQuestion_Exam } = data;

//                 // Lấy đề thi theo ID
//                 const exam = exams.find(e => e.ID === Number(id));
//                 setExamInfo(exam);

//                 // Lấy danh sách MediaQuestionID thuộc đề thi này
//                 const mediaIds = mediaQuestion_Exam
//                     .filter(me => me.ExamID === exam.ID)
//                     .map(me => me.MediaQuestionID);

//                 // Lọc danh sách media của đề thi
//                 let examMediaQuestions = allMedia.filter(mq => mediaIds.includes(mq.ID));

//                 // Nếu là PRACTICE → lọc theo part người dùng chọn
//                 if (mode === "practice" && parts !== "all") {
//                     const selectedPartIds = parts.split(",").map(Number);

//                     examMediaQuestions = examMediaQuestions.filter(mq =>
//                         selectedPartIds.includes(mq.PartID)
//                     );

//                     setCurrentPart(selectedPartIds[0]);   // chọn part đầu tiên
//                 }

//                 // Lọc câu hỏi tương ứng
//                 const examQuestions = allQuestions.filter(q =>
//                     examMediaQuestions.some(mq => mq.ID === q.MediaQuestionID)
//                 );

//                 setQuestions(examQuestions);
//                 setMediaQuestions(examMediaQuestions);
//                 setTestData(data);

//                 // Thiết lập thời gian
//                 if (mode === "full") {
//                     setTimeRemaining(exam.TimeExam * 60);
//                 } else {
//                     setTimeRemaining(30 * 60);
//                 }
//             });
//     }, [id, mode, parts]);

//     // Timer
//     useEffect(() => {
//         const timer = setInterval(() => {
//             setTimeRemaining(prev => (prev > 0 ? prev - 1 : 0));
//         }, 1000);
//         return () => clearInterval(timer);
//     }, []);

//     const handleAnswerSelect = (questionId, answer) => {
//         setSelectedAnswers(prev => ({
//             ...prev,
//             [questionId]: answer,
//         }));
//     };

//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${mins}:${secs.toString().padStart(2, "0")}`;
//     };

//     if (!testData || !examInfo)
//         return <div className="p-5">Đang tải đề thi...</div>;

//     const filteredTestData = {
//         exams: [examInfo],
//         mediaQuestions,
//         questions,
//         parts: testData.parts,
//         choices: testData.choices,     // 🔥 PHẢI CÓ DÒNG NÀY
//     };

//     console.log("Media: ", examMediaQuestions);
// console.log("Questions: ", examQuestions);
// console.log("Parts param: ", parts, "Mode:", mode);

//     return (
//         <TOEICTestInterface
//             testName={examInfo.Title}
//             currentPart={currentPart}
//             onPartChange={setCurrentPart}
//             selectedAnswers={selectedAnswers}
//             onAnswerSelect={handleAnswerSelect}
//             timeRemaining={formatTime(timeRemaining)}
//             testData={filteredTestData}
//             mode={mode}
//         />
//     );
// }
