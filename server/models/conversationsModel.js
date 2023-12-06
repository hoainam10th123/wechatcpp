import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const conversationSchema = mongoose.Schema(
    {
        users:[
            {
                type: ObjectId,
                ref: "User",
            }
        ],
        latestMessage: {
            type: ObjectId,
            ref: "Message",
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Conversation", conversationSchema);;