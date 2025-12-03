"use client"

import { useState, useRef, useEffect } from "react"
import AudioPlayer from "./AudioPlayer"
import PartTabs from "./PartTabs"
import QuestionContent from "./QuestionContent"
import RightSidebar from "./RightSideBar"
import Header from "./Header"

export default function TOEICTestInterface({
  testName,
  currentPart,
  onPartChange,
  selectedAnswers,
  onAnswerSelect,
  timeRemaining,
  testData,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [highlightEnabled, setHighlightEnabled] = useState(true)

  const partData = (testData?.parts || []).find((p) => p.id === currentPart) || {}

  // media thuộc part này
  const mediaList = (testData?.mediaQuestions || []).filter(
    (m) => m.PartID === currentPart
  )

  // câu hỏi thuộc part này
  const questions = (testData?.questions || []).filter((q) =>
    mediaList.some((m) => m.ID === q.MediaQuestionID)
  )

  // tính cumulative để sidebar nhảy câu
  const partCounts = (testData?.parts || []).map((p) => {
    const media = (testData?.mediaQuestions || []).filter((m) => m.PartID === p.id)
    return (testData?.questions || []).filter((q) =>
      media.some((m) => m.ID === q.MediaQuestionID)
    ).length
  })

  const cumulativeCounts = partCounts.reduce((acc, len) => {
    const prev = acc.length ? acc[acc.length - 1] : 0
    acc.push(prev + len)
    return acc
  }, [])

  const partIndex = Math.max(0, Math.min((currentPart || 1) - 1, partCounts.length - 1))
  const baseIndex = partIndex === 0 ? 0 : cumulativeCounts[partIndex - 1]

  // pending jump
  const pendingJumpRef = useRef(null)

  const scrollToQuestionId = (globalNumber) => {
    const el = document.getElementById(`q-${globalNumber}`)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      el.classList.add("ring-2", "ring-blue-200")
      setTimeout(() => el.classList.remove("ring-2", "ring-blue-200"), 900)
    }
  }

  const handleJumpToQuestion = (globalQuestionNumber) => {
    let targetPart = 1
    for (let i = 0; i < cumulativeCounts.length; i++) {
      if (globalQuestionNumber <= cumulativeCounts[i]) {
        targetPart = i + 1
        break
      }
    }

    if (targetPart !== currentPart) {
      pendingJumpRef.current = globalQuestionNumber
      onPartChange(targetPart)
      const prevTotal = targetPart > 1 ? cumulativeCounts[targetPart - 2] : 0
      setCurrentQuestion(globalQuestionNumber - prevTotal - 1)
    } else {
      scrollToQuestionId(globalQuestionNumber)
    }
  }

  useEffect(() => {
    if (pendingJumpRef.current) {
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          scrollToQuestionId(pendingJumpRef.current)
          pendingJumpRef.current = null
        })
      )
      return () => cancelAnimationFrame(id)
    }
  }, [currentPart, baseIndex])

  const handlePartChange = (part) => {
    onPartChange(part)
    setCurrentQuestion(0)
    pendingJumpRef.current = null
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header testName={testName} />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-auto">

          {/* <AudioPlayer
            highlightEnabled={highlightEnabled}
            onHighlightToggle={setHighlightEnabled}
            audioUrl="/audio/toeic-sample.mp3"
          /> */}

          <PartTabs currentPart={currentPart} onPartChange={handlePartChange} />

          <QuestionContent
            part={currentPart}
            questions={questions}
            baseIndex={baseIndex}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={onAnswerSelect}
            testData={testData}            // FIX
            mediaList={mediaList}          // FIX
          />
        </div>

        <RightSidebar
          timeRemaining={timeRemaining}
          currentPart={currentPart}
          selectedAnswers={selectedAnswers}
          onJumpToQuestion={handleJumpToQuestion}
          testData={testData}
        />
      </div>
    </div>
  )
}
