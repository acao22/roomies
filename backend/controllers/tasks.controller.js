import { db, auth } from "../config/firebaseAdmin.js";
import admin from "firebase-admin";
import { getUserGroupData } from '../utils/groupHelper.js';

export const getAllTasks = async (req, res) => {
  try {
    // get group info and group ID
    const groupData = await getUserGroupData(uid);
    const groupId = groupData.id;
    const querySnapshot = await db.collection("task").where("groupId", "==", groupId).get();
    
    // Map over the docs and populate assignedTo with display names if possible.
    const documents = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // If assignedTo exists and is an array, populate it.
        if (data.assignedTo && Array.isArray(data.assignedTo)) {
          data.assignedTo = await Promise.all(
            data.assignedTo.map(async (ref) => {
              // Assuming ref is a Firestore DocumentReference.
              const userDoc = await ref.get();
              return userDoc.exists ? userDoc.data().displayName || "Unknown" : "Unknown";
            })
          );
        }
        
        return {
          id: doc.id,
          ...data,
          completedAt: data.completedAt ? data.completedAt.toDate().toISOString() : null,
        };
      })
    );
    
    res.status(200).json({ documents });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving tasks: " + error.message });
  }
};


export const addTask = async (req, res) => {
    // the body should have the required fields: 
    console.log("works");
    const {title, icon, date, time, members, recurrence, description, createdAt, createdBy, updatedAt, groupId, selectedPoints} = req.body;
    const taskData = {
        title,
        icon,
        status: "open",
        date,
        time,
        members,
        recurrence,
        description,
        createdAt, 
        createdBy,
        completedAt: null,
        completedBy: null,
        updatedAt,
        groupId,
        selectedPoints
    };
    console.log(taskData);
    const assignedTo = null;
    // need to convert assignedTo from string to array
    if (assignedTo && Array.isArray(assignedTo)) {
        taskData.assignedTo = assignedTo.map(uid => db.doc(`users/${uid}`));
    }

    try {
      await db.collection("task").add(taskData);
      res.status(200).json({message: "task added successfully"});
    } catch (error) {
      res.status(500).json({ error: "Error adding task: " + error.message });
    }
    
};

export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const updatedData = req.body;

  if (updatedData.completedAt) {
    const dateObj = new Date(updatedData.completedAt);
    if (!isNaN(dateObj.getTime())) {
      updatedData.completedAt = admin.firestore.Timestamp.fromDate(dateObj);
    } else {
      // If the date is invalid, you can choose to set it to null or handle it as needed.
      updatedData.completedAt = null;
    }
  }
  

  try {
      await db.collection("task").doc(taskId).update(updatedData);
      res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
      res.status(500).json({ error: "Error updating task: " + error.message });
  }
};

export const deleteTask = async (req, res) => {

  const { taskId } = req.params;

  try {
    const taskRef = db.collection("task").doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    const taskData = taskDoc.data();
    const completedBy = taskData.completedBy;
    const selectedPoints = taskData.selectedPoints || 0;

    // If the task was completed, deduct points from user
    if (completedBy) {
      const userRef = db.collection("users").doc(completedBy);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const currPoints = userData.totalPoints || 0;
        await userRef.update({
          totalPoints: Math.max(0, currPoints - selectedPoints),
        });
      }
    }

    // Delete the task
    await taskRef.delete();

    res.status(200).json({ message: "Task deleted and user points updated (if applicable)" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task: " + error.message });
  }

}
  