const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const port = process.env.port || 3000



const commonRouter = require('./Router/commonRouter')

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.use('/',commonRouter)



mongoose.connect('mongodb://localhost:27017/festify')
.then(()=> {
    app.listen(port, ()=> console.log(`server is running on localhost ${port}`))
}).catch((error)=> console.log(error, 'connection failed'))



