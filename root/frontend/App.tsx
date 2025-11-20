// App.tsx
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  Suspense,
} from "react";

import { auth, db } from "./firebase";

import {
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

interface AppUser {
  uid: string;
  email?: string;
  userId: string;
}

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => void;
  logout: () => void;
  db: any;
}

// --------------------------------------------------
// CONTEXT
// --------------------------------------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

// --------------------------------------------------
// AUTH PROVIDER
// --------------------------------------------------

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------- FIXED Google Login ----------
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("GOOGLE LOGIN FAILED", err);
    }
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    // fallback — signin anonymously
    signInAnonymously(auth).catch(() => {});

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.isAnonymous) {
          setCurrentUser({
            uid: user.uid,
            email: "anonymous@guest.com",
            userId: "anonymous-user",
          });
        } else {
          setCurrentUser({
            uid: user.uid,
            email: user.email ?? "",
            userId: user.uid,
          });
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, loginWithGoogle, logout, db }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --------------------------------------------------
// LOGIN SCREEN
// --------------------------------------------------

const LoginScreen = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 to-purple-300">
      <div className="p-10 bg-white/80 rounded-2xl shadow-xl text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome Adventurer</h2>
        <button
          onClick={loginWithGoogle}
          className="w-56 bg-indigo-700 hover:bg-indigo-800 text-white p-3 rounded-full"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

// --------------------------------------------------
// PROTECTED APP
// --------------------------------------------------

const ProtectedApp = () => {
  const { logout, currentUser } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold">Legal Reviewer</h1>

        <nav className="space-y-3">
          <button className="w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700">
            Dashboard
          </button>
          <button className="w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700">
            Upload Contract
          </button>
          <button className="w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700">
            Chatbot
          </button>
        </nav>

        <button
          onClick={logout}
          className="w-full mt-8 bg-red-600 p-3 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <h2 className="text-3xl font-bold">Welcome {currentUser?.email}</h2>

        <div className="grid grid-cols-3 gap-8 mt-10">
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-xl font-bold">Contracts Reviewed</h3>
            <p className="text-5xl mt-4 font-bold text-indigo-600">12</p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-xl font-bold">Issues Found</h3>
            <p className="text-5xl mt-4 font-bold text-red-600">8</p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-xl font-bold">Compliance Score</h3>
            <p className="text-5xl mt-4 font-bold text-green-600">92%</p>
          </div>
        </div>
      </main>
    </div>
  );
};


// --------------------------------------------------
// MAIN APP
// --------------------------------------------------

const App = () => {
  const { currentUser, loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  if (currentUser?.userId === "anonymous-user") {
    return <LoginScreen />;
  }

  return <ProtectedApp />;
};

// --------------------------------------------------

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
