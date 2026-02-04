# Supabase Authentication Integration Plan

## Overview
This document outlines a comprehensive plan to integrate Supabase authentication into the React Native ExpenseManager application, replacing the current custom authentication system with Supabase's managed authentication service.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation & Setup](#installation--setup)
3. [Project Structure Changes](#project-structure-changes)
4. [Configuration](#configuration)
5. [Implementation Steps](#implementation-steps)
6. [Code Changes](#code-changes)
7. [Testing Strategy](#testing-strategy)
8. [Migration Checklist](#migration-checklist)
9. [Security Considerations](#security-considerations)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 1. Supabase Account Setup
- [ ] Create a Supabase account at https://supabase.com
- [ ] Create a new project in Supabase dashboard
- [ ] Note down the following credentials:
  - Project URL (e.g., `https://xxxxx.supabase.co`)
  - Anon/Public Key (for client-side operations)
  - Service Role Key (for server-side operations - keep secret!)
  - Project ID

### 2. Supabase Dashboard Configuration
- [ ] Enable Email authentication provider
- [ ] Configure email templates (optional customization)
- [ ] Set up email confirmation settings:
  - Enable/disable email confirmation requirement
  - Configure redirect URLs for email confirmation
- [ ] Configure password requirements (min length, complexity)
- [ ] Set up any additional auth providers if needed (Google, Apple, etc.)

### 3. Environment Setup
- [ ] Ensure React Native development environment is configured
- [ ] Verify Node.js version >= 20 (as per package.json)
- [ ] Ensure iOS/Android build tools are available

---

## Installation & Setup

### Step 1: Install Supabase Client Library

```bash
npm install @supabase/supabase-js
```

### Step 2: Install React Native AsyncStorage (if not already installed)

Supabase uses AsyncStorage for session persistence. Check if it's already in dependencies:

```bash
npm install @react-native-async-storage/async-storage
```

For iOS, you may need to run:
```bash
cd ios && pod install && cd ..
```

### Step 3: Install React Native URL Handler (for deep linking/auth callbacks)

```bash
npm install react-native-url-polyfill
```

**Note:** For React Native 0.83+, URL polyfill may not be needed, but verify compatibility.

---

## Project Structure Changes

### New Files to Create

```
src/
├── services/
│   └── supabase/
│       ├── index.ts              # Supabase client initialization
│       ├── auth.ts               # Authentication service wrapper
│       └── types.ts              # Supabase-specific types
├── types/
│   └── supabase.ts              # Extended Supabase types
└── hooks/
    └── useSupabaseAuth.ts       # Custom hook for auth state management
```

### Files to Modify

```
src/
├── services/
│   └── axios.ts                 # Update to use Supabase tokens
├── store/
│   └── slices/
│       └── authSlice.ts         # Update to use Supabase auth
├── api/
│   └── auth.ts                  # Replace with Supabase auth calls
├── screens/
│   ├── authentication/
│   │   └── welcomeScreen/
│   │       └── index.tsx        # Update login handler
│   └── LoginScreen.tsx          # Update login handler
└── .env.example                 # Add Supabase credentials
```

---

## Configuration

### 1. Environment Variables

Update `.env.example`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Existing Backend API (if still needed)
API_URL=https://api-invesqcrm.rundfunkbeitragservice.com

# OpenRouter / OCR (receipt analysis)
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
OCR_MODEL=google/gemini-2.0-flash-001
```

Update `src/types/env.d.ts`:

```typescript
declare module 'react-native-dotenv' {
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
  export const API_URL: string;
  export const OPENROUTER_API_KEY: string;
  export const OPENROUTER_API_URL: string;
  export const OCR_MODEL: string;
}
```

### 2. Supabase Client Initialization

Create `src/services/supabase/index.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // React Native doesn't use URLs
  },
});
```

### 3. Supabase Types

Create `src/services/supabase/types.ts`:

```typescript
export interface SupabaseUser {
  id: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at?: string;
  app_metadata?: Record<string, any>;
  user_metadata?: {
    firstname?: string;
    lastname?: string;
    avatar?: string;
    phonenumber?: string;
    title?: string;
  };
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: SupabaseUser;
}
```

---

## Implementation Steps

### Phase 1: Core Supabase Setup (Day 1)

1. **Install dependencies**
   ```bash
   npm install @supabase/supabase-js @react-native-async-storage/async-storage
   ```

2. **Create Supabase client service**
   - Create `src/services/supabase/index.ts`
   - Initialize Supabase client with AsyncStorage

3. **Update environment configuration**
   - Add Supabase credentials to `.env.example`
   - Update `src/types/env.d.ts`
   - Create `.env` file with actual credentials (gitignored)

4. **Test basic connection**
   - Create a simple test to verify Supabase client initialization

### Phase 2: Authentication Service Layer (Day 1-2)

1. **Create authentication service wrapper**
   - Create `src/services/supabase/auth.ts`
   - Implement sign up, sign in, sign out, session management

2. **Create custom auth hook**
   - Create `src/hooks/useSupabaseAuth.ts`
   - Manage auth state, session, and user data
   - Handle session refresh automatically

3. **Update Redux auth slice**
   - Modify `src/store/slices/authSlice.ts`
   - Replace custom API calls with Supabase auth methods
   - Update state management to work with Supabase sessions

### Phase 3: Update UI Components (Day 2-3)

1. **Update Welcome Screen**
   - Modify `src/screens/authentication/welcomeScreen/index.tsx`
   - Replace login handler with Supabase sign in
   - Handle Supabase-specific errors

2. **Update Login Screen**
   - Modify `src/screens/LoginScreen.tsx`
   - Replace login handler with Supabase sign in
   - Add sign up functionality if needed

3. **Create Sign Up Screen** (if needed)
   - Create new sign up screen component
   - Implement Supabase sign up with email/password
   - Handle email confirmation flow

4. **Update Auth Navigator**
   - Add sign up route if creating sign up screen
   - Update navigation flow

### Phase 4: Session Management & Token Handling (Day 3)

1. **Update Axios interceptor**
   - Modify `src/services/axios.ts`
   - Replace token retrieval with Supabase session access token
   - Handle token refresh using Supabase's built-in refresh mechanism

2. **Update KeyChain service**
   - Modify `src/services/keyChain.ts` (if still needed)
   - Consider storing Supabase session tokens
   - Or rely on Supabase's AsyncStorage session management

3. **Update navigation handler**
   - Ensure `src/services/navigationHandler.ts` works with new auth flow
   - Update auth check logic

### Phase 5: Testing & Refinement (Day 4)

1. **Test authentication flows**
   - Sign up flow
   - Sign in flow
   - Sign out flow
   - Session persistence
   - Token refresh

2. **Error handling**
   - Test various error scenarios
   - Update error messages for Supabase-specific errors
   - Handle network errors gracefully

3. **Edge cases**
   - App restart with existing session
   - Token expiration handling
   - Network connectivity issues

---

## Code Changes

### 1. Authentication Service (`src/services/supabase/auth.ts`)

```typescript
import { supabase } from './index';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { User as AppUser } from '@types';

export interface SignUpCredentials {
  email: string;
  password: string;
  metadata?: {
    firstname?: string;
    lastname?: string;
    phonenumber?: string;
    title?: string;
  };
}

export interface SignInCredentials {
  email: string;
  password: string;
}

class SupabaseAuthService {
  /**
   * Sign up a new user
   */
  async signUp(credentials: SignUpCredentials): Promise<{ user: User | null; session: Session | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: credentials.metadata || {},
        },
      });

      if (error) throw error;

      return { user: data.user, session: data.session };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(credentials: SignInCredentials): Promise<{ user: User; session: Session }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
      if (!data.user || !data.session) {
        throw new Error('Sign in failed: No user or session returned');
      }

      return { user: data.user, session: data.session };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Convert Supabase User to App User format
   */
  mapSupabaseUserToAppUser(supabaseUser: User): AppUser {
    const metadata = supabaseUser.user_metadata || {};
    return {
      id: parseInt(supabaseUser.id) || 0, // Convert UUID to number if needed
      name: `${metadata.firstname || ''} ${metadata.lastname || ''}`.trim() || supabaseUser.email || 'User',
      email: supabaseUser.email || '',
      avatar: metadata.avatar,
      firstname: metadata.firstname,
      lastname: metadata.lastname,
      phonenumber: metadata.phonenumber || supabaseUser.phone,
      title: metadata.title,
    };
  }

  /**
   * Handle auth errors and convert to user-friendly messages
   */
  private handleAuthError(error: any): Error {
    if (error?.message) {
      // Map Supabase error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        'Invalid login credentials': 'Invalid email or password',
        'Email not confirmed': 'Please confirm your email address',
        'User already registered': 'An account with this email already exists',
        'Password should be at least 6 characters': 'Password must be at least 6 characters',
      };

      return new Error(errorMessages[error.message] || error.message);
    }
    return new Error('An authentication error occurred');
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  }

  /**
   * Refresh the current session
   */
  async refreshSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
  }
}

