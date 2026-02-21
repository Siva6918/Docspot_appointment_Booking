const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// =========================
// Middlewares
// =========================
app.use(express.json());

// Dynamic CORS (Production Safe for Vercel + Localhost)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / server-to-server

      // Allow localhost
      if (origin === "http://localhost:5173") {
        return callback(null, true);
      }

      // Allow ANY Vercel deployment (preview + production)
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use('/uploads', express.static('uploads'));

// =========================
// Routes
// =========================
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/appointment', require('./routes/appointmentRoutes'));

// =========================
// Error Handler
// =========================
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    return res.status(400).send({
      success: false,
      message: `Upload Error: ${err.message}`,
    });
  }

  res.status(500).send({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
