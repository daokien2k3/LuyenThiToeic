import { useState, useEffect } from "react";
import { X, Save, Search, AlertCircle, BookOpen, CheckCircle } from "lucide-react";

export default function EditExamModal({ exam, examTypes, mediaQuestions, onClose, onSuccess }) {
    const [title, setTitle] = useState(exam.Title);
    const [timeExam, setTimeExam] = useState(exam.TimeExam);
    const [examTypeID, setExamTypeID] = useState(exam.ExamTypeID);
    
    const [examDetail, setExamDetail] = useState(null);
    const [selectedMediaIds, setSelectedMediaIds] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDifficulty, setFilterDifficulty] = useState("");
    const [filterSection, setFilterSection] = useState("");
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [syncingMedia, setSyncingMedia] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const ADMIN_TOKEN = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchExamDetail();
    }, []);

    const fetchExamDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/exams/${exam.ID}`, {
                headers: {
                    'Authorization': `Bearer ${ADMIN_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch exam detail');
            }

            const result = await response.json();
            
            if (result.success) {
                setExamDetail(result.data);
                
                const mediaIds = new Set();
                result.data.Questions?.forEach(q => {
                    if (q.Media) {
                        mediaIds.add(q.Media.ID);
                    }
                });
                
                setSelectedMediaIds(mediaIds);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching exam detail:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBasicInfo = async () => {
        if (!title.trim()) {
            alert("Vui lòng nhập tiêu đề đề thi");
            return;
        }

        try {
            setSaving(true);
            
            const examType = examTypes.find(t => t.ID === parseInt(examTypeID));
            
            const payload = {
                Title: title.trim(),
                TimeExam: parseInt(timeExam),
                ExamTypeID: parseInt(examTypeID),
                Type: examType?.Code || exam.Type
            };

            const response = await fetch(`${API_URL}/exams/${exam.ID}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${ADMIN_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to update exam');
            }

            const result = await response.json();
            
            if (result.success) {
                alert('✅ Cập nhật thông tin đề thi thành công!');
                onSuccess();
            } else {
                throw new Error(result.message || 'Update failed');
            }
        } catch (err) {
            alert(`❌ Lỗi: ${err.message}`);
            console.error('Error updating exam:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleMedia = async (mediaId, isCurrentlySelected) => {
        setSyncingMedia(true);
        
        try {
            if (isCurrentlySelected) {
                const response = await fetch(`${API_URL}/exams/${exam.ID}/media-groups/${mediaId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${ADMIN_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    setSelectedMediaIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(mediaId);
                        return newSet;
                    });
                }
            } else {
                const maxOrderIndex = selectedMediaIds.size;
                
                const payload = {
                    mediaGroupId: mediaId,
                    orderIndex: maxOrderIndex + 1
                };

                const response = await fetch(`${API_URL}/exams/${exam.ID}/media-groups`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${ADMIN_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    setSelectedMediaIds(prev => new Set([...prev, mediaId]));
                }
            }
        } catch (err) {
            console.error('Error toggling media:', err);
        } finally {
            setSyncingMedia(false);
        }
    };

    const filteredMedia = mediaQuestions.filter(media => {
        const matchSearch = !searchTerm || 
            media.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            media.PreviewText?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDifficulty = !filterDifficulty || media.Difficulty === filterDifficulty;
        const matchSection = !filterSection || media.Section === filterSection;
        
        return matchSearch && matchDifficulty && matchSection;
    });

    const difficulties = [...new Set(mediaQuestions.map(m => m.Difficulty))].filter(Boolean);
    const sections = [...new Set(mediaQuestions.map(m => m.Section))].filter(Boolean).sort();

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-3 text-gray-600 text-sm text-center">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-red-800 text-center mb-2">Lỗi</h3>
                    <p className="text-red-600 text-center text-sm mb-4">{error}</p>
                    <button 
                        onClick={onClose}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-5xl my-6 rounded-lg shadow-xl">
                
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-lg">
                    <h2 className="text-lg font-bold text-white">
                        Chỉnh sửa đề thi #{exam.ID}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-5 max-h-[calc(100vh-150px)] overflow-y-auto">
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-5 border border-blue-200">
                        <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-800">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            Thông tin cơ bản
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1 text-sm">
                                    Tiêu đề đề thi
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-medium text-gray-700 mb-1 text-sm">
                                        Loại đề thi
                                    </label>
                                    <select
                                        value={examTypeID}
                                        onChange={(e) => setExamTypeID(e.target.value)}
                                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {examTypes.map(type => (
                                            <option key={type.ID} value={type.ID}>
                                                {type.Description} ({type.Code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-medium text-gray-700 mb-1 text-sm">
                                        Thời gian (phút)
                                    </label>
                                    <input
                                        type="number"
                                        value={timeExam}
                                        onChange={(e) => setTimeExam(e.target.value)}
                                        min="1"
                                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleUpdateBasicInfo}
                                disabled={saving}
                                className={`px-4 py-2 text-sm rounded-lg font-medium flex items-center gap-2 ${
                                    saving
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Cập nhật
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-semibold flex items-center gap-2 text-gray-800">
                                <BookOpen className="w-5 h-5 text-green-600" />
                                Quản lý Media
                            </h3>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-gray-600">Đã chọn:</span>
                                <span className="bg-green-600 text-white px-2 py-1 rounded-full font-semibold">
                                    {selectedMediaIds.size}
                                </span>
                                <span className="text-gray-600">/ {mediaQuestions.length}</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-blue-200 p-3 mb-3">
                            <h4 className="font-medium text-gray-700 mb-2 text-sm">Số câu hỏi theo Part</h4>
                            <div className="grid grid-cols-7 gap-2">
                                {[1, 2, 3, 4, 5, 6, 7].map(section => {
                                    const selectedMedia = mediaQuestions.filter(m => 
                                        selectedMediaIds.has(m.MediaQuestionID) && m.Section === section.toString()
                                    );
                                    const totalQuestions = selectedMedia.reduce((sum, m) => sum + (m.QuestionCount || 0), 0);
                                    
                                    return (
                                        <div key={section} className="bg-blue-50 rounded p-2 text-center border border-blue-200">
                                            <div className="text-xs text-gray-600">Part {section}</div>
                                            <div className="text-lg font-bold text-blue-600">{totalQuestions}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-2 pt-2 border-t flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-700">Tổng:</span>
                                <span className="text-lg font-bold text-green-600">
                                    {mediaQuestions
                                        .filter(m => selectedMediaIds.has(m.MediaQuestionID))
                                        .reduce((sum, m) => sum + (m.QuestionCount || 0), 0)} câu
                                </span>
                            </div>
                        </div>

                        <div className="mb-3 space-y-2">
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center gap-2 bg-white rounded-lg border border-gray-300 px-2">
                                    <Search className="w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="flex-1 p-2 text-sm focus:outline-none"
                                    />
                                </div>
                                
                                <select
                                    value={filterDifficulty}
                                    onChange={(e) => setFilterDifficulty(e.target.value)}
                                    className="p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Độ khó</option>
                                    {difficulties.map(difficulty => (
                                        <option key={difficulty} value={difficulty}>{difficulty}</option>
                                    ))}
                                </select>

                                <select
                                    value={filterSection}
                                    onChange={(e) => setFilterSection(e.target.value)}
                                    className="p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Part</option>
                                    {sections.map(section => (
                                        <option key={section} value={section}>P{section}</option>
                                    ))}
                                </select>
                            </div>

                            {(searchTerm || filterDifficulty || filterSection) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setFilterDifficulty("");
                                        setFilterSection("");
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Xóa bộ lọc
                                </button>
                            )}
                        </div>

                        {syncingMedia && (
                            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded flex items-center gap-2">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                <span className="text-blue-700 text-xs">Đang đồng bộ...</span>
                            </div>
                        )}

                        <div className="bg-white rounded-lg border border-gray-200 max-h-[350px] overflow-y-auto">
                            {filteredMedia.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    <AlertCircle className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm">Không tìm thấy media</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {filteredMedia.map((media) => {
                                        const isSelected = selectedMediaIds.has(media.MediaQuestionID);
                                        
                                        return (
                                            <label
                                                key={media.MediaQuestionID}
                                                className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                                                    isSelected ? 'bg-green-50' : ''
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleToggleMedia(media.MediaQuestionID, isSelected)}
                                                    className="mt-1 w-4 h-4 accent-green-600 cursor-pointer"
                                                />
                                                
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                                                        <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs font-semibold">
                                                            #{media.MediaQuestionID}
                                                        </span>
                                                        <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded text-xs font-semibold">
                                                            {media.Type}
                                                        </span>
                                                        <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded text-xs font-semibold">
                                                            P{media.Section}
                                                        </span>
                                                        <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-xs font-semibold">
                                                            {media.Skill}
                                                        </span>
                                                        {media.QuestionCount && (
                                                            <span className="text-gray-600 text-xs">
                                                                ({media.QuestionCount} câu)
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <h4 className="font-medium text-gray-800 text-sm mb-1">
                                                        {media.Title}
                                                    </h4>
                                                    
                                                    {media.Difficulty && (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-xs text-gray-600">Độ khó:</span>
                                                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                                                                media.Difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                                media.Difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                media.Difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-700'
                                                            }`}>
                                                                {media.Difficulty}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {isSelected && (
                                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}