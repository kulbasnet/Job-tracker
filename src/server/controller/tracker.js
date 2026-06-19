import application from "../models/application.js";
import { Op } from "sequelize";

const VALID_JOB_TYPES = ["Full-time", "Part-time", "Internship"];
const VALID_STATUSES = ["Applied", "Interviewing", "Offered", "Rejected"];

const trim = (value) => (typeof value === "string" ? value.trim() : "");

export const getAllJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const allJobs = await application.findAll({
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        });
        res.status(200).json({
            message: "All Jobs fetched successfully",
            jobs: allJobs,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const addJobs = async (req, res) => {
    try {
        const { companyName, jobTitle, jobType, status, appliedDate, notes } = req.body;

        if (!companyName || !jobTitle || !jobType || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!VALID_JOB_TYPES.includes(jobType) || !VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Invalid job data" });
        }

        const job = await application.create({
            companyName: trim(companyName),
            jobTitle: trim(jobTitle),
            jobType,
            status,
            appliedDate: appliedDate || null,
            notes: notes || null,
        });

        res.status(201).json({
            message: "Job added successfully",
            job,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const updateJobApp = async (req, res) => {
    try {
        const { id } = req.params;
        const { companyName, notes, status, jobType, jobTitle, appliedDate } = req.body;

        if (jobType !== undefined && !VALID_JOB_TYPES.includes(jobType)) {
            return res.status(400).json({ message: "Invalid job type" });
        }
        if (status !== undefined && !VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const updatedData = {};
        if (companyName !== undefined) updatedData.companyName = trim(companyName);
        if (jobTitle !== undefined) updatedData.jobTitle = trim(jobTitle);
        if (jobType !== undefined) updatedData.jobType = jobType;
        if (status !== undefined) updatedData.status = status;
        if (appliedDate !== undefined) updatedData.appliedDate = appliedDate || null;
        if (notes !== undefined) updatedData.notes = notes || null;

        const [updateJob] = await application.update(updatedData, {
            where: { id }
        });

        if (updateJob === 0) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({
            message: "Job updated successfully",
            updateJob,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteJob = await application.destroy({
            where: { id }
        });

        if (deleteJob === 0) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({
            message: "Job deleted successfully",
            deleteJob,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const filterByStatus = async (req, res) => {
    try {
        const { status } = req.query;
        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { count, rows } = await application.findAll({
            where: { status },
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            message: "Jobs filtered by status successfully",
            filteredJobApp: rows,
            total: count.length,
            totalPages: Math.ceil(count.length / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const searchBy = async (req, res) => {
    try {
        const term = trim(req.query.term);
        const companyName = trim(req.query.companyName);
        const jobTitle = trim(req.query.jobTitle);
        const jobType = trim(req.query.jobType);

        if (jobType && !VALID_JOB_TYPES.includes(jobType)) {
            return res.status(400).json({ message: "Invalid job type" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = [];

        if (companyName) search.push({ companyName: { [Op.iLike]: `%${companyName}%` } });
        if (jobTitle) search.push({ jobTitle: { [Op.iLike]: `%${jobTitle}%` } });
        if (jobType) search.push({ jobType });
        if (term) {
            search.push(
                { companyName: { [Op.iLike]: `%${term}%` } },
                { jobTitle: { [Op.iLike]: `%${term}%` } },
                { notes: { [Op.iLike]: `%${term}%` } }
            );
        }

        const where = search.length > 0 ? { [Op.or]: search } : undefined;
        const { count, rows } = await application.findAndCountAll({
            where,
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            message: "Search completed successfully",
            searchResults: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};