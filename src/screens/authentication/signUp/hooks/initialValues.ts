export interface SignUpFormValues {
  email?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  confirmPassword?: string;
  isVisible?: boolean;
  isConfirmVisible?: boolean;
}

export const initialValues: SignUpFormValues = {
  email: '',
  firstname: '',
  lastname: '',
  password: '',
  confirmPassword: '',
  isVisible: false,
  isConfirmVisible: false,
};
