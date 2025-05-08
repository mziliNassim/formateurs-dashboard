const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the Apps API",
  });
});

module.exports = router;
