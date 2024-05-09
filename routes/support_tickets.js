const express = require("express");
const router = express.Router();

const support_ticket_controller = require("../controllers/support_tickets");
const login = require("../middleware/login");

// List all support tickets
router.get("/supportTickets", login.required, support_ticket_controller.getSupport_tickets);
// List specific support ticket
router.get("/supportTickets/:id", login.required, support_ticket_controller.getSupport_Ticket);
// Add support ticket
router.post("/supportTickets/add", login.required, support_ticket_controller.addSupport_Ticket);
//Inform priority
router.put("/supportTicket/informPriority/:id", login.required, support_ticket_controller.informPriority);
//Inform estimated deadline
router.put("/support-ticket/inform-estimated-deadline/:id", login.required, support_ticket_controller.informEstimatedDeadline);
// Remove support ticket
router.delete("/support_tickets/remove/:id", login.required, support_ticket_controller.removeSupport_Ticket);
//Conclude support ticket
router.put("/support_ticket/conclude/:id", login.required, support_ticket_controller.concludeSupportTicket);
//Approve support ticket
router.put("/support_ticket/approve/:id", login.required, support_ticket_controller.approveSupport_ticket);
//Report Missing Data
router.post("/support_ticket/reportMissingData/:id", login.required, support_ticket_controller.reportMissingData);

module.exports = router;
