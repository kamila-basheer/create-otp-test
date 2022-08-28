const path=require('path');
const express = require("express");
const bcrypt = require('bcrypt');
const cors = require("cors");
const nodemailer = require("nodemailer");

const otpData = require("./src/models/otp");

const user = require('./src/models/user');

const PORT = process.env.PORT || 5000;

const app = new express;

require("dotenv").config();

app.use(express.static('./dist/frontend'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.listen(PORT , () => {
    console.log(`Listening on ${ PORT }`);
});

app.post('/api/sendOtp',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    let userData = req.body;
    let Email = userData.email;


    let transporter = nodemailer.createTransport({
        host:"smtp-mail.outlook.com",
        secureConnection:false,
        port:587,
        tls:{
            cphers:'SSLv3'
        },
        auth:{
            user:process.env.AUTH_EMAIL,
            pass:process.env.AUTH_PASS,
        },
    });


    transporter.verify((error,success)=>{
        if(error){
            console.log(error);
        } else {
            console.log("Ready for messages");
            console.log(success);
        }
    });


        try{
            const Otp = `${Math.floor(1000+ Math.random()*9000)}` ;
            
            const mailOptions= {
                from : process.env.AUTH_EMAIL,
                to : Email,
                subject : "Verify your email",
                html:`<p>Enter <b>${Otp}</b> in the app to verify your email address.</p><p>This code <b>expires in 1 hour</b>.</p>`,

            };

            // const saltRounds = 10;
            // const hashedOTP = bcrypt.hash(Otp,saltRounds);
            const newOTP = new otpData({
                email : Email,
                otp :Otp,
                createdAt:Date.now(),
                expiresAt:Date.now()+3600000, 
            });
             newOTP.save();

            transporter.sendMail(mailOptions);
            res.json({
                status:"PENDING",
                message:"Verification otp email sent",
                data:{
                    email,
                },
            });


        } catch(error){
            res.json({
                status:"FAILED",
                message:error.message,
            });

        
    
}

});

app.post('/api/checkOtp',function(req,res){
 
    let data = req.body;
    let Otp = data.otp;
    console.log(Otp);

    otpData.findOne({"otp":Otp})
    .then(function(result){
        if(result){
     res.status(200);
     res.send(result);
     console.log(result)
        }

        else {
            res.status(404).json({message:"Invalid OTP"});

        }
   })

})

app.get('/*',function(req,res){
    res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
});






