const express = require("express");
const router = express.Router();

const support_ticket_controller = require("../controllers/support_tickets");
const login = require("../middleware/login");

//List all support tickets
router.get("/supportTickets", login.required, support_ticket_controller.getSupportTickets);
//List specific support ticket
router.get("/supportTickets/:id", login.required, support_ticket_controller.getSupportTicket);
//Add support ticket
router.post("/supportTickets/add", login.required, support_ticket_controller.addSupportTicket);
//Edit support ticket
router.put('/supportTicket/edit/:id', login.required, support_ticket_controller.editSupportTicket);
//Assignment priority and Estimated deadline
router.put("/supportTicket/assignmentPriorityDeadline/:id", login.required, support_ticket_controller.assignmentPriorityEstimatedDeadline);
//Remove support ticket
router.delete("/support_tickets/remove/:id", login.required, support_ticket_controller.removeSupportTicket);
//Conclude support ticket
router.put("/support_ticket/conclude/:id", login.required, support_ticket_controller.concludeSupportTicket);
//Approve support ticket
router.put("/support_ticket/approve/:id", login.required, support_ticket_controller.approveSupportTicket);
//Send notifications
router.post('/supportTicket/sendNotifications/:id', login.required, support_ticket_controller.sendNotifications);
//Inform missing data
router.post('/supportTicket/informMissingData/:id', login.required, support_ticket_controller.informMissingData);

module.exports = router;
