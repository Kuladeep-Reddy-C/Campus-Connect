import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express'
import connectDB from './dbconfig.js'


//router imports
import departmentRouter from "./ResourceModule/Routes/dep.router.js";
import userRouter from "./ResourceModule/Routes/webHandler.route.js";
import subjectRouter from "./ResourceModule/Routes/subject.router.js";
import resNodeRouter from "./ResourceModule/Routes/resNode.router.js";
import resEdgeRouter from './ResourceModule/Routes/edge.router.js';
import userInfoRouter from "./ResourceModule/Routes/user.router.js";

// Collaborator Routes Imports
import projectRoutes from "./CollaboratorModule/routes/Project.routes.js"
import teamRoutes from "./CollaboratorModule/routes/Team.routes.js"

const app = express()
const PORT = process.env.PORT


//middleware
app.use(clerkMiddleware())
app.use(express.json())
app.use(cors());

//MONGODB 

connectDB();

// common temp route
app.use('/api/users', userRouter);
// routers for resource module
app.use('/res/dep/', departmentRouter);
app.use('/res/sub', subjectRouter);
app.use('/res/node', resNodeRouter);
app.use('/res/edge', resEdgeRouter);
app.use('/user-info/', userInfoRouter);
// routers for collaborator module
app.use("/api/projects", projectRoutes)
app.use("/api/join-forms", teamRoutes)

// start app
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})

