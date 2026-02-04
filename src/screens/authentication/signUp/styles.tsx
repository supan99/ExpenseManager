import { StyleSheet } from 'react-native';
import { theme } from '@themes/index';

export const signUpScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: theme.spacing.m,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.m,
  },
  header: {
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.m,
    paddingHorizontal: theme.spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginTop: theme.spacing.m,
    gap: theme.spacing.s,
  },
  headerText: {
    textAlign: 'center',
    color: theme.colors.white,
  },
  formContainer: {
    paddingTop: theme.spacing.m,
  },
  form: {
    width: '100%',
    gap: theme.spacing.s,
  },
});
