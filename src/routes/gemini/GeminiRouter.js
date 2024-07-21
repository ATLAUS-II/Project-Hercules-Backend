const express = require('express')
require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')

const router = express.Router()

// Access the GEMINI API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// runGemini calls
async function runGemini(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"})

  
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return text
  }
  


module.exports = router;