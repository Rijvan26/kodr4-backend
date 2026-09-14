import authApi from "../api/auth.api";
import React, { useCallback,useEffect } from 'react'
import {useDispatch, useSelector} from "react-redux"
import { clearAuthError, loginUser, registerUser,fetchCurrentUser } from "../state/authSlice";

const useAuth = () => {
  const dispatch = useDispatch()
  const {token, user,isAuthentication,error,isLoading} = useSelector(
    (state) =>   state.auth
)

useEffect(() => {
  if(!token && !user && !isLoading) {
    dispatch(fetchCurrentUser())
  }
},[token , user , dispatch,isLoading])

 const register = useCallback(
    async (userData) => {
      const resultAction = await dispatch(registerUser(userData)) // Run the thunk and give me the final Redux action.
      return registerUser.fulfilled.match(resultAction)  // Check whether that final action represents a successful registration.
    },
    [dispatch]
  )

  const login = useCallback(
    async(credentials) => {
      const resultAction = await dispatch(loginUser(credentials))
      return loginUser.fulfilled.match(resultAction)
    },
    [dispatch]
  )

  const signout = useCallback(() => {
    dispatch(logout())
  },[dispatch])

  const clearError = useCallback(() => [
    dispatch(clearAuthError())
  ],[dispatch])
   

  return {
    token, 
    user,isAuthentication,error,isLoading,
    isSeller : user?.role === "seller",
    register,
    login,
    signout,
    clearError
  }
}

export default useAuth