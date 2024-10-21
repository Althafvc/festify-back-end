const mongoose = require('mongoose')

const programDataSchema = new mongoose.Schema({

    programName:{type:String, required:true},
    programType:{type:String, required:true},
    numberofClasses:{type:Number, required:true},
    numberofStudents:{type:Number, required:true},
    numberofSections:{type:Number, required:true},
    numberofVenues:{type:Array, required:true},
    controllers:[]

},{
    timestamps:true
})

const programDatamodel = mongoose.model('Programdatas',programDataSchema) 

module.exports = programDatamodel