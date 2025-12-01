
const mongoose = require("mongoose")
function connectToDb (){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("DB CONNECT")
    })
    .catch((error)=>{
        console.error('ERROR',error)
    })
}

module.exports=connectToDb;