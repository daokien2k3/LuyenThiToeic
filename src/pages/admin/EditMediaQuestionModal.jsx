import { useState } from "react";
import { X, Image, Volume2, Save, RotateCcw } from "lucide-react";

export default function EditMediaQuestionModal({
    media,
    questions,
    choices,
    parts,
    onClose,
    onSave,
}) {
    const [formMedia, setFormMedia] = useState({ ...media });

    // Chuẩn hóa đường dẫn từ public/
    const getPublicUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("data:")) return path; // base64 file upload
        if (path.startsWith("/")) return path;     // đã đúng
        return "/" + path; // tự thêm / nếu thiếu
    };

    // ===== Gắn choice theo từng question =====
    const [formQuestions, setFormQuestions] = useState(
        questions.map((q) => ({
            ...q,
            choices: choices.filter((c) => c.QuestionID === q.ID),
        }))
    );

    const handleMediaChange = (field, value) => {
        setFormMedia((prev) => ({ ...prev, [field]: value }));
    };

    const handleQuestionChange = (index, field, value) => {
        setFormQuestions((prev) => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const handleChoiceChange = (qIndex, cIndex, field, value) => {
        setFormQuestions((prev) => {
            const updated = [...prev];

            updated[qIndex].choices[cIndex][field] = value;

            if (field === "IsCorrect") {
                updated[qIndex].choices.forEach((ch, i) => {
                    ch.IsCorrect = i === cIndex;
                });
            }

            return updated;
        });
    };

    const handleSave = () => {
        if (onSave) {
            onSave({
                updatedMedia: formMedia,
                updatedQuestions: formQuestions,
            });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl relative ring-1 ring-gray-200 flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="sticky top-0 bg-white z-10 p-6 border-b text-center relative">
                    <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                        Chỉnh sửa MediaQuestion #{media.ID}
                    </h2>

                    <button
                        onClick={onClose}
                        className="absolute top-1/2 right-6 -translate-y-1/2 text-gray-600 hover:text-black transition-colors duration-200"
                    >
                        <X size={32} />
                    </button>
                </div>

                <div className="overflow-y-auto p-8 flex-1">

                    {/* MEDIA */}
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-inner mb-10 ring-1 ring-gray-200">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-800">
                            <Image size={24} className="text-blue-600" /> Thông tin Media
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* IMAGE */}
                            <div>
                                <label className="font-semibold text-gray-700 mb-2 block">Image</label>

                                <input
                                    type="text"
                                    value={formMedia.ImageUrl}
                                    onChange={(e) => handleMediaChange("ImageUrl", e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                    placeholder="Nhập URL hoặc chọn file"
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                            handleMediaChange("ImageUrl", ev.target.result);
                                        };
                                        reader.readAsDataURL(file);
                                    }}
                                    className="mb-2"
                                />

                                {formMedia.ImageUrl && (
                                    <img
                                        src={getPublicUrl(formMedia.ImageUrl)}
                                        alt="Preview"
                                        className="mt-4 w-56 h-40 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
                                    />
                                )}
                            </div>

                            {/* AUDIO */}
                            <div>
                                <label className="font-semibold text-gray-700 mb-2 block">Audio</label>

                                <input
                                    type="text"
                                    value={formMedia.AudioUrl}
                                    onChange={(e) => handleMediaChange("AudioUrl", e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                    placeholder="Nhập URL hoặc chọn file"
                                />

                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                            handleMediaChange("AudioUrl", ev.target.result);
                                        };
                                        reader.readAsDataURL(file);
                                    }}
                                />

                                {formMedia.AudioUrl && (
                                    <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Volume2 className="text-blue-600" />
                                        <audio
                                            controls
                                            src={getPublicUrl(formMedia.AudioUrl)}
                                            className="flex-1"
                                        />
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className="mt-6">
                            <label className="font-semibold text-gray-700 mb-2 block">Script</label>
                            <textarea
                                rows={4}
                                value={formMedia.Script}
                                onChange={(e) =>
                                    handleMediaChange("Script", e.target.value)
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 shadow-sm resize-none"
                            />
                        </div>

                        <div className="mt-6">
                            <label className="font-semibold text-gray-700 mb-2 block">Part</label>
                            <select
                                value={formMedia.PartID}
                                onChange={e =>
                                    handleMediaChange("PartID", Number(e.target.value))
                                }
                                className="w-40 p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 shadow-sm"
                            >
                                {parts.map(part => (
                                    <option key={part.id} value={part.id}>
                                        {part.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* QUESTIONS */}
                    <h3 className="text-2xl font-semibold mb-6 text-gray-800">Câu hỏi & Đáp án</h3>

                    <div className="space-y-8">
                        {formQuestions.map((q, qIndex) => (
                            <div key={q.ID} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">

                                <h4 className="font-semibold text-lg mb-4 text-gray-800">
                                    Question {q.QuestionNumber}
                                </h4>

                                <textarea
                                    rows={3}
                                    value={q.QuestionText}
                                    onChange={(e) =>
                                        handleQuestionChange(qIndex, "QuestionText", e.target.value)
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 shadow-sm resize-none"
                                />

                                <p className="mt-4 font-semibold text-gray-700">Đáp án:</p>

                                <div className="space-y-3 mt-3">
                                    {q.choices.map((c, cIndex) => (
                                        <div
                                            key={c.ID}
                                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${c.IsCorrect
                                                ? "bg-green-50 border-green-400 shadow-md"
                                                : "bg-gray-50 border-gray-300 hover:border-gray-400"
                                                }`}

                                        >
                                            <div className="flex items-center gap-4">

                                                <span className="font-bold text-gray-800 text-lg">
                                                    {c.Attribute}.
                                                </span>

                                                <input
                                                    type="text"
                                                    value={c.Content}
                                                    onChange={(e) =>
                                                        handleChoiceChange(
                                                            qIndex,
                                                            cIndex,
                                                            "Content",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                />

                                                <input
                                                    type="radio"
                                                    name={`correct-${q.ID}`}
                                                    checked={c.IsCorrect}
                                                    onChange={() =>
                                                        handleChoiceChange(
                                                            qIndex,
                                                            cIndex,
                                                            "IsCorrect",
                                                            true
                                                        )
                                                    }
                                                    className="w-5 h-5 accent-green-600"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Đúng</span>

                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* SAVE BUTTON */}
                    <div className="flex justify-end gap-4 mt-10">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Hủy
                        </button>

                        <button
                            onClick={handleSave}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
