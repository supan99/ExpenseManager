/**
 * @format
 */

// IMPORTANT: Import URL polyfill BEFORE any other imports
// This is required for Supabase to work in React Native
import 'react-native-url-polyfill/auto';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
