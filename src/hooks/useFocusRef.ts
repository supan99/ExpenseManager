import { TextInput } from 'react-native';

export const useFocusRef = () => {
  const inputRefs: { [key: string]: TextInput | null } = {};

  const setRef = (name: string) => (ref: TextInput | null) => {
    inputRefs[name] = ref;
  };

  return {
    inputRefs,
    setRef,
  };
};
