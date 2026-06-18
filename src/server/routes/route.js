import {Router} from "express";
import {addJobs, getAllJobs} from "../controller/tracker.js";
const app = Router();

app.get("/getJobs", getAllJobs);
app.post("/addjob", addJobs);

export default app; 