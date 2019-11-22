window.onload = function() {
    setup()
}

//Initialize all html elements and just get the program ready in general
function setup() {
    document.getElementById("fileupload").addEventListener("change", function(e){
        let input = e.target
        //get uploaded file and assume it's the first file because only one file can be uploaded at a time anyways
        let inputImage = input.files[0]
        let filereader = new FileReader()
        filereader.onload = function(){
            let encode = filereader.result
            let image = document.createElement("image")
            image.src = encode
            image.id = "preview"
            document.body.appendChild(image)
        }
        filereader.readAsDataURL(inputImage)
        //Canvas used to be able to read each and every pixel in the image
        let transCanvas = document.createElement("canvas")
        transCanvas.id = "transCanvas"
        transCanvas.setAttribute("visibility", "collapse")
        transCanvas.height
        document.appendChild(transCanvas)
        let ctx = transCanvas.getContext("2d")
//         ctx.
    })
}