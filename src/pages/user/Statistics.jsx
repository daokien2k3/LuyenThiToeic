import { useState, useEffect } from "react";
import {
    BookOpen,
    Clock,
    Calendar,
    Target,
    TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Statistics() {
    const [activeTab, setActiveTab] = useState("listening");
    const [selectedDays, setSelectedDays] = useState("30");
    const [results, setResults] = useState([]);

    // Đọc dữ liệu từ public/data/Results.json
    useEffect(() => {
        fetch("/data/Attempt.json")
            .then((res) => res.json())
            .then((data) => setResults(data))
            .catch((err) => console.error("Lỗi tải Results.json:", err));
    }, []);

    // Dữ liệu thống kê giả lập (sau này có thể lấy từ API)
    const statsData = {
        listening: {
            testsDone: 5,
            accuracy: "78.5%",
            avgTime: "25 phút",
            avgScore: "360/495",
            bestScore: "420/495",
        },
        reading: {
            testsDone: 4,
            accuracy: "72.0%",
            avgTime: "27 phút",
            avgScore: "340/495",
            bestScore: "390/495",
        },
    };

    const StatCard = ({ icon: Icon, label, value, unit, highlight = false }) => (
        <div className="flex flex-col items-center justify-center p-6 text-center border rounded-lg shadow-sm bg-white">
            <Icon className="w-8 h-8 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-2">{label}</p>
            <p
                className={`${highlight
                    ? "text-2xl font-bold text-blue-600"
                    : "text-2xl font-bold"
                    }`}
            >
                {value}
            </p>
            {unit && <p className="text-xs text-gray-500 mt-1">{unit}</p>}
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50 py-10">
            <div className="w-full max-w-6xl mx-auto p-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-6">
                    Thống kê kết quả học tập
                </h2>

                {/* Bộ lọc */}
                <div className="mb-8 bg-white border p-5 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Lọc kết quả theo ngày (tính từ bài thi cuối):
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={selectedDays}
                            onChange={(e) => setSelectedDays(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="7">7 ngày</option>
                            <option value="30">30 ngày</option>
                            <option value="90">90 ngày</option>
                            <option value="365">1 năm</option>
                        </select>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition">
                            Tìm kiếm
                        </button>
                        <button className="border border-gray-300 text-gray-600 hover:bg-gray-100 px-6 py-2 rounded-lg transition">
                            Xóa lọc
                        </button>
                    </div>
                </div>

                {/* Thông tin tổng quan */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <StatCard icon={BookOpen} label="Số đề đã làm" value="9" unit="đề thi" />
                    <StatCard icon={Clock} label="Thời gian luyện thi" value="120" unit="phút" />
                    <StatCard icon={Calendar} label="Ngày dự thi" value="-" unit="✏️" />
                    <StatCard icon={Target} label="Tới kỳ thi" value="10" unit="ngày" />
                    <StatCard icon={TrendingUp} label="Điểm mục tiêu" value="800.0" highlight />
                </div>

                {/* Tabs Listening / Reading */}
                <div className="flex gap-6 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("listening")}
                        className={`pb-3 font-medium transition-colors ${activeTab === "listening"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Listening
                    </button>
                    <button
                        onClick={() => setActiveTab("reading")}
                        className={`pb-3 font-medium transition-colors ${activeTab === "reading"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Reading
                    </button>
                </div>

                {/* Dữ liệu chi tiết theo tab */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
                    <StatCard
                        icon={BookOpen}
                        label="Số đề đã làm"
                        value={statsData[activeTab].testsDone}
                        unit="đề"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Độ chính xác (#đúng/#tổng)"
                        value={statsData[activeTab].accuracy}
                    />
                    <StatCard
                        icon={Clock}
                        label="Thời gian trung bình"
                        value={statsData[activeTab].avgTime}
                    />
                    <StatCard
                        icon={Target}
                        label="Điểm trung bình"
                        value={statsData[activeTab].avgScore}
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Điểm cao nhất"
                        value={statsData[activeTab].bestScore}
                        highlight
                    />
                </div>

                {/* ===== LỊCH SỬ LUYỆN THI ===== */}
                <div className="bg-white border rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        🕓 Lịch sử các bài luyện thi
                    </h3>

                    {results.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {results.map((r) => (
                                <li
                                    key={r.ID}
                                    className="py-4 px-3 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <p className="font-medium text-blue-700 text-lg">
                                                Bài thi #{r.ID}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Ngày làm: {r.StartedAt} → {r.SubmittedAt}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-base font-semibold text-green-600">
                                                🏆 {r.ScoreReading + r.ScoreListening} điểm
                                            </span>
                                            <Link to="/user/result" className="ml-2 bg-gray-200 hover:bg-blue-500 hover:text-white text-gray-700 px-3 py-1 rounded-md text-sm transition-all">
                                                {/* <button className="ml-2 bg-gray-200 hover:bg-blue-500 hover:text-white text-gray-700 px-3 py-1 rounded-md text-sm transition-all"> */}
                                                    Xem chi tiết
                                                {/* </button> */}
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-gray-600 text-sm mt-2">
                                        <span>📘 Reading: {r.ScoreReading}</span>
                                        <span>🎧 Listening: {r.ScoreListening}</span>
                                        <span>🎯 Tỷ lệ đúng: {r.ScorePercent}%</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">Chưa có lịch sử làm bài.</p>
                    )}
                </div>
            </div>
        </main>
    );
}
