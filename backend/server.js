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


// start app
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})



// // Use requireAuth() to protect this route
// // If user isn't authenticated, requireAuth() will redirect back to the homepage
// app.get('/protected', requireAuth(), async (req, res) => {
//     // Use `getAuth()` to get the user's `userId`
//     const { userId } = getAuth(req)

//     // Use Clerk's JavaScript Backend SDK to get the user's User object
//     const user = await clerkClient.users.getUser(userId)

//     return res.json({ user })
// })

// Start the server and listen on the specified port