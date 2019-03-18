 const express = require("express");
 const router = express.Router();

 const flairController = require("../controllers/flairController");

 router.get("/topics/create/flairs", flairController.index);
 router.get("/topics/create/flairs/new", flairController.new);
 router.post("/topics/create/flairs/create", flairController.create);

 module.exports = router;