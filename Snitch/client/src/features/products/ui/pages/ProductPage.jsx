import React, { useEffect } from 'react'
import { ProductGrid } from '../components/ProductGrid'
import useProduct from '../../hooks/useProduct'

const ProductPage = () => {
  const {fetchProducts,products,isLoading,error} = useProduct()

  useEffect(() => {
     fetchProducts()
  },[])

  console.log(products)
  return (
    <div>
      <ProductGrid
      products={products}
      isLoading={isLoading}
      error={error}/>
    </div>
  )
}

export default ProductPage