import express from 'express';
import { addNoteToTicket, createTicket, getAllTickets, getSingleTicket, getAllCustomerTickets, updateTicketStatus, deleteTicket, addAssigneeToTicket, getAllAgentTickets } from '../controller/ticketController.js';
import { authenticateUser, authorization } from '../middleware/authentication.js';
import upload from '../middleware/multer.js';


const router = express.Router();


router.get("/getAllTickets", authenticateUser, authorization, getAllTickets);

router.get("/getAllCustomerTickets/:id", authenticateUser, getAllCustomerTickets);

router.get("/getAllAgentTickets/:id", authenticateUser, authorization, getAllAgentTickets);

router.get("/getSingleTicket/:id", authenticateUser, getSingleTicket);

router.post("/createTicket",authenticateUser, upload.single('attachments'), createTicket);

router.put("/updateTicket/:id/status",authenticateUser, authorization, updateTicketStatus);

router.put("/addAssignee/:id",authenticateUser, authorization, addAssigneeToTicket); 

router.post("/addNote/:id/note", authenticateUser, upload.single("attachments"), addNoteToTicket); 
router.delete("/deleteTicket/:id", authenticateUser, authorization, deleteTicket);


export default router;