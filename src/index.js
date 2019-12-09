window.onload = function() {
    setup()
}

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
}

function readImage() {
    let canvas = document.getElementById("pixelReader")
    let ctx = canvas.getContext("2d")

    //object to store all color values
    //values are stored in their rows, each array within "pixels" is a row, which in turn contains the individual arrays for each pixels' color data in standard rgb format
    //NOTE: transparency will be ignored in all color calculations
    var pixels = []

    // begin scanning through each and every pixel
    let x = 0;
    let y = 0;

    for (let i = 0; i<canvas.width*canvas.height; i++ ) {
        //check to see if a new array within pixels needs to be created for the new row
        if (x === 0) pixels[y] = [];
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
    console.log(pixels.slice(-1)[0])
}