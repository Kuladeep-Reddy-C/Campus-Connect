// backend/server.js
import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express'
import connectDB from './dbconfig.js'

 console.log("Backend loaded API_KEY:", process.env.API_KEY); 
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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NEW EVENTS MODULE IMPORTS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
import eventRoutes from "./EventsModule/Routes/eventRoutes.js";
import registrationRoutes from "./EventsModule/Routes/registrationRoutes.js";
import { verifyApiKey } from "./EventsModule/Middleware/authMiddleware.js"; // Your custom API key middleware
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END NEW IMPORTS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const app = express()
const PORT = process.env.PORT


//middleware
// Clerk authentication applied globally
app.use(cors());
app.use(express.json())

app.use(clerkMiddleware()) 
//MONGODB
connectDB();

// Add this temporary test route:
app.get('/test-clerk', (req, res) => {
  const { auth } = req;
  const { userId, sessionId } = auth();
  if (userId) {
    res.json({ message: 'Clerk auth successful!', userId, sessionId });
  } else {
    res.status(401).json({ message: 'Clerk auth failed, userId not found.' });
  }
});

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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NEW EVENTS MODULE ROUTES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// Apply your custom API key verification to the event and registration routes
app.use('/api/events', eventRoutes);
app.use('/api/register', registrationRoutes);
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END NEW ROUTES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


// Start app
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})
