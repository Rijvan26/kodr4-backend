const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true, 
        trim:true
    },
    description: {
        type: String,
        required:true,
        trim:true
    }
})


const notesModel = mongoose.model("notes", noteSchema)

module.exports = notesModel