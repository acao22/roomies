import { db, auth } from "../config/firebaseAdmin.js";
import admin from "firebase-admin";


export const getUserByUid = async (req, res) => {
  const { uid } = req.body; 

  try {
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const { firstName, lastName } = userDoc.data();

    res.status(200).json({ firstName, lastName });
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).json({ error: "Error retrieving user data" });
  }
};


// verifying the user's session
export const verify = async (req, res) => {
    const { idToken } = req.body; // id token, not custom token

    if (!idToken) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        // verify firebase token
        const decodedToken = await auth.verifyIdToken(idToken);

        res.status(200).json({
            uid: decodedToken.uid,
            email: decodedToken.email,
            message: "Token is valid",
        });
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

// USER SIGNUP (both firebase and our own db)
export const registerUser = async (req, res) => {
  const { email, password, displayName, firstName, lastName} = req.body;
  console.log(firstName, lastName);
  try {
    
    // FIREBASE AUTHENTICATION
    const user = await auth.createUser({
      email,
      password,
      displayName
    });

    // INSERT TO OUR OWN USERS TABLE
    // not enough data for now, we just want to make sure this works
    const userData = {
        uid: user.uid,
        email,
        displayName,
        firstName,
        lastName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await db.collection("users").doc(user.uid).set(userData);

    // generate firebase id token for the user
    const customToken = await admin.auth().createCustomToken(user.uid);

    res.status(201).json({
        uid: user.uid,
        customToken,
        message: "User registered successfully!",
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// USER LOGIN (both firebase and our own)
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Get user by email
      const user = await admin.auth().getUserByEmail(email);
  
      // Check if user exists in Firestore (your database)
      const userDoc = await db.collection("users").doc(user.uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found in database" });
      }
  
      // Generate a custom token for your database
      const customToken = await admin.auth().createCustomToken(user.uid);
  
      res.status(200).json({
        uid: user.uid,
        customToken,
        message: "Login successful",
      });
    } catch (error) {
      res.status(401).json({ error: "Invalid credentials" });
    }
  };
  
// get group name, members
  export const getUserGroup = async (req, res) => {
    const { uid } = req.body; 
  
    try {
      const userDoc = await db.collection("users").doc(uid).get();
  
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const { roomieGroup } = userDoc.data();
      if (!roomieGroup) {
        return res.status(404).json({ error: "User does not belong to any roomieGroup"})
      }

      const groupDoc = await roomieGroup.get();

      if (!groupDoc.exists) {
        return res.status(404).json({ error: "Roomie group not found" });
      }
      const { groupName, members } = groupDoc.data();

      // expand members
      const memberDataPromises = members.map(async (memberRef) => {
        const memberDoc = await memberRef.get();  
        if (!memberDoc.exists) {
          return null;
        }
        return {
          uid: memberDoc.id,
          ...memberDoc.data(),
        };
      });
  
      const expandedMembers = (await Promise.all(memberDataPromises)).filter((user) => user !== null);
      res.status(200).json({ groupName, members: expandedMembers });
    } catch (error) {
      console.error("Error retrieving user data:", error);
      res.status(500).json({ error: "Error retrieving user data" });
    }
  };