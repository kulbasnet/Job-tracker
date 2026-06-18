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