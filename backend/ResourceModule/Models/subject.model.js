// import mongoose from 'mongoose';

// const subjectSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     nodes: [],
//     edges: []
// }, { timestamps: true });

// const Subject = mongoose.model('Subject', subjectSchema);
// export default Subject;


import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        text: { type: String, required: true },
    },
    { timestamps: true } // adds createdAt, updatedAt for each comment
);

const subjectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },

        creatorId: { type: String, required: true },

        tags: [{ type: String }],

        // engagement
        stars: [{ type: String }], // array of users who starred
        views: { type: Number, default: 0 },

        comments: [commentSchema],

        // roadmap data
        nodes: [],
        edges: [],
    },
    { timestamps: true } // adds createdAt, updatedAt
);

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
