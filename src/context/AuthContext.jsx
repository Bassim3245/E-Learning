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
import { seedPlatformData } from "../utils/seedData";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-seed initial platform data (teachers & lessons) on initial load if empty
  useEffect(() => {
    seedPlatformData(false).catch((err) => console.warn("Seed check error:", err));
  }, []);

  // Register function with role support
  async function register({
    username,
    email,
    password,
    firstName,
    lastName,
    phoneNumber = "",
    academicYear = "",
    role = "student",
    specialization = ""
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

    // Save extended profile in Firestore with role
    const profileData = {
      uid: user.uid,
      username: username.trim(),
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: role.toLowerCase() || "student", // 'admin', 'teacher', 'student'
      phoneNumber: phoneNumber.trim() || "",
      academicYear: academicYear.trim() || "",
      specialization: specialization.trim() || "",
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

  // Switch role for the active user (allows instant admin/teacher/student testing)
  async function switchMyRole(newRole) {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, { role: newRole });
    setUserProfile((prev) => ({ ...prev, role: newRole }));
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
              const fallback = {
                uid: user.uid,
                email: user.email,
                username: user.email.split("@")[0],
                firstName: user.displayName || "",
                lastName: "",
                role: "student",
                phoneNumber: "",
                academicYear: "",
                specialization: "",
                bio: "",
                createdAt: new Date().toISOString()
              };
              setUserProfile(fallback);
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

  const role = userProfile?.role || "student";
  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const isStudent = role === "student";

  const value = {
    currentUser,
    userProfile,
    role,
    isAdmin,
    isTeacher,
    isStudent,
    loading,
    register,
    login,
    logout,
    updateUserProfile,
    switchMyRole,
    seedDataTrigger: seedPlatformData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
