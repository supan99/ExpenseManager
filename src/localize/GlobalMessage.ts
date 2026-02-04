/* eslint-disable no-dupe-keys */

export const GlobalMessage = {
  requiredEmail: 'Email is required',
  requiredPhone: 'Phone is required',
  requiredPassword: 'Password is required',
  requiredConfirmPassword: 'Confirm password is required',
  requiredUsername: 'Username is required',
  requiredFirstName: 'First name is required',
  requiredLastName: 'Last name is required',
  requiredName: 'Name is required',
  requiredAge: 'Age is required',
  ageMustBeNumber: 'Age must be a number',
  ageMustBeBetween: (min: number, max: number) =>
    `Age must be between ${min} and ${max}`,
  validEmail: 'Enter a valid email address',
  validPhone: 'Enter a valid phone number',
  validPassword: 'Enter a valid password',
  validConfirmPassword: 'Enter a valid confirm password',
  validUsername: 'Enter a valid username',
  validFirstName: 'Enter a valid first name',
  validLastName: 'Enter a valid last name',
  passwordSmallLetter: 'Password must have a small letter',
  passwordCapitalLetter: 'Password must have a capital letter',
  passwordNumber: 'Password must have a number',
  passwordMin: (min: number) => `Password must be at least ${min} characters`,
  passwordsMustMatch: 'Passwords must match',
  confirmPasswordRequired: 'Confirm password is required',
  phoneNumberInvalid: 'Phone number is not valid',
  phoneNumberMin: (min: number) =>
    `Phone number must be at least ${min} numbers`,
  usernameEmpty: 'Username field can not be empty',
  usernameMax: (max: number) =>
    `Username can not be more than ${max} characters`,
  firstNamePattern:
    'First name can only contain letters, space, hyphens, and apostrophes',
  namePattern: 'Name can only contain letters, space, hyphens, and apostrophes',
  typeOneOf: (types: string) => `Type must be one of: ${types}`,
  requiredType: 'Type is required',
  requiredAddress: 'Address is required',
  requiredBirthday: 'Birthday is required',
  genderOneOf: (genders: string) => `Gender must be one of: ${genders}`,
  requiredGender: 'Gender is required',
  memberAddUpdateSuccess: (editMode: boolean) =>
    `Member ${editMode ? 'updated' : 'added'} successfully`,
  memberAddUpdateFailed: (editMode: boolean) =>
    `Member ${editMode ? 'update' : 'add'} failed`,
} as const;

export type GlobalMessageType = typeof GlobalMessage;
export default GlobalMessage;
