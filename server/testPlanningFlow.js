require("dotenv").config({
    path: require("path").join(__dirname, ".env")
});

const {
    createPlanningState,
    processPlanningMessage
} = require("./services/planningService");

async function testPlanningFlow() {
    // Simulate the state obtained after the first message
    let state = {
        ...createPlanningState(),
        topic: "machine learning",
        priorKnowledge: ["Python"]
    };

    const result = await processPlanningMessage(
        state,
        "I'm a complete beginner in machine learning. " +
        "I want to build practical projects and have six weeks."
    );

    console.log(
        "Updated planning state:",
        JSON.stringify(result.planningState, null, 2)
    );

    console.log("Next question:", result.nextQuestion);
}

testPlanningFlow().catch((error) => {
    console.error("Planning flow failed:", error.message);
});