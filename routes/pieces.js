const express = require("express");
const router = express.Router();

const piecesController = require("../controllers/pieces");
const login = require("../middleware/login");

// List all pieces
router.get("/pieces", piecesController.getPieces);
// List specific piece by id
router.get("/pieces/:id", piecesController.getPieceById);
// List specific piece by name
router.get("/pieces/:name", piecesController.getPiecesByName);
// List specific piece by category
router.get("/pieces/:category", piecesController.getPiecesByCategory);
// List specific piece by collection
router.get("/pieces/:collection", piecesController.getPiecesByCollection);
// Add pieces
router.post("/pieces/add", login.required, piecesController.addPieces);
// Remove pieces
router.delete("/pieces/remove/:id", login.required, piecesController.removePiece);

module.exports = router;
