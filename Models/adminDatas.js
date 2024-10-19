const mongoose = require('mongoose')

const adminDataSchema = new mongoose.Schema({

    institutionname: {type:String, required:true},

    institutiontype: {type:String, required:true},

    email: {type:String, required:true, unique:true},

    password: {type:String, required:true},
    
    confirmpassword:{type:String},

    role: {type:String, required:true, default:'admin'},
    verified: {type:Boolean, default:false}

},{
    timestamps:true
})

const adminDatamodel = mongoose.model('Admindatas',adminDataSchema)

module.exports = adminDatamodel;