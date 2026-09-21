const express = require("express")

const router = express.Router()
const notesModel = require("../models/notes.model")

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await notesModel.create({ username, password })
    res.status(201).json({ message: "User registered successfully", user })
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message })
  }
})



module.exports = router