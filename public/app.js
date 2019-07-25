// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (let i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#buildHere").append(`
      <h3>${data.title}</h3>
      <p>${data.summary}</p>
      <a href='${data.link}'>Link To Story</a>
      <img src='${data.image}'>
      <br>
      `)
    }
  });