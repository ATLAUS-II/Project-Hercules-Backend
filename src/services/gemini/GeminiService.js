require('dotenv').config()
const { GoogleGenerativeAI, FunctionDeclarationSchemaType } = require('@google/generative-ai')

// Access the GEMINI API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


async function runGemini(focus_area, type, level) {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json"}
    })

    const prompt = `Please Generate a ${focus_area}, ${type} workout that for a ${level}. Please do not include any extra text or important notes. Do not put the JSON in a block quore. The workout should be in the following JSON format: 
      {
        focus_area: ${focus_area},
        type: ${type},
        level: ${level},
        exercises: [
          {
            name: {"type": "string"}
            reps: {"type": "integer"}
            sets: {"type" : "integer"}
          }
        ]
      }
    `
  
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return text
  }

module.exports = { runGemini }