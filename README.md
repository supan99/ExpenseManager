# Expense Manager - React Native App

A React Native mobile application built for managing expenses with OCR functionality, lead management, and user authentication.

## Features

1. **Authentication** - Secure login with API-based authentication and token management
2. **Profile Management** - View and manage user profile information
3. **Lead Management** - View leads with search, pagination, and filtering
4. **Expense Management** - Add expenses manually or via OCR receipt scanning
5. **OCR Receipt Scanning** - Automatic data extraction from receipt images using ML Kit

## Project Structure

```
src/
├── api/                    # API service layer
│   ├── auth.ts            # Authentication API calls
│   └── endpoint.ts        # API endpoint definitions
├── assets/                # Static assets
│   └── icons/            # SVG icons
├── components/            # Reusable UI components
│   ├── BackGroundLayout.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── icons/            # Icon components
│   └── image/            # Image/SVG components
├── enums/                 # Enum definitions
│   └── keyChainKeys.ts
├── hooks/                 # Custom React hooks
│   └── useCameraHooks.tsx
├── navigation/            # Navigation setup
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   ├── HomeNavigator.tsx
│   ├── routes.ts
│   └── types.ts
├── screens/               # Screen components
│   ├── AnalyzingReceiptScreen.tsx
│   ├── ExpenseHomeScreen.tsx
│   ├── ExpenseScreen.tsx
│   ├── LeadListScreen.tsx
│   ├── LoadScreen.tsx
│   ├── LoginScreen.tsx
│   ├── ProfileScreen.tsx
│   └── ScanReceiptScreen.tsx
├── services/              # Business logic and services
│   ├── axios.ts          # Axios instance with interceptors
│   ├── keyChain.ts       # Keychain storage service
│   ├── navigationHandler.ts  # Navigation utilities
│   ├── ocr.ts            # OCR processing service
│   └── storage.ts        # Storage service
├── store/                 # Redux store
│   ├── hooks.ts          # Typed Redux hooks
│   ├── index.ts          # Store configuration
│   └── slices/
│       └── authSlice.ts  # Authentication slice
├── themes/                # Theme configuration
│   └── index.tsx
├── types/                 # TypeScript type definitions
│   ├── index.ts
│   └── svg.d.ts
└── utils/                 # Utility functions
    └── toast.ts
```

## Architecture

### State Management
- **Redux Toolkit** for global state management
- **React Hooks** for local component state
- **Secure Storage** using `react-native-keychain` for token persistence
- **Redux Persistence** via storage service for user data

### API Integration
- Centralized API service using `axios`
- Automatic token injection via request interceptors
- Error handling with automatic token refresh on 401 errors
- Response interceptors for error handling and toast notifications

### Navigation
- **React Navigation** with Native Stack and Bottom Tabs
- Nested navigation structure (App → Auth/Home → Tabs)
- Protected routes based on authentication state
- Programmatic navigation using navigation ref

### OCR Functionality
The app uses **ML Kit OCR** (`react-native-mlkit-ocr`) for text recognition from receipt images. The OCR service:

- Extracts amount, date, merchant name, and category from receipts
- Handles OCR errors and normalizes text
- Supports multiple date formats and currency patterns
- Provides intelligent categorization based on merchant and content

**Key Features:**
- Real-time camera preview for receipt capture
- Gallery image selection
- Progress tracking during OCR processing
- Automatic form filling with extracted data

## Setup Instructions

### Prerequisites
- Node.js >= 20
- React Native development environment set up
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **iOS Setup (if building for iOS):**
```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

3. **Android Setup:**
   - Ensure Android SDK is properly configured
   - Permissions are already configured in `AndroidManifest.xml`:
     - Camera permission
     - External storage permission

4. **iOS Setup (Permissions):**
   - Permissions are already configured in `Info.plist`:
     - Camera usage description
     - Photo library usage description

### Running the App

**Start Metro bundler:**
```bash
npm start
```

**Run on Android:**
```bash
npm run android
```

**Run on iOS:**
```bash
npm run ios
```

## API Configuration

The app uses a centralized API configuration. Update the base URL in `src/services/axios.ts` if needed.

### API Endpoints
- `POST /api/login` - User authentication
- `GET /api/leads` - Fetch leads with pagination, search, and sorting

## Security

- **Token Storage:** Uses `react-native-keychain` for secure token storage
- **HTTPS Only:** All API calls use HTTPS
- **Automatic Token Refresh:** Handles 401 errors and token refresh
- **Secure Keychain:** Tokens stored in device keychain with proper encryption

## Form Validation

The app uses **Formik** and **Yup** for form validation:
- Login form with email and password validation
- Expense form with required field validation
- Real-time validation feedback
- Error messages displayed below input fields

## Testing

```bash
npm test
```

## Building APK (Android)

1. Generate a release keystore (if not exists)
2. Configure signing in `android/app/build.gradle`
3. Build release APK:
```bash
cd android
./gradlew assembleRelease
```

The APK will be located at: `android/app/build/outputs/apk/release/app-release.apk`

## Dependencies

### Core
- `react-native`: 0.83.1
- `react`: 19.2.0
- `@react-navigation/native`: Navigation
- `@react-navigation/native-stack`: Stack navigation
- `@react-navigation/bottom-tabs`: Bottom tab navigation
- `react-native-screens`: Native screen components
- `react-native-gesture-handler`: Gesture handling

### State Management
- `@reduxjs/toolkit`: Redux Toolkit
- `react-redux`: React bindings for Redux

### API & Storage
- `axios`: HTTP client
- `react-native-keychain`: Secure storage
- `qs`: Query string parsing

### Media & OCR
- `react-native-image-picker`: Image selection
- `react-native-vision-camera`: Camera functionality
- `react-native-mlkit-ocr`: ML Kit OCR for text recognition
- `react-native-permissions`: Runtime permissions

### UI & Styling
- `react-native-safe-area-context`: Safe area handling
- `react-native-linear-gradient`: Gradient backgrounds
- `@react-native-community/blur`: Blur effects
- `react-native-svg`: SVG support
- `react-native-svg-transformer`: SVG transformer

### Forms & Validation
- `formik`: Form management
- `yup`: Schema validation

## Troubleshooting

### Image Picker Issues
- Ensure permissions are granted on both platforms
- For Android, check `AndroidManifest.xml` permissions
- For iOS, verify `Info.plist` entries

### Camera Issues
- Ensure camera permissions are granted
- For Android, verify camera hardware feature in manifest
- For iOS, check camera usage description in Info.plist

### Navigation Issues
- Ensure `react-native-screens` and `react-native-gesture-handler` are properly linked
- Navigation ref must be initialized before use

### Keychain Issues
- iOS: Ensure Keychain Sharing capability is enabled
- Android: Should work out of the box

### OCR Issues
- Ensure ML Kit dependencies are properly installed
- Check image quality and format
- Verify camera permissions are granted

## License

This project is for educational/demonstration purposes.
