// services/promptpay.js
const generatePayload = require("promptpay-qr");

function createPromptPayQR(phone, amount) {
  return generatePayload(phone, { amount });
}

module.exports = {
  createPromptPayQR,
};