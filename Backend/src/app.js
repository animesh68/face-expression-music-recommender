const express = require("express");
const notesroutes=require("./routes/notes.routes")
const cors = require("cors")
const app = express();

app.use(cors())
app.use(express.json())
app.use("/",notesroutes)


module.exports = app;