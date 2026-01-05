import { useState, useEffect } from "react";
import { X, Image, Volume2, Save, RotateCcw, AlertCircle, CheckCircle, Loader2, Upload, Trash2, Settings, FileText, Edit } from "lucide-react";

export default function EditMediaQuestionModal({ media, onClose }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mediaData, setMediaData] = useState(null);
    const [formMedia, setFormMedia] = useState(null);
    const [formQuestions, setFormQuestions] = useState([]);
    const [originalQuestions, setOriginalQuestions] = useState([]);
    const [updateStatus, setUpdateStatus] = useState({});
    const [mediaUpdateStatus, setMediaUpdateStatus] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [audioUploading, setAudioUploading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const ADMIN_TOKEN = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchMediaDetail();
    }, []);

    const fetchMediaDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/media-groups/${media.MediaQuestionID}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
            const result = await response.json();
            if (result.success) {
                setMediaData(result.data);
                setFormMedia({
                    Title: result.data.Title,
                    Description: result.data.Description,
                    Difficulty: result.data.Difficulty,
                    Tags: result.data.Tags || [],
                    Media: result.data.Media
                });
                const questions = result.data.Questions || [];
                setFormQuestions(JSON.parse(JSON.stringify(questions)));
                setOriginalQuestions(JSON.parse(JSON.stringify(questions)));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file) => {
        if (!file) return;
        setImageUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await fetch(`${API_URL}/upload/image`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` },
                body: formData
            });
            if (!response.ok) throw new Error('Upload failed');
            const result = await response.json();
            if (result.success) {
                setFormMedia(prev => ({
                    ...prev,
                    Media: { ...prev.Media, ImageUrl: result.data.url, ImageFilename: result.data.filename }
                }));
                setMediaUpdateStatus(null);
            }
        } catch (err) {
            alert('Lỗi upload ảnh: ' + err.message);
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
                headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` },
                body: formData
            });
            if (!response.ok) throw new Error('Upload failed');
            const result = await response.json();
            if (result.success) {
                setFormMedia(prev => ({
                    ...prev,
                    Media: { ...prev.Media, AudioUrl: result.data.url, AudioFilename: result.data.filename }
                }));
                setMediaUpdateStatus(null);
            }
        } catch (err) {
            alert('Lỗi upload audio: ' + err.message);
        } finally {
            setAudioUploading(false);
        }
    };

    const getFilenameFromUrl = (url) => {
        if (!url) return null;
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    const handleDeleteFile = async (url, type) => {
        if (!url) return;
        const filename = getFilenameFromUrl(url);
        if (!filename) return;
        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename })
            });
            if (!response.ok) throw new Error('Delete failed');
            if (type === 'image') {
                setFormMedia(prev => ({ ...prev, Media: { ...prev.Media, ImageUrl: "", ImageFilename: "" } }));
            } else if (type === 'audio') {
                setFormMedia(prev => ({ ...prev, Media: { ...prev.Media, AudioUrl: "", AudioFilename: "" } }));
            }
            setMediaUpdateStatus(null);
        } catch (err) {
            alert('Lỗi xóa file: ' + err.message);
        }
    };

    const handleMediaChange = (field, value) => {
        setFormMedia(prev => ({ ...prev, [field]: value }));
        setMediaUpdateStatus(null);
    };

    const handleMediaFieldChange = (field, value) => {
        setFormMedia(prev => ({ ...prev, Media: { ...prev.Media, [field]: value } }));
        setMediaUpdateStatus(null);
    };

    const handleQuestionChange = (index, field, value) => {
        setFormQuestions(prev => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
        setUpdateStatus(prev => ({ ...prev, [index]: null }));
    };

    const handleChoiceChange = (qIndex, cIndex, field, value) => {
        setFormQuestions(prev => {
            const updated = [...prev];
            updated[qIndex].Choices[cIndex][field] = value;
            if (field === "IsCorrect" && value) {
                updated[qIndex].Choices.forEach((ch, i) => { ch.IsCorrect = i === cIndex; });
            }
            return updated;
        });
        setUpdateStatus(prev => ({ ...prev, [qIndex]: null }));
    };

    const isQuestionChanged = (index) => {
        const current = formQuestions[index];
        const original = originalQuestions[index];
        if (!current || !original) return false;
        if (current.QuestionText !== original.QuestionText) return true;
        if (current.Choices.length !== original.Choices.length) return true;
        for (let i = 0; i < current.Choices.length; i++) {
            if (current.Choices[i].Content !== original.Choices[i].Content ||
                current.Choices[i].IsCorrect !== original.Choices[i].IsCorrect) return true;
        }
        return false;
    };

    const handleUpdateQuestion = async (index) => {
        const question = formQuestions[index];
        try {
            setUpdateStatus(prev => ({ ...prev, [index]: 'loading' }));
            const response = await fetch(`${API_URL}/questions/${question.ID}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    QuestionText: question.QuestionText,
                    Choices: question.Choices.map(c => ({
                        ID: c.ID, Content: c.Content, Attribute: c.Attribute, IsCorrect: c.IsCorrect
                    }))
                })
            });
            const result = await response.json();
            if (!response.ok) {
                if (response.status === 400 && result.message?.includes('used in')) {
                    throw new Error('QUESTION_IN_USE');
                }
                throw new Error(result.message || 'Update failed');
            }
            if (result.success) {
                setUpdateStatus(prev => ({ ...prev, [index]: 'success' }));
                const updatedOriginal = [...originalQuestions];
                updatedOriginal[index] = JSON.parse(JSON.stringify(formQuestions[index]));
                setOriginalQuestions(updatedOriginal);
                setTimeout(() => { setUpdateStatus(prev => ({ ...prev, [index]: null })); }, 3000);
            }
        } catch (err) {
            let errorMessage = 'Cập nhật thất bại';
            if (err.message === 'QUESTION_IN_USE') {
                errorMessage = 'Không thể cập nhật: Câu hỏi đã được sử dụng trong bài thi';
            } else if (err.message?.includes('used in')) {
                errorMessage = `Không thể cập nhật: ${err.message}`;
            }
            setUpdateStatus(prev => ({ ...prev, [index]: 'error', [`${index}_message`]: errorMessage }));
            setTimeout(() => {
                setUpdateStatus(prev => {
                    const newState = { ...prev };
                    delete newState[`${index}_message`];
                    newState[index] = null;
                    return newState;
                });
            }, 5000);
        }
    };

    const handleUpdateMedia = async () => {
        try {
            setMediaUpdateStatus('loading');
            const mediaPayload = {
                Skill: formMedia.Media.Skill,
                Type: formMedia.Media.Type,
                Section: formMedia.Media.Section,
                Script: formMedia.Media.Script?.trim() || null,
                ImageUrl: formMedia.Media.ImageUrl?.trim() || null,
                AudioUrl: formMedia.Media.AudioUrl?.trim() || null
            };
            const response = await fetch(`${API_URL}/media-groups/${media.MediaQuestionID}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Title: formMedia.Title,
                    Description: formMedia.Description,
                    Difficulty: formMedia.Difficulty,
                    Tags: formMedia.Tags,
                    Media: mediaPayload
                })
            });
            if (!response.ok) throw new Error('Update failed');
            const result = await response.json();
            if (result.success) {
                setMediaUpdateStatus('success');
                setTimeout(() => { setMediaUpdateStatus(null); }, 3000);
            }
        } catch (err) {
            setMediaUpdateStatus('error');
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-2xl shadow-2xl">
                    <Loader2 className="w-16 h-16 text-blue-600 mx-auto animate-spin" />
                    <p className="mt-4 text-gray-600 text-center font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-800 text-center mb-2">Lỗi</h3>
                    <p className="text-red-600 text-center mb-4">{error}</p>
                    <button onClick={onClose} className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Đóng</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl"><Edit size={28} /></div>
                            <div>
                                <h2 className="text-2xl font-bold">Chỉnh sửa câu hỏi</h2>
                                <p className="text-blue-100 text-sm mt-1">Media ID: #{media.MediaQuestionID}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto flex-1 bg-gray-50">
                    <div className="p-6 space-y-5">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                                <div className="flex items-center gap-3">
                                    <Settings className="text-blue-600" size={20} />
                                    <h3 className="font-bold text-gray-800">Thông tin cơ bản</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-semibold text-gray-700 mb-2 block">Tiêu đề</label>
                                        <input type="text" value={formMedia?.Title || ''} onChange={(e) => handleMediaChange("Title", e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all" />
                                    </div>
                                    <div>
                                        <label className="font-semibold text-gray-700 mb-2 block">Mô tả</label>
                                        <input type="text" value={formMedia?.Description || ''} onChange={(e) => handleMediaChange("Description", e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="font-semibold text-gray-700 mb-2 block">Độ khó</label>
                                    <select value={formMedia?.Difficulty || 'EASY'} onChange={(e) => handleMediaChange("Difficulty", e.target.value)} className="w-full md:w-48 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400">
                                        <option value="EASY">Dễ</option>
                                        <option value="MEDIUM">Trung bình</option>
                                        <option value="HARD">Khó</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Image className="text-purple-600" size={20} />
                                        <h3 className="font-bold text-gray-800">Nội dung Media</h3>
                                    </div>
                                    <button onClick={handleUpdateMedia} disabled={mediaUpdateStatus === 'loading'} className={`px-4 py-2 rounded-lg font-medium shadow-md flex items-center gap-2 text-sm ${mediaUpdateStatus === 'success' ? 'bg-green-600 text-white' : mediaUpdateStatus === 'error' ? 'bg-red-600 text-white' : mediaUpdateStatus === 'loading' ? 'bg-gray-400 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'}`}>
                                        {mediaUpdateStatus === 'loading' ? <><Loader2 size={16} className="animate-spin" />Đang lưu...</> : mediaUpdateStatus === 'success' ? <><CheckCircle size={16} />Đã lưu</> : mediaUpdateStatus === 'error' ? <><AlertCircle size={16} />Thất bại</> : <><Save size={16} />Cập nhật</>}
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="font-semibold text-gray-700 flex items-center gap-2 text-sm"><Image size={16} />Hình ảnh</label>
                                        <input type="text" value={formMedia?.Media?.ImageUrl || ''} onChange={(e) => handleMediaFieldChange("ImageUrl", e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 text-sm" placeholder="URL hình ảnh" />
                                        <label className={`flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 cursor-pointer ${imageUploading ? 'opacity-50' : ''}`}>
                                            {imageUploading ? <><Loader2 size={14} className="animate-spin" /><span className="text-xs text-gray-600">Đang tải...</span></> : <><Upload size={14} /><span className="text-xs text-gray-600">📁 Tải ảnh lên</span></>}
                                            <input type="file" accept="image/*" disabled={imageUploading} onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])} className="hidden" />
                                        </label>
                                        {formMedia?.Media?.ImageUrl && (
                                            <div className="relative group">
                                                <img src={formMedia.Media.ImageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg shadow-sm" />
                                                <button onClick={() => handleDeleteFile(formMedia.Media.ImageUrl, 'image')} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-semibold text-gray-700 flex items-center gap-2 text-sm"><Volume2 size={16} />Audio</label>
                                        <input type="text" value={formMedia?.Media?.AudioUrl || ''} onChange={(e) => handleMediaFieldChange("AudioUrl", e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 text-sm" placeholder="URL audio" />
                                        <label className={`flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 cursor-pointer ${audioUploading ? 'opacity-50' : ''}`}>
                                            {audioUploading ? <><Loader2 size={14} className="animate-spin" /><span className="text-xs text-gray-600">Đang tải...</span></> : <><Upload size={14} /><span className="text-xs text-gray-600">🎵 Tải audio lên</span></>}
                                            <input type="file" accept="audio/*" disabled={audioUploading} onChange={(e) => e.target.files[0] && handleAudioUpload(e.target.files[0])} className="hidden" />
                                        </label>
                                        {formMedia?.Media?.AudioUrl && (
                                            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                                                <audio controls src={formMedia.Media.AudioUrl} className="w-full h-8" />
                                                <button onClick={() => handleDeleteFile(formMedia.Media.AudioUrl, 'audio')} className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"><Trash2 size={12} />Xóa audio</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm"><FileText size={16} />Script / Nội dung</label>
                                    <textarea rows={4} value={formMedia?.Media?.Script || ''} onChange={(e) => handleMediaFieldChange("Script", e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 resize-none text-sm" placeholder="Nhập nội dung script..." />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-blue-600" size={20} />
                                    <h3 className="font-bold text-gray-800">Câu hỏi & Đáp án</h3>
                                    <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full font-medium">{formQuestions.length} câu</span>
                                </div>
                            </div>
                            <div className="p-6 space-y-3">
                                {formQuestions.map((q, qIdx) => (
                                    <div key={q.ID} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all bg-white">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-bold text-base text-gray-800 flex items-center gap-2">
                                                <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">{q.OrderInGroup}</span>
                                                Câu {q.OrderInGroup}
                                            </h4>
                                            {isQuestionChanged(qIdx) && (
                                                <button onClick={() => handleUpdateQuestion(qIdx)} disabled={updateStatus[qIdx] === 'loading'} className={`px-3 py-1.5 rounded-lg font-medium shadow-md flex items-center gap-1.5 text-sm ${updateStatus[qIdx] === 'success' ? 'bg-green-600 text-white' : updateStatus[qIdx] === 'error' ? 'bg-red-600 text-white' : updateStatus[qIdx] === 'loading' ? 'bg-gray-400 text-white' : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'}`}>
                                                    {updateStatus[qIdx] === 'loading' ? <><Loader2 size={14} className="animate-spin" />Đang lưu...</> : updateStatus[qIdx] === 'success' ? <><CheckCircle size={14} />Đã lưu</> : updateStatus[qIdx] === 'error' ? <><AlertCircle size={14} />Thất bại</> : <><Save size={14} />Cập nhật</>}
                                                </button>
                                            )}
                                        </div>
                                        {updateStatus[qIdx] === 'error' && updateStatus[`${qIdx}_message`] && (
                                            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{updateStatus[`${qIdx}_message`]}</div>
                                        )}
                                        <textarea rows={2} value={q.QuestionText} onChange={(e) => handleQuestionChange(qIdx, "QuestionText", e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 resize-none text-sm mb-3" />
                                        <div className="grid grid-cols-1 gap-2">
                                            {q.Choices.map((c, cIdx) => (
                                                <div key={c.ID} className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${c.IsCorrect ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"}`}>
                                                    <input type="radio" name={`correct-${q.ID}`} checked={c.IsCorrect} onChange={() => handleChoiceChange(qIdx, cIdx, "IsCorrect", true)} className="w-4 h-4 text-green-600" />
                                                    <span className={`font-bold text-sm w-6 h-6 rounded-lg flex items-center justify-center ${c.IsCorrect ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}>{c.Attribute}</span>
                                                    <input placeholder={`Đáp án ${c.Attribute}`} value={c.Content} onChange={(e) => handleChoiceChange(qIdx, cIdx, "Content", e.target.value)} className="flex-1 px-3 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all font-semibold text-gray-700 flex items-center gap-2 text-sm">
                        <RotateCcw size={16} />Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}