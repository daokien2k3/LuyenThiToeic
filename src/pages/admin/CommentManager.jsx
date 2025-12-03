import { useEffect, useState, useMemo } from "react";
import { MessageSquare, Trash2, Filter, Reply, Flag, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminComments() {
    const [data, setData] = useState(null);
    const [filterUser, setFilterUser] = useState("");
    const [filterExam, setFilterExam] = useState(""); // ⭐ Thêm state lọc theo bài thi
    const [openDetail, setOpenDetail] = useState({});
    const [reports, setReports] = useState([]); // ⭐ Danh sách báo cáo
    const [commentsPerPage, setCommentsPerPage] = useState(10); // ⭐ Số comment mỗi trang
    const [currentPage, setCurrentPage] = useState(1); // ⭐ Trang hiện tại

    // Load JSON
    useEffect(() => {
        fetch("/data/toeicPractice.json")
            .then((res) => res.json())
            .then((json) => setData(json));
    }, []);

    // Gộp dữ liệu (di chuyển lên trước để hooks luôn được gọi theo thứ tự)
    const mapComments = useMemo(() => {
        if (!data) return [];
        const { users, studentProfiles, exams, comments } = data;
        return comments.map((c) => {
            const profile = studentProfiles.find((sp) => sp.ID === c.StudentProfileID);
            const user = users.find((u) => u.ID === profile?.UserID);
            const exam = exams.find((e) => e.ID === c.ExamID);

            return {
                ...c,
                UserName: user?.FullName || "Không rõ",
                ExamTitle: exam?.Title || "Không rõ",
            };
        });
    }, [data]);

    // Lọc comment (bao gồm cả user và exam)
    const filteredComments = useMemo(() => {
        if (!mapComments.length) return [];
        let filtered = mapComments;
        if (filterUser) {
            filtered = filtered.filter((c) =>
                c.UserName.toLowerCase().includes(filterUser.toLowerCase())
            );
        }
        if (filterExam) {
            filtered = filtered.filter((c) =>
                c.ExamTitle.toLowerCase().includes(filterExam.toLowerCase())
            );
        }
        return filtered;
    }, [filterUser, filterExam, mapComments]);

    // Tính toán comments cho trang hiện tại
    const paginatedComments = useMemo(() => {
        const startIndex = (currentPage - 1) * commentsPerPage;
        const endIndex = startIndex + commentsPerPage;
        return filteredComments.slice(startIndex, endIndex);
    }, [filteredComments, currentPage, commentsPerPage]);

    // Tổng số trang
    const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

    // Reset trang khi filter thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [filterUser, filterExam, commentsPerPage]);

    if (!data) return <p className="p-6 text-center">Đang tải bình luận...</p>;

    // ❌ Xóa comment
    const handleDelete = (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa bình luận này?")) return;
        alert("Giả lập xóa comment ID " + id);
    };

    // 🚨 Báo cáo comment
    const handleReport = (c) => {
        const reason = prompt("Nhập lý do báo cáo bình luận:");
        if (!reason) return;

        setReports((prev) => [
            ...prev,
            {
                ReportID: Date.now(),
                CommentID: c.ID,
                UserName: c.UserName,
                Reason: reason,
                Content: c.Content,
                Time: new Date().toISOString(),
            },
        ]);
    };

    // Xử lý thay đổi trang
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Quản lý bình luận
            </h2>

            {/* GRID 3:7 */}
            <div className="grid grid-cols-3 gap-6 h-full overflow-hidden">
                {/* ⭐ CỘT TRÁI (3 phần) */}
                <div className="space-y-4 pr-4 overflow-y-auto">
                    {/* Bộ lọc */}
                    <div>
                        <label className="font-semibold block mb-1">Lọc theo tên người dùng</label>
                        <input
                            type="text"
                            placeholder="Nhập tên user..."
                            value={filterUser}
                            onChange={(e) => setFilterUser(e.target.value)}
                            className="w-full p-2 border rounded-lg mb-2"
                        />
                        <label className="font-semibold block mb-1">Lọc theo bài thi</label>
                        <input
                            type="text"
                            placeholder="Nhập tên bài thi..."
                            value={filterExam}
                            onChange={(e) => setFilterExam(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>

                    {/* Số comment mỗi trang */}
                    <div>
                        <label className="font-semibold block mb-1">Số bình luận mỗi trang</label>
                        <input
                            type="number"
                            min="1"
                            value={commentsPerPage}
                            onChange={(e) => setCommentsPerPage(Number(e.target.value) || 10)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>

                    {/* Tổng số comment */}
                    <div className="p-4 bg-gray-50 border rounded-lg">
                        <p className="font-semibold">Tổng số bình luận được tìm thấy:</p>
                        <p className="text-lg font-medium mt-1">{filteredComments.length}</p>
                    </div>

                    {/* Danh sách báo cáo */}
                    <div className="p-4 bg-red-50 border rounded-lg">
                        <h3 className="font-bold text-red-600 flex items-center gap-2">
                            <Flag size={18} /> Báo cáo vi phạm
                        </h3>

                        {reports.length === 0 ? (
                            <p className="text-sm mt-2 text-gray-600">Chưa có báo cáo nào.</p>
                        ) : (
                            <div className="mt-3 space-y-3">
                                {reports.map((r) => (
                                    <div
                                        key={r.ReportID}
                                        className="p-3 bg-white rounded border shadow-sm"
                                    >
                                        <p className="font-semibold">#{r.CommentID} – {r.UserName}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(r.Time).toLocaleString()}
                                        </p>
                                        <p className="text-sm mt-1"><b>Lý do:</b> {r.Reason}</p>
                                        <p className="text-xs mt-2 bg-gray-100 p-2 rounded">{r.Content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ⭐ CỘT PHẢI (7 phần) – Danh sách comment */}
                <div className="col-span-2 border-l pl-4 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center gap-2 mb-4 text-gray-600">
                        <Filter size={20} />
                        <span>Danh sách bình luận (Trang {currentPage} / {totalPages})</span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-3 space-y-3">
                        {paginatedComments.map((c) => {
                            const isReply = c.ParentId !== null;
                            const parentComment = mapComments.find((p) => p.ID === c.ParentId);

                            return (
                                <div
                                    key={c.ID}
                                    className="p-4 border bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100"
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold flex items-center gap-2">
                                                <MessageSquare size={18} />
                                                #{c.ID} – {c.UserName}
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                {new Date(c.CreateAt).toLocaleDateString()}
                                            </div>

                                            <div className="text-xs mt-1 text-blue-600">
                                                Bài thi: {c.ExamTitle}
                                            </div>

                                            {isReply && (
                                                <div className="text-xs mt-1 flex items-center gap-1 text-purple-700">
                                                    <Reply size={14} /> Trả lời bình luận #{parentComment?.ID}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                className="p-2 text-red-600 hover:text-red-800"
                                                onClick={() => handleDelete(c.ID)}
                                            >
                                                <Trash2 size={20} />
                                            </button>

                                            <button
                                                className="p-2 text-yellow-600 hover:text-yellow-800"
                                                onClick={() => handleReport(c)}
                                            >
                                                <Flag size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Toggle nội dung */}
                                    <button
                                        className="mt-3 px-3 py-1 rounded bg-white border text-sm hover:bg-gray-200"
                                        onClick={() =>
                                            setOpenDetail((prev) => ({
                                                ...prev,
                                                [c.ID]: !prev[c.ID],
                                            }))
                                        }
                                    >
                                        {openDetail[c.ID] ? "Ẩn nội dung" : "Xem nội dung"}
                                    </button>

                                    {/* Nội dung bình luận */}
                                    <div
                                        className={`transition-all duration-300 overflow-hidden ${
                                            openDetail[c.ID] ? "max-h-[300px] mt-3" : "max-h-0"
                                        }`}
                                    >
                                        <p className="p-3 bg-white border rounded-lg text-sm text-gray-700">
                                            {c.Content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-4 pb-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span>Trang {currentPage} / {totalPages}</span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
