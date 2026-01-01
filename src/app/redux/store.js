
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userSlice'
import linearProgressReducer from './reducers/linearProgressSlice'

export const store = configureStore({
    reducer: {
        user:userReducer,
        linearProgress:linearProgressReducer,
    },
  })