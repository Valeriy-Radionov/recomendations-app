import mongoose from "mongoose"
require("dotenv").config()

const MONGO_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : process.env.MONGO_LOCAL_URI
export const connectMongoDb = async () => {
  try {
    mongoose.set("strictQuery", false)
    MONGO_URI && (await mongoose.connect(MONGO_URI))
    console.log(`Success connected to MongoDB! \nPORT: ${MONGO_URI}`)
  } catch (e) {
    console.log(`Failed to connected ${MONGO_URI}, \nERROR: ${e}`)
  }
}
