// CommentSection.jsx
import { useState, useMemo, useEffect } from "react";
import axios from "axios";

import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import EditCommentModal from "./EditCommentModal";

const BASE_URL = "http://localhost:3001/api/exam";

export default function CommentSection({ examId }) {
    const [flatComments, setFlatComments] = useState([]);
    const [editingComment, setEditingComment] = useState(null);

    const fetchComments = async () => {
        try {
            const token = import.meta.env.VITE_STUDENT_TOKEN;

            const res = await axios.get(
                `${BASE_URL}/comments/exams/${examId}/comments`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            localStorage.setItem("studentProfileID", res.data.data.ID);

            setFlatComments(res.data?.data || []);
        } catch (err) {
            console.error("Error loading comments:", err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [examId]);

    const nestedComments = useMemo(() => {
        const map = {};
        const roots = [];

        flatComments.forEach((c) => {
            map[c.ID] = {
                ...c,
                UserName: c.Author?.FullName || "Ẩn danh",
                replies: [],
            };
        });

        flatComments.forEach((c) => {
            if (c.ParentId && c.ParentId !== 0 && map[c.ParentId]) {
                map[c.ParentId].replies.push(map[c.ID]);
            } else {
                roots.push(map[c.ID]);
            }
        });

        return roots;
    }, [flatComments]);

    // API thêm comment
    const addComment = async (text, parentId = 0) => {
        try {
            const token = import.meta.env.VITE_STUDENT_TOKEN;

            await axios.post(
                `${BASE_URL}/comments`,
                {
                    Content: text,
                    ExamID: examId,
                    ParentId: parentId,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchComments();
        } catch (err) {
            console.error("Error creating comment:", err);
        }
    };

    // API sửa comment
    const updateComment = async (id, newContent) => {
        try {
            const token = import.meta.env.VITE_STUDENT_TOKEN;

            await axios.put(
                `${BASE_URL}/comments/${id}`,
                { Content: newContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEditingComment(null);
            fetchComments();
        } catch (err) {
            console.error("Update comment error:", err);
        }
    };

    // API xoá comment
const deleteComment = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    try {
        const token = import.meta.env.VITE_STUDENT_TOKEN;

        await axios.delete(`${BASE_URL}/comments/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        fetchComments();
    } catch (err) {
        console.error("Delete comment error:", err);
    }
};

    return (
        <div className="mt-12 border rounded-2xl bg-white p-6">
            <CommentInput onSubmit={addComment} />

            <div className="space-y-4 mt-6">
                {nestedComments.map((c) => (
                    <CommentItem
                        key={c.ID}
                        comment={c}
                        onReply={addComment}
                        onEdit={(commentObj) => setEditingComment(commentObj)}
                        onDelete={() => deleteComment(c.ID)}
                    />
                ))}
            </div>

            {editingComment && (
                <EditCommentModal
                    comment={editingComment}
                    onClose={() => setEditingComment(null)}
                    onSave={(newContent) =>
                        updateComment(editingComment.ID, newContent)
                    }
                />
            )}
        </div>
    );
}
