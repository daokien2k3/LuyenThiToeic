import { useState } from "react";
import { X, Save, AlertCircle, CheckCircle } from "lucide-react";

export default function AddExamModal({ examTypes, onClose, onSuccess }) {
    const [title, setTitle] = useState("");
    const [timeExam, setTimeExam] = useState(120);
    const [examTypeID, setExamTypeID] = useState(examTypes[0]?.ID || 1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Notification states
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const ADMIN_TOKEN = localStorage.getItem("accessToken");

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError("Vui lòng nhập tiêu đề đề thi");
            return;
        }

        if (timeExam < 1) {
            setError("Thời gian phải lớn hơn 0");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const examType = examTypes.find(t => t.ID === parseInt(examTypeID));
            
            const payload = {
                Title: title.trim(),
                TimeExam: parseInt(timeExam),
                ExamTypeID: parseInt(examTypeID),
                Type: examType?.Code || "FULL_TEST"
            };

            const response = await fetch(`${API_URL}/exams`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ADMIN_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Không thể tạo đề thi. Vui lòng thử lại!');
            }

            const result = await response.json();
            
            if (result.success) {
                setNotificationMessage(`Đề thi "${title}" đã được thêm thành công!`);
                setShowSuccess(true);
            } else {
                throw new Error(result.message || 'Không thể tạo đề thi. Vui lòng thử lại!');
            }
        } catch (err) {
            setNotificationMessage(err.message || 'Đã xảy ra lỗi khi tạo đề thi!');
            setShowError(true);
            console.error('Error creating exam:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        onSuccess();
        onClose();
    };

    const handleErrorClose = () => {
        setShowError(false);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-lg rounded-lg shadow-xl">
                    
                    <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg">
                        <h2 className="text-lg font-bold text-white">
                            Thêm đề thi mới
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors"
                            disabled={loading}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-5">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1 text-sm">
                                    Tiêu đề đề thi <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Nhập tiêu đề đề thi..."
                                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700 mb-1 text-sm">
                                    Loại đề thi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={examTypeID}
                                    onChange={(e) => setExamTypeID(e.target.value)}
                                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    disabled={loading}
                                >
                                    {examTypes.map(type => (
                                        <option key={type.ID} value={type.ID}>
                                            {type.Code}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700 mb-1 text-sm">
                                    Thời gian (phút) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={timeExam}
                                    onChange={(e) => setTimeExam(e.target.value)}
                                    min="1"
                                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`flex-1 px-4 py-2 text-sm rounded-lg font-medium flex items-center justify-center gap-2 ${
                                    loading
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Tạo đề thi
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Notification */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Thành công
                        </h3>
                        
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {notificationMessage}
                        </p>
                        
                        <button
                            onClick={handleSuccessClose}
                            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* Error Notification */}
            {showError && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-12 h-12 text-red-600" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Có lỗi xảy ra
                        </h3>
                        
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {notificationMessage}
                        </p>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={handleErrorClose}
                                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleErrorClose}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}