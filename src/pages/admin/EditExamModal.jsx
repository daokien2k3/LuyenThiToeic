import { useState, useMemo } from "react";
import { X, Save, RotateCcw, Filter } from "lucide-react";

export default function EditExamModal({
    exam,
    examTypes,
    mediaQuestions,
    selectedMedia = [],
    onSelectMedia,
    onClose,
    onSave
}) {
    const [formExam, setFormExam] = useState({ ...exam });
    const [selectedMediaIds, setSelectedMediaIds] = useState(selectedMedia);
    const [filterPart, setFilterPart] = useState("");
    const [openDetail, setOpenDetail] = useState({});

    const handleChange = (field, value) => {
        setFormExam((prev) => ({ ...prev, [field]: value }));
    };

    const toggleMedia = (id) => {
        let updated;

        if (selectedMediaIds.includes(id)) {
            updated = selectedMediaIds.filter((m) => m !== id);
        } else {
            updated = [...selectedMediaIds, id];
        }

        setSelectedMediaIds(updated);
        onSelectMedia(updated);
    };

    // 🔥 FIXED: Lọc đúng PartID
    const filteredMedia = useMemo(() => {
        if (!filterPart) return mediaQuestions;
        return mediaQuestions.filter((m) => m.PartID === Number(filterPart));
    }, [filterPart, mediaQuestions]);

    const handleSave = () => {
        onSave({
            updatedExam: formExam,
            mediaQuestions: selectedMediaIds
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black transition"
                >
                    <X size={28} />
                </button>

                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    {exam.ID ? "Sửa đề thi" : "Thêm đề thi"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[70vh]">

                    {/* ===== FORM ===== */}
                    <div className="space-y-4 pr-2 overflow-y-auto overflow-x-auto">

                        <div>
                            <label className="font-semibold block mb-1">Title</label>
                            <input
                                type="text"
                                value={formExam.Title || ""}
                                onChange={(e) => handleChange("Title", e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="font-semibold block mb-1">Exam Type</label>
                            <select
                                value={formExam.ExamTypeID || ""}
                                onChange={(e) => handleChange("ExamTypeID", Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">-- Chọn loại đề thi --</option>
                                {examTypes.map((t) => (
                                    <option key={t.ID} value={t.ID}>
                                        {t.Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="font-semibold block mb-1">Thời gian (phút)</label>
                            <input
                                type="number"
                                value={formExam.TimeExam || ""}
                                onChange={(e) => handleChange("TimeExam", Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div className="pt-4">
                            <h3 className="font-semibold text-lg mb-2">Media đã chọn</h3>

                            {selectedMediaIds.length === 0 && (
                                <p className="text-gray-500 italic">Chưa chọn media nào.</p>
                            )}

<ul className="space-y-2">
                                {selectedMediaIds.map((id) => {
                                    const m = mediaQuestions.find((x) => x.ID === id);
                                    if (!m) return null;

                                    return (
                                        <li
                                            key={id}
                                            className="p-3 border rounded-lg bg-gray-50 flex justify-between"
                                        >
                                            <span>#{m.ID} – Part {m.PartID}</span>
                                            <button
                                                onClick={() => toggleMedia(id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Xóa
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* ===== MEDIA LIST ===== */}
                    <div className="border-l pl-4 flex flex-col h-full overflow-hidden">
                        {/* Filter */}
                        <div className="flex items-center gap-3 mb-4">
                            <Filter size={20} />
                            <select
                                className="border p-2 rounded-lg"
                                value={filterPart}
                                onChange={(e) => setFilterPart(e.target.value)}
                            >
                                <option value="">-- Lọc theo Part --</option>
                                {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                                    <option key={p} value={p}>Part {p}</option>
                                ))}
                            </select>
                        </div>

                        {/* Media list */}
                        <div className="flex-1 max-h-full overflow-y-auto pr-2 space-y-3 
    scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">

                            {filteredMedia.map((m) => {

                                const selected = selectedMediaIds.includes(m.ID);

                                return (
                                    <div
                                        key={m.ID}
                                        className={`p-4 rounded-lg border transition cursor-pointer ${selected ? "bg-blue-100 border-blue-500" : "bg-gray-50 hover:bg-gray-100"
                                            }`}
                                    >
                                        {/* Header row */}
                                        <div
                                            className="flex justify-between items-center"
                                            onClick={() => toggleMedia(m.ID)}
                                        >
                                            <div>
                                                <div className="font-semibold">Media #{m.ID}</div>
                                                <div className="text-sm text-gray-600">Part: {m.PartID}</div>
                                            </div>

                                            {/* Button mở rộng chi tiết */}
                                            <button
                                                className="px-3 py-1 text-sm rounded bg-white border hover:bg-gray-200"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // tránh toggle chọn media
                                                    setOpenDetail((prev) => ({
                                                        ...prev,
                                                        [m.ID]: !prev[m.ID],
                                                    }));
                                                }}
                                            >
                                                {openDetail[m.ID] ? "Ẩn" : "Chi tiết"}
                                            </button>
                                        </div>

                                        {/* Accordion */}
                                        <div
                                            className={`transition-all duration-300 overflow-hidden ${openDetail[m.ID] ? "max-h-[600px] mt-3" : "max-h-0"
                                                }`}
                                        >

                                            {/* Image */}
                                            {m.ImageUrl && (
                                                <img
                                                    src={m.ImageUrl.startsWith("/") ? m.ImageUrl : `/${m.ImageUrl}`}
                                                    alt=""
                                                    className="w-52 rounded-lg border mb-3"
                                                />
                                            )}

                                            {/* Audio */}
                                            {m.AudioUrl && (
                                                <audio
                                                    controls
                                                    src={m.AudioUrl.startsWith("/") ? m.AudioUrl : `/${m.AudioUrl}`}
                                                    className="mb-3"
                                                />
                                            )}


                                            {/* Script */}
                                            {m.Script && (
                                                <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg">
                                                    {m.Script}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 flex items-center gap-2"
                    >
                        <RotateCcw size={16} /> Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Save size={16} /> Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}
