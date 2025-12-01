// SDK initialization

var ImageKit = require("imagekit");
var mongoose = require("mongoose")
var imagekit = new ImageKit({
    publicKey : "p",
    privateKey : "p",
    urlEndpoint : "h"
});

function uploadfile(file) {
    return new Promise((resolve, reject) => {
        imagekit.upload(
            {
                file: file.buffer,
                fileName: new mongoose.Types.ObjectId().toString()+ ".mp3",
                folder:"songs",
                fileType: "media" 
            },
            (error, result) => {
                if (error) {
                    console.log("ImageKit Error:", error);  // ⬅ REAL ERROR
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
}
module.exports = uploadfile;