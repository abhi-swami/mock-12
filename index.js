const express=require('express');
const server=require("./server.js");


require("dotenv").config();
const cors = require('cors');
const { job } = require('./routes/job.route.js');



const app=express();

app.use(cors())
app.use(express.json());

app.use("/job",job)





app.listen(process.env.PORT_NUMBER,server)
