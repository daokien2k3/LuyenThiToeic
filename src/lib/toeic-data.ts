export interface Question {
    id: number
    text?: string
    question?: string
    passage?: string
    options: string[]
    correctAnswer: string
}

export interface TOEICPart {
    part: number
    description: string
    questions: Question[]
}

export interface TOEICTestData {
    parts: TOEICPart[]
}

export const toeicTestData: TOEICTestData = {
    parts: [
        {
            part: 1,
            description: "Photographs",
            questions: [
                {
                    id: 1,
                    text: "Look at the photo and listen.",
                    options: [
                        "The woman is sitting at a desk.",
                        "The woman is standing by the window.",
                        "The woman is talking on the phone.",
                        "The woman is walking in the office.",
                    ],
                    correctAnswer: "A",
                },
                {
                    id: 2,
                    text: "Look at the photo and listen.",
                    options: [
                        "The computers are on the table.",
                        "The keyboard is next to the monitor.",
                        "The office is empty.",
                        "The workers are having a meeting.",
                    ],
                    correctAnswer: "A",
                },
                {
                    id: 3,
                    text: "Look at the photo and listen.",
                    options: [
                        "The books are on the shelf.",
                        "The documents are being filed.",
                        "The office supplies are organized.",
                        "The cabinet is made of wood.",
                    ],
                    correctAnswer: "B",
                },
                {
                    id: 4,
                    text: "Look at the photo and listen.",
                    options: [
                        "The conference room is full.",
                        "The participants are seated around the table.",
                        "The presentation is starting.",
                        "The cameras are recording.",
                    ],
                    correctAnswer: "B",
                },
                {
                    id: 5,
                    text: "Look at the photo and listen.",
                    options: [
                        "The coffee cups are on the desk.",
                        "The office supplies are scattered.",
                        "The documents are neatly arranged.",
                        "The workspace is cluttered.",
                    ],
                    correctAnswer: "C",
                },
            ],
        },
        {
            part: 2,
            description: "Question-Response",
            questions: [
                {
                    id: 6,
                    text: "What time does the meeting start?",
                    options: ["At 2 PM.", "In the conference room.", "With the marketing team."],
                    correctAnswer: "A",
                },
                {
                    id: 7,
                    text: "Where is the file located?",
                    options: ["On my desk.", "Yes, I found it.", "Very important documents."],
                    correctAnswer: "A",
                },
                {
                    id: 8,
                    text: "Who will attend the presentation?",
                    options: ["All department heads.", "At 3 o'clock.", "In the main auditorium."],
                    correctAnswer: "A",
                },
                {
                    id: 9,
                    text: "Have you finished the report?",
                    options: [
                        "Yes, I submitted it this morning.",
                        "No, that's not my responsibility.",
                        "The report is on your desk.",
                    ],
                    correctAnswer: "A",
                },
                {
                    id: 10,
                    text: "When can you meet with the client?",
                    options: ["Next Tuesday would work.", "In the downtown office.", "We contacted them yesterday."],
                    correctAnswer: "A",
                },
            ],
        },
        {
            part: 3,
            description: "Short Conversations",
            questions: [
                {
                    id: 11,
                    text: "What is the main topic of the conversation?",
                    options: [
                        "Scheduling a meeting.",
                        "Ordering office supplies.",
                        "Discussing project deadlines.",
                        "Planning a team building event.",
                    ],
                    correctAnswer: "A",
                },
                {
                    id: 12,
                    text: "What does the woman suggest?",
                    options: [
                        "Working late tonight.",
                        "Moving the meeting to tomorrow.",
                        "Sending a report by email.",
                        "Calling the client first.",
                    ],
                    correctAnswer: "B",
                },
                {
                    id: 13,
                    text: "When will the meeting be held?",
                    options: ["This afternoon.", "Tomorrow morning.", "Next week.", "After lunch."],
                    correctAnswer: "A",
                },
                {
                    id: 14,
                    text: "Who needs to confirm attendance?",
                    options: ["The manager.", "The clients.", "All department members.", "The administrative staff."],
                    correctAnswer: "B",
                },
                {
                    id: 15,
                    text: "What is the purpose of the meeting?",
                    options: [
                        "To review quarterly results.",
                        "To plan the next project.",
                        "To discuss budget allocation.",
                        "To introduce new policies.",
                    ],
                    correctAnswer: "A",
                },
            ],
        },
        {
            part: 4,
            description: "Short Talks",
            questions: [
                {
                    id: 16,
                    text: "What is the speaker's main purpose?",
                    options: [
                        "To announce a new product.",
                        "To explain company policies.",
                        "To report on sales performance.",
                        "To introduce new employees.",
                    ],
                    correctAnswer: "C",
                },
                {
                    id: 17,
                    text: "According to the speaker, what improved this quarter?",
                    options: ["Customer satisfaction.", "Employee retention.", "Market share.", "Production efficiency."],
                    correctAnswer: "C",
                },
                {
                    id: 18,
                    text: "What does the speaker recommend for next quarter?",
                    options: [
                        "Hiring more staff.",
                        "Expanding to new markets.",
                        "Reducing expenses.",
                        "Increasing marketing efforts.",
                    ],
                    correctAnswer: "B",
                },
                {
                    id: 19,
                    text: "Who is the audience for this talk?",
                    options: ["New employees.", "Sales team.", "Executive management.", "All staff members."],
                    correctAnswer: "D",
                },
                {
                    id: 20,
                    text: "When should the action be taken?",
                    options: ["Immediately.", "By end of month.", "Next quarter.", "Before next year."],
                    correctAnswer: "C",
                },
            ],
        },
        {
            part: 5,
            description: "Incomplete Sentences",
            questions: [
                {
                    id: 21,
                    text: "The company has _____ developing new software solutions for three years.",
                    options: ["being worked on", "been working", "was working", "worked"],
                    correctAnswer: "B",
                },
                {
                    id: 22,
                    text: "All employees must submit their reports _____ the deadline specified in the memo.",
                    options: ["by", "before", "until", "during"],
                    correctAnswer: "A",
                },
                {
                    id: 23,
                    text: "The new office building is more spacious and modern _____ the previous location.",
                    options: ["than", "then", "as", "such as"],
                    correctAnswer: "A",
                },
                {
                    id: 24,
                    text: "Mr. Johnson, _____ has extensive experience in marketing, will lead the new campaign.",
                    options: ["who", "whom", "which", "that"],
                    correctAnswer: "A",
                },
                {
                    id: 25,
                    text: "The conference will be held _____ the grand ballroom on the second floor.",
                    options: ["in", "at", "on", "by"],
                    correctAnswer: "A",
                },
            ],
        },
        {
            part: 6,
            description: "Text Completion",
            questions: [
                {
                    id: 26,
                    passage:
                        "Dear Mr. Thompson, Thank you for your inquiry about our new product line. We are _____ to provide you with detailed information about our offerings.",
                    question: "What is the best word to complete the sentence?",
                    options: ["delighted", "described", "disturbed", "deployed"],
                    correctAnswer: "A",
                },
                {
                    id: 27,
                    passage:
                        "The marketing department _____ increase brand awareness by implementing a comprehensive social media strategy.",
                    question: "What is the correct verb form?",
                    options: ["are planned to", "is planned to", "plans to", "plan to"],
                    correctAnswer: "D",
                },
                {
                    id: 28,
                    passage: "As a result of the restructuring, several _____ were made to improve operational efficiency.",
                    question: "What is the most appropriate word?",
                    options: ["adaptations", "adjustments", "amendments", "alternatives"],
                    correctAnswer: "B",
                },
                {
                    id: 29,
                    passage: "The training program is designed to _____ employees with the skills necessary for their new roles.",
                    question: "What verb completes the sentence?",
                    options: ["equip", "supply", "provide", "furnish"],
                    correctAnswer: "A",
                },
                {
                    id: 30,
                    passage: "We expect the project to be completed _____ the end of the fiscal year.",
                    question: "What is the correct preposition?",
                    options: ["by", "until", "before", "during"],
                    correctAnswer: "A",
                },
            ],
        },
        {
            part: 7,
            description: "Reading Comprehension",
            questions: [
                {
                    id: 31,
                    passage:
                        "InnovateTech Corporation announced record-breaking sales for the second quarter. The company's revenue increased by 35% compared to the same period last year, driven primarily by strong demand for their cloud computing solutions.",
                    question: "What was the main reason for the increased sales?",
                    options: [
                        "Reduction in operational costs.",
                        "Strong demand for cloud computing solutions.",
                        "Expansion to international markets.",
                        "Introduction of new product lines.",
                    ],
                    correctAnswer: "B",
                },
                {
                    id: 32,
                    passage:
                        "Please be advised that the main office will be closed on Monday for system maintenance. All staff should work from home on that day. IT support will be available remotely to assist with any technical issues.",
                    question: "What arrangement has been made for staff on Monday?",
                    options: [
                        "All staff should take the day off.",
                        "Staff should work from home.",
                        "Staff should report to a temporary location.",
                        "The office will operate with limited staff.",
                    ],
                    correctAnswer: "B",
                },
                {
                    id: 33,
                    passage:
                        "The recent employee satisfaction survey revealed a significant improvement in workplace culture. Overall satisfaction increased from 72% to 85%, with particular improvements in management communication and career development opportunities.",
                    question: "In which areas did satisfaction improve?",
                    options: [
                        "Salary and benefits.",
                        "Management communication and career development.",
                        "Office facilities and lunch options.",
                        "Work hours and vacation days.",
                    ],
                    correctAnswer: "B",
                },
                {
                    id: 34,
                    passage:
                        "Attendees at the annual conference can choose from multiple workshops including Advanced Financial Planning, Digital Marketing Strategies, and Supply Chain Management. Breakfast and lunch will be provided, and networking sessions are scheduled throughout the day.",
                    question: "What will be provided during the conference?",
                    options: [
                        "Transportation and accommodations.",
                        "Meals and networking opportunities.",
                        "Training materials and certificates.",
                        "Office supplies and equipment.",
                    ],
                    correctAnswer: "B",
                },
                {
                    id: 35,
                    passage:
                        "The quarterly performance review process has been streamlined to reduce administrative burden. Managers will use the new digital platform to submit evaluations, which will be accessible to employees within 48 hours of completion.",
                    question: "What is an advantage of the new review process?",
                    options: [
                        "It eliminates the need for face-to-face meetings.",
                        "It reduces administrative burden.",
                        "It increases employee bonuses.",
                        "It allows employees to rate managers.",
                    ],
                    correctAnswer: "B",
                },
            ],
        },
    ],
}
