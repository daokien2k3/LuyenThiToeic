import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import EditExamModal from "./EditExamModal";

export default function ExamManager() {

    const [exams, setExams] = useState([]);
    const [examTypes, setExamTypes] = useState([]);
    const [mediaQuestionExam, setMediaQuestionExam] = useState([]);
    const [mediaQuestions, setMediaQuestions] = useState([]);

    const [editingExam, setEditingExam] = useState(null);
    const [selectedMediaIds, setSelectedMediaIds] = useState([]);

    // Load dữ liệu JSON
    useEffect(() => {
        fetch("/data/toeicPractice.json")
            .then((res) => res.json())
            .then((data) => {
                setExams(data.exams || []);
                setExamTypes(data.examTypes || []);
                setMediaQuestionExam(data.mediaQuestion_Exam || []);
                setMediaQuestions(data.mediaQuestions || []);
            })
            .catch((err) => console.error("Load JSON error:", err));
    }, []);

    // ============================================
    // 🔥 Khi ấn sửa → mở modal + load media đúng của đề thi
    // ============================================
    const openEditModal = (exam) => {
        setEditingExam(exam);

        const mediaIds = mediaQuestionExam
            .filter((m) => m.ExamID === exam.ID)
            .map((m) => m.MediaQuestionID);

        setSelectedMediaIds(mediaIds);
    };

    // 🔥 Khi thêm đề → modal trống hoàn toàn
    const openAddModal = () => {
        setEditingExam({
            ID: null,
            Title: "",
            ExamTypeID: "",
            TimeExam: ""
        });
        setSelectedMediaIds([]);
    };

    // ============================================
    // 🔥 Lưu dữ liệu từ modal
    // ============================================
    const handleSave = ({ updatedExam, mediaQuestions: updatedMediaList }) => {
        // Cập nhật hoặc thêm đề mới
        if (updatedExam.ID) {
            setExams((prev) =>
                prev.map((e) => (e.ID === updatedExam.ID ? updatedExam : e))
            );
        } else {
            updatedExam.ID =
                exams.length ? Math.max(...exams.map((e) => e.ID)) + 1 : 1;

            setExams((prev) => [...prev, updatedExam]);
        }

        // Cập nhật bảng mediaQuestion_Exam
        setMediaQuestionExam((prev) => {
            // Xóa media cũ thuộc đề thi
            const filtered = prev.filter((item) => item.ExamID !== updatedExam.ID);

            // Tạo lại danh sách mới
            const added = updatedMediaList.map((mid) => ({
                ID: Math.floor(Math.random() * 999999),
                ExamID: updatedExam.ID,
                MediaQuestionID: mid
            }));

            return [...filtered, ...added];
        });

        setEditingExam(null);
    };

    // ============================================
    // 🔥 Xóa đề thi
    // ============================================
    const handleDelete = (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa đề thi này?")) return;

        setExams(exams.filter((e) => e.ID !== id));
        setMediaQuestionExam(mediaQuestionExam.filter((m) => m.ExamID !== id));
    };

    const getExamTypeName = (id) => {
        return examTypes.find((t) => t.ID === id)?.Name || "N/A";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                        Quản lý đề thi
                    </h1>

                    <button
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold shadow-lg flex items-center gap-2"
                        onClick={openAddModal}
                    >
                        <Plus className="w-5 h-5" />
                        Thêm đề thi
                    </button>
                </div>

                {/* TABLE */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden ring-1 ring-gray-200">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                            <tr>
                                <th className="p-4 border-b text-center font-semibold text-gray-700">STT</th>
                                <th className="p-4 border-b font-semibold text-gray-700">Title</th>
                                <th className="p-4 border-b font-semibold text-gray-700">Type</th>
                                <th className="p-4 border-b text-center font-semibold text-gray-700">Thời gian</th>
                                <th className="p-4 border-b text-center font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {exams.map((exam, index) => (
                                <tr
                                    key={exam.ID}
                                    className="border-b hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors"
                                >
                                    <td className="p-4 text-center font-semibold">{index + 1}</td>
                                    <td className="p-4">{exam.Title}</td>
                                    <td className="p-4">{getExamTypeName(exam.ExamTypeID)}</td>
                                    <td className="p-4 text-center">{exam.TimeExam}</td>

                                    <td className="p-4 text-center">
                                        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                                            <button
                                                onClick={() => openEditModal(exam)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md flex items-center gap-1"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(exam.ID)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md flex items-center gap-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 🔥 MODAL EDIT / ADD */}
                {editingExam && (
                    <EditExamModal
                        exam={editingExam}
                        examTypes={examTypes}
                        mediaQuestions={mediaQuestions}
                        selectedMedia={selectedMediaIds}
                        onSelectMedia={setSelectedMediaIds}
                        onClose={() => setEditingExam(null)}
                        onSave={handleSave}
                    />
                )}
            </div>
        </div>
    );
}
