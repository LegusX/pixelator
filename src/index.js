window.onload = function() {
    setup()
}

//Initialize all html elements and just get the program ready in general
function setup() {
    document.getElementById("fileupload").addEventListener("change", function(e){
        let input = e.target
        //get uploaded file and assume it's the first file because only one file can be uploaded at a time anyways
        let file = input.files[0]
        let filereader = new FileReader()
        filereader.readAsDataURL(file)
        filereader.onloadend(function(){
            let encode = filereader.result
            let image = document.createElement("image")
            image.src = encode
            image.id = "preview"
            document.appendChild(image)
        })
        //Canvas used to get the image file in a more js accessible format
        let transCanvas = document.createElement("canvas")
        transCanvas.id = "transCanvas"
        transCanvas.setAttribute("visibility", "collapse")
        transCanvas.height
        document.appendChild(transCanvas)
        let ctx = transCanvas.getContext("2d")
        ctx.
    })
}