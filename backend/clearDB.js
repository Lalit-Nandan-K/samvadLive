import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo connected");

    await mongoose.connection.db.collection("messages").deleteMany({});
    await mongoose.connection.db.collection("friendrequests").deleteMany({});

    console.log("Database cleaned");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
