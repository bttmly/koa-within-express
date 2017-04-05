const express = require("express")
const path = require("path")
const logger = require("morgan")

const app = express()
app.use(logger("dev"))

app.get("/express/hello", function(req, res) {
  res.json({ hello: "express" })
});

app.use(require("./koa"));

app.get("/express/hello_again", function(req, res) {
  res.json({ hello_again: "express" })
});

// Note that all 404s will say 'Express says' -- this indicates that even when
// the request passes through the Koa application, it does wind up here
app.use(function(req, res, next) {
  var err = new Error("Express says: Not Found!");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: `Express error handler: ${err.message}`,
    error: err,
  });
});

const port = process.env.PORT || 3000
// const server = app.listen(port, function() {
//   console.log("Express server listening on port",  port);
// });

module.exports = app;
