$(document).ready(function() {
  $("#inputName").submit((e) => {
    if ($("#name").val() == null) {
      alert("Please choose a name.")
      e.preventDefault()
    }
  })
})