import mongoose, {Schema} from "mongoose";

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    photo: [
        {
            url: { type: String },  // URL of the image
            public_id: { type: String }  // Public ID (from a service like Cloudinary)
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})


export const Tweet = mongoose.model("Tweet", tweetSchema)