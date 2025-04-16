import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,  // Stores user details (id, email, role, etc.)
  isAuthenticated: false,
  token:null // Tracks authentication status
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token; // Store the token if needed
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null; // Clear the token on logout
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
