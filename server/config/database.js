import mongoose from "mongoose";

export const connectDB = async () => {
  // connect to mongodb database
  mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(() => {
    console.log("MongoDB database connected succesfully");
  });
};
