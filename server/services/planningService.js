
function createPlanningState() {
    return {
        topic: null,
        level: null,
        priorKnowledge: [],
        goals: [],
        deadline: null,
        weeklyTimeAvailability: null,
        language: "English",
        preferences: {
            depth: "balanced",
            approach: []
        }
    };
}

function getMissingFields(state) {
    const requiredFields = ["topic", "level"];

    return requiredFields.filter(
        field => !state[field]
    );
}

const planningQuestions = {
    topic: {
        question: "What would you like to learn?",
        options: null
    },
    level: {
        question: "What's your current level in this subject?",
        options: [
            "Beginner",
            "Intermediate",
            "Advanced"
        ]
    }
};

function getNextQuestion(state) {
    const missingFields = getMissingFields(state);

    if (missingFields.length === 0) {
        return null;
    }

    return planningQuestions[missingFields[0]];
}

function submitAnswer(state, field, answer) {
    if (field === "topic") {
        if (typeof answer !== "string" || !answer.trim()) {
            throw new Error("Topic must be a non-empty string.");
        }

        return {
            ...state,
            topic: answer.trim()
        };
    }

    if (field === "level") {
        const validLevels = [
            "Beginner",
            "Intermediate",
            "Advanced"
        ];

        if (!validLevels.includes(answer)) {
            throw new Error("Invalid level selected.");
        }

        return {
            ...state,
            level: answer
        };
    }

    throw new Error("Invalid planning field.");
}


function validatePlanningInfo(info) {
    if (!info || typeof info !== "object" || Array.isArray(info)) {
        throw new Error("Invalid planning information.");
    }

    const validLevels = [
        "Beginner",
        "Intermediate",
        "Advanced"
    ];

    if (
        info.level != null &&
        !validLevels.includes(info.level)
    ) {
        throw new Error("Invalid level in extracted information.");
    }

    const scalarFields = [
        "topic",
        "deadline",
        "weeklyTimeAvailability"
    ];

    for (const field of scalarFields) {
        if (
            info[field] != null &&
            (typeof info[field] !== "string" || !info[field].trim())
        ) {
            throw new Error(`Invalid value for ${field}.`);
        }
    }

    const arrayFields = ["priorKnowledge", "goals"];

    for (const field of arrayFields) {
        if (
            info[field] != null &&
            (
                !Array.isArray(info[field]) ||
                !info[field].every(
                    item => typeof item === "string" && item.trim()
                )
            )
        ) {
            throw new Error(`Invalid value for ${field}.`);
        }
    }

    return info;
}



function mergePlanningInfo(state, extractedInfo) {
    validatePlanningInfo(extractedInfo);

    const updatedState = { ...state };

    const scalarFields = [
        "topic",
        "level",
        "deadline",
        "weeklyTimeAvailability"
    ];

    for (const field of scalarFields) {
        if (extractedInfo[field] != null) {
            updatedState[field] = extractedInfo[field];
        }
    }

    const arrayFields = ["priorKnowledge", "goals"];

    for (const field of arrayFields) {
        if (Array.isArray(extractedInfo[field])) {
            updatedState[field] = [
                ...new Set([
                    ...state[field],
                    ...extractedInfo[field]
                ])
            ];
        }
    }

    return updatedState;
}


module.exports = {
    createPlanningState,
    getMissingFields,
    getNextQuestion,
    submitAnswer,
    mergePlanningInfo,
    validatePlanningInfo
};