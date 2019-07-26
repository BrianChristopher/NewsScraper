console.log("Hey Brian, this script is running!");

$(document).on("click", ".favoriteButton", function() {
  event.preventDefault();
  let articleID = $(this).data("id");
  console.log(articleID);

  $.ajax({
    method: "POST",
    url: "/favorite/" + articleID,
    data: {
      favorite: "true"
    }
  });
});
