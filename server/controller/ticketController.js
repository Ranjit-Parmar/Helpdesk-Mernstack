import Ticket from "../model/ticketModel.js";
import { ApiFeatures } from "../utils/apiFeatures.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import CustomError from "../utils/customError.js";
import { fileUploader } from "../utils/fileUploader.js";
import fs from 'fs';

export const createTicket = asyncHandler(async (req, res, next) => {

  // take input from the frontend
  const { title, customerId, content, tags } = req.body;
  const attachments = req.file;

  let fileUrl;

  if(attachments && attachments?.path){

    // upload file in cloudinary
     fileUrl = await fileUploader(attachments);  

    //  remove uploaded file localy
  fs.unlink(`uploads/${attachments.filename}`, (err) => {
    if (err) {
      const error = new CustomError(err.message, 500);
      return next(error);
    }
    console.log("file removed successfully");
  });

  }
  
  const note = { author: customerId, note:content, attachments: fileUrl }; 

  const ticket = await Ticket.create({ title, customerId, notes:note, tags });

 const createdTicket =  await ticket.save();

  res.status(201).json({
    success: true,
    message: "Ticket created successfully",
    createdTicket
  });

});


// Get All Tickets 
export const getAllTickets = asyncHandler(async (req, res, next) => {

  // Set the default number of tickets per page
  const page = process.env.TICKETS_PER_PAGE || 10;

  // Get all tickets for dashboard
  const showAllTickets = await Ticket.find();

  // Find tickets based on given query
  const features = new ApiFeatures(Ticket.find(), req.query).filter().sort().pagination(page);

  const getTickets = await features.query.populate("customerId");

  // Get the count of tickets after applying the filters
  const countTickets = await Ticket.countDocuments({
    status: req.query.status || { $in: ['active', 'pending', 'closed'] },
    tags: req.query.tags || { $in: ['Technical', 'Billing', 'Account', 'General'] },
  });
  
  res.status(200).json({
    success: true,
    itemPerPage: page,
    totalDocuments: countTickets,
    length: getTickets.length, 
    allTickets: getTickets, 
    showAllTickets
  });
});



// Get Single Ticket 
export const getSingleTicket = asyncHandler(async (req, res, next) => {

  const { id } = req.params;

  const getTicketById = await Ticket.findById(id).populate("customerId assignee").populate({
    path: 'notes.author', 
    select: 'name role' 
  });;

  if (!getTicketById) {
    const err = new CustomError("Ticket not found", 404);
    return next(err);
  }
  res.status(200).json({
    sucess: true,
    ticket: getTicketById,
  });
})


// Get All Customer Ticket 
export const getAllCustomerTickets = asyncHandler(async (req, res, next) => {

  
    // Set the default number of tickets per page
  const page = process.env.TICKETS_PER_PAGE || 10; 
  const {id} = req.params;

  // Find tickets based on given query
  const features = new ApiFeatures(Ticket.find({"customerId":id}), req.query).filter().sort().pagination(page);

  const allCustomerTickets = await features.query.populate("customerId");

  // Get the count of tickets after applying the filters
  const countTickets = await Ticket.countDocuments({
    customerId: id,
    status: req.query.status || { $in: ['active', 'pending', 'closed'] },
    tags: req.query.tags || { $in: ['Technical', 'Billing', 'Account', 'General'] }, 
  });

 
  res.status(200).json({
    success: true,
    itemPerPage: page,
    totalDocuments: countTickets,
    length: allCustomerTickets.length, 
    allTickets: allCustomerTickets, 
  });
  

});

// Get All Agents or Admin Ticket 
export const getAllAgentTickets = asyncHandler(async (req, res, next) => {

  // Set the default number of tickets per page
  const page = process.env.TICKETS_PER_PAGE || 10; 
  const {id} = req.params;

  // Get all tickets for dashboard
  const showAllTickets = await Ticket.find({"assignee":id});

  // Find tickets based on given query

  const features = new ApiFeatures(Ticket.find({"assignee":id}), req.query).filter().sort().pagination(page);
  
  const allAgentTickets = await features.query.populate("assignee"); 

  // Get the count of tickets after applying the filters
  const countTickets = await Ticket.countDocuments({
    assignee: id,
    status: req.query.status || { $in: ['active', 'pending', 'closed'] },
    tags: req.query.tags || { $in: ['Technical', 'Billing', 'Account', 'General'] }, 
  });
 
     
     res.status(200).json({
       success: true,
       itemPerPage: page,
       totalDocuments: countTickets,
       length: allAgentTickets.length, 
       allTickets: allAgentTickets, 
       showAllTickets
     });
});



// Update Ticket Status
export const updateTicketStatus = asyncHandler(async (req, res, next) => {

  const { id } = req.params;  

  const { status } = req.body;
 
  await Ticket.findByIdAndUpdate(id, { status, lastUpdated: Date.now() }, { new: true });

  res.status(200).json({
    success: true,
    message: "Ticket status updated successfully",
  });

});

// Add Not To Ticket
export const addNoteToTicket = asyncHandler(async (req, res, next) => {

  const { content } = req.body;
  const attachments = req.file;
  const {id} = req.params;  
    
  let fileUrl;

  // upload file 
  if(attachments && attachments?.path){
     fileUrl = await fileUploader(attachments);  
  
    fs.unlink(`uploads/${attachments.filename}`, (err) => {
      if (err) {
        const error = new CustomError(err.message, 500);
        return next(error);
      }
      console.log("file removed successfully");
    });
  }
  

  const note = { author: req.user._id, note:content, attachments: fileUrl };  

const updatedTicket = await Ticket.findByIdAndUpdate(id, { $push: { notes: note }, lastUpdated: Date.now() }, { new: true });

// If no ticket found
  if (!updatedTicket) {

    const err = new CustomError("Ticket not found", 404);
    return next(err);
  
  }

  res.status(200).json({
    success : true,
    message : "Note has been added successfully"
  });

});


// Add assignee to tickets

export const addAssigneeToTicket = asyncHandler(async (req, res, next)=>{

  const {userId} = req.body;
  const {id} = req.params;  

  const assignTicket = await Ticket.findByIdAndUpdate(id, {assignee : userId}, {new:true}).populate('assignee');

  res.status(200).json({
    success : true,
    message : "Ticket has been assigned successfully",
    assignTicket
  })
})

// Delete Ticket

export const deleteTicket = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // find use with given ID
  const ticketExist = await Ticket.findById(id);

  if (!ticketExist) {
    const err = new CustomError("Ticket not found", 404);
    return next(err);
  }

  // deleting user
  await Ticket.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "ticket is deleted successfully",
  });
});