const express = require('express')
require('dotenv').config()
const { runGemini } = require('../../services/gemini/GeminiService')

const GeminiRouter = express.Router()
  
  GeminiRouter.post('/', async(req, res, next) => {
    try {
     // Get prompt from request body
     const { prompt } = req.body
 
     // Make sure prompt exists
     if (!prompt) {
       return res.status(400).json({ message: "Missing prompt in request" })
     }
 
     // Generate workout response with prompt
     const geminiResponse = await runGemini(prompt);

     // Remove all escape characters from the Gemini Response
     const cleanedResponse = geminiResponse.replace(/\\n/g, "")

     // Parse the Cleaned workout as JSON
     const workout = JSON.parse(cleanedResponse)
 
     // Send generated workout as JSON
     res.json({ workout })
 
    } catch (error)  {
      console.error(error)
      res.status(500).json({ message: "There was an Error generating workout" })
    }
 })

module.exports = { GeminiRouter };