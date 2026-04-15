import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { firebaseDb, firebaseStorage } from '../services/firebaseClient';
import { useAuth } from '../hooks/useAuth';

const STORAGE_KEY = '@duply_profile';
const PROFILE_COLLECTION = 'profiles';

export interface ProfilePreferences {
  username: string;
  photoUri: string;
}

export interface ProfileContextValue {
  profile: ProfilePreferences;
  loaded: boolean;
  saving: boolean;
  error: string | null;
  updateProfile: (updates: Partial<ProfilePreferences>) => void;
  uploadProfilePhoto: (uri: string, mimeType?: string) => Promise<void>;
  resetProfile: () => void;
}

const DEFAULT_PROFILE: ProfilePreferences = {
  username: 'Beauty Lover',
  photoUri: '',
};

export const ProfileContext = createContext<ProfileContextValue>({
  profile: DEFAULT_PROFILE,
  loaded: false,
  saving: false,
  error: null,
  updateProfile: () => {},
  uploadProfilePhoto: async () => {},
  resetProfile: () => {},
});

function profileStorageKey(uid?: string) {
  return uid ? `${STORAGE_KEY}_${uid}` : STORAGE_KEY;
}

function normalizeProfile(value: Partial<ProfilePreferences> | null | undefined, fallback: ProfilePreferences) {
  return {
    username: value?.username || fallback.username || DEFAULT_PROFILE.username,
    photoUri: value?.photoUri || fallback.photoUri || DEFAULT_PROFILE.photoUri,
  };
}

function profileDoc(uid: string) {
  if (!firebaseDb) return null;
  return doc(firebaseDb, PROFILE_COLLECTION, uid);
}

function fileExtension(mimeType?: string) {
  if (mimeType?.includes('png')) return 'png';
  if (mimeType?.includes('webp')) return 'webp';
  return 'jpg';
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfilePreferences>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fallbackProfile = useMemo<ProfilePreferences>(() => ({
    username: user?.displayName || DEFAULT_PROFILE.username,
    photoUri: user?.photoURL || DEFAULT_PROFILE.photoUri,
  }), [user?.displayName, user?.photoURL]);

  const persist = useCallback(async (value: ProfilePreferences, uid?: string) => {
    try {
      await AsyncStorage.setItem(profileStorageKey(uid), JSON.stringify(value));
    } catch {
      // Local profile cache is best-effort.
    }
  }, []);

  useEffect(() => {
    let unsubscribed = false;
    let unsubscribeRemote: (() => void) | undefined;
    const uid = user?.uid;

    setLoaded(false);
    setError(null);

    (async () => {
      let cachedProfile = fallbackProfile;

      try {
        const json = await AsyncStorage.getItem(profileStorageKey(uid));
        if (json && !unsubscribed) {
          cachedProfile = normalizeProfile(JSON.parse(json), fallbackProfile);
          setProfile(cachedProfile);
        } else if (!unsubscribed) {
          setProfile(fallbackProfile);
        }
      } catch {
        if (!unsubscribed) setProfile(fallbackProfile);
      }

      const remoteDoc = uid ? profileDoc(uid) : null;
      if (!remoteDoc) {
        if (!unsubscribed) setLoaded(true);
        return;
      }

      unsubscribeRemote = onSnapshot(
        remoteDoc,
        snapshot => {
          const next = snapshot.exists()
            ? normalizeProfile(snapshot.data() as Partial<ProfilePreferences>, fallbackProfile)
            : cachedProfile;
          setProfile(next);
          persist(next, uid);
          setLoaded(true);
        },
        () => {
          setError('Could not load your synced profile right now.');
          setLoaded(true);
        }
      );
    })();

    return () => {
      unsubscribed = true;
      unsubscribeRemote?.();
    };
  }, [fallbackProfile, persist, user?.uid]);

  const saveRemoteProfile = useCallback(async (next: ProfilePreferences) => {
    const uid = user?.uid;
    const remoteDoc = uid ? profileDoc(uid) : null;
    if (!uid || !remoteDoc) return;

    setSaving(true);
    setError(null);
    try {
      await setDoc(remoteDoc, {
        username: next.username.trim() || DEFAULT_PROFILE.username,
        photoUri: next.photoUri,
        email: user.email || '',
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch {
      setError('Could not save your synced profile right now.');
    } finally {
      setSaving(false);
    }
  }, [user?.email, user?.uid]);

  const updateProfile = useCallback((updates: Partial<ProfilePreferences>) => {
    setProfile(prev => {
      const next = normalizeProfile({ ...prev, ...updates }, fallbackProfile);
      persist(next, user?.uid);
      saveRemoteProfile(next);
      return next;
    });
  }, [fallbackProfile, persist, saveRemoteProfile, user?.uid]);

  const uploadProfilePhoto = useCallback(async (uri: string, mimeType?: string) => {
    const uid = user?.uid;
    if (!uid || !firebaseStorage) {
      updateProfile({ photoUri: uri });
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const uploadType = mimeType || blob.type || 'image/jpeg';
      const imageRef = ref(firebaseStorage, `profilePhotos/${uid}/avatar.${fileExtension(uploadType)}`);

      await uploadBytes(imageRef, blob, { contentType: uploadType });
      const downloadUrl = await getDownloadURL(imageRef);
      updateProfile({ photoUri: downloadUrl });
    } catch {
      setError('Could not upload your profile photo right now.');
    } finally {
      setSaving(false);
    }
  }, [updateProfile, user?.uid]);

  const resetProfile = useCallback(() => {
    const next = fallbackProfile;
    setProfile(next);
    persist(next, user?.uid);

    const uid = user?.uid;
    const remoteDoc = uid ? profileDoc(uid) : null;
    if (remoteDoc) {
      deleteDoc(remoteDoc).catch(() => {
        setError('Could not reset your synced profile right now.');
      });
    }
  }, [fallbackProfile, persist, user?.uid]);

  return (
    <ProfileContext.Provider value={{ profile, loaded, saving, error, updateProfile, uploadProfilePhoto, resetProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
