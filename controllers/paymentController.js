import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Transaction from '../models/transactionModel.js';




const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;
const RETURN_URL = process.env.RETURN_URL;
const CANCEL_URL = process.env.CANCEL_URL;
const NOTIFY_URL = process.env.NOTIFY_URL;

console.log("💬 PAYFAST_MERCHANT_ID:", PAYFAST_MERCHANT_ID);
console.log("💬 PAYFAST_MERCHANT_KEY:", PAYFAST_MERCHANT_KEY);
console.log("💬 RETURN_URL:", RETURN_URL);
console.log("💬 CANCEL_URL:", CANCEL_URL);
console.log("💬 NOTIFY_URL:", NOTIFY_URL);

// ✅ INITIATE PAYFAST PAYMENT (HTML redirect flow)
export const initiatePayfastPayment = asyncHandler(async (req, res) => {
  const { amount, userEmail, userId } = req.body;

  if (!amount || !userEmail || !userId) {
    return res.status(400).json({ message: 'Missing payment details' });
  }

  const html = `
    <html>
      <body onload="document.forms[0].submit()">
        <form action="https://sandbox.payfast.co.za/eng/process" method="post">
          <input type="hidden" name="merchant_id" value="${PAYFAST_MERCHANT_ID}" />
          <input type="hidden" name="merchant_key" value="${PAYFAST_MERCHANT_KEY}" />
          <input type="hidden" name="return_url" value="${RETURN_URL}" />
          <input type="hidden" name="cancel_url" value="${CANCEL_URL}" />
          <input type="hidden" name="notify_url" value="${NOTIFY_URL}" />
          <input type="hidden" name="amount" value="${parseFloat(amount).toFixed(2)}" />
          <input type="hidden" name="item_name" value="DiskiPred Top-up" />
          <input type="hidden" name="email_address" value="${userEmail}" />
          <input type="hidden" name="custom_str1" value="${userId}" />
        </form>
      </body>
    </html>
  `;

  return res.status(200).send(html);
});

// ✅ PAYFAST IPN HANDLER
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

