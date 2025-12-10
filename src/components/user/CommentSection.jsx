// 📁 src/components/CommentSection.jsx
import { useState, useMemo } from "react";
import { MessageSquare, Send, Heart, Reply, ChevronDown, ChevronUp } from "lucide-react";

export default function CommentSection({ examId, initialComments = [] }) {
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [error, setError] = useState("");
    const [expandedReplies, setExpandedReplies] = useState({});

    // 📌 Convert comments thành dạng cây (nested)
    const nestedComments = useMemo(() => {
        const map = {};
        const roots = [];

        initialComments.forEach((c) => {
            map[c.ID] = { ...c, likes: c.likes || 0, replies: [] };
        });

        initialComments.forEach((c) => {
            if (c.ParentId && map[c.ParentId]) {
                map[c.ParentId].replies.push(map[c.ID]);
            } else {
                roots.push(map[c.ID]);
            }
        });

        return roots;
    }, [initialComments]);

    const [comments, setComments] = useState(nestedComments);

    useMemo(() => {
        setComments(nestedComments);
    }, [nestedComments]);

    const handleAddComment = () => {
        if (!newComment.trim()) return setError("Bình luận không được để trống");

        const obj = {
            ID: Date.now(),
            ExamID: examId,
            Content: newComment.trim(),
            CreateAt: new Date().toISOString(),
            UserName: "Người dùng",
            likes: 0,
            replies: [],
            ParentId: null,
        };

        setComments((prev) => [obj, ...prev]);
        setNewComment("");
        setError("");
    };

    const handleAddReply = (parentId) => {
        if (!replyText.trim()) return setError("Phản hồi không được để trống");

        const reply = {
            ID: Date.now(),
            Content: replyText.trim(),
            CreateAt: new Date().toISOString(),
            UserName: "Người dùng",
            likes: 0,
            ParentId: parentId,
        };

        setComments((prev) =>
            prev.map((c) =>
                c.ID === parentId ? { ...c, replies: [reply, ...c.replies] } : c
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
                                  r.ID === id ? { ...r, likes: r.likes + 1 } : r
                              ),
                          }
                        : c
                )
            );
        } else {
            setComments((prev) =>
                prev.map((c) => (c.ID === id ? { ...c, likes: c.likes + 1 } : c))
            );
        }
    };

    const toggleReplies = (id) => {
        setExpandedReplies((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // -----------------------
    // 🎨 UI TỐI GIẢN
    // -----------------------
    const renderComment = (c, isReply = false, parentId = null, level = 0) => {
        return (
            <div
                key={c.ID}
                className={`p-4 border rounded-lg bg-white ${
                    isReply ? "ml-8 mt-3" : ""
                }`}
            >
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                        {(c.UserName || "U").charAt(0)}
                    </div>

                    <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">
                            {c.UserName}
                        </p>
                        <p className="text-xs text-gray-500 mb-1">
                            {new Date(c.CreateAt).toLocaleDateString("vi-VN")}
                        </p>

                        <p className="text-gray-800 text-sm mb-2">{c.Content}</p>

                        <div className="flex items-center gap-4 text-sm">
                            <button
                                onClick={() => handleLike(c.ID, isReply, parentId)}
                                className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                            >
                                <Heart className="w-4 h-4" />
                                {c.likes}
                            </button>

                            <button
                                onClick={() =>
                                    setReplyTo(replyTo === c.ID ? null : c.ID)
                                }
                                className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
                            >
                                <Reply className="w-4 h-4" />
                                Trả lời
                            </button>

                            {c.replies?.length > 0 && (
                                <button
                                    onClick={() => toggleReplies(c.ID)}
                                    className="flex items-center gap-1 text-gray-600 hover:text-green-600"
                                >
                                    {expandedReplies[c.ID] ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                    {c.replies.length} phản hồi
                                </button>
                            )}
                        </div>

                        {/* Form reply */}
                        {replyTo === c.ID && (
                            <div className="mt-3">
                                <textarea
                                    className="w-full border rounded p-2 text-sm"
                                    rows="2"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                                <div className="flex justify-end mt-2 gap-2">
                                    <button
                                        onClick={() => setReplyTo(null)}
                                        className="text-sm text-gray-500"
                                    >
                                        Hủy
                                    </button>

                                    <button
                                        onClick={() => handleAddReply(c.ID)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Gửi
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Replies */}
                        {expandedReplies[c.ID] &&
                            c.replies?.map((r) =>
                                renderComment(r, true, c.ID, level + 1)
                            )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mt-12 border rounded-2xl bg-white p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                Bình luận 
                {/* ({comments.length}) */}
            </h2>

            {/* Form bình luận */}
            <div className="mb-8">
                <textarea
                    className="w-full border rounded-lg p-3 text-sm"
                    rows="3"
                    placeholder="Viết bình luận của bạn..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleAddComment}
                        className="bg-blue-600 text-white px-5 py-2 rounded text-sm"
                    >
                        Gửi bình luận
                    </button>
                </div>
            </div>

            {/* Danh sách bình luận */}
            <div className="space-y-4">
                {comments.map((c) => renderComment(c))}
            </div>
        </div>
    );
}
    