const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users");
const login = require("../middleware/login");

// Authenticate
router.post("/users/login", usersController.login);
// Register
router.post("/users/register", usersController.register);
// Verify Token
router.get("/users/token/verify/:token", usersController.tokenVerify);
// List all users
router.get("/users", login.required, usersController.getUsers);
// List specific user
router.get("/users/:id", login.required, usersController.getUser);
// Edit user
router.put("/users/edit/:id", login.required, usersController.editUser);
// Remove user
router.delete("/users/remove/:id", login.required, usersController.removeUser);
// Change User Type
router.put("/users/edit/type/:id", login.required, usersController.changeUserType);
// Change Password
router.put("/users/edit/password/:id", login.required, usersController.changePassword);

module.exports = router;
