import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: ObjectId,
      ref: "User",
    },
    recipient: {
      type: ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },    
    dateRead:{
      type: Date,
      default: null
    },
    messageSent:{
      type: Date,
      default: Date.now()
    },
    files: [],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Message', messageSchema);