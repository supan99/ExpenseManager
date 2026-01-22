import { Alert } from 'react-native';

interface ToastOptions {
  type: 'success' | 'error';
  message: string;
}

export const showToast = ({ type, message }: ToastOptions): void => {
  Alert.alert(
    type === 'error' ? 'Error' : 'Success',
    message,
    [{ text: 'OK' }],
  );
};
