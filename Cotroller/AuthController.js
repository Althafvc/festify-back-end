const bcrypt = require('bcrypt')
const admindataModel = require('../Models/adminDatas')
const mailotp = require('../Middlewares/Mailotp')
const otpMailer = require('../Utilities/otpmailer')
let givenOTP = ''

exports.adminSignup = async (req,res)=> {
        
    //Extracting fields from the request body
    const {institutionname, institutiontype, email, password, confirmpassword, role, verified} = req.body

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;


    try {

        const existingEmail = await admindataModel.findOne({email})
        
         // Checking if any field is empty
    if(institutionname.trim()=='' || institutiontype.trim()=='' || email.trim()=='' || password.trim()=='' || confirmpassword.trim()=='') {
        return res.status(400).json({ success: false, message: 'All fields are mandatory' });

    }else if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Account already exists with this email address' });


    }else if (institutionname.length<2) {
        return res.status(400).json({success:false, message: 'Institution name should be more than two characters'})

    }else if (institutiontype.length<2) {
        return res.status(400).json({success:false, message: 'Institution type should be more than two characters'})

    }else if (!emailRegex.test(email)) {
        return res.status(400).json({success:false, message: 'Invalid email format'})

    }else if (!passwordRegex.test(password)) {
        return res.status(400).json({success:false, message: 'Invalid password format'})

    }else if (password != confirmpassword) {
        return res.status(400).json({success:false, message: 'password and confirmpassword fields are not matching'})

    }else {
        const salting = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salting);

        const newShema = new admindataModel({
            institutionname, institutiontype, email, password:hashedPassword, role, verified
        })

        
        await newShema.save()
        givenOTP = mailotp.otp
        otpMailer(givenOTP, email)
        return res.status(200).json({success:true, message:'Account created successfully'})
    }

    }catch(err) {
        // If an error occurs, respond with a server error message
        return res.status(500).json({ message: 'server error' });
        
    }

   
    
}