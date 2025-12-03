"use client"

import { useState, useEffect } from "react"
import TOEICTestInterface from "../../components/user/ToeicTestInterface"

export default function DoTest() {
    const [currentPart, setCurrentPart] = useState(1)
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [timeRemaining, setTimeRemaining] = useState(7146)
    const [testData, setTestData] = useState(null)

    useEffect(() => {
        fetch("/data/toeicPractice.json")
            .then(res => res.json())
            .then(data => setTestData(data))
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleAnswerSelect = (questionId, answer) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }))
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    // tránh lỗi khi testData chưa load
    if (!testData) return <div className="p-5">Đang tải đề thi...</div>

    return (
        <TOEICTestInterface
            testName="New Economy TOEIC Test 1"
            currentPart={currentPart}
            onPartChange={setCurrentPart}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={handleAnswerSelect}
            timeRemaining={formatTime(timeRemaining)}
            testData={testData}
        />
    )
}
