
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


async function extractPlanningInfo(message) {
  const prompt = `
Extract course-planning information from the user's message.

User message:
${message}

Return a JSON object with these fields:
{
    "topic": null,
    "level": null,
    "priorKnowledge": [],
    "goals": [],
    "deadline": null,
    "weeklyTimeAvailability": null
}

Rules:
- Extract only information explicitly stated or clearly implied.
- Use null for unknown topic, level, deadline, or weekly availability.
- Use an empty array when no prior knowledge or goals are mentioned.
- The level must be Beginner, Intermediate, or Advanced.
- Do not invent information.
- Return only valid JSON.
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


module.exports = {
  generateCourseOutline,
  extractPlanningInfo
};
