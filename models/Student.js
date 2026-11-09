import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name দিন"], trim: true },
    email: {
      type: String,
      required: [true, "Email দিন"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "সঠিক Email দিন"],
    },
    phone: { type: String, required: [true, "Phone দিন"], trim: true },
    department: { type: String, required: [true, "Department দিন"], trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
