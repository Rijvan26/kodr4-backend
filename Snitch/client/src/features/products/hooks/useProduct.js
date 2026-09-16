import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../state/productSlice'

const useProduct = () => {
    const {products,isLoading,error} = useSelector(
        (state) => state.products
    )
    const dispatch = useDispatch()

    const fetchProducts = useCallback(
        async () => {
            const resultAction = await dispatch(getAllProducts())
            return getAllProducts.fulfilled.match(resultAction)
        },[dispatch]
    )
  return {
    fetchProducts,
    products,
    error,
    isLoading
  }
}

export default useProduct