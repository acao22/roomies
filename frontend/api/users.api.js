import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "@env";
import { auth, db } from "../firebaseConfig";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';

const API_USER_BASE_URL = `${API_BASE_URL}/users`;


export const fetchAvatar = async (uid) => {
  console.log("fetching avatar for: ", uid);
  if (uid) {
    const response = await axios.post(`${API_USER_BASE_URL}/fetchAvatar`, {
      uid
    });
    console.log(response.data);
    return response.data;
  }
}

// save an avatar 
export const saveAvatar = async (uri) => {
  const {uid, email, message} = await verifyUserSession(); 
  if (uid) {
    const response = await axios.post(`${API_USER_BASE_URL}/saveAvatar`, {
      uid, uri
    });
    return response.data;
  }
}



// get first name and last name from database
export const getUserInfo = async () => {
  const {uid, email, message} = await verifyUserSession();
  if (uid) {
    const response = await axios.post(`${API_USER_BASE_URL}/getInfo`, {
      uid
    });
    return response.data;
  }
}

// get user's roommate group members, group name
export const getUserGroup = async () => {
  const {uid, email, message} = await verifyUserSession();
  if (uid) {
    const response = await axios.post(`${API_USER_BASE_URL}/getUserGroup`, {
      uid
    });
    return response.data;
  }
}



// checking if a user is still logged in
export const verifyUserSession = async () => {
    const idToken = await AsyncStorage.getItem("idToken");
    if (!idToken) return null; // no session found

    try {
      const response = await axios.post(`${API_USER_BASE_URL}/verify`, {
        idToken, // this sends firebase ID token, not the custom token
      });
    //   const { uid, email, message } = response.data;

    //   const groupResponse = await axios.post(`${API_USER_BASE_URL}/getUserGroup`, {
    //     uid,
    //   });

    //   const { groupName, members } = groupResponse.data;

    //   return {
    //     uid,
    //     email,
    //     roomieGroup: groupName,
    //   };

        const { uid, email } = response.data;
        return { uid, email };
        
      //return response.data; // { uid, email, message }
    } catch (error) {
      // Still return user info if session is valid but group is missing
      if (error?.response?.status === 404 && error.response.data?.error?.includes("roomieGroup")) {
        return {
          uid: error.response.config?.data?.uid || null,
          email: null,
          roomieGroup: null,
          members: [],
        };
      }
  
      return null;
    }
};


// register a new user
export const registerUser = async (email, password, firstName, lastName, displayName = "roomie") => {
    console.log(firstName, lastName, displayName);
    try {
      const response = await axios.post(
        `${API_USER_BASE_URL}/signup`,
        JSON.stringify({ email, password, displayName, firstName, lastName }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      
      console.log("Signup response:", response.data);

      // store firebase id token for session management
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // get firebase id token
      const idToken = await userCredential.user.getIdToken();
      await AsyncStorage.setItem("idToken", idToken);

      return response.data;
    } catch (error) {
      console.error("Error registering user:", error.response?.data || error.message);
      throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
      // get firebase id token
      const idToken = await userCredential.user.getIdToken();

      // store firebase id token for session management
      await AsyncStorage.setItem("idToken", idToken);
  
      return { uid: userCredential.user.uid, idToken };
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
};

export const logoutUser = async (setUser) => {
    try {
      console.log("Logging out...");
      await AsyncStorage.removeItem("idToken");
  
      const auth = getAuth();
      await signOut(auth);
  
      setUser(null);
  
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

// join an existing group by name + passcode
export const joinGroup = async ({ uid, groupName, passcode }) => {
    try {
      const response = await axios.post(`${API_USER_BASE_URL}/joinGroup`, {
        uid,
        groupName,
        passcode,
      });
  
      return response.data; // { message, groupId, groupName }
    } catch (error) {
      console.error("Join group failed:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // create a new group
  export const createGroup = async ({ uid, groupName, passcode }) => {
    const groupRef = collection(db, "roomieGroups");
    const q = query(groupRef, where("passcode", "==", passcode));
    const existing = await getDocs(q);

    if (!existing.empty) {
      throw new Error("Passcode already in use. Please choose another.");
    }



    try {
      const response = await axios.post(`${API_USER_BASE_URL}/createGroup`, {
        uid,
        groupName,
        passcode,
      });
  
      return response.data; // { message, groupId, groupName }
    } catch (error) {
      console.error("Create group failed:", error.response?.data || error.message);
      throw error;
    }
  };


// pass uid explicitly
export const addPointsToUser = async (uid, pointsToAdd) => {
  if (!uid || !pointsToAdd) return;

  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const current = snap.data().totalPoints || 0;
    await updateDoc(userRef, { totalPoints: current + pointsToAdd });
  } else {
    await setDoc(userRef, { totalPoints: pointsToAdd });
  }
};

export const shouldAddLoginPoint = async (uid) => {
  if (!uid) return false;

  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return true; // first-time login, grant point

  const lastLoginDate = snap.data().lastLoginDate;
  const today = new Date().toDateString(); // e.g., "Mon Apr 08 2025"

  return lastLoginDate !== today;
};

export const updateLastLoginDate = async (uid) => {
  if (!uid) return;

  const userRef = doc(db, "users", uid);
  const today = new Date().toDateString();

  await updateDoc(userRef, { lastLoginDate: today });
};

// leave group, removes user from current group
export const leaveGroupAPI = async (uid, groupId) => {
  try {
    const response = await axios.post(`${API_USER_BASE_URL}/leaveGroup`, {
      uid,
      groupId,
    });
    return response.data;
  } catch (error) {
    console.error("Error leaving group:", error.response?.data || error.message);
    throw error;
  }

};


// export const listenToUserDoc = (uid, callback) => {
//   const userRef = doc(db, "users", uid);
//   return onSnapshot(userRef, (snapshot) => {
//     if (snapshot.exists()) {
//       callback(snapshot.data());
//     } else {
//       callback(null);
//     }
//   });
// };
