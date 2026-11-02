const express = require("express");
const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");

const router = express.Router();
const reviewStatuses = ["Pending", "Reviewed"];

router.post("/", async (req, res, next) => {
  try {
    const { studentName, courseName, message, rating } = req.body;

    if (
      typeof studentName !== "string" ||
      !studentName.trim() ||
      typeof courseName !== "string" ||
      !courseName.trim() ||
      typeof message !== "string" ||
      !message.trim() ||
      rating === undefined ||
      rating === null ||
      rating === ""
    ) {
      return res.status(400).json({
        message: "studentName, courseName, message, and rating are required.",
      });
    }

    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "rating must be a number from 1 to 5." });
    }

    const feedback = await Feedback.create({
      studentName,
      courseName,
      message,
      rating: numericRating,
    });

    return res.status(201).json({ message: "Feedback submitted successfully.", feedback });
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1
    ) {
      return res.status(400).json({
        message: "page and limit must be positive integers.",
      });
    }

    const [feedback, totalRecords] = await Promise.all([
      Feedback.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Feedback.countDocuments(),
    ]);

    return res.status(200).json({
      feedback,
      currentPage: page,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reviewStatus } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid feedback ID." });
    }

    if (!reviewStatuses.includes(reviewStatus)) {
      return res.status(400).json({
        message: `reviewStatus must be one of: ${reviewStatuses.join(", ")}.`,
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { reviewStatus },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: "Feedback record not found." });
    }

    return res.status(200).json({ message: "Feedback status updated successfully.", feedback });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
