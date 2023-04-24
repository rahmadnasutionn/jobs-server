const { NotFoundError, BadRequestError } = require('../errors');
const Job = require('../models/Job');

const { StatusCodes } = require('http-status-codes');

const createJobs = async(req, res) => {
    req.body.createdBy = req.user.userId;
    const jobs = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({
        jobs,
    });
};

const getAllJobs = async(req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId })
        .sort('createdAt');
    res.status(StatusCodes.OK).json({
        jobs,
        count: jobs.length,
    });
};

const getJob = async(req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;

    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId,
    });

    if (!job) {
        throw new NotFoundError(`No job with id: ${id}`);
    }
    res.status(StatusCodes.OK).json({
        job,
        message: 'success',
    });
};

const updateJob = async(req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
    } = req;

    const { company, position } = req.body;

    if (!company || !position) {
        throw new BadRequestError('Company or Position cannot be empty');
    }

    const job = await Job.findByIdAndUpdate({ _id: jobId, createdBy: userId }, { company, position }, { new: true, runValidators: true }, );

    res.status(StatusCodes.OK).json({
        job,
    });

}

const deleteJob = async(req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
    } = req;

    const job = await Job.findByIdAndRemove({ _id: jobId, createdBy: userId });

    if (!job) {
        throw new NotFoundError(`No job with id: ${id}`);
    }
    res.status(StatusCodes.OK).json({
        job,
        message: 'success'
    });
};

module.exports = {
    createJobs,
    getAllJobs,
    getJob,
    updateJob,
    deleteJob,
};