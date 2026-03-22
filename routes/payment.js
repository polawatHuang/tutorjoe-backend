// routes/payment.js
router.post("/create", async (req, res) => {
  const { amount } = req.body;

  const qr = createPromptPayQR("0957249324", amount);

  res.json({ qr });
});

module.exports = router;