
import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    token: null,
  }


  export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      addUserToken: (state,action) => {
        state.token = action.payload;
      },
      removeUserToken: (state) => {
        state.token = null
      },
     
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { addUserToken, removeUserToken } = userSlice.actions
  
  export default userSlice.reducer;
