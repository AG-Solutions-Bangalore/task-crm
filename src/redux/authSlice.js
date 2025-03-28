import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  company_id: null,
  id: null,
  mobile: null,
  name: null,
  user_type: null,
  email: null,
  last_login: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.company_id = action.payload.company_id;
      state.id = action.payload.id;
      state.mobile = action.payload.mobile;
      state.name = action.payload.name;
      state.user_type = action.payload.user_type;
      state.email = action.payload.email;
      state.last_login = action.payload.last_login;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
