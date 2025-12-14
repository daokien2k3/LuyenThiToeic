import { useEffect, useState, useMemo } from "react";
import {
    MessageSquare,
    Trash2,
    Filter,
    Reply,
    Flag,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import axios from "axios";

const BASE_URL = "http://localhost:3001/api/exam";
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

export default function AdminComments() {
    const [comments, setComments] = useState([]);
    const [filterUser, setFilterUser] = useState("");
    const [filterExam, setFilterExam] = useState("");
    const [openDetail, setOpenDetail] = useState({});
    const [reports, setReports] = useState([]);
    const [commentsPerPage, setCommentsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // ================================
    // 📌 1. Gọi API lấy toàn bộ comment
    // ================================
    const fetchAllComments = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/comments/exams/1/comments`, {
                headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
            });

            setComments(res.data?.data || []);
        } catch (err) {
            console.error("Error loading admin comments:", err);
        }
    };

    useEffect(() => {
        fetchAllComments();
    }, []);

    // ================================
    // 📌 2. Map dữ liệu (đã có author + exam từ API)
    // ================================
    const mapComments = useMemo(() => {
        return comments.map((c) => ({
            ...c,
            UserName: c.Author?.FullName || "Không rõ",
            ExamTitle: c.Exam?.Title || "Không rõ",
        }));
    }, [comments]);

    // ================================
    // 📌 3. Lọc theo user + exam
    // ================================
    const filteredComments = useMemo(() => {
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

    // ================================
    // 📌 4. Phân trang
    // ================================
    const paginatedComments = useMemo(() => {
        const start = (currentPage - 1) * commentsPerPage;
        return filteredComments.slice(start, start + commentsPerPage);
    }, [filteredComments, currentPage, commentsPerPage]);

    const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterUser, filterExam, commentsPerPage]);

    // ================================
    // 📌 5. Xoá comment (API thật)
    // ================================
    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc muốn xoá bình luận này?")) return;

        try {
            await axios.delete(`${BASE_URL}/comments/${id}`, {
                headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
            });

            fetchAllComments();
        } catch (err) {
            console.error("Delete comment error:", err);
        }
    };

    // ================================
    // 📌 6. Báo cáo comment (local)
    // ================================
    const handleReport = (c) => {
        const reason = prompt("Nhập lý do báo cáo bình luận:");
        if (!reason) return;

        setReports((prev) => [
            ...prev,
            {
                ReportID: Date.now(),
                CommentID: c.ID,
                UserName: c.UserName,
                Content: c.Content,
                Reason: reason,
                Time: new Date().toISOString(),
            },
        ]);
    };

    // ================================
    // 📌 7. Render giao diện
    // ================================
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Quản lý bình luận
            </h2>

            <div className="grid grid-cols-3 gap-6 h-full overflow-hidden">

                {/* ====== Cột trái ====== */}
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
                            onChange={(e) =>
                                setCommentsPerPage(Number(e.target.value) || 10)
                            }
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>

                    {/* Báo cáo */}
                    <div className="p-4 bg-red-50 border rounded-lg">
                        <h3 className="font-bold text-red-600 flex items-center gap-2">
                            <Flag size={18} /> Báo cáo vi phạm
                        </h3>

                        {reports.length === 0 ? (
                            <p className="text-sm text-gray-600 mt-2">Chưa có báo cáo nào.</p>
                        ) : (
                            reports.map((r) => (
                                <div key={r.ReportID} className="p-3 bg-white mt-3 rounded border">
                                    <p className="font-semibold">
                                        #{r.CommentID} – {r.UserName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(r.Time).toLocaleString()}
                                    </p>
                                    <p className="text-sm mt-1">
                                        <b>Lý do:</b> {r.Reason}
                                    </p>
                                    <p className="text-xs mt-2 p-2 rounded bg-gray-100">
                                        {r.Content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ====== Cột phải ====== */}
                <div className="col-span-2 border-l pl-4 flex flex-col">

                    <div className="flex items-center gap-2 mb-4 text-gray-600">
                        <Filter size={20} />
                        <span>Danh sách bình luận (Trang {currentPage} / {totalPages})</span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-3 space-y-3">
                        {paginatedComments.map((c) => {
                            const parent = mapComments.find((p) => p.ID === c.ParentId);

                            return (
                                <div
                                    key={c.ID}
                                    className="p-4 border bg-gray-50 rounded-lg shadow-sm"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold flex items-center gap-2">
                                                <MessageSquare size={18} />
                                                #{c.ID} – {c.UserName}
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                {new Date(c.CreateAt).toLocaleDateString()}
                                            </div>

                                            <div className="text-xs text-blue-600 mt-1">
                                                Bài thi: {c.ExamID}
                                            </div>

                                            {parent && (
                                                <div className="text-xs text-purple-700 flex items-center gap-1 mt-1">
                                                    <Reply size={14} /> Trả lời bình luận #{parent.ID}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                className="p-2 text-red-600"
                                                onClick={() => handleDelete(c.ID)}
                                            >
                                                <Trash2 size={20} />
                                            </button>

                                            <button
                                                className="p-2 text-yellow-600"
                                                onClick={() => handleReport(c)}
                                            >
                                                <Flag size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Toggle nội dung */}
                                    <button
                                        className="mt-3 px-3 py-1 rounded bg-white border"
                                        onClick={() =>
                                            setOpenDetail((prev) => ({
                                                ...prev,
                                                [c.ID]: !prev[c.ID],
                                            }))
                                        }
                                    >
                                        {openDetail[c.ID] ? "Ẩn nội dung" : "Xem nội dung"}
                                    </button>

                                    {openDetail[c.ID] && (
                                        <div className="mt-3 p-3 bg-white border rounded-lg text-sm">
                                            {c.Content}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-4 pb-4">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                            >
                                <ChevronLeft />
                            </button>

                            <span>Trang {currentPage} / {totalPages}</span>

                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
