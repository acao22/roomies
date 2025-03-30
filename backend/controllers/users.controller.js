import { db, auth } from "../config/firebaseAdmin.js";
import admin from "firebase-admin";
import { getUserGroupData } from '../utils/groupHelper.js';

export const saveAvatar = async (req, res) => {
  const { uid, uri } = req.body;
  try {
    const avatarData = {
      uid,
      uri,
      createdAt: new Date(),
    };

    await db.collection("avatar").doc(uid).set(avatarData);
    res.status(200).json({ uri });
  } catch (error) {
    console.error("Error saving avatar:", error);
    res.status(500).json({ error: error.message });
  }
}

export const fetchAvatar = async (req, res) => {
  const { uid } = req.body; 
  console.log(uid);
  try {
    const userDoc = await db.collection("avatar").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(200).json({ uri: null });
    }

    const { createdAt, id, uri } = userDoc.data();
    console.log(uri);
    res.status(200).json({ uri });
  } catch (error) {
    console.error("Error retrieving avatar data:", error);
    res.status(500).json({ error: "Error retrieving avatar data" });
  }

}

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
// THIS IS THE DEFAULT GROUP, WHICH IS AT INDEX 0
  export const getUserGroup = async (req, res) => {
    const { uid } = req.body; 
  
    try {
      const groupData = await getUserGroupData(uid);

      // expand members
      const memberDataPromises = groupData.members.map(async (memberRef) => {
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
      res.status(200).json({ id: groupData.id, groupName: groupData.groupName, members: expandedMembers });
    } catch (error) {
      console.error("Error retrieving user data:", error);
      res.status(500).json({ error: "Error retrieving user data" });
    }
  };


// join group
// this allows the user to join a group given the name and the passcode
// making the group they join the FIRST group
export const joinGroup = async (req, res) => {
    const { uid, groupName, passcode } = req.body;
  
    if (!uid || !groupName || !passcode) {
      return res.status(400).json({ error: "Missing uid, groupName, or passcode" });
    }
  
    try {
      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // find the group with matching groupName AND passcode
      const groupQuery = await db
        .collection("roomieGroups")
        .where("groupName", "==", groupName)
        .where("passcode", "==", passcode)
        .limit(1)
        .get();
  
      if (groupQuery.empty) {
        return res.status(404).json({ error: "No group found with matching name and passcode" });
      }
  
      const groupDoc = groupQuery.docs[0];
      const groupRef = groupDoc.ref;
      const groupData = groupDoc.data();
  
      const alreadyInGroup = groupData.members?.some((ref) => ref.id === uid);
  
      if (!alreadyInGroup) {
        await groupRef.update({
          members: admin.firestore.FieldValue.arrayUnion(userRef),
        });
      }
  
      const userData = userDoc.data();
      let updatedGroups = [groupRef];
  
      if (userData.roomieGroup && Array.isArray(userData.roomieGroup)) {
        const otherGroups = userData.roomieGroup.filter(
          (ref) => ref.id !== groupRef.id
        );
        updatedGroups = [groupRef, ...otherGroups];
      }
  
      await userRef.update({
        roomieGroup: updatedGroups,
      });
  
      return res.status(200).json({
        message: "Successfully joined group",
        groupId: groupRef.id,
        groupName: groupData.groupName,
      });
    } catch (error) {
      console.error("Error joining group:", error);
      res.status(500).json({ error: "Failed to join group" });
    }
  };


// create group
export const createGroup = async (req, res) => {
    const { uid, groupName, passcode } = req.body;
  
    if (!uid || !groupName || !passcode) {
      return res.status(400).json({ error: "Missing uid, groupName, or passcode" });
    }
  
    try {
      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // 1. Create the group with the user as the initial member
      const groupRef = await db.collection("roomieGroups").add({
        groupName,
        passcode,
        createdBy: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        members: [userRef], // add the creator as the first member
      });
  
      // 2. Update user's roomieGroup array, placing this group at the front
      const userData = userDoc.data();
      let updatedGroups = [groupRef];
  
      if (userData.roomieGroup && Array.isArray(userData.roomieGroup)) {
        const otherGroups = userData.roomieGroup.filter(
          (ref) => ref.id !== groupRef.id
        );
        updatedGroups = [groupRef, ...otherGroups];
      }
  
      await userRef.update({
        roomieGroup: updatedGroups,
      });
  
      res.status(201).json({
        message: "Group created and joined successfully",
        groupId: groupRef.id,
        groupName,
      });
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({ error: "Failed to create group" });
    }
  };