import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

const LESSONS_COLLECTION = "lessons";
const USERS_COLLECTION = "users";
const TEACHER_LESSONS_COLLECTION = "teacher_lessons"; // Dedicated connection collection

// ==========================================
// LESSONS CRUD
// ==========================================

export async function getLessons() {
  const colRef = collection(db, LESSONS_COLLECTION);
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function subscribeToLessons(callback) {
  const colRef = collection(db, LESSONS_COLLECTION);
  return onSnapshot(colRef, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Sort client-side by createdAt descending
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    callback(list);
  });
}

export async function addLesson(lessonData) {
  const colRef = collection(db, LESSONS_COLLECTION);
  const now = new Date().toISOString();
  
  const payload = {
    title: lessonData.title?.trim() || "Untitled Lesson",
    description: lessonData.description?.trim() || "",
    subject: lessonData.subject?.trim() || "General",
    difficulty: lessonData.difficulty || "Beginner",
    durationMinutes: Number(lessonData.durationMinutes) || 30,
    videoUrl: lessonData.videoUrl?.trim() || "",
    teacherId: lessonData.teacherId || "",
    teacherName: lessonData.teacherName || "Unassigned",
    teacherEmail: lessonData.teacherEmail || "",
    status: lessonData.status || "published",
    createdAt: now,
    updatedAt: now
  };

  const docRef = await addDoc(colRef, payload);

  // If a teacher is assigned, also record in the dedicated teacher_lessons collection
  if (payload.teacherId) {
    await linkTeacherAndLesson(payload.teacherId, docRef.id, payload.teacherName, payload.title);
  }

  return { id: docRef.id, ...payload };
}

export async function updateLesson(lessonId, updates) {
  const docRef = doc(db, LESSONS_COLLECTION, lessonId);
  const now = new Date().toISOString();
  const payload = {
    ...updates,
    updatedAt: now
  };

  await updateDoc(docRef, payload);

  // If teacher assignment changed, update the teacher_lessons connection
  if (updates.teacherId !== undefined) {
    await linkTeacherAndLesson(updates.teacherId, lessonId, updates.teacherName || "", updates.title || "");
  }
}

export async function deleteLesson(lessonId) {
  // Delete from lessons
  await deleteDoc(doc(db, LESSONS_COLLECTION, lessonId));
  
  // Also clean up any teacher_lessons connection documents
  try {
    const q = query(collection(db, TEACHER_LESSONS_COLLECTION), where("lessonId", "==", lessonId));
    const snap = await getDocs(q);
    const deletePromises = snap.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  } catch (err) {
    console.warn("Cleanup teacher_lessons warning:", err);
  }
}

// ==========================================
// TEACHERS & TEACHER-LESSON CONNECTION
// ==========================================

export async function getTeachers() {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, where("role", "==", "teacher"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function subscribeToTeachers(callback) {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, where("role", "==", "teacher"));
  return onSnapshot(usersRef, (snap) => {
    // Filter on role == 'teacher' (handles both existing and newly tagged teachers)
    const teachers = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((u) => u.role === "teacher");
    callback(teachers);
  });
}

/**
 * Admin creates a new teacher directly in Firestore
 */
export async function addTeacher(teacherData) {
  const usersRef = collection(db, USERS_COLLECTION);
  const teacherId = "teacher_" + Date.now();
  const now = new Date().toISOString();

  const payload = {
    uid: teacherId,
    username: teacherData.username?.trim() || teacherData.email?.split("@")[0] || "teacher",
    email: teacherData.email?.trim() || "",
    firstName: teacherData.firstName?.trim() || "",
    lastName: teacherData.lastName?.trim() || "",
    role: "teacher",
    phoneNumber: teacherData.phoneNumber?.trim() || "",
    specialization: teacherData.specialization?.trim() || "Computer Science",
    bio: teacherData.bio?.trim() || "",
    academicYear: teacherData.academicYear?.trim() || "Faculty",
    createdAt: now
  };

  await setDoc(doc(db, USERS_COLLECTION, teacherId), payload);
  return { id: teacherId, ...payload };
}

/**
 * Method to connect / map a Teacher and a Lesson in the dedicated 'teacher_lessons' collection
 */
export async function linkTeacherAndLesson(teacherId, lessonId, teacherName = "", lessonTitle = "") {
  if (!teacherId || !lessonId) return;

  const connectionId = `${teacherId}_${lessonId}`;
  const connectionRef = doc(db, TEACHER_LESSONS_COLLECTION, connectionId);

  await setDoc(
    connectionRef,
    {
      teacherId,
      lessonId,
      teacherName,
      lessonTitle,
      connectedAt: new Date().toISOString()
    },
    { merge: true }
  );
}

/**
 * Get all lessons taught by a specific teacher
 */
export async function getLessonsForTeacher(teacherId) {
  const colRef = collection(db, LESSONS_COLLECTION);
  const q = query(colRef, where("teacherId", "==", teacherId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ==========================================
// USER ROLES MANAGEMENT
// ==========================================

export async function getAllUsers() {
  const usersRef = collection(db, USERS_COLLECTION);
  const snap = await getDocs(usersRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function subscribeToUsers(callback) {
  const usersRef = collection(db, USERS_COLLECTION);
  return onSnapshot(usersRef, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });
}

export async function updateUserRole(userId, newRole) {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, { role: newRole });
}

export async function addUser(userData) {
  const userId = userData.uid || "user_" + Date.now();
  const now = new Date().toISOString();
  const payload = {
    uid: userId,
    username: userData.username?.trim() || userData.email?.split("@")[0] || "user",
    email: userData.email?.trim() || "",
    firstName: userData.firstName?.trim() || "",
    lastName: userData.lastName?.trim() || "",
    role: userData.role || "student",
    phoneNumber: userData.phoneNumber?.trim() || "",
    createdAt: now,
    updatedAt: now
  };

  await setDoc(doc(db, USERS_COLLECTION, userId), payload);
  return { id: userId, ...payload };
}

export async function updateUser(userId, updates) {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const payload = {
    ...updates,
    updatedAt: new Date().toISOString()
  };
  await updateDoc(userRef, payload);
}

export async function deleteUser(userId) {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await deleteDoc(userRef);
}


