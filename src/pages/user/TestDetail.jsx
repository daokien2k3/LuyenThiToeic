"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";
import CommentSection from "../../components/user/CommentSection";

export default function TestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [examType, setExamType] = useState("");
    const [questions, setQuestions] = useState([]);
    const [comments, setComments] = useState([]);
    const [parts, setParts] = useState([]);
    const [customTime, setCustomTime] = useState(30);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [mediaQuestions, setMediaQuestions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch("/data/toeicPractice.json");
                const data = await res.json();

                const { exams, examTypes, questions: allQuestions, mediaQuestions: allMediaQuestions, mediaQuestion_Exam, parts: allParts, comments: allComments } = data;

                const foundExam = exams.find((e) => e.ID === Number(id));
                if (!foundExam) {
                    setError("Không tìm thấy đề thi.");
                    setLoading(false);
                    return;
                }

                const type = examTypes.find((t) => t.ID === foundExam.ExamTypeID);

                const mediaIds = mediaQuestion_Exam
                    .filter((me) => me.ExamID === foundExam.ID)
                    .map((me) => me.MediaQuestionID);

                const relatedQuestions = allQuestions.filter((q) => mediaIds.includes(q.MediaQuestionID));

                const partIdsInExam = [...new Set(allMediaQuestions
                    .filter((mq) => mediaIds.includes(mq.ID))
                    .map((mq) => mq.PartID))];

                const relatedParts = allParts.filter((p) => partIdsInExam.includes(p.id));

                const relatedComments = allComments.filter((c) => c.ExamID === foundExam.ID);

                setExam(foundExam);
                setExamType(type?.Name || "Không xác định");
                setQuestions(relatedQuestions);
                setParts(relatedParts);
                setComments(relatedComments);
                setMediaQuestions(allMediaQuestions);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Lỗi tải dữ liệu.");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);


    const handleStartTest = () => {
        if (customTime < 5 || customTime > exam.TimeExam) {
            setError(`Thời gian phải từ 5 đến ${exam.TimeExam} phút`);
            return;
        }

        navigate(`/user/dotests/${id}?time=${customTime}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin đề thi...</p>
                </div>
            </div>
        );
    }

    if (error && !exam) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 text-center drop-shadow-sm">
                    {exam.Title || "Đề thi không có tiêu đề"}
                </h1>

                {/* Errors */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-5 mb-8 flex items-start gap-4 shadow-md">
                        <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-red-800 font-medium">{error}</p>
                    </div>
                )}

                {/* Exam Info */}
                <div className="bg-white shadow-xl rounded-2xl p-8 mb-10 ring-1 ring-gray-200 hover:shadow-2xl transition-shadow duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem icon={CheckCircle2} label="Loại đề" value={examType} />
                        <InfoItem icon={Clock} label="Thời gian chuẩn" value={`${exam?.TimeExam} phút`} />
                        <InfoItem icon={FileText} label="Số phần thi" value={`${parts.length} phần`} />
                        <InfoItem icon={FileText} label="Tổng số câu hỏi" value={`${questions.length} câu`} />
                    </div>
                </div>

                {/* Custom time (NEW - yêu cầu của bạn) */}
                <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 ring-1 ring-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Cài đặt thời gian làm bài</h2>

                    <div className="mt-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                        <label className="block mb-3 font-semibold text-gray-700 text-lg">Thời gian làm bài (phút):</label>
                        <input
                            type="number"
                            min="5"
                            max={exam?.TimeExam}
                            value={customTime}
                            onChange={(e) => setCustomTime(Number(e.target.value))}
                            className="border border-gray-300 rounded-lg p-3 w-40 text-center focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 shadow-sm"
                        />
                        <p className="text-sm text-gray-600 mt-3">(Tối đa {exam?.TimeExam} phút)</p>
                    </div>
                </div>

                {/* PART LIST - giữ nguyên giao diện cũ */}
                <div className="bg-gray-50 rounded-xl p-5 mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Các phần thi trong đề
                    </h2>

                    {parts.length === 0 ? (
                        <p className="text-gray-500 text-center py-6 text-sm">
                            Đề thi này chưa có phần thi nào.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {parts.map((part) => (
                                <div key={part.id} className="p-4 rounded-lg">
                                    <p className="font-medium text-blue-700 text-sm">
                                        {part.title}
                                        <span className="text-gray-600 text-xs ml-1 bg-gray-100 px-2 py-0.5 rounded-full">
                                            (
                                            {
                                                mediaQuestions
                                                    .filter((mq) => mq.PartID === part.id)
                                                    .reduce(
                                                        (total, mq) =>
                                                            total + questions.filter((q) => q.MediaQuestionID === mq.ID).length,
                                                        0
                                                    )
                                            }
                                            {" "}
                                            câu hỏi)
                                        </span>
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {part.types?.map((type, index) => (
                                            <span
                                                key={index}
                                                className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                                            >
                                                {type}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* BUTTON START */}
                <div className="text-center mt-8 mb-12">
                    <button
                        onClick={handleStartTest}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                        🚀 Bắt đầu làm bài
                    </button>
                </div>

                <CommentSection examId={exam?.ID} initialComments={comments} />
            </div>
        </div>
    );

    function InfoItem({ icon: Icon, label, value }) {
        return (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <p className="font-bold text-gray-900 text-lg">{value}</p>
                </div>
            </div>
        );
    }
}

// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";
// import CommentSection from "../../components/user/CommentSection";

// export default function TestDetail() {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [exam, setExam] = useState(null);
//     const [examType, setExamType] = useState("");
//     const [questions, setQuestions] = useState([]);
//     const [comments, setComments] = useState([]);
//     const [parts, setParts] = useState([]);
//     const [selectedParts, setSelectedParts] = useState([]);
//     const [mode, setMode] = useState("practice");
//     const [customTime, setCustomTime] = useState(30);
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [mediaQuestions, setMediaQuestions] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const res = await fetch("/data/toeicPractice.json");
//                 const data = await res.json();

//                 const { exams, examTypes, questions: allQuestions, mediaQuestions: allMediaQuestions, mediaQuestion_Exam, parts: allParts, comments: allComments } = data;

//                 const foundExam = exams.find((e) => e.ID === Number(id));
//                 if (!foundExam) {
//                     setError("Không tìm thấy đề thi.");
//                     setLoading(false);
//                     return;
//                 }

//                 const type = examTypes.find((t) => t.ID === foundExam.ExamTypeID);

//                 const mediaIds = mediaQuestion_Exam
//                     .filter((me) => me.ExamID === foundExam.ID)
//                     .map((me) => me.MediaQuestionID);

//                 const relatedQuestions = allQuestions.filter((q) => mediaIds.includes(q.MediaQuestionID));

//                 const partIdsInExam = [...new Set(allMediaQuestions.filter((mq) => mediaIds.includes(mq.ID)).map((mq) => mq.PartID))];
//                 const relatedParts = allParts.filter((p) => partIdsInExam.includes(p.id));

//                 const relatedComments = allComments.filter((c) => c.ExamID === foundExam.ID);

//                 setExam(foundExam);
//                 setExamType(type?.Name || "Không xác định");
//                 setQuestions(relatedQuestions);
//                 setParts(relatedParts);
//                 setComments(relatedComments);
//                 setMediaQuestions(allMediaQuestions); // ⚡ Lưu mediaQuestions vào state
//                 setLoading(false);
//             } catch (err) {
//                 console.error(err);
//                 setError("Lỗi tải dữ liệu.");
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [id]);


//     const handleSelectAllParts = () => {
//         if (selectedParts.length === parts.length) setSelectedParts([]);
//         else setSelectedParts(parts.map((p) => p.title));
//     };

//     const handleStartTest = () => {
//         if (mode === "practice" && selectedParts.length === 0) {
//             setError("Vui lòng chọn ít nhất một phần để luyện tập");
//             return;
//         }

//         if (customTime < 5 || customTime > exam.TimeExam) {
//             setError(`Thời gian phải từ 5 đến ${exam.TimeExam} phút`);
//             return;
//         }

//         setError("");
//         navigate(`/user/dotests/${id}`);
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//                     <p className="text-gray-600">Đang tải thông tin đề thi...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error && !exam) {
//         return (
//             <div className="max-w-2xl mx-auto px-4 py-10">
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
//                     <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
//                     <p className="text-red-700 font-medium">{error}</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
//             <div className="max-w-6xl mx-auto px-6 py-12">
//                 <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 text-center drop-shadow-sm">
//                     {exam.Title || "Đề thi không có tiêu đề"}
//                 </h1>

//                 {error && (
//                     <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-5 mb-8 flex items-start gap-4 shadow-md">
//                         <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
//                         <p className="text-red-800 font-medium">{error}</p>
//                     </div>
//                 )}

//                 {/* Thông tin đề thi */}
//                 <div className="bg-white shadow-xl rounded-2xl p-8 mb-10 ring-1 ring-gray-200 hover:shadow-2xl transition-shadow duration-300">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <InfoItem icon={CheckCircle2} label="Loại đề" value={examType} />
//                         <InfoItem icon={Clock} label="Thời gian làm bài" value={`${exam.TimeExam} phút`} />
//                         <InfoItem icon={FileText} label="Số phần thi" value={`${parts.length} phần`} />
//                         <InfoItem icon={FileText} label="Tổng số câu hỏi" value={`${questions.length} câu`} />
//                     </div>
//                 </div>

//                 {/* Chế độ thi */}
//                 <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 ring-1 ring-gray-200 hover:shadow-2xl transition-shadow duration-300">
//                     <h2 className="text-xl font-bold text-gray-800 mb-6">Chọn chế độ làm bài</h2>
//                     <ModeSelector mode={mode} setMode={setMode} setSelectedParts={setSelectedParts} setError={setError} />

//                     {mode === "practice" && (
//                         <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
//                             <label className="block mb-3 font-semibold text-gray-700 text-lg">Thời gian tùy chỉnh (phút):</label>
//                             <input
//                                 type="number"
//                                 min="5"
//                                 max={exam.TimeExam}
//                                 value={customTime}
//                                 onChange={(e) => setCustomTime(Number(e.target.value))}
//                                 className="border border-gray-300 rounded-lg p-3 w-40 text-center focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 shadow-sm"
//                             />
//                             <p className="text-sm text-gray-600 mt-3">(Từ 5 đến {exam.TimeExam} phút)</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Chọn phần thi */}
//                 <div className="bg-gray-50 rounded-xl p-5 mb-8">

//                     <div className="flex justify-between items-center mb-4">
//                         <h2 className="text-lg font-semibold text-gray-800">Chọn phần thi bạn muốn làm</h2>

//                         {mode === "practice" && parts.length > 0 && (
//                             <button
//                                 onClick={handleSelectAllParts}
//                                 className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
//                             >
//                                 {selectedParts.length === parts.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
//                             </button>
//                         )}
//                     </div>

//                     {parts.length === 0 ? (
//                         <p className="text-gray-500 text-center py-6 text-sm">
//                             Đề thi này chưa có phần thi nào.
//                         </p>
//                     ) : (
//                         <div className="space-y-4">
//                             {parts.map((part) => (
//                                 <div key={part.id} className="p-4 rounded-lg">

//                                     <label className="flex items-center gap-2 font-medium text-blue-700 cursor-pointer text-sm">
//                                         {mode === "practice" && (
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedParts.includes(part.title)}
//                                                 onChange={() =>
//                                                     setSelectedParts((prev) =>
//                                                         prev.includes(part.title)
//                                                             ? prev.filter((p) => p !== part.title)
//                                                             : [...prev, part.title]
//                                                     )
//                                                 }
//                                                 className="w-4 h-4 accent-blue-600 focus:ring-1 focus:ring-blue-300"
//                                             />
//                                         )}

//                                         {part.title}

//                                         <span className="text-gray-600 text-xs ml-1 bg-gray-100 px-2 py-0.5 rounded-full">
//                                             (
//                                             {mediaQuestions
//                                                 .filter((mq) => mq.PartID === part.id)
//                                                 .reduce(
//                                                     (total, mq) =>
//                                                         total + questions.filter((q) => q.MediaQuestionID === mq.ID).length,
//                                                     0
//                                                 )}{" "}
//                                             câu hỏi)
//                                         </span>
//                                     </label>

//                                     <div className="flex flex-wrap gap-2 mt-2">
//                                         {part.types?.map((type, index) => (
//                                             <span
//                                                 key={index}
//                                                 className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
//                                             >
//                                                 {type}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {/* Nút bắt đầu */}
//                 <div className="text-center mt-8 mb-12">
//                     <button
//                         onClick={handleStartTest}
//                         className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
//                     >
//                         {mode === "practice" ? "🚀 Bắt đầu luyện tập" : "📝 Bắt đầu Full Test"}
//                     </button>
//                 </div>

//                 {/* Bình luận */}
//                 <CommentSection examId={exam?.ID} initialComments={comments} />
//             </div>
//         </div>
//     );

//     function InfoItem({ icon: Icon, label, value }) {
//         return (
//             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
//                 <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
//                 <div>
//                     <p className="text-sm text-gray-500 font-medium">{label}</p>
//                     <p className="font-bold text-gray-900 text-lg">{value}</p>
//                 </div>
//             </div>
//         );
//     }

//     function ModeSelector({ mode, setMode, setSelectedParts, setError }) {
//         const modes = [
//             { value: "practice", label: "Luyện tập", desc: "Chọn phần và thời gian tùy chỉnh" },
//             { value: "full", label: "Full Test", desc: "Thi đầy đủ theo đúng format" },
//         ];
//         return (
//             <div className="flex gap-6 mb-6">
//                 {modes.map((m) => (
//                     <button
//                         key={m.value}
//                         onClick={() => {
//                             setMode(m.value);
//                             setError("");
//                             if (m.value === "full") setSelectedParts([]);
//                         }}
//                         className={`flex-1 p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${mode === m.value
//                                 ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg ring-2 ring-blue-200"
//                                 : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
//                             }`}
//                     >
//                         <p className={`font-bold mb-2 text-lg ${mode === m.value ? "text-blue-700" : "text-gray-700"}`}>{m.label}</p>
//                         <p className="text-sm text-gray-600">{m.desc}</p>
//                     </button>
//                 ))}
//             </div>
//         );
//     }
// }