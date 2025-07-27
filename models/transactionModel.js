import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['complete', 'failed', 'pending'],
    default: 'pending',
  }, 
  gateway: {
    type: String,
    default: 'payfast',
  },
  reference: {
    type: String,
  },
  raw: {
    type: Object,
  }
}, {
  timestamps: true, // ✅ Move it here
})

const Transaction = mongoose.model('Transaction', transactionSchema)
export default Transaction
