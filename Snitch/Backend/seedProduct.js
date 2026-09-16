import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns"
dns.setServers(['1.1.1.1','8.8.8.8'])
import productModel from "./src/models/product.model.js";

dotenv.config();

const sellerId = new mongoose.Types.ObjectId("6a9f45bcbb678f71e347cadd");

const products = [
    {
        title: "Classic Black Oversized T-Shirt",
        description: "Premium cotton oversized t-shirt with a relaxed fit for everyday casual wear.",
        price: {
            amount: 799,
            currency: "INR"
        },
        categories: ["T-Shirts", "Men", "Oversized"],
        images: [
            {
                imagekitId: "product-001",
                url: "https://placehold.co/800x1000?text=Black+T-Shirt",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 20 },
            { size: "M", stock: 30 },
            { size: "L", stock: 25 },
            { size: "XL", stock: 15 }
        ],
        isPublished: true
    },

    {
        title: "White Essential T-Shirt",
        description: "Minimal white cotton t-shirt designed for comfortable everyday styling.",
        price: {
            amount: 599,
            currency: "INR"
        },
        categories: ["T-Shirts", "Men", "Basics"],
        images: [
            {
                imagekitId: "product-002",
                url: "https://placehold.co/800x1000?text=White+T-Shirt",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "XS", stock: 10 },
            { size: "S", stock: 25 },
            { size: "M", stock: 35 },
            { size: "L", stock: 25 },
            { size: "XL", stock: 15 }
        ],
        isPublished: true
    },

    {
        title: "Beige Relaxed Fit Shirt",
        description: "A relaxed beige shirt made from lightweight fabric for a clean modern look.",
        price: {
            amount: 1299,
            currency: "INR"
        },
        categories: ["Shirts", "Men", "Casual"],
        images: [
            {
                imagekitId: "product-003",
                url: "https://placehold.co/800x1000?text=Beige+Shirt",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 15 },
            { size: "M", stock: 25 },
            { size: "L", stock: 30 },
            { size: "XL", stock: 12 }
        ],
        isPublished: true
    },

    {
        title: "Dark Blue Straight Jeans",
        description: "Classic dark blue straight-fit jeans with durable denim and everyday comfort.",
        price: {
            amount: 1799,
            currency: "INR"
        },
        categories: ["Jeans", "Men", "Denim"],
        images: [
            {
                imagekitId: "product-004",
                url: "https://placehold.co/800x1000?text=Blue+Jeans",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 12 },
            { size: "M", stock: 20 },
            { size: "L", stock: 25 },
            { size: "XL", stock: 10 }
        ],
        isPublished: true
    },

    {
        title: "Olive Cargo Pants",
        description: "Utility-inspired olive cargo pants with multiple pockets and a relaxed fit.",
        price: {
            amount: 1599,
            currency: "INR"
        },
        categories: ["Pants", "Men", "Cargo"],
        images: [
            {
                imagekitId: "product-005",
                url: "https://placehold.co/800x1000?text=Olive+Cargo",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 15 },
            { size: "M", stock: 25 },
            { size: "L", stock: 20 },
            { size: "XL", stock: 10 }
        ],
        isPublished: true
    },

    {
        title: "Charcoal Hoodie",
        description: "Warm charcoal hoodie with a soft interior and relaxed streetwear-inspired fit.",
        price: {
            amount: 1499,
            currency: "INR"
        },
        categories: ["Hoodies", "Men", "Winter"],
        images: [
            {
                imagekitId: "product-006",
                url: "https://placehold.co/800x1000?text=Charcoal+Hoodie",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 10 },
            { size: "M", stock: 20 },
            { size: "L", stock: 25 },
            { size: "XL", stock: 15 },
            { size: "XXL", stock: 5 }
        ],
        isPublished: true
    },

    {
        title: "Cream Oversized Sweatshirt",
        description: "Soft cream sweatshirt featuring an oversized silhouette and minimal design.",
        price: {
            amount: 1399,
            currency: "INR"
        },
        categories: ["Sweatshirts", "Men", "Oversized"],
        images: [
            {
                imagekitId: "product-007",
                url: "https://placehold.co/800x1000?text=Cream+Sweatshirt",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 15 },
            { size: "M", stock: 20 },
            { size: "L", stock: 25 },
            { size: "XL", stock: 10 }
        ],
        isPublished: true
    },

    {
        title: "Brown Corduroy Jacket",
        description: "Textured brown corduroy jacket designed for layering during cooler weather.",
        price: {
            amount: 2199,
            currency: "INR"
        },
        categories: ["Jackets", "Men", "Winter"],
        images: [
            {
                imagekitId: "product-008",
                url: "https://placehold.co/800x1000?text=Corduroy+Jacket",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 8 },
            { size: "M", stock: 15 },
            { size: "L", stock: 20 },
            { size: "XL", stock: 8 }
        ],
        isPublished: true
    },

    {
        title: "Sky Blue Polo T-Shirt",
        description: "Classic sky blue polo t-shirt with a comfortable regular fit and clean collar.",
        price: {
            amount: 899,
            currency: "INR"
        },
        categories: ["Polo", "Men", "T-Shirts"],
        images: [
            {
                imagekitId: "product-009",
                url: "https://placehold.co/800x1000?text=Blue+Polo",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 15 },
            { size: "M", stock: 25 },
            { size: "L", stock: 25 },
            { size: "XL", stock: 15 }
        ],
        isPublished: true
    },

    {
        title: "Black Slim Fit Trousers",
        description: "Smart black trousers with a slim silhouette suitable for formal and casual outfits.",
        price: {
            amount: 1499,
            currency: "INR"
        },
        categories: ["Trousers", "Men", "Formal"],
        images: [
            {
                imagekitId: "product-010",
                url: "https://placehold.co/800x1000?text=Black+Trousers",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 10 },
            { size: "M", stock: 20 },
            { size: "L", stock: 20 },
            { size: "XL", stock: 10 }
        ],
        isPublished: true
    },

    {
        title: "Maroon Graphic T-Shirt",
        description: "Relaxed maroon t-shirt featuring a minimal graphic print and soft cotton fabric.",
        price: {
            amount: 749,
            currency: "INR"
        },
        categories: ["T-Shirts", "Men", "Graphic"],
        images: [
            {
                imagekitId: "product-011",
                url: "https://placehold.co/800x1000?text=Maroon+T-Shirt",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 20 },
            { size: "M", stock: 30 },
            { size: "L", stock: 25 },
            { size: "XL", stock: 15 }
        ],
        isPublished: true
    },

    {
        title: "Stone Wash Denim Jacket",
        description: "Vintage-inspired stone wash denim jacket with a relaxed fit and durable construction.",
        price: {
            amount: 1999,
            currency: "INR"
        },
        categories: ["Jackets", "Men", "Denim"],
        images: [
            {
                imagekitId: "product-012",
                url: "https://placehold.co/800x1000?text=Denim+Jacket",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 8 },
            { size: "M", stock: 15 },
            { size: "L", stock: 20 },
            { size: "XL", stock: 10 }
        ],
        isPublished: true
    },

    {
        title: "Black Jogger Pants",
        description: "Comfortable black joggers with an elastic waistband and tapered everyday fit.",
        price: {
            amount: 1099,
            currency: "INR"
        },
        categories: ["Joggers", "Men", "Sportswear"],
        images: [
            {
                imagekitId: "product-013",
                url: "https://placehold.co/800x1000?text=Black+Joggers",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 15 },
            { size: "M", stock: 25 },
            { size: "L", stock: 25 },
            { size: "XL", stock: 15 }
        ],
        isPublished: true
    },

    {
        title: "Forest Green Overshirt",
        description: "Versatile forest green overshirt that works as a lightweight jacket or shirt.",
        price: {
            amount: 1399,
            currency: "INR"
        },
        categories: ["Shirts", "Men", "Overshirts"],
        images: [
            {
                imagekitId: "product-014",
                url: "https://placehold.co/800x1000?text=Green+Overshirt",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 10 },
            { size: "M", stock: 20 },
            { size: "L", stock: 20 },
            { size: "XL", stock: 10 }
        ],
        isPublished: true
    },

    {
        title: "Light Grey Basic Hoodie",
        description: "Minimal light grey hoodie made with soft fabric and a comfortable regular fit.",
        price: {
            amount: 1299,
            currency: "INR"
        },
        categories: ["Hoodies", "Men", "Basics"],
        images: [
            {
                imagekitId: "product-015",
                url: "https://placehold.co/800x1000?text=Grey+Hoodie",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 15 },
            { size: "M", stock: 25 },
            { size: "L", stock: 25 },
            { size: "XL", stock: 15 }
        ],
        isPublished: true
    },

    {
        title: "Navy Blue Casual Shirt",
        description: "Classic navy casual shirt made from lightweight fabric for everyday styling.",
        price: {
            amount: 1199,
            currency: "INR"
        },
        categories: ["Shirts", "Men", "Casual"],
        images: [
            {
                imagekitId: "product-016",
                url: "https://placehold.co/800x1000?text=Navy+Shirt",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 10 },
            { size: "M", stock: 20 },
            { size: "L", stock: 25 },
            { size: "XL", stock: 10 }
        ],
        isPublished: true
    },

    {
        title: "Off White Linen Shirt",
        description: "Breathable off white linen shirt designed for warm weather and relaxed occasions.",
        price: {
            amount: 1599,
            currency: "INR"
        },
        categories: ["Shirts", "Men", "Linen"],
        images: [
            {
                imagekitId: "product-017",
                url: "https://placehold.co/800x1000?text=Linen+Shirt",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 12 },
            { size: "M", stock: 20 },
            { size: "L", stock: 20 },
            { size: "XL", stock: 10 }
        ],
        isPublished: true
    },

    {
        title: "Washed Grey Baggy Jeans",
        description: "Relaxed baggy jeans with a washed grey finish and modern streetwear silhouette.",
        price: {
            amount: 1899,
            currency: "INR"
        },
        categories: ["Jeans", "Men", "Baggy"],
        images: [
            {
                imagekitId: "product-018",
                url: "https://placehold.co/800x1000?text=Grey+Jeans",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 10 },
            { size: "M", stock: 20 },
            { size: "L", stock: 20 },
            { size: "XL", stock: 10 }
        ],
        isPublished: true
    },

    {
        title: "Rust Relaxed T-Shirt",
        description: "Rust-colored relaxed t-shirt crafted from soft cotton for casual daily outfits.",
        price: {
            amount: 699,
            currency: "INR"
        },
        categories: ["T-Shirts", "Men", "Basics"],
        images: [
            {
                imagekitId: "product-019",
                url: "https://placehold.co/800x1000?text=Rust+T-Shirt",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 15 },
            { size: "M", stock: 30 },
            { size: "L", stock: 25 },
            { size: "XL", stock: 15 }
        ],
        isPublished: true
    },

    {
        title: "Black Bomber Jacket",
        description: "Modern black bomber jacket with a clean silhouette designed for everyday streetwear.",
        price: {
            amount: 2499,
            currency: "INR"
        },
        categories: ["Jackets", "Men", "Streetwear"],
        images: [
            {
                imagekitId: "product-020",
                url: "https://placehold.co/800x1000?text=Bomber+Jacket",
                order: 1
            }
        ],
        seller: sellerId,
        sizes: [
            { size: "S", stock: 8 },
            { size: "M", stock: 15 },
            { size: "L", stock: 20 },
            { size: "XL", stock: 10 },
            { size: "XXL", stock: 5 }
        ],
        isPublished: true
    }
];

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await productModel.deleteMany({});

        await productModel.insertMany(products);

        console.log("20 products inserted successfully");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seedProducts();