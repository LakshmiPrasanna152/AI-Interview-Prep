import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  auth, 
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();
export const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    'https://ai-interview-prep-as7p.onrender.com/api'
});

// Attach Firebase ID token to every request
API.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch/sync user profile from backend
          const res = await API.get('/auth/me');
          setUser(res.data.user);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = await credential.user.getIdToken();
    const res = await API.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // Update display name in Firebase
    await updateProfile(credential.user, { displayName: name });
    const token = await credential.user.getIdToken(true);
    // Sync name to backend
    const res = await API.post('/auth/sync', { name }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(res.data.user);
    return res.data;
  };

  const googleLogin = async () => {
    const credential = await signInWithPopup(auth, googleProvider);
    const token = await credential.user.getIdToken();
    // Sync name/avatar to backend
    await API.post('/auth/sync', {
      name: credential.user.displayName,
      avatar: credential.user.photoURL
    }, { headers: { Authorization: `Bearer ${token}` } });
    const res = await API.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, resetPassword, updateUser, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
