import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot
} from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register function
  async function register({
    username,
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    academicYear
  }) {
    // Check if username is already taken in Firestore
    const q = query(collection(db, "users"), where("username", "==", username.trim()));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error("This username is already taken. Please choose another one.");
    }

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (fullName) {
      await updateProfile(user, { displayName: fullName });
    }

    // Save extended profile in Firestore
    const profileData = {
      uid: user.uid,
      username: username.trim(),
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim() || "",
      academicYear: academicYear.trim() || "",
      bio: "",
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, "users", user.uid), profileData);
    setUserProfile(profileData);
    return user;
  }

  // Login function (supports email or username)
  async function login(usernameOrEmail, password) {
    let emailToUse = usernameOrEmail.trim();

    // If no '@', find user by username in Firestore
    if (!emailToUse.includes("@")) {
      const q = query(collection(db, "users"), where("username", "==", emailToUse));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("No account found with this username.");
      }
      emailToUse = querySnapshot.docs[0].data().email;
    }

    const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
    return userCredential.user;
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  // Update profile in Firestore
  async function updateUserProfile(updates) {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, updates);
    setUserProfile((prev) => ({ ...prev, ...updates }));
  }

  // Auth state listener
  useEffect(() => {
    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        // Real-time listener for Firestore profile
        const userRef = doc(db, "users", user.uid);
        unsubscribeProfile = onSnapshot(
          userRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile(docSnap.data());
            } else {
              // Fallback if document doesn't exist yet
              setUserProfile({
                uid: user.uid,
                email: user.email,
                username: user.email.split("@")[0],
                firstName: user.displayName || "",
                lastName: "",
                phoneNumber: "",
                academicYear: "",
                bio: "",
                createdAt: new Date().toISOString()
              });
            }
            setLoading(false);
          },
          (error) => {
            console.error("Firestore snapshot error:", error);
            setLoading(false);
          }
        );
      } else {
        setUserProfile(null);
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

