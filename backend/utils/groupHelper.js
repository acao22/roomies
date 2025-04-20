import { db } from "../config/firebaseAdmin.js";

export const getUserGroupData = async (uid) => {
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      throw new Error("User not found");
    }
    
    const { roomieGroup } = userDoc.data();
    if (!roomieGroup || roomieGroup.length === 0) {
      const e = new Error("User has no roomieGroup");
      e.code = 404;
      throw e;
    }
    
    // Assuming the user is in one group.
    const groupRef = roomieGroup[0];
    const groupDoc = await groupRef.get();
    
    if (!groupDoc.exists) {
      const e = new Error("User has no roomieGroup");
      e.code = 404;
      throw e;
    }
    
    const { groupName, members } = groupDoc.data();
    return { id: groupDoc.id, groupName, members };
  };
  