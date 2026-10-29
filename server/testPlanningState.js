
const {
    createPlanningState,
    mergePlanningInfo
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
