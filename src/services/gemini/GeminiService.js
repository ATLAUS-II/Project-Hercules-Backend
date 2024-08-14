require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')

// Access the GEMINI API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function runGemini(focus_area, type, level) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  })

  const prompt = `Please Generate a ${focus_area}, ${type} workout that for a ${level}. Please do not include any extra text or important notes. Do not put the JSON in a block quotes. The workout should follow this JSON schema: 
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
  const response = result.response
  const text = response.text()

  console.log(text)

  return text
}

module.exports = { runGemini }
