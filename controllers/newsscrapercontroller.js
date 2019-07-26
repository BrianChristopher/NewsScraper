const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../models");

// Routes

// A GET route for scraping NPR website

router.get("/", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.render("index", { hbsObjectMain: dbArticle.reverse() });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

  // var hbsObject = [{
  //   thiss : "This is this 1.",
  //   that : "This is that 1."
  //   },
  //   {
  //   thiss : "This is this 2.",
  //   that : "This is that 2."
  //   },
  //   {
  //   thiss : "This is this 3.",
  //   that : "This is that 3."
  //   }]
  //   console.log(hbsObject);
  //   res.render("index", {hbsObjectMain: hbsObject });
});


router.get("/favorites", function(req, res) {
  db.Article.find({$where:{favorite : true}})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.render("index", { hbsObjectMain: dbArticle.reverse() });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.npr.org/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    let $ = cheerio.load(response.data);

    // Now, we grab every story-text class within a div tag, and do the following:
    $("div.story-text").each(function(i, element) {
      // Save an empty result object
      let result = {};

      // Add the title, link, summary, and image of every story, and save them as properties of the result object
      result.title = $(element)
        .find("h3")
        .text();
      result.link = $(element)
        .children("a")
        .attr("href");
      result.summary = $(element)
        .find("p.teaser")
        .text();
      result.image = $(element)
        .parent()
        .find("img")
        .attr("src");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          //     console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    //res.send("Scrape Complete");

    //Then reload the index page with all articles.
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.render("index", { hbsObjectMain: dbArticle.reverse() });
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
});

// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for grabbing a specific Article by id, populate it with it's note
router.post("/favorite/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  console.log("req.params = ", req.params.id);
  console.log("req.data.favorite = ", req.data)
  db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: {favorite: true }});
});



// Export routes for server.js to use.
module.exports = router;
