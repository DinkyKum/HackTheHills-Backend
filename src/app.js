const express = require('express')
const app = express()

const cors=require('cors')
const connectDB=require("./config/database")
const profileRouter=require("./routes/profile");
const authRouter=require("./routes/auth");
const scheduleDeliveryRouter= require("./routes/scheduleDelivery");
const mergeRouter=require('./routes/merge');

const cookieParser=require('cookie-parser');
const viewCompanyRouter = require('./routes/viewCompany');
require('dotenv').config()
const port = process.env.PORT

const allowedOrigins = ["http://localhost:5174", "https://farmxpress.vercel.app"];

app.use(cors({
  origin: allowedOrigins,
  methods: "GET,POST,PATCH,PUT,DELETE,OPTIONS",
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('We Will Win!')
})


app.use(express.json());
app.use(cookieParser())

app.use('/', profileRouter);
app.use('/', authRouter);
app.use('/',scheduleDeliveryRouter);
app.use('/',viewCompanyRouter);
app.use('/',mergeRouter);

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};


if (require.main === module) {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }).catch((err) => {
    console.error("Cannot connect to DB: " + err);
  });
}