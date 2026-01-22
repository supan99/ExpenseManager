import * as Keychain from 'react-native-keychain';
import { KeyChainKeys } from '../enums/keyChainKeys';
import { BaseOptions } from 'react-native-keychain';

export const getKeyChain = async (key: string): Promise<string | null> => {
  try {
    if (key === KeyChainKeys.TOKEN || key === 'token') {
      const credentials = await Keychain.getGenericPassword();
      return credentials ? credentials.password : null;
    }
    const credentials = await Keychain.getInternetCredentials(key);
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error(`Error getting keychain for key ${key}:`, error);
    return null;
  }
};

export const setKeyChain = async (
  key: string,
  value: string,
): Promise<void> => {
  try {
    if (key === KeyChainKeys.TOKEN || key === 'token') {
      await Keychain.setGenericPassword(KeyChainKeys.TOKEN, value);
    } else if (key === KeyChainKeys.REFRESH_TOKEN || key === 'refreshToken') {
      await Keychain.setInternetCredentials(
        KeyChainKeys.REFRESH_TOKEN,
        KeyChainKeys.REFRESH_TOKEN,
        value,
      );
    } else {
      await Keychain.setInternetCredentials(key, key, value);
    }
  } catch (error) {
    console.error(`Error setting keychain for key ${key}:`, error);
    throw error;
  }
};

export const deleteKeyChain = async (key: string): Promise<void> => {
  try {
    if (key === KeyChainKeys.TOKEN || key === 'token') {
      await Keychain.resetGenericPassword();
    } else {
      await Keychain.resetInternetCredentials({ service: key } as BaseOptions);
    }
  } catch (error) {
    console.error(`Error deleting keychain for key ${key}:`, error);
    throw error;
  }
};

export const clearAllKeyChain = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword();
    const keysToClear = [
      KeyChainKeys.REFRESH_TOKEN,
      KeyChainKeys.PROFILE_ID,
      KeyChainKeys.USER_DATA,
    ];
    for (const key of keysToClear) {
      try {
        await Keychain.resetInternetCredentials(
          { service: key } as BaseOptions,
        );
      } catch {
      }
    }
  } catch (error) {
    console.error('Error clearing all keychain:', error);
    throw error;
  }
};
