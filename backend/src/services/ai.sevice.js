

const { GoogleGenAI } = require("@google/genai");


const ai = new GoogleGenAI({});

async function genrateTags(title, description, promptText, category) {
    // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const contents = [
        { text: `Generate 5 short and relevent tags for this prompt : ${title}, ${description}, ${promptText}, ${category}` }
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
            systemInstruction: `
                You are an expert in keyword tagging.
                Generate only 5 comma-separated tags.
                tags should be lower case , one or two words each , no special symbols.
            `
        }
    });



    return response.text
}


module.exports = genrateTags
