import { useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

// Success Notification Component
export function SuccessNotification({ message, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                    <div className="flex items-center justify-center">
                        <div className="bg-white rounded-full p-3 animate-scaleIn">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Thành công!</h3>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

// Error Notification Component
export function ErrorNotification({ message, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
                    <div className="flex items-center justify-center">
                        <div className="bg-white rounded-full p-3 animate-scaleIn">
                            <XCircle className="w-12 h-12 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Có lỗi xảy ra!</h3>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

// Confirm Delete Modal Component - Updated Design (Similar to CommentManager)
export function ConfirmDeleteModal({ examTitle, onConfirm, onCancel }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        await onConfirm();
        setIsDeleting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onCancel}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-scale-in">
                <div className="p-6">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="text-red-600" size={24} />
                    </div>
                    
                    {/* Content */}
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Xác nhận xóa đề thi
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                            Bạn có chắc chắn muốn xóa đề thi:
                        </p>
                        <div className="p-3 bg-gray-100 rounded-lg mb-3">
                            <p className="text-sm font-semibold text-gray-800">
                                "{examTitle}"
                            </p>
                        </div>
                        <p className="text-sm text-red-600">
                            ⚠️ Hành động này không thể hoàn tác!
                        </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Đang xóa...
                                </>
                            ) : (
                                "Xác nhận xóa"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Demo Component
export default function NotificationDemo() {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShowConfirm(false);
        setShowSuccess(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes scaleIn {
                    from { 
                        transform: scale(0);
                    }
                    to { 
                        transform: scale(1);
                    }
                }
                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.4s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>

            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Exam Notification System
                </h1>
                <p className="text-center text-gray-600 mb-12">
                    Hệ thống thông báo chuyên nghiệp cho quản lý đề thi (Updated Design)
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">Thành công</h3>
                        <p className="text-gray-600 text-center mb-4 text-sm">
                            Hiển thị khi thao tác hoàn thành
                        </p>
                        <button
                            onClick={() => setShowSuccess(true)}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold"
                        >
                            Xem demo
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">Lỗi</h3>
                        <p className="text-gray-600 text-center mb-4 text-sm">
                            Hiển thị khi có lỗi xảy ra
                        </p>
                        <button
                            onClick={() => setShowError(true)}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold"
                        >
                            Xem demo
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">Xác nhận xóa</h3>
                        <p className="text-gray-600 text-center mb-4 text-sm">
                            Xác nhận trước khi xóa đề thi (New Design)
                        </p>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold"
                        >
                            Xem demo
                        </button>
                    </div>
                </div>

                <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Thay đổi thiết kế</h2>
                    <div className="space-y-3 text-gray-600">
                        <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p>Modal xác nhận xóa được thiết kế lại đơn giản và gọn gàng hơn</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p>Loại bỏ gradient phức tạp, sử dụng background đơn giản</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p>Icon cảnh báo với background màu đỏ nhạt</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p>Nút "Xác nhận xóa" thay vì "Xóa đề thi"</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p>Animation scale-in mượt mà hơn</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Hướng dẫn sử dụng</h2>
                    <div className="space-y-4 text-gray-600">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">1. Thông báo thành công:</h3>
                            <code className="bg-gray-100 px-3 py-1 rounded text-sm block overflow-x-auto">
                                {`<SuccessNotification message="Cập nhật đề thi thành công!" onClose={() => {}} />`}
                            </code>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">2. Thông báo lỗi:</h3>
                            <code className="bg-gray-100 px-3 py-1 rounded text-sm block overflow-x-auto">
                                {`<ErrorNotification message="Đề thi đã được sử dụng, không thể xóa!" onClose={() => {}} />`}
                            </code>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">3. Xác nhận xóa (Updated):</h3>
                            <code className="bg-gray-100 px-3 py-1 rounded text-sm block overflow-x-auto">
                                {`<ConfirmDeleteModal 
  examTitle="TOEIC Test 001" 
  onConfirm={handleDelete} 
  onCancel={() => {}} 
/>`}
                            </code>
                        </div>
                    </div>
                </div>
            </div>

            {showSuccess && (
                <SuccessNotification
                    message="Đề thi đã được cập nhật thành công!"
                    onClose={() => setShowSuccess(false)}
                />
            )}

            {showError && (
                <ErrorNotification
                    message="Đề thi đã được sử dụng trong bài kiểm tra, không thể xóa!"
                    onClose={() => setShowError(false)}
                />
            )}

            {showConfirm && (
                <ConfirmDeleteModal
                    examTitle="TOEIC Test 001 - Full Test"
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    );
}