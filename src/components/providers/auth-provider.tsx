'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserRole } from '@/lib/types';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


const getUserFromFirestore = async (uid: string): Promise<User | null> => {
  console.log(`Fetching role for uid: ${uid}`);
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    console.warn("User document not found in Firestore.");
    return null;

  } catch (error) {
    console.error("Error getting user from Firestore:", error);
    return null;
  }
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userProfile = await getUserFromFirestore(firebaseUser.uid);
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = {
    user,
    role: user?.role || null,
    loading,
    login,
    logout,
  };


  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
