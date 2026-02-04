
export interface LoginFormValues {
  email?: string;
  password?: string;
  isVisible?: boolean;
}

export const initialValues: LoginFormValues = {
  email: '',
  password: '',
  isVisible: false,
};