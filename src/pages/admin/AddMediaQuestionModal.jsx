import { useState } from "react";
import { X, Image, Volume2, Save, RotateCcw, Loader2, Plus, Trash2, FileText, Settings, Upload } from "lucide-react";

export default function AddMediaQuestionModal({ onClose }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [skill, setSkill] = useState("LISTENING");
    const [type, setType] = useState("PHOTO_DESCRIPTION");
    const [section, setSection] = useState("1");
    const [difficulty, setDifficulty] = useState("MEDIUM");
    const [tags, setTags] = useState("");
    
    const [imageUrl, setImageUrl] = useState("");
    const [imageFilename, setImageFilename] = useState("");
    const [imageUploading, setImageUploading] = useState(false);
    
    const [audioUrl, setAudioUrl] = useState("");
    const [audioFilename, setAudioFilename] = useState("");
    const [audioUploading, setAudioUploading] = useState(false);
    
    const [script, setScript] = useState("");
    
    const [questions, setQuestions] = useState([
        {
            text: "",
            correct: null,
            choices: [
                { attribute: "A", content: "" },
                { attribute: "B", content: "" },
                { attribute: "C", content: "" },
                { attribute: "D", content: "" }
            ]
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;
    const ADMIN_TOKEN = localStorage.getItem("accessToken");

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                text: "",
                correct: null,
                choices: [
                    { attribute: "A", content: "" },
                    { attribute: "B", content: "" },
                    { attribute: "C", content: "" },
                    { attribute: "D", content: "" }
                ]
            }
        ]);
    };

    const removeQuestion = (index) => {
        if (questions.length <= 1) {
            alert("Phải có ít nhất 1 câu hỏi!");
            return;
        }
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleImageUpload = async (file) => {
        if (!file) return;
        
        setImageUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${API_URL}/upload/image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ADMIN_TOKEN}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();
            
            if (result.success && result.data?.url) {
                setImageUrl(result.data.url);
                setImageFilename(result.data.filename);
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (err) {
            alert('Lỗi upload ảnh: ' + err.message);
            console.error('Image upload error:', err);
        } finally {
            setImageUploading(false);
        }
    };

    const handleAudioUpload = async (file) => {
        if (!file) return;
        
        setAudioUploading(true);
        try {
            const formData = new FormData();
            formData.append('audio', file);

            const response = await fetch(`${API_URL}/upload/audio`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ADMIN_TOKEN}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();
            
            if (result.success && result.data?.url) {
                setAudioUrl(result.data.url);
                setAudioFilename(result.data.filename);
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (err) {
            alert('Lỗi upload audio: ' + err.message);
            console.error('Audio upload error:', err);
        } finally {
            setAudioUploading(false);
        }
    };

    const handleDeleteFile = async (filename, type) => {
        if (!filename) return;
        
        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${ADMIN_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filename })
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            if (type === 'image') {
                setImageUrl("");
                setImageFilename("");
            } else if (type === 'audio') {
                setAudioUrl("");
                setAudioFilename("");
            }
        } catch (err) {
            alert('Lỗi xóa file: ' + err.message);
            console.error('Delete file error:', err);
        }
    };

    const validateForm = () => {
        if (!title.trim()) {
            alert("Vui lòng nhập tiêu đề!");
            return false;
        }
        if (!description.trim()) {
            alert("Vui lòng nhập mô tả!");
            return false;
        }
        
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.text.trim()) {
                alert(`Câu hỏi ${i + 1}: Vui lòng nhập nội dung câu hỏi!`);
                return false;
            }
            if (!q.correct) {
                alert(`Câu hỏi ${i + 1}: Vui lòng chọn đáp án đúng!`);
                return false;
            }
            for (let j = 0; j < q.choices.length; j++) {
                if (!q.choices[j].content.trim()) {
                    alert(`Câu hỏi ${i + 1}: Vui lòng nhập đầy đủ tất cả đáp án!`);
                    return false;
                }
            }
        }
        
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            const mediaPayload = {
                Skill: skill,
                Type: type,
                Section: section
            };
            
            if (script && script.trim()) {
                mediaPayload.Script = script.trim();
            }
            if (imageUrl && imageUrl.trim()) {
                mediaPayload.ImageUrl = imageUrl.trim();
            }
            if (audioUrl && audioUrl.trim()) {
                mediaPayload.AudioUrl = audioUrl.trim();
            }

            const payload = {
                Title: title,
                Description: description,
                Media: mediaPayload,
                Questions: questions.map((q, index) => ({
                    QuestionText: q.text,
                    OrderInGroup: index + 1,
                    Choices: q.choices.map(choice => ({
                        Attribute: choice.attribute,
                        Content: choice.content,
                        IsCorrect: choice.attribute === q.correct
                    }))
                })),
                Difficulty: difficulty,
                Tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []
            };

            const response = await fetch(`${API_URL}/media-groups`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ADMIN_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error Details:', errorData);
                
                if (errorData.errors) {
                    const errorMessages = Object.entries(errorData.errors)
                        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                        .join('\n');
                    throw new Error(`Validation failed:\n${errorMessages}`);
                }
                
                throw new Error(errorData.message || errorData.error || `API Error: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                alert("✅ Thêm câu hỏi thành công!");
                onClose();
            } else {
                throw new Error(result.message || 'Thêm thất bại');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error adding media question:', err);
        } finally {
            setLoading(false);
        }
    };

    const typeOptions = [
        "PHOTO_DESCRIPTION",
        "QUESTION_RESPONSE",
        "CONVERSATION",
        "TALK",
        "INCOMPLETE_SENTENCE",
        "TEXT_COMPLETION",
        "READING_COMPREHENSION",
        "EMAIL",
        "ARTICLE"
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

                {/* HEADER */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                <Plus size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Thêm câu hỏi mới</h2>
                                <p className="text-blue-100 text-sm mt-1">Điền thông tin để tạo câu hỏi TOEIC</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all duration-200 disabled:opacity-50 backdrop-blur-sm"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* BODY */}
                <div className="overflow-y-auto flex-1 bg-gray-50">
                    <div className="p-6 space-y-5">

                        {/* BASIC INFO */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <Settings className="text-blue-600" size={20} />
                                    <h3 className="font-bold text-gray-800">Thông tin cơ bản</h3>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Title & Description on same row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-semibold text-gray-700 mb-2 block">
                                            Tiêu đề <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                                            placeholder="VD: Company Newsletter Update"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-semibold text-gray-700 mb-2 block">
                                            Mô tả <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                                            placeholder="VD: Text completion questions"
                                        />
                                    </div>
                                </div>

                                {/* Part/Skill (combined) & Type & Difficulty on same row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="font-semibold text-gray-700 mb-2 block">Phần thi</label>
                                        <select
                                            value={section}
                                            onChange={(e) => {
                                                const newSection = e.target.value;
                                                setSection(newSection);
                                                // Auto set skill based on part
                                                if (['1', '2', '3', '4'].includes(newSection)) {
                                                    setSkill('LISTENING');
                                                } else if (['5', '6', '7'].includes(newSection)) {
                                                    setSkill('READING');
                                                }
                                            }}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 appearance-none bg-white cursor-pointer transition-all"
                                        >
                                            <option value="1">Part 1 - 🎧 Listening</option>
                                            <option value="2">Part 2 - 🎧 Listening</option>
                                            <option value="3">Part 3 - 🎧 Listening</option>
                                            <option value="4">Part 4 - 🎧 Listening</option>
                                            <option value="5">Part 5 - 📖 Reading</option>
                                            <option value="6">Part 6 - 📖 Reading</option>
                                            <option value="7">Part 7 - 📖 Reading</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-semibold text-gray-700 mb-2 block">Loại bài</label>
                                        <input
                                            type="text"
                                            list="type-suggestions"
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                                            placeholder="Nhập hoặc chọn..."
                                        />
                                        {/* <datalist id="type-suggestions">
                                            {typeOptions.map(opt => (
                                                <option key={opt} value={opt} />
                                            ))}
                                        </datalist> */}
                                    </div>

                                    <div>
                                        <label className="font-semibold text-gray-700 mb-2 block">Độ khó</label>
                                        <select
                                            value={difficulty}
                                            onChange={(e) => setDifficulty(e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 appearance-none bg-white cursor-pointer transition-all"
                                        >
                                            <option value="EASY">Dễ</option>
                                            <option value="MEDIUM">Trung bình</option>
                                            <option value="HARD">Khó</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="font-semibold text-gray-700 mb-2 block">
                                        Tags <span className="text-sm text-gray-500 font-normal">(phân cách bằng dấu phẩy)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                                        placeholder="part1, listening, toeic"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* MEDIA */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <Image className="text-purple-600" size={20} />
                                    <h3 className="font-bold text-gray-800">Nội dung Media</h3>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    
                                    {/* IMAGE */}
                                    <div className="space-y-2">
                                        <label className="font-semibold text-gray-700 flex items-center gap-2 text-sm">
                                            <Image size={16} /> Hình ảnh
                                        </label>
                                        <input
                                            type="text"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all text-sm"
                                            placeholder="URL hình ảnh"
                                        />
                                        <label className={`flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition-all ${imageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {imageUploading ? (
                                                <>
                                                    <Loader2 size={14} className="animate-spin" />
                                                    <span className="text-xs text-gray-600">Đang tải...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={14} />
                                                    <span className="text-xs text-gray-600">📁 Tải ảnh lên</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                disabled={imageUploading}
                                                onChange={(e) => {
                                                    if (e.target.files[0]) {
                                                        handleImageUpload(e.target.files[0]);
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>

                                        {imageUrl && (
                                            <div className="relative group">
                                                <img
                                                    src={imageUrl}
                                                    alt="Preview"
                                                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                                                />
                                                <button
                                                    onClick={() => handleDeleteFile(imageFilename, 'image')}
                                                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* AUDIO */}
                                    <div className="space-y-2">
                                        <label className="font-semibold text-gray-700 flex items-center gap-2 text-sm">
                                            <Volume2 size={16} /> Audio
                                        </label>
                                        <input
                                            type="text"
                                            value={audioUrl}
                                            onChange={(e) => setAudioUrl(e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all text-sm"
                                            placeholder="URL audio"
                                        />
                                        <label className={`flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition-all ${audioUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {audioUploading ? (
                                                <>
                                                    <Loader2 size={14} className="animate-spin" />
                                                    <span className="text-xs text-gray-600">Đang tải...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={14} />
                                                    <span className="text-xs text-gray-600">🎵 Tải audio lên</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                disabled={audioUploading}
                                                onChange={(e) => {
                                                    if (e.target.files[0]) {
                                                        handleAudioUpload(e.target.files[0]);
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>

                                        {audioUrl && (
                                            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                                                <audio controls src={audioUrl} className="w-full h-8" />
                                                <button
                                                    onClick={() => handleDeleteFile(audioFilename, 'audio')}
                                                    className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                                                >
                                                    <Trash2 size={12} />
                                                    Xóa audio
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* SCRIPT */}
                                <div className="mt-4">
                                    <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm">
                                        <FileText size={16} /> Script / Nội dung
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={script}
                                        onChange={(e) => setScript(e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none transition-all text-sm"
                                        placeholder="Nhập nội dung script, đoạn văn, email..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* QUESTIONS */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-blue-600" size={20} />
                                        <h3 className="font-bold text-gray-800">
                                            Câu hỏi & Đáp án <span className="text-red-500">*</span>
                                        </h3>
                                        <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full font-medium">
                                            {questions.length} câu
                                        </span>
                                    </div>
                                    <button
                                        onClick={addQuestion}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50"
                                    >
                                        <Plus size={18} />
                                        Thêm câu hỏi
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-3">
                                {questions.map((q, qIdx) => (
                                    <div
                                        key={qIdx}
                                        className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all bg-white"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-bold text-base text-gray-800 flex items-center gap-2">
                                                <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                                                    {qIdx + 1}
                                                </span>
                                                Câu {qIdx + 1}
                                            </h4>
                                            {questions.length > 1 && (
                                                <button
                                                    onClick={() => removeQuestion(qIdx)}
                                                    className="text-red-600 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>

                                        <textarea
                                            rows={2}
                                            value={q.text}
                                            onChange={(e) => {
                                                const updated = [...questions];
                                                updated[qIdx].text = e.target.value;
                                                setQuestions(updated);
                                            }}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none transition-all text-sm mb-3"
                                            placeholder="Nhập nội dung câu hỏi..."
                                        />

                                        <div className="grid grid-cols-1 gap-2">
                                            {q.choices.map((choice, i) => (
                                                <div
                                                    key={choice.attribute}
                                                    className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                                                        q.correct === choice.attribute
                                                            ? "border-green-500 bg-green-50"
                                                            : "border-gray-200 bg-white"
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`correct-${qIdx}`}
                                                        checked={q.correct === choice.attribute}
                                                        onChange={() => {
                                                            const updated = [...questions];
                                                            updated[qIdx].correct = choice.attribute;
                                                            setQuestions(updated);
                                                        }}
                                                        className="w-4 h-4 text-green-600"
                                                    />
                                                    <span className={`font-bold text-sm w-6 h-6 rounded-lg flex items-center justify-center ${
                                                        q.correct === choice.attribute
                                                            ? "bg-green-600 text-white"
                                                            : "bg-gray-200 text-gray-700"
                                                    }`}>
                                                        {choice.attribute}
                                                    </span>

                                                    <input
                                                        placeholder={`Đáp án ${choice.attribute}`}
                                                        value={choice.content}
                                                        onChange={(e) => {
                                                            const updated = [...questions];
                                                            updated[qIdx].choices[i].content = e.target.value;
                                                            setQuestions(updated);
                                                        }}
                                                        className="flex-1 px-3 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ERROR MESSAGE */}
                        {error && (
                            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 flex items-start gap-3 animate-in slide-in-from-top duration-300">
                                <div className="bg-red-600 text-white p-2 rounded-lg">
                                    <X size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-red-800 mb-1">Có lỗi xảy ra!</p>
                                    <p className="text-red-700">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all font-semibold text-gray-700 disabled:opacity-50 flex items-center gap-2 text-sm"
                    >
                        <RotateCcw size={16} />
                        Hủy
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Lưu câu hỏi
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}