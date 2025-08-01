
import qs from 'querystring';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Transaction from '../models/transactionModel.js';

dotenv.config();

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;

const isProd = process.env.NODE_ENV === 'production';

const RETURN_URL = isProd
  ? process.env.RETURN_URL
  : 'http://localhost:5173/payment-success';

const CANCEL_URL = isProd
  ? process.env.CANCEL_URL
  : 'http://localhost:5173/payment-cancel';

const NOTIFY_URL = isProd
  ? process.env.NOTIFY_URL
  : 'http://localhost:3000/api/payments/notify';

console.log("💬 PAYFAST_MERCHANT_ID:", PAYFAST_MERCHANT_ID);
console.log("💬 PAYFAST_MERCHANT_KEY:", PAYFAST_MERCHANT_KEY);
console.log("💬 RETURN_URL:", RETURN_URL);
console.log("💬 CANCEL_URL:", CANCEL_URL);
console.log("💬 NOTIFY_URL:", NOTIFY_URL);

// ✅ Initiate Payfast Payment - returns redirect URL
export const initiatePayfastPayment = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const user = req.user;

  if (!amount || !user) {
    return res.status(400).json({ message: 'Missing payment info' });
  }

  const paymentData = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: RETURN_URL,
    cancel_url: CANCEL_URL,
    notify_url: NOTIFY_URL,
    amount: parseFloat(amount).toFixed(2),
    item_name: 'DiskiPred Top-up',
    email_address: user.email,
    custom_str1: user._id.toString(),
  };

  const queryString = qs.stringify(paymentData);
  const redirectUrl = `https://sandbox.payfast.co.za/eng/process?${queryString}`;

  return res.status(200).json({ redirectUrl });
});

// ✅ Handle IPN Notifications
export const payfastNotifyHandler = asyncHandler(async (req, res) => {
  const ipnData = req.body;

  console.log("📩 Payfast IPN received:", ipnData);

  const paymentStatus = ipnData.payment_status;
  const amount = parseFloat(ipnData.amount_gross);
  const userId = ipnData.custom_str1;

  if (!userId || isNaN(amount)) {
    console.warn("⚠️ Invalid IPN payload");
    return res.status(400).send("Invalid data");
  }

  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const transaction = {
      user: userId,
      amount,
      status: paymentStatus,
      gateway: 'payfast',
      reference: ipnData.pf_payment_id || '',
      raw: ipnData,
    };

    if (paymentStatus === 'COMPLETE') {
      user.balance = (user.balance || 0) + amount;
      await user.save();
    }

    await Transaction.create(transaction);

    res.status(200).send(paymentStatus === 'COMPLETE' ? "OK" : "Received but not complete");
  } catch (err) {
    console.error("❌ IPN processing error:", err.message);
    res.status(500).send("Server error");
  }
});
