import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, MinusCircle, Flag, X } from "lucide-react";

export default function Result() {
    const { attemptID } = useParams();

    const [attempts, setAttempts] = useState([]);
    const [attemptAnswers, setAttemptAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [choices, setChoices] = useState([]);
    const [mediaQuestions, setMediaQuestions] = useState([]);
    const [users, setUsers] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [selectedAttempt, setSelectedAttempt] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const LOGGED_USER_ID = 3; // Giữ nguyên mặc định user ID 3

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

                // tìm attempt theo URL
                const selected = data.attempts.find(a => a.ID === Number(attemptID));

                // Tìm studentProfile của user đang đăng nhập
                const userProfile = data.studentProfiles.find(
                    p => p.UserID === LOGGED_USER_ID
                );

                // Kiểm tra xem attempt này có thuộc studentProfile của user hay không
                if (selected && userProfile && selected.StudentProfileID === userProfile.ID) {
                    setSelectedAttempt(selected);
                } else {
                    setSelectedAttempt(null);
                }

            })
            .catch(err => console.error(err));
    }, [attemptID]);

    if (!selectedAttempt)
        return (
            <p className="text-center mt-10 text-red-600 font-medium">
                Không tìm thấy kết quả bài làm hoặc bạn không có quyền xem bài này.
            </p>
        );

    // lọc answer
    const attemptDetails = attemptAnswers.filter(a => a.AttemptID === selectedAttempt.ID);

    const totalQuestions = attemptDetails.length;
    const correct = attemptDetails.filter(a => a.IsCorrect).length;
    const wrong = totalQuestions - correct;
    const skipped = 0;

    // Lấy StudentProfile tương ứng với attempt
    const currentProfile = profiles.find(p => p.ID === selectedAttempt.StudentProfileID);

    // Lấy user dựa vào UserID bên trong Profile
    const currentUser = users.find(u => u.ID === currentProfile?.UserID);


    // const handleViewDetail = (questionID) => {
    //     const question = questions.find(q => q.ID === questionID);
    //     const questionChoices = choices.filter(c => c.QuestionID === questionID);
    //     const userAnswer = attemptAnswers.find(a => a.AttemptID === selectedAttempt.ID && a.QuestionID === questionID);
    //     const userChoice = questionChoices.find(c => c.ID === userAnswer?.ChoiceID);

    //     setSelectedQuestion({
    //         question,
    //         choices: questionChoices,
    //         userChoice
    //     });
    // };

    const handleViewDetail = (questionID) => {
        const question = questions.find(q => q.ID === questionID);

        // tìm lựa chọn của người dùng cho câu này
        const userAttempt = Object.values(parts)
            .flat()
            .find(d => d.QuestionID === questionID);

        const userChoice = choices.find(c => c.ID === userAttempt.ChoiceID);

        const choicesForQuestion = choices.filter(c => c.QuestionID === questionID);

        const mediaQ = mediaQuestions.find(mq => mq.ID === question.MediaQuestionID);

        setSelectedQuestion({
            question,
            userChoice,
            choices: choicesForQuestion,
            mediaQuestion: mediaQ
        });
    };



    const closeModal = () => setSelectedQuestion(null);

    function ExplanationSection({ questionID }) {
        const [showExplanation, setShowExplanation] = useState(false);
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

    const getPartID = (questionID) => {
        const question = questions.find(q => q.ID === questionID);
        const media = mediaQuestions.find(m => m.ID === question?.MediaQuestionID);
        return media?.PartID || 0;
    };

    const parts = {};
    attemptDetails.forEach(a => {
        const partID = getPartID(a.QuestionID);
        if (!parts[partID]) parts[partID] = [];
        parts[partID].push(a);
    });

    return (
        <div className="w-full min-h-screen bg-gray-100 pt-2 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 px-6 lg:px-12 overflow-visible">

                {/* LEFT */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-lg font-bold mb-4">Kết quả bài làm</h2>

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
                            <Flag className="mx-auto text-blue-500 w-6 h-6" />
                            <p className="text-blue-700 font-medium">Điểm</p>
                            <p className="text-2xl font-bold text-blue-700 mt-1">
                                {selectedAttempt.ScoreReading + selectedAttempt.ScoreListening}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-100 rounded-xl p-4 text-center">
                            <Flag className="mx-auto text-blue-500 w-6 h-6" />
                            <p className="text-blue-700 font-medium">Listening</p>
                            <p className="text-2xl font-bold text-blue-700 mt-1">{selectedAttempt.ScoreListening}</p>
                            {/* <p className="text-sm text-gray-700 mt-1">
                                {attemptDetails.filter(a => {
                                    const part = mediaQuestions.find(m => m.ID === questions.find(q => q.ID === a.QuestionID)?.MediaQuestionID)?.PartID;
                                    return part === 1;
                                }).filter(a => a.IsCorrect).length} /
                                {attemptDetails.filter(a => {
                                    const part = mediaQuestions.find(m => m.ID === questions.find(q => q.ID === a.QuestionID)?.MediaQuestionID)?.PartID;
                                    return part === 1;
                                }).length} câu đúng
                            </p> */}
                        </div>

                        <div className="bg-blue-100 rounded-xl p-4 text-center">
                            <Flag className="mx-auto text-blue-500 w-6 h-6" />
                            <p className="text-blue-700 font-medium">Reading</p>
                            <p className="text-2xl font-bold text-blue-700 mt-1">{selectedAttempt.ScoreReading}</p>
                            {/* <p className="text-sm text-gray-700 mt-1">
                                {attemptDetails.filter(a => {
                                    const part = mediaQuestions.find(m => m.ID === questions.find(q => q.ID === a.QuestionID)?.MediaQuestionID)?.PartID;
                                    return part >= 2;
                                }).filter(a => a.IsCorrect).length} /
                                {attemptDetails.filter(a => {
                                    const part = mediaQuestions.find(m => m.ID === questions.find(q => q.ID === a.QuestionID)?.MediaQuestionID)?.PartID;
                                    return part >= 2;
                                }).length} câu đúng
                            </p> */}
                        </div>
                    </div>

                    {/* ANALYSIS */}
                    <h2 className="text-lg font-bold mt-6 mb-4">Phân tích chi tiết</h2>

                    {Object.keys(parts).sort((a, b) => a - b).map(partID => (
                        <div key={partID} className="mb-8">
                            <h3 className="text-base font-semibold mb-4">Part {partID}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {parts[partID].map((d) => {
                                    const q = questions.find(q => q.ID === d.QuestionID);
                                    const correctChoice = choices.find(c => c.QuestionID === q.ID && c.IsCorrect);

                                    return (
                                        <div key={d.ID} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 text-blue-700 font-semibold flex items-center justify-center rounded-full">
                                                    {q.QuestionNumber}
                                                </div>

                                                <div className={`text-sm font-medium ${d.IsCorrect ? "text-green-600" : "text-red-600"}`}>
                                                    {d.IsCorrect ? "Đúng" : `Sai - Đáp án: ${correctChoice.Attribute}`}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleViewDetail(q.ID)}
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

                {/* RIGHT SIDEBAR */}
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-md sticky top-20 h-fit">
                    {currentUser && currentProfile ? (
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="h-16 w-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-bold">
                                    {currentUser.FullName[0]}
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold">{currentUser.FullName}</h3>
                            <p className="text-sm text-gray-500 mb-6">{currentUser.Email}</p>

                            <div className="space-y-2 border-t pt-4 text-left text-sm">
                                <div className="flex justify-between">
                                    <span>Cấp độ:</span>
                                    <span className="font-medium">{currentProfile.PlacementLevel}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Mục tiêu:</span>
                                    <span className="font-medium">{currentProfile.TargetScore}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Thời gian/ngày:</span>
                                    <span className="font-medium">{currentProfile.DailyStudyMinutes} phút</span>
                                </div>
                            </div>

                            <Link to="/user/statistics">
                                <button className="w-full border-2 border-blue-600 text-blue-600 rounded-full py-2 mt-4 hover:bg-blue-50">
                                    📊 Xem thống kê
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <p className="text-center text-sm text-gray-500">Không tìm thấy học viên.</p>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {selectedQuestion && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white w-full max-w-2xl p-6 rounded-2xl relative max-h-[90vh] overflow-hidden">

                        {/* NÚT ĐÓNG */}
                        <button className="absolute top-3 right-3" onClick={closeModal}>
                            <X />
                        </button>

                        {/* KHỐI NỘI DUNG CÓ SCROLL */}
                        <div className="overflow-y-auto max-h-[80vh] pr-2">

                            {/* MEDIA QUESTION */}
                            {selectedQuestion.mediaQuestion && (
                                <div className="mb-4 space-y-3">

                                    {/* IMAGE */}
                                    {selectedQuestion.mediaQuestion.ImageUrl && (
                                        <img
                                            src={`/${selectedQuestion.mediaQuestion.ImageUrl}`}
                                            alt="Question visual"
                                            className="w-full rounded-lg border"
                                        />
                                    )}

                                    {/* AUDIO */}
                                    {selectedQuestion.mediaQuestion.AudioUrl && (
                                        <audio controls className="w-full mt-2">
                                            <source src={`/${selectedQuestion.mediaQuestion.AudioUrl}`} type="audio/mpeg" />
                                            Trình duyệt của bạn không hỗ trợ audio.
                                        </audio>
                                    )}

                                    {/* SCRIPT */}
                                    {selectedQuestion.mediaQuestion.Script && (
                                        <p className="bg-gray-50 p-3 rounded-lg text-sm border">
                                            <strong>Transcript:</strong> {selectedQuestion.mediaQuestion.Script}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* QUESTION TITLE */}
                            <h3 className="text-lg font-bold mb-3">
                                Câu {selectedQuestion.question.QuestionNumber}
                            </h3>

                            {/* QUESTION TEXT */}
                            <p className="mb-4">{selectedQuestion.question.QuestionText}</p>

                            {/* ANSWERS */}
                            <ul className="space-y-2">
                                {selectedQuestion.choices.map(c => {
                                    const isCorrect = c.IsCorrect;
                                    const isUserChoice = c.ID === selectedQuestion.userChoice?.ID;

                                    let bg = "bg-white";
                                    if (isCorrect) bg = "bg-green-100";
                                    if (isUserChoice && !isCorrect) bg = "bg-red-100";

                                    return (
                                        <li key={c.ID} className={`${bg} p-3 border rounded-lg`}>
                                            <strong>{c.Attribute}.</strong> {c.Content}
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* EXPLANATION */}
                            <ExplanationSection questionID={selectedQuestion.question.ID} />

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

