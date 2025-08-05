// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const getInitialState = () => {
    const token = localStorage.getItem('token');
    // Also get fullName from localStorage on initial load
    const fullName = localStorage.getItem('fullName'); 
    if (token) {
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.clear(); // Clear all auth-related items
                return { token: null, role: null, isAuthenticated: false, profileComplete: false, fullName: null };
            }
            return { token, role: decoded.role, isAuthenticated: true, profileComplete: decoded.profile_complete, fullName };
        } catch (error) {
            localStorage.clear();
            return { token: null, role: null, isAuthenticated: false, profileComplete: false, fullName: null };
        }
    }
    return { token: null, role: null, isAuthenticated: false, profileComplete: false, fullName: null };
};

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.isAuthenticated = true;
            state.profileComplete = action.payload.profileComplete;
            state.fullName = action.payload.fullName; // Set fullName
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('fullName', action.payload.fullName); // Store fullName
        },
        logout: (state) => {
            state.token = null;
            state.role = null;
            state.isAuthenticated = false;
            state.profileComplete = false;
            state.fullName = null; // Clear fullName
            localStorage.clear(); // Clear all on logout
        },
        setProfileComplete: (state, action) => {
            state.profileComplete = action.payload;
        },
    },
});

export const { loginSuccess, logout, setProfileComplete } = authSlice.actions;
export default authSlice.reducer;
