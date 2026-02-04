import * as yup from 'yup';

import RegexPatterns from '@utils/regex';
import GlobalMessage from '@localize/GlobalMessage';
import { ForgotPasswordFormValues } from './initialValues';

const createYupSchema = <T extends object>(
  schema: yup.ObjectSchema<T>,
): yup.ObjectSchema<T> => schema;

const schema = createYupSchema<ForgotPasswordFormValues>(
  yup.object().shape({
    email: yup
      .string()
      .matches(RegexPatterns.EMAIL, GlobalMessage.validEmail)
      .required(GlobalMessage.requiredEmail),
  }),
);

export default schema;
