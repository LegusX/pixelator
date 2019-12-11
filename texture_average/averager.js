var pix = require("image-pixels")
var fs = require("fs")

var fileInfo = {}
let files = fs.readdirSync("../mc_textures")
let i = 0
for (let i in files) {
    pix("../mc_textures/"+files[i]).then(({data, width, height})=>{

        let preRed = 0 //total of all red values
        for (let j = 0; j<data.length; j+=4) {
            preRed += data[j]
        }
        let endRed = Math.floor(preRed/(data.length/4))
        
        let preGreen = 0 //total of all green values
        for (let j = 1; j<data.length; j+=4) {
            preGreen += data[j]
        }
        let endGreen = Math.floor(preGreen/(data.length/4))

        let preBlue = 0 //total of all blue values
        for (let j = 2; j<data.length; j+=4) {
            preBlue += data[j]
        }
        let endBlue = Math.floor(preBlue/(data.length/4))

        fileInfo[files[i]] = [endRed, endGreen, endBlue, "rgba("+endRed+", "+endGreen+", "+endBlue+")", hex]
        fs.writeFileSync("./map.json", JSON.stringify(fileInfo, null, "\t"))
    })

}

