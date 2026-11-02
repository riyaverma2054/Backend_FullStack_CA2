require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI is required.");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Student Feedback API is running on port ${port}.`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
