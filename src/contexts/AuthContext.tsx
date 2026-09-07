import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc, getDocFromServer, serverTimestamp } from 'firebase/firestore';

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      const localUserJson = localStorage.getItem('gcc_demo_user');
      const localProfileJson = localStorage.getItem('gcc_demo_profile');

      if (localUserJson && localProfileJson) {
        setUser(JSON.parse(localUserJson));
        setProfile(JSON.parse(localProfileJson));
        setLoading(false);
        return;
      }

      setUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(docRef);
          let userProfile: any = null;
          
          if (docSnap.exists()) {
            userProfile = docSnap.data();
          } else {
            const isEmailAdmin = user.email?.toLowerCase().includes('admin') || user.email === 'admin@gcc-company.com';
            const role = isEmailAdmin ? 'admin' : 'patient';
            
            userProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || (isEmailAdmin ? 'GCC Admin' : 'Demo Client'),
              photoURL: user.photoURL,
              role: role,
              createdAt: serverTimestamp(),
            };
            try {
              await setDoc(docRef, userProfile);
            } catch (err) {
              console.warn("Could not write Firestore initial user document", err);
            }
          }

          if (user.email?.toLowerCase().includes('admin') || user.email === 'admin@gcc-company.com') {
            if (userProfile) {
              userProfile.role = 'admin';
            }
          }
          setProfile(userProfile);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
          // Graceful fallback for offline / restricted database environments
          const isEmailAdmin = user.email?.toLowerCase().includes('admin') || user.email === 'admin@gcc-company.com';
          setProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || (isEmailAdmin ? 'GCC Admin' : 'Demo Client'),
            photoURL: user.photoURL,
            role: isEmailAdmin ? 'admin' : 'patient',
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const isAdmin = profile?.role === 'admin';
  const isDoctor = profile?.role === 'doctor';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, isDoctor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
