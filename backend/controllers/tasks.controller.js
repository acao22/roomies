import { db, auth } from "../config/firebaseAdmin.js";
import admin from "firebase-admin";

export const getAllTasks = async (req, res) => {
  try {
    const querySnapshot = await db.collection("task").get();
    
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
    const {title, selectedIcon, date, time, members, recurrence, description, createdAt, createdBy, assignedTo, groupId} = req.body;
    const taskData = {
        title,
        icon: selectedIcon,
        status: "open",
        date,
        time,
        members,
        recurrence,
        description,
        createdAt, 
        createdBy,
        groupId
    };

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
        updatedData.completedAt = admin.firestore.Timestamp.fromDate(new Date(updatedData.completedAt));
    }

    try {
        await db.collection("task").doc(taskId).update(updatedData);
        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error updating task: " + error.message });
    }
};
  