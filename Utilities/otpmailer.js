const nodemailer = require('nodemailer')

const sendMail = (otp,email)=> {
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.myemail,
            pass: process.env.mypassword
        }
    })
    
    var mailOptions = {
        from: process.env.myemail,
        to: email,
        subject: 'Sending Email using Node.js',
        html:` <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Enlife</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 30px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333;
                        text-align: center;
                    }
                    p {
                        color: #666;
                        margin-bottom: 20px;
                    }
                    .otp {
                        font-size: 24px;
                        font-weight: bold;
                        color: #007bff;
                        text-align: center;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Welcome to Festify!</h1>
                    <p>Dear User,</p>
                    <p>We are delighted to welcome you to Festify, the next level event planning platform.</p>
                    <p>To complete your registration, please use the OTP provided below:</p>
                    <p class="otp">${otp}</p>
                    <p>If you have any questions or need assistance, feel free to contact us.</p>
                    <p>Best Regards,<br/>The Festify Team</p>
                </div>
            </body>
            </html>`
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
           
            
        } else {
            console.log('Email has sent:');
        }
    });
}

module.exports = sendMail