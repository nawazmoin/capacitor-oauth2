// import { Preferences } from '@capacitor/preferences';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

export const setRefreshToken = async (token:string) => {
  await SecureStoragePlugin.set({
    key: 'refreshToken',
    value: token,
  });
};

export const getRefreshToken = async () => {
  const { value } = await SecureStoragePlugin.get({ key: 'refreshToken' });
  return value;
};

export const removeRefreshToken = async () => {
  await SecureStoragePlugin.remove({ key: 'refreshToken' });
};



