require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')

// Access the GEMINI API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function runGemini(focus_area, type, level) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  })

  const prompt = `Please Generate a ${focus_area}, ${type} workout that for a ${level}. Please do not include any extra text or important notes. Do not put the JSON in a block quotes. For individual leg or arm exercises, there is no need to add "each leg" or "each arm" after the reps or sets as it is understood. The workout needs to strictly follow this JSON schema: 
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

  // TODO: Figure out how to ensure the response schema is followed.
  //console.log(text)

  return text
}

module.exports = { runGemini }
