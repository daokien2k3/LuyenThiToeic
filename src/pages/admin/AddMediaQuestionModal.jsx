import { useState } from "react";
import { X, Image, Volume2, Save, RotateCcw } from "lucide-react";

export default function AddMediaQuestionModal({ onClose }) {
    const [imageUrl, setImageUrl] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const [script, setScript] = useState("");
    const [questions, setQuestions] = useState([
        {
            text: "",
            correct: null, // <-- thêm trường đáp án đúng
            choices: [{ a: "" }, { b: "" }, { c: "" }, { d: "" }]
        }
    ]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                text: "",
                correct: null,
                choices: [{ a: "" }, { b: "" }, { c: "" }, { d: "" }]
            }
        ]);
    };

    const handleFileToBase64 = (file, setUrl) => {
        const reader = new FileReader();
        reader.onload = (e) => setUrl(e.target.result);
        reader.readAsDataURL(file);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl ring-1 ring-gray-200 overflow-hidden">

                {/* HEADER */}
                <div className="sticky top-0 bg-white z-10 p-6 border-b text-center relative">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                        Thêm Media Question
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute top-1/2 right-6 -translate-y-1/2 text-gray-600 hover:text-black transition-colors duration-200"
                    >
                        <X size={32} />
                    </button>
                </div>

                {/* BODY */}
                <div className="overflow-y-auto p-8 flex-1 space-y-8">

                    {/* MEDIA */}
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-inner ring-1 ring-gray-200">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-800">
                            <Image size={24} className="text-blue-600" /> Thông tin Media
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* IMAGE */}
                            <div>
                                <label className="font-semibold text-gray-700 mb-2 block">Image</label>
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:ring-4 focus:ring-blue-300 focus:border-blue-500 shadow-sm"
                                    placeholder="Nhập URL hoặc chọn file"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (!e.target.files[0]) return;
                                        handleFileToBase64(e.target.files[0], setImageUrl);
                                    }}
                                    className="mb-2"
                                />

                                {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        className="mt-4 w-56 h-40 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                                    />
                                )}
                            </div>

                            {/* AUDIO */}
                            <div>
                                <label className="font-semibold text-gray-700 mb-2 block">Audio</label>
                                <input
                                    type="text"
                                    value={audioUrl}
                                    onChange={(e) => setAudioUrl(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:ring-4 focus:ring-blue-300 focus:border-blue-500 shadow-sm"
                                    placeholder="Nhập URL hoặc chọn file"
                                />
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => {
                                        if (!e.target.files[0]) return;
                                        handleFileToBase64(e.target.files[0], setAudioUrl);
                                    }}
                                    className="mb-2"
                                />

                                {audioUrl && (
                                    <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Volume2 className="text-blue-600" />
                                        <audio controls src={audioUrl} className="flex-1" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SCRIPT */}
                        <div className="mt-6">
                            <label className="font-semibold text-gray-700 mb-2 block">Script</label>
                            <textarea
                                rows={4}
                                value={script}
                                onChange={(e) => setScript(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-500 shadow-sm resize-none"
                            />
                        </div>
                    </div>

                    {/* QUESTIONS */}
                    <h3 className="text-2xl font-semibold mb-6 text-gray-800">Câu hỏi & Đáp án</h3>

                    <div className="space-y-6">
                        {questions.map((q, qIdx) => (
                            <div
                                key={qIdx}
                                className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <h4 className="font-semibold text-lg mb-4 text-gray-800">
                                    Question {qIdx + 1}
                                </h4>

                                <textarea
                                    rows={3}
                                    value={q.text}
                                    onChange={(e) => {
                                        const updated = [...questions];
                                        updated[qIdx].text = e.target.value;
                                        setQuestions(updated);
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-500 shadow-sm resize-none"
                                />

                                <p className="mt-4 font-semibold text-gray-700">Đáp án:</p>

                                <div className="grid grid-cols-2 gap-4 mt-3">
                                    {["A", "B", "C", "D"].map((opt, i) => (
                                        <div
                                            key={opt}
                                            className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                                                q.correct === opt
                                                    ? "border-green-500 bg-green-50"
                                                    : "border-gray-300"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`correct-${qIdx}`}
                                                checked={q.correct === opt}
                                                onChange={() => {
                                                    const updated = [...questions];
                                                    updated[qIdx].correct = opt;
                                                    setQuestions(updated);
                                                }}
                                                className="w-5 h-5 text-blue-600"
                                            />

                                            <input
                                                placeholder={`Đáp án ${opt}`}
                                                value={q.choices[i][opt.toLowerCase()] || ""}
                                                onChange={(e) => {
                                                    const updated = [...questions];
                                                    updated[qIdx].choices[i][opt.toLowerCase()] =
                                                        e.target.value;
                                                    setQuestions(updated);
                                                }}
                                                className="flex-1 p-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addQuestion}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 mb-4"
                    >
                        + Thêm câu hỏi
                    </button>

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" /> Hủy
                        </button>

                        <button
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