export const supabaseAuthService = new SupabaseAuthService();
```

### 2. Update Auth Slice (`src/store/slices/authSlice.ts`)

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types';
import { StorageService } from '../../services/storage';
import { getKeyChain, setKeyChain, deleteKeyChain } from '../../services/keyChain';
import { KeyChainKeys } from '../../enums/keyChainKeys';
import { supabaseAuthService } from '../../services/supabase/auth';
import { Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Check if user is already authenticated
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const session = await supabaseAuthService.getSession();
      
      if (session?.user && session.access_token) {
        const user = supabaseAuthService.mapSupabaseUserToAppUser(session.user);
        return {
          token: session.access_token,
          refreshToken: session.refresh_token,
          user,
        };
      }
      
      return { token: null, refreshToken: null, user: null };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to check authentication');
    }
  },
);

// Sign in with email and password
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { user: supabaseUser, session } = await supabaseAuthService.signIn({
        email,
        password,
      });

      if (!session || !supabaseUser) {
        throw new Error('Sign in failed: No session returned');
      }

      const user = supabaseAuthService.mapSupabaseUserToAppUser(supabaseUser);
      
      // Store tokens in keychain for axios interceptor
      await setKeyChain(KeyChainKeys.TOKEN, session.access_token);
      await setKeyChain(KeyChainKeys.REFRESH_TOKEN, session.refresh_token);
      await StorageService.saveUser(JSON.stringify(user));

      return {
        token: session.access_token,
        refreshToken: session.refresh_token,
        user,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Sign in failed');
    }
  },
);

// Sign up with email and password
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (
    {
      email,
      password,
      metadata,
    }: {
      email: string;
      password: string;
      metadata?: {
        firstname?: string;
        lastname?: string;
        phonenumber?: string;
        title?: string;
      };
    },
    { rejectWithValue },
  ) => {
    try {
      const { user: supabaseUser, session } = await supabaseAuthService.signUp({
        email,
        password,
        metadata,
      });

      if (!session || !supabaseUser) {
        throw new Error('Sign up failed: No session returned');
      }

      const user = supabaseAuthService.mapSupabaseUserToAppUser(supabaseUser);
      
      await setKeyChain(KeyChainKeys.TOKEN, session.access_token);
      await setKeyChain(KeyChainKeys.REFRESH_TOKEN, session.refresh_token);
      await StorageService.saveUser(JSON.stringify(user));

      return {
        token: session.access_token,
        refreshToken: session.refresh_token,
        user,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Sign up failed');
    }
  },
);

// Sign out
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await supabaseAuthService.signOut();
      await deleteKeyChain(KeyChainKeys.TOKEN);
      await deleteKeyChain(KeyChainKeys.REFRESH_TOKEN);
      await StorageService.clearAll();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to logout');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.token && action.payload.user) {
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.token = null;
          state.refreshToken = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
```

