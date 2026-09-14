const express  = require("express")
const notesModel = require("./model/notes.model")

const app = express()


app.use(express.json())

app.post("/api/notes", async (req, res) => {
    const { title, description } = req.body

    const notes = await notesModel.create({ title, description })

   res.status(201).json({ message: "Note created successfully", note: { title, description } }) 
})

app.get("/api/notes", async (req,res) => {
    const notes = await notesModel.find()
    res.status(200).json({ message: "Notes fetched successfully", notes })
})

app.delete("/api/notes/:id",async(req,res) => {
    const id = req.params({id})
     await notesModel.findByIdAndDelete(id)

     res.status(204).json({
        message:"delete success",
     }
    )
})

app.patch("/api/notes/:id",async(req,res) => {
     const description = req.body.description
    const id = req.params.id
     await notesModel.findByIdAndUpdate(id,{description},{new:true})

     res.status(200).json({
        message:"update successfully"
     })

})
module.exports = app