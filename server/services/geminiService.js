
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateCourseOutline(topic, level, duration) {
    const prompt = `
Create a course outline for the following:

Topic: ${topic}
Level: ${level}
Duration: ${duration}

Return a JSON object with this structure:
{
  "title": "Course title",
  "description": "Short course description",
  "modules": [
    {
      "title": "Module title",
      "lessons": [
        {
          "title": "Lesson title"
        }
      ]
    }
  ]
}

Generate 4 modules, each containing 3 lessons.
Return only valid JSON, without Markdown code fences.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    return JSON.parse(response.text);
}

module.exports = { generateCourseOutline };
