// import { Preferences } from '@capacitor/preferences';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

export const setToSecureStorage = async (token: string, key: string) => {
  await SecureStoragePlugin.set({
    key,
    value: token,
  });
};

export const getFromSecureStorage = async (key: string) => {
  const { value } = await SecureStoragePlugin.get({ key });
  return value;
};

export const removeFromSecureStorage = async (key: string) => {
  await SecureStoragePlugin.remove({ key });
};



