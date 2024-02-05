const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort(
      "createdAt"
    );
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
  } catch (e) {
    throw new NotFoundError(e.message);
  }
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({
    createdBy: userId,
    _id: jobId,
  });
  if (!job) {
    throw new NotFoundError(`No job is id ${jobId} found`);
  }
  res.status(StatusCodes.OK).json(job);
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;
  if (!company || !position) {
    throw new NotFoundError("Please give details");
  }
  const job = await Job.findByIdAndUpdate(
    { createdBy: userId, _id: jobId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job is id ${jobId} found`);
  }
  res.status(StatusCodes.OK).json(job);
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const deletedJob = await Job.deleteOne({
    createdBy: userId,
    _id: jobId,
  });
  if (!deleteJob) {
    throw new NotFoundError("Didn't found particlar job for deletion");
  }
  res.status(StatusCodes.OK).send("Deleted Success");
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
