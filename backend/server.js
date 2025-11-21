import express from "express";
import { v2 as cloudinary } from "cloudinary";
import { neon } from "@neondatabase/serverless";

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

const sql = neon(process.env.DATABASE_URL);

let status = {
  cloudinary: false,
  database: false
};

async function testConnections() {
  try {
    await sql`SELECT 1`;
    console.log("Neon database connected ✔");
    status.database = true;
  } catch {
    console.log("Neon database connection failed ❌");
  }
  
  try {
    await cloudinary.api.ping();
    console.log("Cloudinary connected ✔");
    status.cloudinary = true;
  } catch {
    console.log("Cloudinary connection failed ❌");
  }
}

testConnections();

app.get("/", (req, res) => {
  res.send("Brightnal backend is running ✔");
});

app.get("/status", (req, res) => {
  res.json(status);
});

const PORT = process.env.PORT || 7700;
app.listen(PORT, () => console.log("Server running on port " + PORT));