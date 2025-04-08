require("dotenv").config(); 

const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, 
    });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = { connectToDatabase };