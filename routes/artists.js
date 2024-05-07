const express = require("express");
const router = express.Router();

const artistController = require("../controllers/artists");
const login = require("../middleware/login");

// List all artists
router.get("/artists", artistController.getArtists);
// List specific artist
router.get("/artists/:id", artistController.getArtist);
// Add artist
router.post("/artists/add", login.required, artistController.addArtist);
// Edit artist
router.put("/artists/edit/:id", login.required, artistController.editArtist);
// Remove artist
router.delete("/artists/remove/:id", login.required, artistController.removeArtist);

module.exports = router;
