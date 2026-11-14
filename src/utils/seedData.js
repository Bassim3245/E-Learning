import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { linkTeacherAndLesson } from "../services/lessonService";

export const SEED_TEACHERS = [
  {
    id: "teacher_sarah",
    username: "dr_sarah",
    email: "sarah.ahmed@elearning.edu",
    firstName: "Dr. Sarah",
    lastName: "Ahmed",
    role: "teacher",
    specialization: "Artificial Intelligence & Computer Vision",
    phoneNumber: "+1 202 555 0143",
    academicYear: "Faculty of AI",
    bio: "Senior Researcher in Educational Computer Vision and Affective Computing.",
    createdAt: new Date().toISOString()
  },
  {
    id: "teacher_omar",
    username: "prof_omar",
    email: "omar.hassan@elearning.edu",
    firstName: "Prof. Omar",
    lastName: "Hassan",
    role: "teacher",
    specialization: "Python & Algorithms",
    phoneNumber: "+1 202 555 0178",
    academicYear: "Computer Science Dept",
    bio: "Passionate educator with 12+ years teaching Data Structures, Algorithms, and Python.",
    createdAt: new Date().toISOString()
  },
  {
    id: "teacher_mona",
    username: "eng_mona",
    email: "mona.ali@elearning.edu",
    firstName: "Eng. Mona",
    lastName: "Ali",
    role: "teacher",
    specialization: "Full Stack & Real-time Web Systems",
    phoneNumber: "+1 202 555 0192",
    academicYear: "Software Engineering",
    bio: "Specialist in interactive frontend interfaces, telemetry streaming, and reactive web architectures.",
    createdAt: new Date().toISOString()
  }
];

export const SEED_LESSONS = [
  {
    id: "lesson_cv_intro",
    title: "Introduction to Computer Vision & Facial Emotion Detection",
    description: "Learn how camera feeds extract facial landmarks (eyebrows, eyes, lips) in-browser to identify confusion, boredom, focus, and joy.",
    subject: "Artificial Intelligence",
    difficulty: "Beginner",
    durationMinutes: 35,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    teacherId: "teacher_sarah",
    teacherName: "Dr. Sarah Ahmed",
    teacherEmail: "sarah.ahmed@elearning.edu",
    status: "published",
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    id: "lesson_python_loops",
    title: "Adaptive Python Loops & Control Flow",
    description: "Mastering for and while loops. Features real-time adaptive pacing: if confused, extra visual tracing examples appear automatically.",
    subject: "Python Programming",
    difficulty: "Beginner",
    durationMinutes: 40,
    videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
    teacherId: "teacher_omar",
    teacherName: "Prof. Omar Hassan",
    teacherEmail: "omar.hassan@elearning.edu",
    status: "published",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: "lesson_ds_stacks",
    title: "Data Structures: Stacks, Queues, and Graph Search",
    description: "Deep dive into memory organization, LIFO/FIFO mechanics, and BFS/DFS graph traversals with interactive self-assessment quizzes.",
    subject: "Computer Science",
    difficulty: "Intermediate",
    durationMinutes: 50,
    videoUrl: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
    teacherId: "teacher_omar",
    teacherName: "Prof. Omar Hassan",
    teacherEmail: "omar.hassan@elearning.edu",
    status: "published",
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
  },
  {
    id: "lesson_realtime_web",
    title: "Real-Time Web Interfaces with JavaScript & WebSockets",
    description: "Connecting client-side telemetry streams directly to student analytics dashboards with zero backend latency.",
    subject: "Web Development",
    difficulty: "Advanced",
    durationMinutes: 45,
    videoUrl: "https://www.youtube.com/watch?v=2ZLl8GAk1jx",
    teacherId: "teacher_mona",
    teacherName: "Eng. Mona Ali",
    teacherEmail: "mona.ali@elearning.edu",
    status: "published",
    createdAt: new Date().toISOString()
  }
];

/**
 * Seeds teachers and lessons into Firestore, linking each teacher to their lessons
 */
export async function seedPlatformData(force = false) {
  const lessonsSnap = await getDocs(collection(db, "lessons"));
  if (!force && !lessonsSnap.empty) {
    return {
      success: true,
      seeded: false,
      message: `Database already has ${lessonsSnap.size} lessons. No seeding needed.`
    };
  }

  // 1. Seed Teachers into `users` collection with role 'teacher'
  for (const teacher of SEED_TEACHERS) {
    const { id, ...data } = teacher;
    await setDoc(doc(db, "users", id), { uid: id, ...data }, { merge: true });
  }

  // 2. Seed Lessons into `lessons` collection
  for (const lesson of SEED_LESSONS) {
    const { id, ...data } = lesson;
    await setDoc(doc(db, "lessons", id), data, { merge: true });

    // 3. Link teacher and lesson in dedicated collection 'teacher_lessons'
    await linkTeacherAndLesson(lesson.teacherId, id, lesson.teacherName, lesson.title);
  }

  return {
    success: true,
    seeded: true,
    message: `Successfully seeded ${SEED_TEACHERS.length} teachers and ${SEED_LESSONS.length} connected lessons!`
  };
}

