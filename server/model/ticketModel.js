import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter title"],
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "pending", "closed"],
    default: "active",
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  assignee : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  },
  notes: [
    {
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      note: {
        type: String,
      },
      attachments: [String],
      createdAt: { 
        type: Date,
        default: Date.now
       }
    },
  ],
  tags: { 
    type: String, 
    enum: ['Billing', 'Account', 'General', 'Technical']
},
});


const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
