import {Router} from "express";
import {addJobs, getAllJobs, updateJobApp, deleteJob, filterByStatus , searchBy} from "../controller/tracker.js";
const app = Router();

app.get("/getJobs", getAllJobs);
app.post("/addjob", addJobs);
app.post("/addJob", addJobs);
app.put("/updatedJob/:id", updateJobApp);
app.delete("/deleteJob/:id", deleteJob);
app.get("/filterByStatus", filterByStatus);
app.get("/searchBy", searchBy);



export default app; 