import orderModel from "../models/order.model"


export async function createOrder (req,res) {
    const user = req.user

   const cart = await cartModel.findOne({
    user:user.id
   }).populate("products.product")

    if(!cart) {
        return res.status(400).json({
        message:"cart is empty ",
        
    })
    }

    if(cart.products.length === 0) {
          return res.status(400).json({
        message:"cart is empty ",
        
    })
    }


const publishedProduct = await cart.products.filter((val) => val.isPublished)

if(publishedProduct.length !== cart.products.length) {
      return res.status(400).json({
        message:"some product are not listed ",
        
    })
}

   const sizeErrors = []
    cart.products.forEach(p => {
        const productSize = p.size

        const size = p.product.sizes.find(s => {
            return s.size === productSize
        })

        if (!size) {
            sizeErrors.push({
                product: p.product._id,
                message: `Size ${productSize} is not available for this product`
            })
            return
        }

        const isStockAvailable = size.stock >= p.quantity

        if (!isStockAvailable) {
            sizeErrors.push({
                product: p.product._id,
                message: `Only ${size.stock} items available for size ${productSize}`
            })
            return
        }
    })

    if (sizeErrors.length > 0) {
        return res.status(400).json({
            message: "Some products have size or stock issues",
            errors: sizeErrors
        })
    }

    await productModel.bulkWrite(
        cart.products.map(product => {
            return {
                updateOne: {
                    filter: {
                        _id: product.product._id,
                        "sizes.size": product.size
                    },
                    update: {
                        $inc: {
                            "sizes.$.stock": -product.quantity
                        }
                    }
                }
            }
        })
    )

    const order = await orderModel.create({
        user: user.id,
        address: req.body.address,
        products: cart.products.map(product => {
            return {
                product: {
                    title: product.product.title,
                    description: product.product.description,
                    price: product.product.price,
                    image: product.product.images[ 0 ],
                    productId: product.product._id
                },
                quantity: product.quantity,
                size: product.size
            }
        }),
        totalPrice: {
            amount: cart.products.reduce((total, product) => {
                return total + product.product.price * product.quantity
            }, 0),
            currency: "INR"
        }
    })

    return res.status(201).json({
        message: "Order placed successfully",
        data: {
            order
        }
    })

    }

export async function getOder (req,res) {
    const user = req.user

    const orders = await orderModel.findOne({user:user.id}).sort({createdAt: -1})

    if(!orders) {
        res.status(404).json({
        message:"no order found",
        
    })
    }

    res.status(200).json({
        message:"order fetched successfully",
        data:{
            orders
        }
    })
}

export const cancelOrder = async (req, res) => {
    const user = req.user
    const { orderid } = req.params


    const order = await orderModel.findOne({
        _id: orderid
    })

    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        })
    }

    if (order.user.toString() !== user.id) {
        return res.status(403).json({
            message: "You are not authorized to cancel this order"
        })
    }

    if (order.status == "CANCELLED") {
        return res.status(400).json({
            message: "Order is already cancelled"
        })
    }

    if ([ "DELIVERED", "SHIPPED" ].includes(order.status)) {
        return res.status(400).json({
            message: "Order cannot be cancelled as it is already " + order.status.toLowerCase()
        })
    }

    await orderModel.updateOne(
        { _id: orderid },
        { $set: { status: "CANCELLED" } }
    )

    return res.status(200).json({
        message: "Order canceled Successfully"
    })

}


export const updateOrder = async (req, res) => {
      const user = req.user

      if(user.role !== "seller") {
        return res.status(403).json({
            message:"you are not allowed to update order"
        })
      }

      const order = req.body
      const orderId = req.params

      if(!orderId) {
         return res.status(404).json({
            message:"order not found"
        })
      }

      if(order === "PLACED") {
        
        if ([ "CANCELLED", "DELIVERED", "SHIPPED" ].includes(order.status)) {
            return res.status(400).json({
                message: "Order status cannot be changed to PLACED as it is already " + order.status.toLowerCase()
            })
        }

        await orderModel.updateOne(
            {_id:orderId},
            {$set:{status:"PLACED"}}
        )
      }

        if(orderStatus === "SHIPPED") {
        
        if ([ "CANCELLED", "DELIVERED" ].includes(order.status)) {
            return res.status(400).json({
                message: "Order status cannot be changed to PLACED as it is already " + order.status.toLowerCase()
            })
        }

        await orderModel.updateOne(
            {_id:orderId},
            {$set:{status:"SHIPPED"}}
        )
      }

        if(orderStatus === "DELIVERED") {
        
        if ([ "CANCELLED" ].includes(order.status)) {
            return res.status(400).json({
                message: "Order status cannot be changed to PLACED as it is already " + order.status.toLowerCase()
            })
        }

        await orderModel.updateOne(
            {_id:orderId},
            {$set:{status:"DELIVERED"}}
        )
      }

      res.status(200).json({
        message:"status update successfully "
      })
}
