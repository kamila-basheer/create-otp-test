const mongoose = require("mongoose");
mongoose.connect('mongodb://xyz123:fvyosiRBHs3PQDvg@ac-bz3ghis-shard-00-00.77f4z4w.mongodb.net:27017,ac-bz3ghis-shard-00-01.77f4z4w.mongodb.net:27017,ac-bz3ghis-shard-00-02.77f4z4w.mongodb.net:27017/OTP?ssl=true&replicaSet=atlas-xsylnh-shard-0&authSource=admin&retryWrites=true&w=majority',{useNewUrlParser:true, useUnifiedTopology: true});

// mongoose.connect('mongodb+srv://xyz123:fvyosiRBHs3PQDvg@cluster0.77f4z4w.mongodb.net/HallBookingPortal?retryWrites=true&w=majority',{useNewUrlParser:true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("connected to Mongodb");
});
const Schema = mongoose.Schema;

const otpSchema = new Schema({

    email: String,
    otp:String,
    createdAt:Date,
    expiresAt:Date
});

const otpData = mongoose.model('otpData',otpSchema)
module.exports= otpData;