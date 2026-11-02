const express = require("express");
const feedbackRoutes = require("./routes/feedback");

const app = express();

app.use(express.json());
app.use("/api/feedback", feedbackRoutes);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Request body must contain valid JSON." });
  }

  console.error(error);
  return res.status(500).json({ message: "An unexpected server error occurred." });
});

module.exports = app;
