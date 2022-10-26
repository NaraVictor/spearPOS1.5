const router = require("express").Router();

// Users routes

router.all("/", async (req, res) => {
	res.send({
		message: "Welcome to waffle spearPOS API Endpoint",
	});
});
router.use(require("./user"));
router.use(require("./product"));
router.use(require("./sale"));
router.use(require("./category"));
router.use(require("./company"));
router.use(require("./expense"));
router.use(require("./purchase-order"));
router.use(require("./staff"));
router.use(require("./supplier"));
router.use(require("./dashboard"));
router.use(require("./audit"));
router.use(require("./activity"));
router.use(require("./register"));
router.use(require("./customer"));
// router.use(require("./sub-category"));
// router.use(require("./brand"));
// router.use(require("./order"));
module.exports = router;
