const express = require( "express" );
const router = express.Router();

const product = require( "../controllers/product.js" );
const authenticateToken = require( "../middleware/auth" );
const productValidator = require( "../middleware/product" );

// routes

// basic crud routes
router.get( "/api/products/:id", product.getProductById );
router.get( "/api/products/category/:categoryId", product.getProductByCategory );

router.get( "/api/products", product.getProducts );

router.post(
	"/api/products",
	authenticateToken,
	productValidator,
	product.newProduct
);

router.delete( "/api/products/:id", authenticateToken, product.deleteProduct );

router.put(
	"/api/products",
	authenticateToken,
	productValidator,
	product.updateProduct
);

module.exports = router;