### 3. Update Axios Interceptor (`src/services/axios.ts`)

```typescript
// ... existing imports ...
import { supabase } from './supabase';

// ... existing client setup ...

client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get token from Supabase session instead of keychain
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    const profileId = await getKeyChain(KeyChainKeys.PROFILE_ID);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (profileId && profileId !== '') {
      config.headers['x-profile-id'] = profileId;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async error => {
    const status = error.response ? error.response.status : null;
    const config = error.response ? error.response.config : null;
    const data = error.response ? error.response.data : null;

    if (
      status === 401 &&
      config.url !== '/signIn' &&
      config.url !== '/refreshToken'
    ) {
      try {
        // Use Supabase's built-in session refresh
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !session) {
          await supabase.auth.signOut();
          navigateToAuth();
          return Promise.reject(error);
        }

        // Retry the request with new token
        error.config.headers.Authorization = `Bearer ${session.access_token}`;
        return axios(error.config);
      } catch (refreshError) {
        await supabase.auth.signOut();
        navigateToAuth();
        return Promise.reject(refreshError);
      }
    } else if (status === 403 && data.isBanned) {
      await supabase.auth.signOut();
      navigateToRestricted();
    } else {
      // ... existing error handling ...
    }
    return Promise.reject(error);
  },
);
```

