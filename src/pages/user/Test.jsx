"use client"

import { useEffect, useState } from "react"
import { Search, Clock, ListChecks, Layers } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"

export default function Tests() {
    const [data, setData] = useState({
        users: [],
        profiles: [],
        exams: [],
        examTypes: [],
        questions: [],
        mediaQuestions: [],
        mediaQuestion_Exam: [],
        parts: []
    })
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("Tất cả")

    useEffect(() => {
        fetch("/data/toeicPractice.json")
            .then((res) => res.json())
            .then((json) => {
                setData({
                    users: json.users || [],
                    profiles: json.studentProfiles || [],
                    exams: json.exams || [],
                    examTypes: json.examTypes || [],
                    questions: json.questions || [],
                    mediaQuestions: json.mediaQuestions || [],
                    mediaQuestion_Exam: json.mediaQuestion_Exam || [],
                    parts: json.parts || []
                })
            })
            .catch((err) => console.error("Lỗi tải dữ liệu:", err))
    }, [])

    const { users, profiles, exams, examTypes, questions, mediaQuestions, mediaQuestion_Exam } = data

    // 🔹 Merge exam với loại đề
    const mergedExams = exams.map((exam) => {
        const type = examTypes.find((t) => t.ID === exam.ExamTypeID)
        return {
            ...exam,
            TypeName: type?.Name || "Khác"
        }
    })

    // 🔹 Tính số câu hỏi & số part
    const getExamStats = (examId) => {
        // Lấy danh sách mediaQuestionID của exam
        const mediaIds = mediaQuestion_Exam
            .filter(mq => mq.ExamID === examId)
            .map(mq => mq.MediaQuestionID)

        // Lấy danh sách câu hỏi của exam
        const examQuestions = questions.filter(q => mediaIds.includes(q.MediaQuestionID))
        const totalQuestions = examQuestions.length

        // Lấy danh sách part
        const partIds = [
            ...new Set(
                examQuestions
                    .map(q => {
                        const media = mediaQuestions.find(m => m.ID === q.MediaQuestionID)
                        return media?.PartID
                    })
                    .filter(Boolean)
            )
        ]
        const partCount = partIds.length

        return { totalQuestions, partCount }
    }

    // 🔹 Filter theo category & search
    const filteredExams = mergedExams.filter(exam => {
        const matchCategory =
            activeCategory === "Tất cả" ||
            exam.TypeName.toLowerCase().includes(activeCategory.toLowerCase())
        const matchSearch = exam.Title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchCategory && matchSearch
    })

    const currentUser = users.find(u => u.ID === 3)
    const currentProfile = profiles.find(p => p.UserID === 3)

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-6 py-8">
                    <h1 className="text-3xl font-bold text-gray-900">Thư viện đề thi</h1>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                <div className="flex gap-8">
                    <div className="flex-1">
                        {/* Categories */}
                        <div className="mb-8 flex flex-wrap gap-3">
                            {["Tất cả", ...examTypes.map(t => t.Name)].map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium border transition-colors ${activeCategory === category
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="mb-6 flex gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Nhập từ khoá: tên đề, dạng câu hỏi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                />
                                <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Exam Cards */}
                        {filteredExams.length === 0 ? (
                            <p className="text-center text-gray-500">Không tìm thấy đề thi phù hợp.</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredExams.map(exam => {
                                    const { totalQuestions, partCount } = getExamStats(exam.ID)
                                    return (
                                        <div
                                            key={exam.ID}
                                            className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-shadow flex flex-col overflow-hidden"
                                        >
                                            <div className="flex-1 p-4">
                                                <h3 className="mb-3 text-base font-semibold text-gray-900">{exam.Title}</h3>
                                                <p className="text-xs text-gray-500 mb-3">
                                                    Loại: <span className="font-medium text-gray-700">{exam.TypeName}</span>
                                                </p>
                                                <div className="text-xs text-gray-600 flex items-center gap-2 mb-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Thời gian làm bài: {exam.TimeExam} phút</span>
                                                </div>
                                                <div className="text-xs text-gray-600 flex items-center gap-2 mb-2">
                                                    <Layers className="h-4 w-4" />
                                                    <span>Các phần trong đề: {partCount} parts</span>
                                                </div>
                                                <div className="text-xs text-gray-600 flex items-center gap-2">
                                                    <ListChecks className="h-4 w-4" />
                                                    <span>Số câu hỏi: {totalQuestions}</span>
                                                </div>
                                            </div>
                                            <Link to={`/user/tests/${exam.ID}`} className="block">
                                                <button className="w-full border-t border-gray-200 px-4 py-3 text-center font-medium text-blue-600 hover:bg-blue-50 transition-colors flex justify-center">
                                                    Chi tiết
                                                </button>
                                            </Link>

                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="w-80 hidden lg:block">
                        {currentUser && currentProfile ? (
                            <div className="bg-white border rounded-xl shadow-sm mb-6 p-6 text-center">
                                <div className="mb-4 flex justify-center">
                                    <Link to={'/user/profile'}>
                                        <div className="h-16 w-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold">
                                            {currentUser.FullName?.[0] || "U"}
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
                            <p className="text-gray-500 text-sm">Không tìm thấy thông tin học viên.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}