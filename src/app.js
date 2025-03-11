const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
require("dotenv").config();

const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
const scheduleDeliveryRouter = require("./routes/scheduleDelivery");
const mergeRouter = require("./routes/merge");
const viewCompanyRouter = require("./routes/viewCompany");

const app = express();
const port = process.env.PORT || 5000;
const isVercel = !!process.env.VERCEL; // Detect if running on Vercel

const allowedOrigins = ["http://localhost:5174", "https://farmxpress.vercel.app"];


app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,POST,PATCH,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setTimeout(5000, () => {
    console.error("Request Timed Out");
    res.status(504).json({ error: "Request Timed Out" });
  });
  next();
});


app.get("/", (req, res) => {
  res.send("All is Well!");
});


app.use("/", profileRouter);
app.use("/", authRouter);
app.use("/", scheduleDeliveryRouter);
app.use("/", viewCompanyRouter);
app.use("/", mergeRouter);

//Export for Vercel (Serverless Mode)
if (isVercel) {
  module.exports = async (req, res) => {
    try {
      if (mongoose.connection.readyState === 0) await connectDB();
      return app(req, res);
    } catch (err) {
      console.error("Vercel API Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
} else {
  // Local Mode
  connectDB()
    .then(() => {
      console.log("MongoDB Connected Successfully");
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    })
    .catch((err) => {
      console.error("Cannot connect to DB:", err);
      process.exit(1);
    });
}
