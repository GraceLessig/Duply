import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@duply_profile';

export interface ProfilePreferences {
  username: string;
  photoUri: string;
}

export interface ProfileContextValue {
  profile: ProfilePreferences;
  loaded: boolean;
  updateProfile: (updates: Partial<ProfilePreferences>) => void;
  resetProfile: () => void;
}

const DEFAULT_PROFILE: ProfilePreferences = {
  username: 'Beauty Lover',
  photoUri: '',
};

export const ProfileContext = createContext<ProfileContextValue>({
  profile: DEFAULT_PROFILE,
  loaded: false,
  updateProfile: () => {},
  resetProfile: () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfilePreferences>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(json) });
        }
      } catch {
        // Storage unavailable
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (value: ProfilePreferences) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Persist error
    }
  }, []);

  const updateProfile = useCallback((updates: Partial<ProfilePreferences>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      persist(next);
      return next;
    });
  }, [persist]);

  const resetProfile = useCallback(() => {
    setProfile(() => {
      persist(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    });
  }, [persist]);

  return (
    <ProfileContext.Provider value={{ profile, loaded, updateProfile, resetProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
