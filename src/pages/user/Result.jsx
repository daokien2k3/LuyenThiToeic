import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, MinusCircle, Clock, Flag, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Result() {
    const [attempts, setAttempts] = useState([]);
    const [attemptAnswers, setAttemptAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [choices, setChoices] = useState([]);
    const [mediaQuestions, setMediaQuestions] = useState([]);
    const [users, setUsers] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [selectedAttempt, setSelectedAttempt] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        fetch("/data/toeicPractice.json")
            .then(res => res.json())
            .then(data => {
                setUsers(data.users);
                setProfiles(data.studentProfiles);
                setQuestions(data.questions);
                setChoices(data.choices);
                setMediaQuestions(data.mediaQuestions);
                setAttempts(data.attempts);
                setAttemptAnswers(data.attemptAnswers);

                // Lấy attempt đầu tiên của học viên ID=3
                const studentProfile = data.studentProfiles.find(p => p.UserID === 3);
                const firstAttempt = data.attempts.find(a => a.StudentProfileID === studentProfile.ID);
                setSelectedAttempt(firstAttempt);
            })
            .catch(err => console.error(err));
    }, []);

    if (!selectedAttempt) return <p className="text-center mt-10">Đang tải dữ liệu...</p>;

    // Lọc attemptAnswers của attempt được chọn
    const attemptDetails = attemptAnswers.filter(a => a.AttemptID === selectedAttempt.ID);
    const totalQuestions = attemptDetails.length;
    const correct = attemptDetails.filter(a => a.IsCorrect).length;
    const wrong = totalQuestions - correct;
    const skipped = 0;

    const currentUser = users.find(u => u.ID === 3);
    const currentProfile = profiles.find(p => p.UserID === 3);

    const handleViewDetail = (questionID) => {
        const question = questions.find(q => q.ID === questionID);
        const questionChoices = choices.filter(c => c.QuestionID === questionID);
        const userAnswer = attemptAnswers.find(a => a.AttemptID === selectedAttempt.ID && a.QuestionID === questionID);
        const userChoice = questionChoices.find(c => c.ID === userAnswer?.ChoiceID);

        setSelectedQuestion({
            question,
            choices: questionChoices,
            userChoice
        });
    };

    const closeModal = () => setSelectedQuestion(null);

    function ExplanationSection({ questionID }) {
        const [showExplanation, setShowExplanation] = useState(false);
        const question = questions.find(q => q.ID === questionID);
        const correctChoice = choices.find(c => c.QuestionID === questionID && c.IsCorrect);

        return (
            <div className="mt-5 border-t pt-4">
                <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="text-blue-600 text-sm font-medium hover:underline"
                >
                    {showExplanation ? "Ẩn giải thích ▲" : "Xem giải thích ▼"}
                </button>

                {showExplanation && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-gray-700 whitespace-pre-line">
                        Giải thích: Đáp án đúng là <strong>{correctChoice?.Attribute}</strong> - {correctChoice?.Content}
                    </div>
                )}
            </div>
        );
    }

    // Hàm lấy PartID từ câu hỏi
    const getPartID = (questionID) => {
        const media = mediaQuestions.find(m => m.ID === questions.find(q => q.ID === questionID)?.MediaQuestionID);
        return media?.PartID || 0;
    };

    // Nhóm attemptDetails theo PartID
    const parts = {};
    attemptDetails.forEach(a => {
        const partID = getPartID(a.QuestionID);
        if (!parts[partID]) parts[partID] = [];
        parts[partID].push(a);
    });

    return (
        <div className="w-full min-h-screen bg-gray-100 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 px-6 lg:px-12">
                {/* ==== KHUNG KẾT QUẢ ==== */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-lg font-bold mb-4 text-gray-800">Kết quả làm bài</h2>

                    {/* Thống kê tổng quan */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                            <CheckCircle2 className="mx-auto text-green-600 w-6 h-6" />
                            <p className="text-green-600 font-medium">Đúng</p>
                            <p className="font-semibold mt-1 text-green-700">{correct}</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4 text-center">
                            <XCircle className="mx-auto text-red-600 w-6 h-6" />
                            <p className="text-red-600 font-medium">Sai</p>
                            <p className="font-semibold mt-1 text-red-700">{wrong}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <MinusCircle className="mx-auto text-gray-500 w-6 h-6" />
                            <p className="text-gray-600 font-medium">Bỏ qua</p>
                            <p className="font-semibold mt-1 text-gray-600">{skipped}</p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                            <Flag className="mx-auto text-blue-400 w-6 h-6 mb-1" />
                            <p className="text-blue-700 font-medium">Điểm</p>
                            <p className="font-bold text-blue-700 text-2xl mt-1">
                                {selectedAttempt.ScoreReading + selectedAttempt.ScoreListening}
                            </p>
                        </div>
                    </div >
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Listening */}
                        <div className="bg-blue-100 rounded-xl p-4 text-center">
                            <p className="text-blue-700 font-medium">Listening</p>
                            <p className="font-bold text-blue-700 text-2xl mt-1">{selectedAttempt.ScoreListening}</p>
                            <p className="text-sm text-gray-700 mt-1">
                                {attemptDetails.filter(a => {
                                    const part = mediaQuestions.find(m => m.ID === questions.find(q => q.ID === a.QuestionID)?.MediaQuestionID)?.PartID;
                                    return part === 1; // Part Listening giả sử là Part 1
                                }).filter(a => a.IsCorrect).length} /
                                {attemptDetails.filter(a => {
                                    const part = mediaQuestions.find(m => m.ID === questions.find(q => q.ID === a.QuestionID)?.MediaQuestionID)?.PartID;
                                    return part === 1;
                                }).length} câu đúng
                            </p>
                        </div>
                        {/* Reading */}
                        <div className="bg-blue-100 rounded-xl p-4 text-center">
                            <p className="text-blue-700 font-medium">Reading</p>
                            <p className="font-bold text-blue-700 text-2xl mt-1">{selectedAttempt.ScoreReading}</p>
                            <p className="text-sm text-gray-700 mt-1">
                                {attemptDetails.filter(a => {
                                    const part = mediaQuestions.find(m => m.ID === questions.find(q => q.ID === a.QuestionID)?.MediaQuestionID)?.PartID;
                                    return part >= 2; // Part Reading giả sử là Part 2→7
                                }).filter(a => a.IsCorrect).length} /
                                {attemptDetails.filter(a => {
                                    const part = mediaQuestions.find(m => m.ID === questions.find(q => q.ID === a.QuestionID)?.MediaQuestionID)?.PartID;
                                    return part >= 2;
                                }).length} câu đúng
                            </p>
                        </div>
                    </div>



                    {/* Danh sách câu hỏi */}
                    <h2 className="text-lg font-bold mt-6 mb-4 text-gray-800">Phân tích chi tiết</h2>
                    <div className="mt-8">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Phân tích chi tiết</h2>
                        {Object.keys(parts).sort((a, b) => a - b).map(partID => (
                            <div key={partID} className="mb-8">
                                <h3 className="text-base font-semibold text-gray-700 mb-4">Part {partID}</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {parts[partID].map((d) => {
                                        const q = questions.find(q => q.ID === d.QuestionID);
                                        const userChoice = choices.find(c => c.ID === d.ChoiceID);

                                        return (
                                            <div key={d.ID} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 shadow-sm hover:bg-gray-100 transition">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 text-blue-700 font-semibold flex items-center justify-center rounded-full">
                                                        {q?.QuestionNumber}
                                                    </div>
                                                    <div className={`text-sm font-medium ${d.IsCorrect ? "text-green-600" : "text-red-600"}`}>
                                                        {d.IsCorrect ? "Đúng" : `Sai - Đáp án: ${choices.find(c => c.QuestionID === d.QuestionID && c.IsCorrect)?.Attribute}`}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleViewDetail(d.QuestionID)}
                                                    className="text-blue-600 text-sm hover:underline"
                                                >
                                                    [Chi tiết]
                                                </button>
                                            </div>
                                        );
                                    })}

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ==== KHUNG NGƯỜI DÙNG ==== */}
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-md self-start">
                    {currentUser && currentProfile ? (
                        <div className="border rounded-xl shadow-sm p-6 text-center">
                            <div className="mb-4 flex justify-center">
                                <Link to={"/profile"}>
                                    <div className="h-16 w-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold">
                                        {currentUser.FullName[0]}
                                    </div>
                                </Link>
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">{currentUser.FullName}</h3>
                            <p className="text-sm text-gray-500 mb-6">{currentUser.Email}</p>
                            <div className="mb-6 space-y-3 text-sm border-t pt-6 text-left">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Cấp độ:</span>
                                    <span className="font-medium text-gray-900">{currentProfile.PlacementLevel}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Mục tiêu:</span>
                                    <span className="font-medium text-gray-900">{currentProfile.TargetScore}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Thời gian học/ngày:</span>
                                    <span className="font-medium text-gray-900">{currentProfile.DailyStudyMinutes} phút</span>
                                </div>
                            </div>
                            <Link to={`/user/statistics`}>
                                <button className="w-full border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-full py-2">
                                    📊 Xem thống kê
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm text-center">Không tìm thấy thông tin học viên.</p>
                    )}
                </div>
            </div>

            {/* MODAL CHI TIẾT CÂU HỎI */}
            {selectedQuestion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold mb-4 text-gray-800">
                            Câu {selectedQuestion.question.QuestionNumber}
                        </h3>
                        <p className="mb-4 text-gray-700">{selectedQuestion.question.QuestionText}</p>
                        <ul className="space-y-2">
                            {selectedQuestion.choices.map(c => {
                                const isCorrect = c.IsCorrect;
                                const isUserChoice = c.ID === selectedQuestion.userChoice?.ID;

                                let bg = "bg-white";
                                if (isCorrect) bg = "bg-green-100";
                                if (isUserChoice && !isCorrect) bg = "bg-red-100";

                                return (
                                    <li key={c.ID} className={`${bg} border rounded-lg p-3 flex items-center gap-3`}>
                                        <span className="font-semibold text-gray-800">{c.Attribute}.</span>
                                        <span className="text-gray-700">{c.Content}</span>
                                    </li>
                                );
                            })}
                        </ul>
                        <ExplanationSection questionID={selectedQuestion.question.ID} />
                    </div>
                </div>
            )}
        </div>
    );
}
