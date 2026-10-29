
const {
    createPlanningState,
    mergePlanningInfo,
    validatePlanningInfo
} = require("./services/planningService");

const initialState = createPlanningState();

// Simulate information extracted from the first message
const firstExtraction = {
    topic: "Machine Learning",
    level: "Beginner",
    priorKnowledge: ["Python"],
    goals: ["Build projects"],
    deadline: "six weeks",
    weeklyTimeAvailability: null
};

const stateAfterFirstMessage = mergePlanningInfo(
    initialState,
    firstExtraction
);

console.log(
    "After first message:",
    JSON.stringify(stateAfterFirstMessage, null, 2)
);

// Simulate a second message that adds information
const secondExtraction = {
    topic: null,
    level: null,
    priorKnowledge: ["Python", "Basic statistics"],
    goals: ["Build projects", "Understand model training"],
    deadline: null,
    weeklyTimeAvailability: "5 hours per week"
};

const stateAfterSecondMessage = mergePlanningInfo(
    stateAfterFirstMessage,
    secondExtraction
);

console.log(
    "After second message:",
    JSON.stringify(stateAfterSecondMessage, null, 2)
);

// Verify the original state wasn't mutated
console.log(
    "Original state unchanged:",
    initialState.topic === null
);


const validInfo = {
    topic: "Machine Learning",
    level: "Beginner",
    priorKnowledge: ["Python"],
    goals: ["Build projects"],
    deadline: "six weeks",
    weeklyTimeAvailability: null
};

try {
    validatePlanningInfo(validInfo);
    console.log("Valid information: passed");
} catch (error) {
    console.log("Unexpected error:", error.message);
}

try {
    validatePlanningInfo({
        ...validInfo,
        level: "Expert"
    });
} catch (error) {
    console.log("Invalid level:", error.message);
}

try {
    validatePlanningInfo({
        ...validInfo,
        priorKnowledge: "Python"
    });
} catch (error) {
    console.log("Invalid prior knowledge:", error.message);
}

