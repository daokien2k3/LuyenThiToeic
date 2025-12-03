// 📁 src/components/CommentSection.jsx
import { useState, useMemo } from "react";
import { MessageSquare, Send, Heart, Reply, ChevronDown, ChevronUp } from "lucide-react";

export default function CommentSection({ examId, initialComments = [] }) {
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState(null); // ID của comment đang reply
    const [replyText, setReplyText] = useState("");
    const [error, setError] = useState("");
    const [expandedReplies, setExpandedReplies] = useState({}); // Để toggle hiển thị replies

    // Xây dựng cấu trúc nested comments từ initialComments
    const nestedComments = useMemo(() => {
        const commentMap = {};
        const rootComments = [];

        // Tạo map cho tất cả comments
        initialComments.forEach((c) => {
            commentMap[c.ID] = { ...c, likes: c.likes || 0, replies: [] };
        });

        // Gán replies vào parent
        initialComments.forEach((c) => {
            if (c.ParentId) {
                if (commentMap[c.ParentId]) {
                    commentMap[c.ParentId].replies.push(commentMap[c.ID]);
                }
            } else {
                rootComments.push(commentMap[c.ID]);
            }
        });

        return rootComments;
    }, [initialComments]);

    const [comments, setComments] = useState(nestedComments);

    // Cập nhật comments khi initialComments thay đổi
    useMemo(() => {
        setComments(nestedComments);
    }, [nestedComments]);

    const handleAddComment = () => {
        if (!newComment.trim()) {
            setError("Bình luận không được để trống");
            return;
        }

        const newCommentObj = {
            ID: Date.now(),
            ExamID: examId,
            Content: newComment.trim(),
            CreateAt: new Date().toISOString().split("T")[0],
            UserName: "Người dùng mới",
            likes: 0,
            replies: [],
            ParentId: null,
        };

        setComments((prev) => [newCommentObj, ...prev]);
        setNewComment("");
        setError("");
    };

    const handleAddReply = (parentId) => {
        if (!replyText.trim()) {
            setError("Phản hồi không được để trống");
            return;
        }

        const newReply = {
            ID: Date.now(),
            Content: replyText.trim(),
            CreateAt: new Date().toISOString().split("T")[0],
            UserName: "Người dùng mới",
            likes: 0,
            ParentId: parentId,
        };

        setComments((prev) =>
            prev.map((c) =>
                c.ID === parentId
                    ? { ...c, replies: [newReply, ...c.replies] }
                    : c
            )
        );
        setReplyTo(null);
        setReplyText("");
        setError("");
    };

    const handleLike = (id, isReply = false, parentId = null) => {
        if (isReply) {
            setComments((prev) =>
                prev.map((c) =>
                    c.ID === parentId
                        ? {
                              ...c,
                              replies: c.replies.map((r) =>
                                  r.ID === id ? { ...r, likes: (r.likes || 0) + 1 } : r
                              ),
                          }
                        : c
                )
            );
        } else {
            setComments((prev) =>
                prev.map((c) => (c.ID === id ? { ...c, likes: (c.likes || 0) + 1 } : c))
            );
        }
    };

    const toggleReplies = (id) => {
        setExpandedReplies((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const renderComment = (c, isReply = false, parentId = null, level = 0) => {
        const indentClass = level > 0 ? `ml-8 border-l-2 border-l-gray-300 pl-4` : '';
        const hasReplies = c.replies && c.replies.length > 0;
        const isExpanded = expandedReplies[c.ID] !== false; // Mặc định mở

        return (
            <div key={c.ID} className={`bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 ${indentClass} ${isReply ? 'mt-3' : ''}`}>
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <div className={`bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${isReply ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base'}`}>
                            {(c.UserName || "Người dùng").charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className={`font-semibold text-gray-900 ${isReply ? 'text-sm' : 'text-base'}`}>{c.UserName || "Người dùng"}</p>
                                <p className="text-xs text-gray-500">{new Date(c.CreateAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                            {isReply && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                                    Phản hồi
                                </span>
                            )}
                        </div>
                        <p className={`text-gray-800 mb-3 leading-relaxed ${isReply ? 'text-sm' : 'text-base'}`}>{c.Content}</p>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleLike(c.ID, isReply, parentId)}
                                className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors duration-200 font-medium text-sm group"
                            >
                                <Heart className="w-4 h-4 group-hover:fill-current" />
                                {c.likes || 0}
                            </button>
                            <button
                                onClick={() => setReplyTo(replyTo === c.ID ? null : c.ID)}
                                className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium text-sm group"
                            >
                                <Reply className="w-4 h-4 group-hover:fill-current" />
                                Phản hồi
                            </button>
                            {hasReplies && (
                                <button
                                    onClick={() => toggleReplies(c.ID)}
                                    className="flex items-center gap-1 text-gray-600 hover:text-green-500 transition-colors duration-200 font-medium text-sm group"
                                >
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    {c.replies.length} phản hồi
                                </button>
                            )}
                        </div>
                        {/* Form reply */}
                        {replyTo === c.ID && (
                            <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200 resize-none shadow-sm text-sm"
                                    placeholder="Viết phản hồi của bạn..."
                                    rows="2"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                                <div className="flex justify-end mt-2 gap-2">
                                    <button
                                        onClick={() => setReplyTo(null)}
                                        className="px-3 py-1 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={() => handleAddReply(c.ID)}
                                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center gap-1 text-sm"
                                    >
                                        <Send className="w-3 h-3" />
                                        Gửi
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Render replies */}
                        {hasReplies && isExpanded && (
                            <div className="mt-4 space-y-3">
                                {c.replies.map((reply) => renderComment(reply, true, c.ID, level + 1))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white shadow-2xl rounded-3xl p-8 mt-12 ring-2 ring-gray-100">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-full">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Bình luận ({comments.length})</h2>
            </div>

            {/* Form thêm bình luận */}
            <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            U
                        </div>
                    </div>
                    <div className="flex-1">
                        <textarea
                            className="w-full border border-gray-300 rounded-xl p-4 focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 resize-none shadow-sm text-base"
                            placeholder="Chia sẻ ý kiến của bạn về đề thi này..."
                            rows="4"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        {error && (
                            <p className="text-red-600 text-sm mt-2 flex items-center gap-1 font-medium">
                                <span className="text-red-500">⚠️</span> {error}
                            </p>
                        )}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleAddComment}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 text-base"
                            >
                                <Send className="w-5 h-5" />
                                Gửi bình luận
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách bình luận */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <MessageSquare className="w-20 h-20 mx-auto mb-6 opacity-50" />
                        <p className="text-xl">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ!</p>
                    </div>
                ) : (
                    comments.map((c) => renderComment(c))
                )}
            </div>
        </div>
    );
}
