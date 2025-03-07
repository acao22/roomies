import express from "express";
import cors from "cors";
import { auth } from "./config/firebaseAdmin.js";

const app = express();
app.use(cors());
app.use(express.json());

// User Registration (Signup)
app.post("/signup", async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const user = await auth.createUser({
      email,
      password,
      displayName,
    });
    res.status(201).json({ uid: user.uid, message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Login (Get Firebase ID Token)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Firebase Admin SDK **CANNOT** verify passwords, so you should use Firebase Authentication SDK in the frontend.
    res.status(400).json({ error: "Use frontend to sign in and send ID token to backend." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify ID Token (Called by Frontend After Login)
app.post("/verify-token", async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    res.status(200).json({ uid: decodedToken.uid });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));