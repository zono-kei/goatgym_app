import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Reservation, MealRecord, WeightRecord, TrainingRecord, Food } from '../types';
// import secondaryAuth from firebase
import { db, auth, secondaryAuth, handleFirestoreError } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updatePassword, deleteUser as deleteFirebaseAuthUser } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query, where, writeBatch } from 'firebase/firestore';

interface AppState {
  currentUser: User | null;
  users: User[];
  reservations: Reservation[];
  meals: MealRecord[];
  weights: WeightRecord[];
  trainings: TrainingRecord[];
  customFoods: Food[];
  loading: boolean;
}

interface AppContextType extends AppState {
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (newPass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  addUser: (user: User) => Promise<void>;
  adminCreateUser: (email: string, pass: string, user: Omit<User, 'id'>) => Promise<void>;
  adminChangePassword: (email: string, oldPass: string, newPass: string, uid: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateUserAdmin: (id: string, updates: Partial<User>) => Promise<void>;
  addReservation: (res: Reservation) => Promise<void>;
  addMeal: (meal: MealRecord) => Promise<void>;
  addWeight: (weight: WeightRecord) => Promise<void>;
  addTraining: (training: TrainingRecord) => Promise<void>;
  addCustomFood: (food: Food) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    users: [],
    reservations: [],
    meals: [],
    weights: [],
    trainings: [],
    customFoods: [],
    loading: true
  });

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch or create user
        const userRef = doc(db, 'users', user.uid);
        try {
          const userSnap = await getDoc(userRef);
          let currentUser: User;
          if (userSnap.exists()) {
            currentUser = userSnap.data() as User;
            // Auto-upgrade developer email to admin if currently not admin
            if (currentUser.email === 'b2181199@gmail.com' && currentUser.role !== 'admin') {
              currentUser.role = 'admin';
              await updateDoc(userRef, { role: 'admin' });
            }
          } else {
            // Check if admin (for simple preview purposes, the first user could be admin or we check a list, but let's default to member)
            currentUser = {
              id: user.uid,
              name: user.displayName || '名無し',
              email: user.email || '',
              role: user.email === 'b2181199@gmail.com' ? 'admin' : 'member',
              goal: 'maintain',
              targetCalories: 2000,
              tickets: 0,
              contractPlan: '未定義'
            };
            await setDoc(userRef, currentUser);
          }
          setState(s => ({ ...s, currentUser, loading: false }));
        } catch (e) {
          handleFirestoreError(e, 'get' as any, 'users');
          setState(s => ({ ...s, currentUser: null, loading: false }));
        }
      } else {
        setState(s => ({ ...s, currentUser: null, loading: false }));
      }
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!state.currentUser) return;
    const isMember = state.currentUser.role === 'member';
    const cUid = state.currentUser.id;

    const unsubs: (() => void)[] = [];

    // Users
    try {
      const q = collection(db, 'users');
      unsubs.push(onSnapshot(q, (snap) => {
        const users = snap.docs.map(d => d.data() as User);
        setState(s => ({ ...s, users }));
      }, (err) => handleFirestoreError(err, 'get' as any, 'users')));
    } catch(e) {}

    // Lists logic: if member, only their stuff, else all
    const collections = ['meals', 'weights', 'trainings', 'customFoods', 'reservations'];
    collections.forEach(col => {
      try {
        const ref = collection(db, col);
        const qData = isMember ? query(ref, where('userId', '==', cUid)) : ref;
        unsubs.push(onSnapshot(qData, (snap) => {
          const items = snap.docs.map(d => d.data());
          setState(s => ({ ...s, [col]: items }));
        }, (err) => handleFirestoreError(err, 'get' as any, col)));
      } catch (e) { }
    });

    return () => unsubs.forEach(u => u());
  }, [state.currentUser?.id, state.currentUser?.role]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signupWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const changePassword = async (newPass: string) => {
    if (!auth.currentUser) throw new Error("ログインしていません");
    await updatePassword(auth.currentUser, newPass);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!state.currentUser) return;
    const ref = doc(db, 'users', state.currentUser.id);
    await updateDoc(ref, updates);
  };

  const updateUserAdmin = async (id: string, updates: Partial<User>) => {
    const ref = doc(db, 'users', id);
    await updateDoc(ref, updates);
  };

  const addUser = async (user: User) => {
    // Cannot create auth users easily from client JS without cloud function.
    // We mock this by adding to collection. 
    await setDoc(doc(db, 'users', user.id), user);
  };

  const adminCreateUser = async (email: string, pass: string, user: Omit<User, 'id'>) => {
    let finalEmail = email;
    let uid = '';
    try {
      // Create in auth using secondary app so we don't log out the admin
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, pass);
      uid = cred.user.uid;
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use' && email.includes('@goat-hp.local')) {
        const baseId = user.memberId || email.split('@')[0];
        const newEmail = `${baseId}_${Date.now()}@goat-hp.local`;
        const cred = await createUserWithEmailAndPassword(secondaryAuth, newEmail, pass);
        uid = cred.user.uid;
        finalEmail = newEmail;
        await setDoc(doc(db, 'authMappings', baseId), { email: newEmail });
      } else if (err.code === 'auth/email-already-in-use') {
         throw new Error("指定されたメールアドレスは既にシステムに存在します。別のメールアドレスをご利用ください。");
      } else {
        throw err;
      }
    }
    
    // Now create document
    const fullUser: User = { ...user, id: uid, rawPassword: pass, email: finalEmail };
    await setDoc(doc(db, 'users', uid), fullUser);
    // Sign out of secondary auth so it doesn't linger
    await signOut(secondaryAuth);
  };

  const adminChangePassword = async (email: string, oldPass: string, newPass: string, uid: string) => {
    const cred = await signInWithEmailAndPassword(secondaryAuth, email, oldPass);
    if(cred.user) {
      await updatePassword(cred.user, newPass);
      await setDoc(doc(db, 'users', uid), { rawPassword: newPass }, { merge: true });
    }
    await signOut(secondaryAuth);
  };

  const deleteUser = async (id: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', id));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        if (userData.email && userData.rawPassword) {
          const cred = await signInWithEmailAndPassword(secondaryAuth, userData.email, userData.rawPassword);
          if (cred.user) {
            await deleteFirebaseAuthUser(cred.user);
          }
        }
      }
    } catch (err) {
      console.error("Failed to delete Auth User:", err);
    }
    
    // 🔥 Firestoreの関連データをすべて削除します。
    await deleteDoc(doc(db, 'users', id));

    const collectionsToDelete = ['meals', 'weights', 'trainings', 'reservations', 'customFoods'];
    
    for (const coll of collectionsToDelete) {
      const q = query(collection(db, coll), where('userId', '==', id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const batch = writeBatch(db);
        querySnapshot.forEach((docSnap) => {
          batch.delete(docSnap.ref);
        });
        await batch.commit();
      }
    }
  };

  const addReservation = async (res: Reservation) => {
    await setDoc(doc(db, 'reservations', res.id), res);
  };

  const addMeal = async (meal: MealRecord) => {
    await setDoc(doc(db, 'meals', meal.id), meal);
  };

  const addWeight = async (weight: WeightRecord) => {
    await setDoc(doc(db, 'weights', weight.id), weight);
  };

  const addTraining = async (training: TrainingRecord) => {
    await setDoc(doc(db, 'trainings', training.id), training);
  };

  const addCustomFood = async (food: Food) => {
    // using random id for custom food
    const id = Date.now().toString();
    await setDoc(doc(db, 'customFoods', id), { ...food, id, userId: state.currentUser?.id });
  };

  if (state.loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">Loading...</div>;
  }

  return (
    <AppContext.Provider value={{
      ...state, login, loginWithEmail, signupWithEmail, resetPassword, changePassword, logout, updateUser, updateUserAdmin, addUser, adminCreateUser, adminChangePassword, deleteUser,
      addReservation, addMeal, addWeight, addTraining, addCustomFood
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppStore must be used within AppProvider');
  return context;
};

