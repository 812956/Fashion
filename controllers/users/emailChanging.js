const nodemailer = require('nodemailer');
const asyncHandler = require("express-async-handler");
const {
  OK,
  CONFLICT,
  FORBIDDEN,
  NOT_FOUND,
} = require("../../utils/statuscodes");
const userCLTN = require('../../modles/users/usersModel')
const jwt = require('jsonwebtoken');

let otpStore = {};

exports.sendOtp = asyncHandler(async(req,res)=> {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    otpStore[email] = otp;

    // Send OTP via email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

 
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.json({ success: false });
        } else {
            return res.json({ success: true });
        }
    });
})


exports.verifyOtp = asyncHandler(async(req,res)=> {
    const { otp, email } = req.body;

    if (otpStore[email] && otpStore[email] == otp) {
        delete otpStore[email]; // Remove OTP after successful verification
        return res.json({ success: true });
    } else {
        return res.json({ success: false });
    }
})


exports.updateEmail = asyncHandler(async(req,res)=> {

    const { email } = req.body;
    const userId = jwt.decode(req.cookies.jwtToken).userId

    await userCLTN.findByIdAndUpdate(userId, {
        $set: { email: email }
    });
      
    return res.json({ success: true });

})







