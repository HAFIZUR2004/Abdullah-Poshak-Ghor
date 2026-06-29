"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

interface UserData {
  phoneNumber: string;
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: string;
  status?: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("🔵 1. Auth user:", firebaseUser?.uid);

      if (firebaseUser) {
        const userData: UserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          phoneNumber: "",
        };
        setUser(userData);

        try {
          console.log("🔵 2. Fetching user from API...");
          const response = await fetch(`/api/users?uid=${firebaseUser.uid}`);
          console.log("🔵 3. Response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("🔵 4. Full API data:", JSON.stringify(data, null, 2));

            // 🔥 গুরুত্বপূর্ণ: data.user থেকে role নিন
            const userFromDB = data.user;
            console.log("🔵 5. Role from DB:", userFromDB?.role);

            setUserRole(userFromDB?.role || "user");
            setUserStatus(userFromDB?.status || "active");
          } else {
            console.log("🔵 Response not OK");
            setUserRole("user");
            setUserStatus("active");
          }
        } catch (error) {
          console.error("🔵 Error fetching user role:", error);
          setUserRole("user");
          setUserStatus("active");
        }
      } else {
        console.log("🔵 No user logged in");
        setUser(null);
        setUserRole(null);
        setUserStatus(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { user, loading, logout, userRole, userStatus };
}
