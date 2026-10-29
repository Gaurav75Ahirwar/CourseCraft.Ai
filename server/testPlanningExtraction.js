
require("dotenv").config();

const {
    extractPlanningInfo
} = require("./services/geminiService");

async function testExtraction() {
    const result = await extractPlanningInfo(
        "I want to learn machine learning. " +
        "I'm a beginner, I know Python, " +
        "I want to build projects, and I have six weeks."
    );

    console.log(
        "Extracted planning information:",
        JSON.stringify(result, null, 2)
    );
}

testExtraction().catch((error) => {
    console.error("Extraction failed:", error.message);
});
