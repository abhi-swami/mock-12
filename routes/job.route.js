const express = require("express");
const job = express.Router();
const {jobModel} = require("../model/job.model.js");

job.get("/", async (req, res) => {
  const { filter, sort, search, page, limit } = req.query;

  const newPage = +page || 1;
  let newLimit = +limit || 10;
  const newSkip = (newPage - 1) * newLimit;
  const query = {};
  const sorting={};

  if (filter) {
    query.role = filter;
  }
  if(sort){
    if(sort==="asc"){
      sorting.postedAt=1
    }else if(sort==="desc"){
      sorting.postedAt=-1
    }
  }
  console.log(sort)
  if (search) {
    query.language = { $regex: search, $options: "i" };
  }

  try {
    const allJobs = await jobModel.find(query)
      .sort(sorting)
      .skip(newSkip)
      .limit(newLimit);
      const count = await jobModel.countDocuments(query);
    const totalJobs = allJobs.length;
    res.status(200).send({
      allJobs,
      currentPage: parseInt(newPage),
      totalPages: Math.ceil(count / newLimit),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

job.post("/", async (req, res) => {
  try {
    const job = new jobModel({...req.body});
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {job};
