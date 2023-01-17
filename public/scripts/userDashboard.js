var socket = io.connect("https://WingSpeak.zhuasmcs.repl.co")

$(document).ready(function() {
  $(".communication").click(function() {
    // send data
    var data = {
      name: $("#name").val(),
      message: $(this).val()
    }
    socket.emit("send", data)

    // play audio
    var audio = new Audio("audio/" + $(this).val() + ".mp3")
    audio.play()
    
    // lock buttons and display message sent notif
    $(".notif").show(400).delay(1500).hide(400)
    $(".communication").prop("disabled", true)
    setTimeout(function(){
        $(".communication").prop("disabled", false)
    }, 1900)
  })
})