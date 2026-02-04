export enum RegexPatternKeys {
  EMAIL = 'EMAIL',
  PHONE_NUMBER = 'PHONE_NUMBER',
  PASSWORD = 'PASSWORD',
  CREATE_PASSWORD = 'CREATE_PASSWORD',
  SMALL_LETTERS = 'SMALL_LETTERS',
  CAPITAL_LETTERS = 'CAPITAL_LETTERS',
  NUMBERS = 'NUMBERS',
  SPECIAL_CHARACTERS = 'SPECIAL_CHARACTERS',
  NAME = 'NAME',
}

export const RegexPatterns: Record<RegexPatternKeys, RegExp> = {
  [RegexPatternKeys.EMAIL]: new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  ),
  [RegexPatternKeys.PHONE_NUMBER]: new RegExp(/^\+?[1-9]\d{1,14}$/),
  [RegexPatternKeys.PASSWORD]: new RegExp(/^[1-9a-zA-Z]{4,}$/),
  [RegexPatternKeys.CREATE_PASSWORD]: new RegExp(
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/,
  ),
  [RegexPatternKeys.SMALL_LETTERS]: new RegExp(/\w*[a-z]\w*/),
  [RegexPatternKeys.CAPITAL_LETTERS]: new RegExp(/\w*[A-Z]\w*/),
  [RegexPatternKeys.NUMBERS]: new RegExp(/\d/),
  [RegexPatternKeys.SPECIAL_CHARACTERS]: new RegExp(/\w*[!@#$%^&*]\w*/),
  [RegexPatternKeys.NAME]: new RegExp(/^[a-zA-Z- ']*$/), // Allows letters and space
};

export default RegexPatterns;
