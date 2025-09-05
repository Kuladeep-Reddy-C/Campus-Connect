// ResourceModule/Routes/webHandler.route.js
import express from "express";
import { requireAuth, clerkClient } from "@clerk/express";

const router = express.Router();

router.get("/:userId", requireAuth(), async (req, res) => {
    try {
        console.log("Request received for userId:", req.params.userId);
        const { userId } = req.params;
        const user = await clerkClient.users.getUser(userId);
        // console.log("User fetched:", user);
        return res.json({ user });
    } catch (error) {
        console.error("Error while fetching user info:", error);
        return res.status(500).json({ message: error.message || "Failed to fetch user info" });
    }
});

export default router;