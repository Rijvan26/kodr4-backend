const mongoose = require("mongoose")

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        trim:true,
        required:true,
    },
    description: {
        type: String,
        trim:true,
    }
})

const noteModel = mongoose.model("Note", notesSchema)

module.exports = noteModel