### 4. Update Welcome Screen (`src/screens/authentication/welcomeScreen/index.tsx`)

```typescript
// ... existing imports ...
import { signIn } from '@store/slices/authSlice';

const welcomeScreen: React.FC = () => {
  // ... existing code ...
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.auth.loading);
  const error = useAppSelector(state => state.auth.error);

  // ... existing useEffect hooks ...

  const renderForm = useMemo(() => {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={loginValidationSchema}
        onSubmit={async (values: any) => {
          try {
            await dispatch(signIn({
              email: values.email.trim(),
              password: values.password,
            })).unwrap();
            navigateToHome();
          } catch (error: any) {
            // Error is handled by Redux slice, but you can show toast here if needed
            console.error('Login error:', error);
          }
        }}
        validateOnMount={true}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({
          // ... existing formik props ...
        }) => (
          <View style={styles.form}>
            {/* ... existing form fields ... */}
            
            {error && (
              <AppText 
                text={error} 
                variant="error" 
                style={styles.errorText}
              />
            )}

            <Button
              title="Login"
              onPress={handleSubmit}
              loading={loading}
              disabled={!isValid || loading}
            />
          </View>
        )}
      </Formik>
    );
  }, [loading, error, dispatch]);

  // ... rest of component ...
};
```

---

## Testing Strategy

### Unit Tests

1. **Supabase Auth Service Tests**
   - Test sign up flow
   - Test sign in flow
   - Test sign out flow
   - Test session management
   - Test error handling

2. **Auth Slice Tests**
   - Test Redux actions and reducers
   - Test async thunks
   - Test state updates

### Integration Tests

1. **Authentication Flow Tests**
   - Complete sign up → email confirmation → sign in flow
   - Sign in → app usage → sign out flow
   - Session persistence across app restarts
   - Token refresh mechanism

2. **API Integration Tests**
   - Verify axios interceptor uses Supabase tokens
   - Test token refresh on 401 errors
   - Test API calls with valid/invalid tokens

### Manual Testing Checklist

- [ ] Sign up with new email
- [ ] Sign in with existing credentials
- [ ] Sign in with invalid credentials (error handling)
- [ ] Sign out
- [ ] App restart with existing session (session persistence)
- [ ] Token refresh on API call after expiration
- [ ] Network error handling
- [ ] Email confirmation flow (if enabled)
- [ ] Password reset flow (if implemented)

---

## Migration Checklist

### Pre-Migration
- [ ] Backup current authentication code
- [ ] Create feature branch: `feature/supabase-auth-integration`
- [ ] Set up Supabase project and get credentials
- [ ] Add Supabase credentials to `.env` file

### Phase 1: Core Setup
- [ ] Install Supabase dependencies
- [ ] Create Supabase client service
- [ ] Update environment configuration
- [ ] Test Supabase connection

### Phase 2: Auth Service
- [ ] Create authentication service wrapper
- [ ] Create custom auth hook (optional)
- [ ] Update Redux auth slice
- [ ] Test auth service methods

### Phase 3: UI Updates
- [ ] Update welcome screen login handler
- [ ] Update login screen
- [ ] Create sign up screen (if needed)
- [ ] Update auth navigator
- [ ] Test UI flows

