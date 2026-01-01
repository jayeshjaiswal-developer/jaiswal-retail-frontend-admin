
import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    isClicked: false,
    isSideMenuClicked:-1,
  }


  export const linearProgressSlice = createSlice({
    name: 'linearProgress',
    initialState,
    reducers: {
      showLinearBar: (state) => {
        state.isClicked = true;
      },
      hideLinearBar: (state) => {
        state.isClicked = false
      },
      updateSideMenuClicked: (state,action)=>{
        state.isSideMenuClicked = action.payload;
      }
     
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { showLinearBar, hideLinearBar, updateSideMenuClicked } = linearProgressSlice.actions
  
  export default linearProgressSlice.reducer;
