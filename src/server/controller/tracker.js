import application from "../models/application.js";

export const getAllJobs = async (req, res) => {
    try {
        const allJobs = await application.findAll();
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
        res.status(500).json({ message: "Server Error", error: error.message});
    }
};