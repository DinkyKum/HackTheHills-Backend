const mongoose= require("mongoose");

const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://LAD_PROJECT:LAD%40123@ladproject.cfgyg.mongodb.net/")
}

module.exports=connectDB
