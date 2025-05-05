import { configureStore, } from '@reduxjs/toolkit';
import AuthSlice from './slices/AuthSlice';

export const AppStore = configureStore<AppStore>({
  reducer: {
    auth: AuthSlice,
   
  },
})