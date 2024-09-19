// Importing necessary modules
const bcrypt = require('bcrypt') // For hashing passwords securely
const admindataModel = require('../Models/adminDatas') // Admin data model from the database
const mailotp = require('../Middlewares/Mailotp') // Middleware for generating OTP (One Time Password)
const otpMailer = require('../Utilities/otpmailer') // Utility for sending OTP via email
let givenOTP = '' // Variable to store the generated OTP

// Exported function for admin signup
exports.adminSignup = async (req, res) => {

    // Extracting fields from the request body
    const { institutionname, institutiontype, email, password, confirmpassword, role, verified } = req.body

    // Regular expressions for email and password validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

    try {
        // Checking if an account with the given email already exists
        const existingEmail = await admindataModel.findOne({ email })

        // Validating input fields and sending appropriate responses if validation fails

        // Checking if any field is empty
        if (institutionname.trim() == '' || institutiontype.trim() == '' || email.trim() == '' || password.trim() == '' || confirmpassword.trim() == '') {
            return res.status(400).json({ success: false, message: 'All fields are mandatory' });
        }
        // Checking if the email is already registered
        else if (existingEmail) {
            return res.status(400).json({ success: false, message: 'Account already exists with this email address' });
        }
        // Validating institution name length
        else if (institutionname.length < 2) {
            return res.status(400).json({ success: false, message: 'Institution name should be more than two characters' });
        }
        // Validating institution type length
        else if (institutiontype.length < 2) {
            return res.status(400).json({ success: false, message: 'Institution type should be more than two characters' });
        }
        // Validating email format using regex
        else if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }
        // Validating password format using regex
        else if (!passwordRegex.test(password)) {
            return res.status(400).json({ success: false, message: 'Invalid password format' });
        }
        // Checking if password and confirm password match
        else if (password != confirmpassword) {
            return res.status(400).json({ success: false, message: 'Password and confirm password fields are not matching' });
        }
        // If all validations pass, proceed to create a new admin account
        else {
            // Generating salt for hashing the password
            const salting = await bcrypt.genSalt(10)
            // Hashing the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, salting);

            // Creating a new admin schema instance with hashed password
            const newShema = new admindataModel({
                institutionname,
                institutiontype,
                email,
                password: hashedPassword, // Storing hashed password
                role,
                verified
            })

            // Saving the new admin record to the database
            await newShema.save()

            // Generating and sending OTP to the admin's email
            givenOTP = mailotp.otp // Retrieve generated OTP from middleware
            otpMailer(givenOTP, email) // Send OTP to email using otpMailer utility

            // Sending success response
            return res.status(200).json({ success: true, message: 'Account created successfully' })
        }
    } catch (err) {
        // Handling any server-side errors
        return res.status(500).json({ message: 'server error' });
    }
}




exports.Otp = async (req,res)=> {
    
    const {otp, email, role} = req.body    

    const recievedOtp = otp.join('').trim();
    const actualOtp = givenOTP.toString().trim()

    try {

        if(role=='admin') {
            
            const admin = await admindataModel.findOne({email})

            if(!admin) {
                return res.status(401).json({ msg: 'User not found' });

            }else if (recievedOtp != actualOtp) {
                return res.status(400).json({ msg: 'Invalid OTP' });

            }else {

                try {
                    await admindataModel.updateOne({email}, {$set: {verified:true}})

                    return res.status(200).json({ msg: 'OTP verified successfully' });

                }catch(err) {
                    
                    return res.status(500).json({ msg: 'Server error' });

                }
            }
            

        }

    }catch(err) {
        return res.status(500).json({msg:'server error'})
    }
    
}