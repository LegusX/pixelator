window.onload = function() {
    setup()
}

//Initi all html elements and just get the program ready in general
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

                confirm();
            }
            image.src = event.target.result
            // image.id = "preview"
            // document.body.appendChild(image)
        }
        filereader.readAsDataURL(inputImage)

    })
}

function confirm() {
    // now that the image is uploaded, make sure that the user really does want to convert this one
}