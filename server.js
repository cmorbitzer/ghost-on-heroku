var ghost = require("ghost");
var express = require("express");
var urlService = require("./node_modules/ghost/core/frontend/services/url");
var parentApp = express();

// Force www
parentApp.use(function (req, res, next) {
  if (!req.hostname.startsWith('www')) {
    res.redirect('https://www.' + req.hostname + req.url, 301);
  } else {
    next();
  }
});

// Run a single Ghost process
ghost()
  .then(function(ghostServer) {
    // for making subdir work
    parentApp.use(urlService.utils.getSubdir(), ghostServer.rootApp);
    ghostServer.start(parentApp);
  })
  .catch(error => {
    console.error(`Ghost server error: ${error.message} ${error.stack}`);
    process.exit(1);
  });