import mongoose from "mongoose";
import dotenv from "dotenv";
import College from "./models/College.js";

dotenv.config();

const colleges = [
  {
    name: "IIT Delhi",
    location: { city: "New Delhi", state: "Delhi" },
    type: "Engineering",
    branches: ["Computer Science", "Electrical", "Mechanical", "Civil", "Chemical"],
    website: "https://home.iitd.ac.in/",
    description: "Indian Institute of Technology Delhi",
    logo: "",
  },
  {
    name: "IIT Bombay",
    location: { city: "Mumbai", state: "Maharashtra" },
    type: "Engineering",
    branches: ["Computer Science", "Electrical", "Mechanical", "Civil", "Chemical"],
    website: "https://www.iitb.ac.in/",
    description: "Indian Institute of Technology Bombay",
    logo: "",
  },
  {
    name: "IIT Madras",
    location: { city: "Chennai", state: "Tamil Nadu" },
    type: "Engineering",
    branches: ["Computer Science", "Electrical", "Mechanical", "Civil", "Chemical"],
    website: "https://www.iitm.ac.in/",
    description: "Indian Institute of Technology Madras",
    logo: "",
  },
  {
    name: "NIT Trichy",
    location: { city: "Tiruchirappalli", state: "Tamil Nadu" },
    type: "Engineering",
    branches: ["Computer Science", "Electrical", "Mechanical", "Civil", "Chemical"],
    website: "https://www.nitt.edu/",
    description: "National Institute of Technology Trichy",
    logo: "",
  },
  {
    name: "BITS Pilani",
    location: { city: "Pilani", state: "Rajasthan" },
    type: "Engineering",
    branches: ["Computer Science", "Electrical", "Mechanical", "Civil", "Chemical"],
    website: "https://www.bits-pilani.ac.in/",
    description: "Birla Institute of Technology and Science, Pilani",
    logo: "",
  },
  {
    name: "Delhi University",
    location: { city: "New Delhi", state: "Delhi" },
    type: "Arts",
    branches: ["Arts", "Commerce", "Science"],
    website: "https://www.du.ac.in/",
    description: "University of Delhi",
    logo: "",
  },
  {
    name: "VIT Vellore",
    location: { city: "Vellore", state: "Tamil Nadu" },
    type: "Engineering",
    branches: ["Computer Science", "Electrical", "Mechanical", "Civil", "Chemical"],
    website: "https://vit.ac.in/",
    description: "Vellore Institute of Technology",
    logo: "",
  },
  {
    name: "SRM Chennai",
    location: { city: "Chennai", state: "Tamil Nadu" },
    type: "Engineering",
    branches: ["Computer Science", "Electrical", "Mechanical", "Civil", "Chemical"],
    website: "https://www.srmist.edu.in/",
    description: "SRM Institute of Science and Technology",
    logo: "",
  },
  {
    name: "Jawaharlal Nehru University",
    location: { city: "New Delhi", state: "Delhi" },
    type: "Arts",
    branches: ["Arts", "Science"],
    website: "https://www.jnu.ac.in/",
    description: "Jawaharlal Nehru University",
    logo: "",
  },
  {
    name: "Banaras Hindu University",
    location: { city: "Varanasi", state: "Uttar Pradesh" },
    type: "Arts",
    branches: ["Arts", "Science", "Commerce"],
    website: "https://www.bhu.ac.in/",
    description: "Banaras Hindu University",
    logo: "",
  },
];

async function seedColleges() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/Camcon");
    await College.deleteMany({});
    await College.insertMany(colleges);
    console.log("✅ Colleges seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding colleges:", error);
    process.exit(1);
  }
}

seedColleges(); 