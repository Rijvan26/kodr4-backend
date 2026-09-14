import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"

export async  function addProductToCart (req,res) {

 const productId = req.params
 const {size:productSize,quantity} = req.body

 const product = await productModel.findOne({
    _id:productId
 })

 if(!product) {
    return res.status(404).json({
        message:"product not found"
    })
 }

 //check size is valid or not or find in avalaible sizes
 const size = await product.sizes.find((s) => s.size === productSize)

 if(!size) {
return res.status(404).json({
        message:"invalid size"
    })
 }

  if(quantity > size.stock) {
    return res.status(404).json({
        message:"insufficent quantity"
    })
  }    

  //find cart and if not exist create new one 
  const cart = (await cartModel.findOne({user:req.user.id})) ?? await cartModel.create({user:req.user.id})


  //check product is already in cart if in increase quantity only
 const productInCart = cart.products.find(p => p.product.toString() === productId && p.size === productSize);

    if (productInCart) {

        const totalQuantity = productInCart.quantity + quantity;

        if (totalQuantity > size.stock) {
            return res.status(400).json({
                message: `Insufficient stock. Available: ${size.stock}`
            })
        }


         await cartModel.findOneAndUpdate({
            user: req.user.id,
            arrayFilters: [ { "elem.product": productId, "elem.size": productSize } ]
        }, {
            $set: {
                "products.$[elem].quantity": totalQuantity
            }
        })


    } else {

        await cartModel.findOneAndUpdate({
            user: req.user.id,
        }, {
            $push: {
                products: {
                    product: productId,
                    size: productSize,
                    quantity: quantity
                }
            }
        })
    }

    return res.status(200).json({ message: "Product added to cart successfully" });
}

export async  function removeProductFromCart (req,res) {
    const productId = req.params
 const {size:productSize,quantity} = req.body

 const product = await productModel.findOne({
    _id:productId
 })

 if(!product) {
    return res.status(404).json({
        message:"product not found"
    })
 }

 const cart = await cartModel.findOne({user:req.user.id})

 if(!cart) {
    return res.status(400).json({
        message:"cart is empty"
    })
 }

 const productInCart = cart.products.finc(p => {
    return  p.product.toString() === productId && p.size === productSize
 })

 if(!productInCart) {
    return res.status(404).json({
        message:"product not found"
    })
 }


if (productInCart.quantity <= quantity) {
     const user = req.user.id
     await cartModel.findOneAndUpdate({
        user:user
     },{
        $pull:{
            products: {
                    product: productId,
                    size: productSize,
                }
        }
     })
        

    } else {
const newQuantity = productInCart.quantity - quantity;

        


         await cartModel.findOneAndUpdate({
            user: req.user.id,
            arrayFilters: [ { "elem.product": productId, "elem.size": productSize } ]
        }, {
            $set: {
                "products.$[elem].quantity": newQuantity
            }
        })
       
    }

    return res.status(200).json({ message: "Product added to cart successfully" });

}

export const getCart = async (req,res) => {
    const user  = req.user

    const cart = (await cartModel.findOne({user:user.id})) || await cartModel.create({user:user.id})

    const totalPrice = cart.products.reduce((total,item) => {
        return total + (item.product.price.amount * item.quantity)
    },0)

    res.status(200).json({
        message:"cart fetched successfully"
    })
}


