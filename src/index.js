window.onload = function(){setup()}

//object to store all color values
//values are stored in their rows, each array within "pixels" is a row, which in turn contains the individual arrays for each pixels' color data in standard rgb format
//NOTE: transparency will be ignored in all color calculations
var pixels = []

//object to store the completed lists of matched blocks
var finishedBlocks = []

//object that stores the calculated average colors of all blocks
var blockList = {}

//Init all html elements and just get the program ready in general
function setup() {
    document.getElementById("fileupload").addEventListener("change", function(e){
        // create canvas to read pixel data from
        let canvas = document.createElement("canvas")
        canvas.id = "pixelReader"
        document.body.appendChild(canvas)

        //get uploaded file and assume it's the first file because only one file can be uploaded at a time anyways
        let input = e.target
        let inputImage = input.files[0]
        let filereader = new FileReader()
        filereader.onload = function(){
            let encode = event.target.result
            let image = new Image()
            image.onload = function() {
                //make sure canvas is the right height
                let canvasReader = document.getElementById("pixelReader")
                canvasReader.width = image.width
                canvasReader.height = image.height

                //draw image to canvas so that we can read pixel data
                let ctx = canvasReader.getContext("2d")
                ctx.drawImage(image, 0, 0)

                // now that the image is uploaded, make sure that the user really does want to convert this one
                // (confirmation buttons will handle the continuation of this process)
                document.getElementById("confirmcontainer").style.setProperty("visibility", "visible")
            }
            image.src = event.target.result
            // image.id = "preview"
            // document.body.appendChild(image)
        }
        filereader.readAsDataURL(inputImage)
    })

    // setup confirmation dialog stuff
    // confirm button setup
    // (okay yes I know that the id calls it continue and the var calls it confirm but I really don't care enough to change it, so leave me alone)
    let confirm = document.getElementById("continuebutton")
    confirm.addEventListener("click", function() {
        document.getElementById("confirmcontainer").style.setProperty("visibility", "hidden")
        readImage();
    })

    // cancel button setup
    let cancel = document.getElementById("cancelbutton")
    cancel.addEventListener("click", function() {
        document.getElementById("confirmcontainer").style.setProperty("visibility", "hidden")
        document.getElementById("fileupload").value = null;
        document.getElementById("pixelReader").remove();
    })

    //get map.json and convert it to an object
    fetch("./texture_average/map.json").then(response => response.json()).then((data) => {
        blockList = data
    })
}

function readImage() {
    let canvas = document.getElementById("pixelReader")
    let ctx = canvas.getContext("2d")

    // begin scanning through each and every pixel
    let x = 0;
    let y = 0;

    for (let i = 0; i<canvas.width*canvas.height; i++ ) {
        //check to see if a new array within pixels/finishedBlocks needs to be created for the new row
        if (x === 0) {
            pixels[y] = [];
            finishedBlocks[y] = []
        }
        let pixel = ctx.getImageData(x,y,1,1);
        let data = pixel.data;
        
        // manually creating the array so as to avoid unnessecary info from the original pixel.data
        pixels[y][x] = [
            data[0],
            data[1],
            data[2]
        ]
        
        //increment x position, and move to next row as needed
        x++
        if (x>canvas.width) {
            x = 0;
            y++
        }
    }
    convertImage()
}

function convertImage() {
    //lots and lots of loops that'll probably end up crashing your computer :D
    let canvas = document.getElementById("pixelReader")
    for (let y in pixels) {
        for (let x in pixels[y]) {
            let limits = [5, 5, 5] //how far off we will initially allow the colors to be
            let pixel = pixels[y][x]
            let pixDec = parseInt(pixel[0].toString(16)+pixel[1].toString(16)+pixel[2].toString(16), 16)
            
            // cycle through the blocks until we find the closest one
            // while (true) {
            //     let potential = [] // list of potential blocks that will gradually be narrowed down

            //     //filter through to check for red matches
            //     for (let i in Object.getOwnPropertyNames(blockList)) {
            //         let block = blockList[Object.getOwnPropertyNames(blockList)[i]]
            //         if (Math.abs(block[0]-pixel[0]) <= limits[0])
            //          potential.push(Object.getOwnPropertyNames(blockList)[i])
            //     }
            //     if (potential.length < 1) {
            //         limits[0]+=5
            //         continue;
            //     }

            //     //filter through to check for green matches
            //     for (let i in potential) {
            //         let block = blockList[potential[i]]
            //         if (!(block[1]+limits[1] >= pixel[1] && block[1]-limits[1] <= pixel[1])) {
            //             potential.splice(i,1) //remove if it doesn't meet the requirements
            //         } 
            //     }
            //     if (potential.length < 1) {
            //         if (limits[0] > limits[1]) limits[1]+=5
            //         else limits[0]+=5
            //         continue;
            //     }

            //     //filter through to check for blue matches
            //     for (let i in potential) {
            //         let block = blockList[potential[i]]
            //         if (!(block[2]+limits[2] >= pixel[2] && block[2]-limits[2] <= pixel[2])) {
            //             potential.splice(i,1) //remove if it doesn't meet the requirements
            //         } 
            //     }
            //     if (potential.length < 1) {
            //         if (limits[1] > limits[2]) limits[2]+=5
            //         else limits[1]+=5
            //         continue;
            //     }

            //     //by this point, at least one potential block should remain, but still need to check if there is more than one block that meets the limit criteria
            //     if (potential.length === 1) {
            //         finishedBlocks[y][x] = potential[0];
            //         //reset limits for next pixel
            //         limits = [5,5,5]
            //         break;
            //     }
            //     else {
            //         //Do some simple subtraction to see which block has the least total difference with the pixel in question.
            //         let leastDifference = []
            //         for (let i in potential) {
            //             let block = blockList[potential[i]]

            //             let redDiff = Math.abs(block[0]-pixel[0])
            //             let greenDiff = Math.abs(block[1]-pixel[1])
            //             let blueDiff = Math.abs(block[2]-pixel[2])

            //             leastDifference[i] = redDiff+greenDiff+blueDiff
            //             leastDifference[i]+= potential[i]
            //         }

            //         //sort leastDifference to see which one is the least:
            //         leastDifference.sort(function(a,b){
            //             //weird jankiness here because I chose to do so
            //             return Number(a.match(/[0-9]*/g))-Number(b.match(/[0-9]*/g))
            //         })
            //         finishedBlocks[y][x] = leastDifference[0].match(/[a-zA-Z]*\.[a-zA-Z]*/g)
            //         //reset limits for next pixel
            //         limits = [5,5,5]
            //         break;
            //     }
            // }

            //new looping thing
            let limit = 1000
            let potential = ""
            for (let i in Object.getOwnPropertyNames(blockList)) {
                let block = blockList[Object.getOwnPropertyNames(blockList)[i]]
                if (Math.sqrt(Math.pow(pixel[0]-block[0],2) + Math.pow(pixel[1]-block[1],2) + Math.pow(pixel[2]-block[2],2)) < limit) {
                    finishedBlocks[y][x] = Object.getOwnPropertyNames(blockList)[i]
                    limit = Math.sqrt(Math.pow(pixel[0]-block[0],2) + Math.pow(pixel[1]-block[1],2) + Math.pow(pixel[2]-block[2],2))
                }
            }

            //increment x position, and move to next row as needed
            x++
            if (x>canvas.width) {
                x = 0;
                y++
            }
        }
    }
}