### Phase 4: Integration
- [ ] Update axios interceptor
- [ ] Update keychain service (if needed)
- [ ] Update navigation handlers
- [ ] Test complete authentication flow

### Phase 5: Testing & Cleanup
- [ ] Run all tests
- [ ] Manual testing of all flows
- [ ] Remove old authentication API code
- [ ] Update documentation
- [ ] Code review

### Post-Migration
- [ ] Deploy to staging environment
- [ ] Test in staging
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Update user documentation if needed

---

## Security Considerations

### 1. Environment Variables
- ✅ Never commit `.env` file with actual credentials
- ✅ Use `.env.example` for template
- ✅ Use different Supabase projects for dev/staging/prod
- ✅ Rotate keys if accidentally exposed

### 2. Token Storage
- ✅ Supabase handles token storage securely via AsyncStorage
- ✅ Consider additional encryption for sensitive user data
- ✅ Tokens are automatically refreshed by Supabase

### 3. API Security
- ✅ Use Supabase Row Level Security (RLS) for database access
- ✅ Validate user permissions on backend
- ✅ Use service role key only on server-side (never in client)

### 4. Authentication Best Practices
- ✅ Enforce strong password requirements
- ✅ Implement rate limiting (handled by Supabase)
- ✅ Use HTTPS only (enforced by Supabase)
- ✅ Handle session expiration gracefully
- ✅ Clear sensitive data on logout

---

## Troubleshooting

### Common Issues

#### 1. "Missing Supabase environment variables"
- **Solution:** Ensure `.env` file exists with `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- **Check:** Verify `babel.config.js` includes `react-native-dotenv` plugin

#### 2. "Session not persisting after app restart"
- **Solution:** Verify AsyncStorage is properly installed and linked
- **Check:** Ensure `storage: AsyncStorage` is set in Supabase client config

#### 3. "Token refresh failing"
- **Solution:** Check if refresh token is valid and not expired
- **Solution:** Verify Supabase project settings allow token refresh
- **Check:** Ensure `autoRefreshToken: true` in Supabase client config

#### 4. "401 Unauthorized on API calls"
- **Solution:** Verify axios interceptor is getting token from Supabase session
- **Check:** Ensure token is being set correctly in Authorization header
- **Solution:** Check if token format matches backend expectations

#### 5. "Email confirmation not working"
- **Solution:** Configure redirect URLs in Supabase dashboard
- **Check:** Set up deep linking for email confirmation callbacks
- **Solution:** Verify email templates are configured correctly

### Debugging Tips

1. **Enable Supabase Debug Logging**
   ```typescript
   // In supabase client initialization
   export const supabase = createClient(url, key, {
     // ... other options
     global: {
       headers: { 'x-client-info': 'expense-manager' },
     },
   });
   ```

2. **Monitor Supabase Dashboard**
   - Check Authentication logs in Supabase dashboard
   - Monitor API usage and errors
   - Review user sessions

3. **React Native Debugger**
   - Use React Native Debugger to inspect Redux state
   - Check AsyncStorage contents
   - Monitor network requests

---

## Additional Resources

### Documentation
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

### Useful Commands

```bash
# Install dependencies
npm install @supabase/supabase-js @react-native-async-storage/async-storage

# iOS pod install
cd ios && pod install && cd ..

# Run on iOS
npm run ios

# Run on Android
npm run android

# Clear Metro bundler cache
npm start -- --reset-cache
```

---

## Notes

- This plan assumes you're keeping the existing backend API for other features (leads, expenses, etc.)
- Supabase will handle authentication, but you may still need your backend API for business logic
- Consider migrating other features to Supabase (database, storage) in future phases
- The User type mapping may need adjustment based on your actual Supabase user metadata structure
- Consider implementing password reset flow in a future update

---

## Estimated Timeline

- **Phase 1:** 2-3 hours
- **Phase 2:** 4-6 hours
- **Phase 3:** 3-4 hours
- **Phase 4:** 2-3 hours
- **Phase 5:** 3-4 hours

**Total:** ~14-20 hours of development time

---

**Last Updated:** February 3, 2026
**Version:** 1.0
