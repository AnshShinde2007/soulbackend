import express from "express";
import Razorpay from "razorpay";
import { db } from "../firebase.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// INIT BOOKING
router.post("/booking/init", async (req, res) => {
  try {
    const booking = req.body;

    if (!booking.user_id || !booking.therapist_id) {
      return res.status(400).json({ detail: "Missing user_id or therapist_id" });
    }

    const therapistDoc = await db
      .collection("therapists")
      .doc(booking.therapist_id)
      .get();

    if (!therapistDoc.exists) {
      return res.status(404).json({ detail: "Therapist not found" });
    }

    const amount = therapistDoc.data().session_price;
    if (!amount) {
      return res.status(400).json({ detail: "Therapist has no price configured" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `booking_${booking.user_id}`,
    });

    return res.json({
      order_id: order.id,
      amount,
      currency: "INR",
      booking_data: booking,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ detail: err.message });
  }
});

// GET ALL BOOKINGS
router.get("/bookings", async (req, res) => {
  try {
    const snapshot = await db.collection("bookings").get();
    const data = snapshot.docs.map(doc => doc.data());
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ detail: err.message });
  }
});

export default router;
