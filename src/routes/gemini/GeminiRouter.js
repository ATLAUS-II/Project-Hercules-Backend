const express = require('express')
require('dotenv').config()
const { runGemini } = require('../../services/gemini/GeminiService')

const GeminiRouter = express.Router()
  
  GeminiRouter.get('/workout', async(req, res, next) => {
    try {
     // Get prompt from request body
     const { focus, level, type } = req.query

    const  focus_Areas = [ "upper", "lower", "full"]
    const levels = ["beginner", "intermediate", "advanced"]
    const types = ["strength", "body"]
 
     // Make sure query options exist and are a valid option
     if (!focus_Areas.includes(focus)) {
       return res.status(400).json({ message: "Invalid Focus Area" })
     }

     if (!levels.includes(level)) {
      return res.status(400).json({ message: "Invalid Level" })
    }

    if (!types.includes(type)) {
      return res.status(400).json({ message: "Invalid Type" })
    }
 
     // Generate workout response with prompt
     const geminiResponse = await runGemini(focus, level, type);

     // Parse the Gemini response as JSON
     const workout = JSON.parse(geminiResponse)
 
     // Send generated workout as JSON
     res.json({ workout })
 
    } catch (error)  {
      res.status(500).json({ message: `There was an Error generating workout: ${error}` })
    }
 })

module.exports = { GeminiRouter };