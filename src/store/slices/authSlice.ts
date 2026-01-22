import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types';
import { StorageService } from '../../services/storage';
import { getKeyChain, setKeyChain, deleteKeyChain } from '../../services/keyChain';
import { KeyChainKeys } from '../../enums/keyChainKeys';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getKeyChain(KeyChainKeys.TOKEN);
      const userData = await StorageService.getUser();
      
      if (token && userData) {
        const user = JSON.parse(userData);
        return { token, user };
      }
      return { token: null, user: null };
    } catch (error) {
      return rejectWithValue('Failed to check authentication');
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    { token, user }: { token: string; user: User },
    { rejectWithValue },
  ) => {
    try {
      await setKeyChain(KeyChainKeys.TOKEN, token);
      await StorageService.saveUser(JSON.stringify(user));
      return { token, user };
    } catch (error) {
      return rejectWithValue('Failed to save authentication data');
    }
  },
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await deleteKeyChain(KeyChainKeys.TOKEN);
      await StorageService.clearAll();
      return null;
    } catch (error) {
      return rejectWithValue('Failed to logout');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.token && action.payload.user) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
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

export default authSlice.reducer;
