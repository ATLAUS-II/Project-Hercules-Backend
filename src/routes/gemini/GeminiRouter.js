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
  
  router.post('/', async(req, res, next) => {
    try {
     // Get prompt from request body
     const { prompt } = req.body
 
     // Make sure prompt exists
     if (!prompt) {
       return res.status(400).json({ message: "Missing prompt in request" })
     }
 
     // Generate workout with prompt
     const workout = await runGemini(prompt);
 
     // Send generated workout as JSON
     res.json({ workout })
 
    } catch (error)  {
     res.status(500).json({ message: "Error generating workout" })
    }
 })

module.exports = router;