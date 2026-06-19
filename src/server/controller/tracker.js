import application from "../models/application.js";
import {Op} from "sequelize";

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
        const job = await application.create({
            companyName,
            jobTitle,
            jobType,
            status,
            appliedDate,
            notes,
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

        const updatedData = {};
        if(companyName !== undefined){
            updatedData.companyName = companyName;
        }
        if(notes !== undefined){
            updatedData.notes = notes;
        }
        if(status !== undefined){
            updatedData.status = status;
        }
        if(jobType !== undefined){
            updatedData.jobType = jobType;
        }
        if(jobTitle !== undefined){
            updatedData.jobTitle = jobTitle;
        }
        if(appliedDate !== undefined){
            updatedData.appliedDate = appliedDate;
        }

        const updateJob = await application.update( updatedData, {
            where: { id }
        });

        res.status(200).json({
            message: "Job updated successfully",
            updateJob,
        });


    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });


    }
}


export const deleteJob = async (req, res) => {

    try {
        const { id } = req.params;
        const deleteJob = await application.destroy({
            where: { id }
        });

        res.status(200).json({
            message: "Job deleted successfully",
            deleteJob,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }

}

export const filterByStatus = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { status } = req.query;
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

        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });

    }
}


export const searchBy = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { companyName, jobTitle, jobType } = req.query;

        const search = {};
        if (companyName?.trim()) {
            search.companyName = {
                [Op.iLike]: `%${companyName.trim()}%`
            };
        }
        if (jobTitle?.trim()) {
            search.jobTitle = {
                [Op.iLike]: `%${jobTitle.trim()}%`
            };
        }
        if (jobType?.trim()) {
            search.jobType = {
                [Op.iLike]: `%${jobType.trim()}%`
            };
        }

        const { count, rows } = await application.findAll({
            where: {
                [Op.or]: search.length > 0 ? search : undefined

            },
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            message: "Search completed successfully",
            searchResults: rows,
            total: count.length,
            totalPages: Math.ceil(count.length / limit),
            currentPage: page,
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });

    }
}