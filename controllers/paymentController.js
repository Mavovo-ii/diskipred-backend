import qs from 'querystring'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import  Transaction  from '../models/transactionModel.js'


const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY
const RETURN_URL = process.env.RETURN_URL
const CANCEL_URL = process.env.CANCEL_URL
const NOTIFY_URL = process.env.NOTIFY_URL


//Initiating Payfast Payment
export const initiatePayfastPayment = asyncHandler(async(req, res) => {
    const {amount, userEmail, userId } =  req.body

    const paymentData = {
        merchant_id: PAYFAST_MERCHANT_ID,
        merchant_key: PAYFAST_MERCHANT_KEY,
        return_url: RETURN_URL,
        cancel_url: CANCEL_URL,
        notify_url:NOTIFY_URL,
        amount: parseFloat(amount).toFixed(2),
        item_name: 'DiskiPred Top-up',
        email_address: userEmail,
        custom_str1: userId
    }

    const query = qs.stringify(paymentData)
    const payfastUrl = `https://www.payfast.co.za/eng/process?${query}`

    res.status(200).json({url: payfastUrl})
})

//Payfast Notification Handler(IPN)
export const payfastNotifyHandler = asyncHandler(async(req, res) => {
    const ipnData = req.body

    const paymentStatus = ipnData.payment_status
    const amount = parseFloat(ipnData.amount_gross)
    const userId = ipnData.custom_str1

    if(paymentStatus === 'COMPLETE') {
        const user = await User.findById(userId)
        if (!user) throw new Error('User not found')

        user.balance = (user.balance || 0) + amount
        await user.save()

        await Transaction.create({
            user: userId,amount,
            status: 'complete',
            gateway: 'payfast',
            reference: ipnData.pf_payment_id || '',
            raw: ipnData
        })

        return res.status(200).send("OK")
    }

    //save failed or pending transaction
    await Transaction.create({
        user: userId, amount,
        status: paymentStatus,
        gateway: 'payfast',
        reference: ipnData.pf_payment_id || '',
        raw: ipnData
    })

    res.status(200).send('Received but not complete')
})