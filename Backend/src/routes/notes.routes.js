
const express = require("express")
const model =require("../model/notes.model")
// import connectToDb from "../db/db"; 
const router = express.Router();
const multer = require("multer");
const uploadfile = require("../service/storage.service")

const upload = multer({storage:multer.memoryStorage()})
router.post("/notes",upload.single("Audio"),async(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    const {title,dis,mood}=req.body
    const filee = await uploadfile(req.file)
    await model.create({
        title : title,
        Discription : dis,
        audio: filee.url,
        mood: mood
    })
    console.log(filee);
    res.status(201).json({
        msg:"note created",
        notes:req.body
    })
})

router.get("/songs",async(req,res)=>{
    const {mood}=req.query

    const songs=await model.find({
        mood:mood
    })
    res.status(200).json({
        msg:"Song featch",
        songs
    })
})

module.exports = router;