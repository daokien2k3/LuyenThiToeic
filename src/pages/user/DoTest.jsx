"use client";

import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import TOEICTestInterface from "../../components/do-test/ToeicTestInterface";
import axios from "axios";

export default function DoTest() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;
    const TOKEN = import.meta.env.VITE_STUDENT_TOKEN;

    const attemptIdRaw = location.state?.attemptId;
    const attemptId = attemptIdRaw ? Number(attemptIdRaw) : null;
    const timeFromDetail = new URLSearchParams(location.search).get("time");

    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [examInfo, setExamInfo] = useState(null);
    const [currentPart, setCurrentPart] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    // 1. Lấy đề thi
    useEffect(() => {
        if (!id) return;

        fetch(`${API_URL}/exams/${id}`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        })
            .then(res => res.json())
            .then(res => {
                const exam = res.data;
                setExamInfo(exam);

                const parts = [...new Set(exam.Questions.map(q => q.Media?.Section))].filter(Boolean).sort((a, b) => Number(a) - Number(b));
                if (parts.length > 0) setCurrentPart(parts[0]);

                const seconds = timeFromDetail
                    ? Number(timeFromDetail) * 60
                    : exam.TimeExam * 60;
                setTimeRemaining(seconds);
            })
            .catch(err => console.error("Fetch exam error:", err));
    }, [id, API_URL, TOKEN, timeFromDetail]);

    // 2. Timer với auto-submit khi hết giờ
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitTest(true); // Auto submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [examInfo, selectedAnswers, attemptId]);

    // 3. Chọn câu trả lời - LƯU CHOICE ID thay vì index
    const handleAnswerSelect = (questionId, choiceId) => {
        setSelectedAnswers(prev => ({ ...prev, [questionId]: Number(choiceId) }));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // 4. Submit bài thi
    const handleSubmitTest = async (isAutoSubmit = false) => {
        if (isSubmitting) return;
        
        if (!attemptId) {
            alert("Không có AttemptID!");
            return;
        }

        if (!examInfo || !examInfo.Questions) {
            alert("Exam data chưa load!");
            return;
        }

        if (!isAutoSubmit) {
            const unansweredCount = examInfo.Questions.filter(
                q => selectedAnswers[q.ID] == null
            ).length;
            
            if (unansweredCount > 0) {
                const confirmed = window.confirm(
                    `Bạn còn ${unansweredCount} câu chưa trả lời. Bạn có chắc muốn nộp bài?`
                );
                if (!confirmed) return;
            }
        }

        setIsSubmitting(true);

        const answersPayload = examInfo.Questions.map(q => {
            const choiceId = selectedAnswers[q.ID];
            return {
                QuestionID: q.ID,
                ChoiceID: choiceId != null ? Number(choiceId) : null
            };
        });

        console.log("Submitting payload:", { 
            AttemptID: attemptId, 
            answers: answersPayload,
            totalQuestions: answersPayload.length,
            answeredQuestions: answersPayload.filter(a => a.ChoiceID !== null).length
        });

        try {
            const res = await axios.post(
                `${API_URL}/attempts/submit`,
                { AttemptID: attemptId, answers: answersPayload },
                { headers: { Authorization: `Bearer ${TOKEN}` } }
            );

            if (res.data.success) {
                const message = isAutoSubmit 
                    ? "Hết giờ! Bài thi đã được nộp tự động."
                    : "Bài thi đã nộp thành công!";
                alert(message);
                navigate(`/user/result/${attemptId}`, { 
                    state: { result: res.data.data } 
                });
            } else {
                alert("Nộp bài thất bại: " + res.data.message);
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error("Submit error:", err.response?.data || err);
            const errorMsg = err.response?.data?.message || "Lỗi khi nộp bài!";
            alert(errorMsg);
            setIsSubmitting(false);
        }
    };

    // 5. Xử lý thoát và xóa attempt
    const handleExit = async () => {
        const confirmed = window.confirm(
            "Bạn có chắc muốn thoát? Bài thi của bạn sẽ không được lưu và attempt này sẽ bị xóa."
        );
        
        if (!confirmed) return;

        setIsExiting(true);

        try {
            if (attemptId) {
                await axios.delete(
                    `${API_URL}/attempts/${attemptId}`,
                    { headers: { Authorization: `Bearer ${TOKEN}` } }
                );
                console.log("Attempt deleted successfully");
            }
            
            // Quay về trang trước hoặc trang danh sách đề thi
            navigate(-1); // hoặc navigate("/exams") nếu bạn muốn về trang cụ thể
        } catch (err) {
            console.error("Delete attempt error:", err.response?.data || err);
            alert("Có lỗi khi xóa");
            // alert("Có lỗi khi xóa attempt, nhưng bạn sẽ được chuyển về trang trước.");
            navigate(-1);
        } finally {
            setIsExiting(false);
        }
    };

    if (!examInfo || !currentPart) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải đề thi...</p>
                </div>
            </div>
        );
    }

    const filteredTestData = {
        parts: [...new Set(examInfo.Questions.map(q => q.Media?.Section))].filter(Boolean).sort((a, b) => Number(a) - Number(b)),
        questions: examInfo.Questions,
        mediaQuestions: examInfo.MediaQuestions || [],
    };

    return (
        <TOEICTestInterface
            testName={examInfo.Title}
            currentPart={currentPart}
            onPartChange={setCurrentPart}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={handleAnswerSelect}
            timeRemaining={formatTime(timeRemaining)}
            testData={filteredTestData}
            attemptId={attemptId}
            onSubmitTest={() => handleSubmitTest(false)}
            onExit={handleExit}
            isSubmitting={isSubmitting}
            isExiting={isExiting}
        />
    );
}