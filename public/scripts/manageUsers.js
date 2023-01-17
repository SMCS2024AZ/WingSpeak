$(document).ready(function () {
  var userTable = $("#userTable").DataTable({
    info: false,
    lengthChange: false,
    ordering: false,
    pageLength: 5,
    scrollY: "200px",
    paging: false,
    initComplete: function() {
      var api = this.api();
      $("#userTable").show();
      api.columns.adjust();
    }
  });
  
  $(".dataTables_filter").css("display", "none");
  
  $("#searchbar").on("input", function() {
    userTable.column(0).search($("#searchbar").val()).draw();
  });

  $("body").on("click", ".del", function() {
    var check = confirm("Are you sure you would like to delete this user?")
    var currRow = $(this).closest("tr")
    if (check) {
      $.ajax({
        url: "/manageUsers/delete",
        type: "DELETE",
        data: JSON.stringify({
          id: $(this).closest("td").prevAll("input").val()
        }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(data) {
          userTable.row(currRow).remove().draw()
        }
      })
    }
  })
})