var pix = require("image-pixels")
var fs = require("fs")

let files = fs.readdirSync("../mc_textures")
for (let i in files) {
    pix("../mc_textures/"+files[i]).then((data)=>{
        //get all red pixels and average
        for (let j = 0; i<data)
    })
}
