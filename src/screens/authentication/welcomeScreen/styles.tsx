import { StyleSheet } from "react-native";
import { theme } from "@themes/index";


export const welcomeScreenStyles = StyleSheet.create({
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
    paddingTop: theme.spacing.xxl,
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
    flex: 1,
    justifyContent: 'space-between',
    gap: theme.spacing.s,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: theme.fontSize.font16,
    color: theme.colors.blue,
  },
  dontHaveAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.s,
    marginTop: theme.spacing.s,
  },
  dontHaveAccountText: {
    fontSize: theme.fontSize.font16,
    color: theme.colors.white,
  },
  signUpText: {
    color: theme.colors.blue,
    fontSize: theme.fontSize.font18,
    fontWeight: 'bold',
  },
});