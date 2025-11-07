import { configureStore } from '@reduxjs/toolkit';
import memberReducer from "../features/member/memberSlice";
export const store = configureStore({
  reducer: {
    members:memberReducer,

  },
});

export default store;