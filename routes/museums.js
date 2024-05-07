const express = require("express");
const router = express.Router();

const museumsController = require("../controllers/museums");
const login = require("../middleware/login");

// List all museums
router.get("/museums", museumsController.getMuseums);
// List specific museum by id
router.get("/museums/:id", museumsController.getMuseumById);
// List specific museum by id
router.get("/museums/name/:name", museumsController.getMuseumsByName);
// List specific museum by category
router.get("/museums/category/:category", museumsController.getMuseumsByCategory);
// Add museum
router.post("/museums/add", login.required, museumsController.addMuseum);
// Edit museum
router.put("/museums/edit/:id", login.required, museumsController.editMuseum);
// Remove museum
router.delete("/museums/remove/:id", login.required, museumsController.removeMuseum);
// Approve museum
router.put("/museums/approve/:id", login.required, museumsController.approveMuseum);

module.exports = router;
