import mongoose from "mongoose"
import env from "dotenv"
env.config()

const connectDB = async () => {
  if(!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables")
    process.exit(1)
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    
    console.log(`📊 MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

export default connectDB
