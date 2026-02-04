import * as yup from 'yup';

import {
  SignUpFormValues,
} from './initialValues';
import RegexPatterns from '@utils/regex';
import GlobalMessage from '@localize/GlobalMessage';

const createYupSchema = <T extends object>(
  schema: yup.ObjectSchema<T>,
): yup.ObjectSchema<T> => schema;

const schema = createYupSchema<SignUpFormValues>(
  yup.object().shape({
    email: yup
      .string()
      .matches(RegexPatterns.EMAIL, GlobalMessage.validEmail)
      .when('isEmail', {
        is: (val: boolean) => val === true,
        then: schema => schema.required(GlobalMessage.requiredEmail),
        otherwise: schema => schema.notRequired(),
      }),
    firstname: yup
      .string()
      .matches(RegexPatterns.NAME, GlobalMessage.validFirstName)
      .required(GlobalMessage.requiredFirstName),
    lastname: yup
      .string()
      .matches(RegexPatterns.NAME, GlobalMessage.validLastName)
      .required(GlobalMessage.requiredLastName),
    password: yup
      .string()
      .matches(RegexPatterns.SMALL_LETTERS, GlobalMessage.passwordSmallLetter)
      .matches(
        RegexPatterns.CAPITAL_LETTERS,
        GlobalMessage.passwordCapitalLetter,
      )
      .matches(RegexPatterns.NUMBERS, GlobalMessage.passwordNumber)
      .min(8, ({ min }) => GlobalMessage.passwordMin(min))
      .required(GlobalMessage.requiredPassword),
    confirmPassword: yup
      .string()
      .required(GlobalMessage.requiredConfirmPassword)
      .oneOf([yup.ref('password'), ''], GlobalMessage.passwordsMustMatch),
  }),
);

export default schema;
