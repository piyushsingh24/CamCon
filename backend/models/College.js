import mongoose from "mongoose"

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
    type: {
      type: String,
      enum: ["Engineering", "Medical", "Arts", "Commerce", "Science", "Management", "Other"],
      required: true,
    },
    branches: [
      {
        type: String,
      },
    ],
    website: {
      type: String,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    logo: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("College", collegeSchema)
