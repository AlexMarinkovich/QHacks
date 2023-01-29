var recording
navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(stream => {
    // get video from webcam
    const video = document.getElementById('webcam-video')
    video.srcObject = stream
    video.play() 
    recording = new MediaRecorder(stream)

    // when recording stops, gets recording data
    recording.ondataavailable = event => {sendToPython(event.data)}
    })
    .catch(error => {console.error(error)})


function startRecording(event) {
    document.getElementById("start-button").innerHTML = "Started!"
    event.preventDefault()
    recording.start()
    setTimeout(function() {stopRecording(event)}, 5000)
}

function stopRecording(event) {
    event.preventDefault(); 
    recording.stop()
}

// send video data to python server
function sendToPython(recordedBlob) {
    // get base64data from recordedBlob
    var reader = new FileReader()
    reader.readAsDataURL(recordedBlob)
    reader.onloadend = function() {
        const base64data = reader.result;
        fetch('http://127.0.0.1:5000/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({videodata: base64data})
        })}  
    }

setTimeout(function() {
    fetch('http://127.0.0.1:5000/p')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data == "") {return}
        else if (data == "-1") {document.getElementById("UnsucessfulText").style.display = "block"}
        else {document.getElementById("SucessfulText").style.display = "block"}
        })
    .catch(error => {console.error(error)})
    }, 1000);