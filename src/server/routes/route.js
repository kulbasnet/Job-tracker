import {Router} from "express";
import {addJobs, getAllJobs, updateJobApp, deleteJob} from "../controller/tracker.js";
const app = Router();

app.get("/getJobs", getAllJobs);
app.post("/addjob", addJobs);
app.put("/updatedJob/:id", updateJobApp);
app.delete("/deleteJob/:id", deleteJob);



export default app; 