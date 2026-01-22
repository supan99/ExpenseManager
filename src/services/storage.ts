import * as Keychain from 'react-native-keychain';

const USER_KEY = 'user_data';

export const StorageService = {
  async saveUser(user: string): Promise<void> {
    await Keychain.setInternetCredentials(USER_KEY, USER_KEY, user);
  },

  async getUser(): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(USER_KEY);
      return credentials ? credentials.password : null;
    } catch (error) {
      return null;
    }
  },

  async removeUser(): Promise<void> {
    await Keychain.resetInternetCredentials(USER_KEY);
  },

  async clearAll(): Promise<void> {
    await this.removeUser();
  },
};
