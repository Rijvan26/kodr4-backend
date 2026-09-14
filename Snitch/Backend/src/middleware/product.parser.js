export function parseProductBody(req, res, next) {
    try {
        req.body.price = JSON.parse(req.body.price)
        req.body.categories = JSON.parse(req.body.categories)
        req.body.sizes = JSON.parse(req.body.sizes)

        next()
    } catch (error) {
        return res.status(400).json({
            message: "Invalid product data format"
        })
    }
}