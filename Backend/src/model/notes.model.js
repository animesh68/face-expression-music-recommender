const mongoose = require("mongoose")

const notesSchema = new mongoose.Schema({
    title:String,
    Discription:String,
    audio:String,
    mood:String
})

const notemodel = mongoose.model("notes",notesSchema)

module.exports=notemodel;