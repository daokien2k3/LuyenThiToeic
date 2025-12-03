"use client";

export default function AnswerOptions({
    options = [],
    part,
    inputName,
    selectedAnswer,
    onAnswerSelect,
}) {
    return (
        <div className="space-y-4">
            {options.map((op, idx) => {
                const label = String.fromCharCode(65 + idx);
                const isSelected = selectedAnswer === label;

                return (
                    <label
                        key={label}
                        className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-md ${
                            isSelected
                                ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-indigo-500 shadow-lg"
                                : "border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                        }`}
                    >
                        <input
                            type="radio"
                            name={inputName}
                            value={label}
                            checked={isSelected}
                            onChange={() => onAnswerSelect(label)}
                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                        />

                        <span className="font-bold text-lg text-gray-700">{label}.</span>

                        {/* Part 1–2 không hiển thị text đáp án */}
                        {part > 2 && <span className="text-gray-800 leading-relaxed">{op}</span>}
                    </label>
                );
            })}
        </div>
    );
}
