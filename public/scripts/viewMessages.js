var socket = io.connect("https://WingSpeak.zhuasmcs.repl.co")

function showEmpty() {
  if (!$.trim( $(".chat").html() ).length) {
    $(".chat").html("<div class=\"message\"><div class=\"empty\">No messages!</div></div>")
  }
}

$(document).ready(function() {
  showEmpty()

  socket.on("send", function(data) {
    $(".chat").empty()
    $(".chat").html(data)
    showEmpty()
  })

  $("body").on("click", ".resolve", function() {
    var data = $(this).val()
    socket.emit("resolve", data)
  })
})