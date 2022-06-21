const Job = require('../models/Job')
const {BadRequestError,NotFoundError}= require('../errors')
const {StatusCodes} = require('http-status-codes')


const getAllJobs = async (req,res) => {
    const jobs = await Job.find({createdBy: req.user.userID}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs,count: jobs.length})
}
const getJob = async (req,res) => {
    const {id:jobID} = req.params
    const job = Job.findOne({_id: jobID, createdBy: req.user.userID})
    if(!job)
    {
        throw new NotFoundError('Job Not Found')
    }
    res.status(StatusCodes.OK).json({job})
}
const createJob = async (req,res) => {
    req.body.createdBy = req.user.userID
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}
const updateJob = async (req,res) => {
    const {id:jobID} = req.params
    const {company, position} = req.body
    if(!company || !position){
        throw new BadRequestError('Company or Position fields cannot be empty')
    }
     
    const job = await Job.findByIdAndUpdate({_id: jobID, createdBy: req.user.userID},req.body,{new:true,runValidators:true})
    if(!job)
    {
        throw new NotFoundError("Job doesn't exists")
    }

    res.status(StatusCodes.OK).json({job})


}
const deleteJob = async (req,res) => {
    const {id:jobID} = req.params
    const {company, position} = req.body
    const job = await Job.findOneAndRemove({
        _id:jobID,
        createdBy: req.user.userID
    })
    if(!job)
    {
        throw new NotFoundError("Job doesn't exists")
    }

    res.status(StatusCodes.OK).send();
}


module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}