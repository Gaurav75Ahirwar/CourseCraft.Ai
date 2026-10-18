
require("dotenv").config();

const { generateCourseOutline } = require("./services/geminiService");

async function testCourseGeneration() {
    const course = await generateCourseOutline(
        "JavaScript Programming",
        "Beginner",
        "4 weeks"
    );

    console.log(JSON.stringify(course, null, 2));
}

testCourseGeneration().catch((err) => {
    console.error("Course generation failed:", err.message);
});
