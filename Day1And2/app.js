const express = require("express")

const app = express()

const notes = []
app.use(express.json())
app.get('/', (req,res) => {
    res.send("hello bhia")
    
})


app.post('/notes', (req,res) => {
    console.log(req.body);
    notes.push(req.body)
    res.send("note created")
    
})

app.get("/notes",(req,res) => {
    res.send(notes)
})

app.delete("/notes/:index",(req,res) => {
    delete notes[req.params.index]
    res.send("note deleted successfully")
})

app.patch("/notes/:index",(req,res) => {
    notes[req.params.index].name = req.body.name
    res.send("updated successfully")
})
app.listen(3000, () => {
    console.log("server run on port 3000");
})
