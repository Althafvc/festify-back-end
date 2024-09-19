function otpGenerator() {
    // Generate a random number between 1000 and 9999
    const randomOTP = Math.floor(Math.random() * 9000) + 1000;
  
    return randomOTP;
  }
  
  exports.otp = otpGenerator();