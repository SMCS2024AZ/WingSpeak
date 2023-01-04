var socket = io.connect("https://WingSpeak.zhuasmcs.repl.co")

$(document).ready(function() {
  $(".communication").click(function() {
    var data = {
      name: $("#name").val(),
      message: $(this).val()
    }
    socket.emit("send", data)
  })
})