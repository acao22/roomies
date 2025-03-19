import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { admin, db } from "./config/firebaseAdmin.js";

const app = express();

// middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// all api routes start with /api
app.use("/api", routes); // Prefix all API routes with `/api`

// test firestore connection route
app.get("/test-db", async (req, res) => {
  try {
    const testDoc = await db.collection("testCollection").doc("testDoc").get();
    res.json(testDoc.exists ? testDoc.data() : { message: "No data found." });
  } catch (error) {
    res.status(500).json({ error: "Error accessing Firestore", details: error.message });
  }
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { db, app };