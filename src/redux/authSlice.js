import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,  // Stores user details (id, email, role, etc.)
  token: null, // Stores authentication token
  isAuthenticated: false, // Tracks authentication status
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
