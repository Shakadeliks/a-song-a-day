import mongoose from "mongoose";
const { Schema } = mongoose;

const SongSchema = new Schema(
    {
        songId: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Song", SongSchema);
