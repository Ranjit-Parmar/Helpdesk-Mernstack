import app from "./app.js";
import { connectDB } from "./config/database.js";

const port = process.env.PORT || 5000;

// Connect database
connectDB();

// Listening to server
const server = app.listen(port, () => {
  console.log("server is running on port ", port);
});

// Handle unhandledRejection Error
process.on("unhandledRejection", (err) => {
  console.log("server is shutting down due to unhandle rejection occur!");
  console.log({
    name: err.name,
    message: err.message,
  });

  server.close(() => {
    process.exit(1);
  });
});
