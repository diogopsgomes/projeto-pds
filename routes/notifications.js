const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notifications");
const login = require("../middleware/login");

//List unread notifications
router.get('/notifications/unread', login.required,notificationController.getUnreadNotifications);
//List read notifications
router.get('/notifications/read', login.required,notificationController.getReadNotifications);
//List all notifications
router.get('/notifications', login.required,notificationController.getAllNotifications);
//Add notification
router.post('/notifications/add', login.required, notificationController.addNotifications);

module.exports = router;