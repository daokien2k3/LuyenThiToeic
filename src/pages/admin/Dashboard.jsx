import { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, BookOpen, MessageSquare, Flag, TrendingUp, Calendar } from "lucide-react";

export default function AdminDashboard() {
    const [data, setData] = useState(null);

    // Load JSON
    useEffect(() => {
        fetch("/data/toeicPractice.json")
            .then((res) => res.json())
            .then((json) => setData(json));
    }, []);

    // Tính toán thống kê
    const stats = useMemo(() => {
        if (!data) return null;
        const { users, studentProfiles, exams, comments } = data;

        const totalUsers = users.length;
        const totalExams = exams.length;
        const totalComments = comments.length;
        const totalReports = 0; // Giả lập, vì reports không có trong data gốc

        // Biểu đồ comments theo exam
        const commentsByExam = exams.map((exam) => {
            const count = comments.filter((c) => c.ExamID === exam.ID).length;
            return { name: exam.Title, value: count };
        });

        // Biểu đồ comments theo tháng (giả lập dựa trên CreateAt)
        const commentsByMonth = {};
        comments.forEach((c) => {
            const month = new Date(c.CreateAt).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
            commentsByMonth[month] = (commentsByMonth[month] || 0) + 1;
        });
        const chartData = Object.entries(commentsByMonth).map(([month, count]) => ({ month, count }));

        return {
            totalUsers,
            totalExams,
            totalComments,
            totalReports,
            commentsByExam,
            chartData,
        };
    }, [data]);

    if (!data) return <p className="p-6 text-center">Đang tải dữ liệu...</p>;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-8">
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Dashboard Quản Trị TOEIC
            </h1>

            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <Users className="text-blue-500 mr-4" size={40} />
                    <div>
                        <h3 className="text-lg font-semibold">Tổng Người Dùng</h3>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <BookOpen className="text-green-500 mr-4" size={40} />
                    <div>
                        <h3 className="text-lg font-semibold">Tổng Bài Thi</h3>
                        <p className="text-2xl font-bold">{stats.totalExams}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <MessageSquare className="text-purple-500 mr-4" size={40} />
                    <div>
                        <h3 className="text-lg font-semibold">Tổng Bình Luận</h3>
                        <p className="text-2xl font-bold">{stats.totalComments}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <Flag className="text-red-500 mr-4" size={40} />
                    <div>
                        <h3 className="text-lg font-semibold">Báo Cáo Vi Phạm</h3>
                        <p className="text-2xl font-bold">{stats.totalReports}</p>
                    </div>
                </div>
            </div>

            {/* Biểu đồ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Biểu đồ cột: Comments theo tháng */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <TrendingUp className="mr-2" size={24} />
                        Bình Luận Theo Tháng
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Biểu đồ tròn: Comments theo bài thi */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <BookOpen className="mr-2" size={24} />
                        Bình Luận Theo Bài Thi
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.commentsByExam}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {stats.commentsByExam.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Danh sách gần đây */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Calendar className="mr-2" size={24} />
                    Bình Luận Gần Đây
                </h3>
                <div className="space-y-4">
                    {data.comments.slice(0, 5).map((c) => {
                        const user = data.users.find((u) => u.ID === data.studentProfiles.find((sp) => sp.ID === c.StudentProfileID)?.UserID);
                        const exam = data.exams.find((e) => e.ID === c.ExamID);
                        return (
                            <div key={c.ID} className="flex justify-between items-center p-4 border rounded-lg">
                                <div>
                                    <p className="font-semibold">#{c.ID} – {user?.FullName || "Không rõ"}</p>
                                    <p className="text-sm text-gray-600">Bài thi: {exam?.Title || "Không rõ"}</p>
                                    <p className="text-xs text-gray-500">{new Date(c.CreateAt).toLocaleString()}</p>
                                </div>
                                <p className="text-sm text-gray-700 truncate max-w-xs">{c.Content}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Liên kết nhanh */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/admin/comments" className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600 transition">
                    Quản Lý Bình Luận
                </a>
                <a href="/admin/users" className="bg-green-500 text-white p-4 rounded-lg text-center hover:bg-green-600 transition">
                    Quản Lý Người Dùng
                </a>
                <a href="/admin/exams" className="bg-purple-500 text-white p-4 rounded-lg text-center hover:bg-purple-600 transition">
                    Quản Lý Bài Thi
                </a>
            </div>
        </div>
    );
}
