const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name can not be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  salaryMin: {
    type: Number,
    min: [0, 'Minimum salary must be greater than 0']
  },
  salaryMax: {
    type: Number,
    min: [0, 'Maximum salary must be greater than 0']
  },
  exprienceLevel: {
    type: String,
    required: true,
    enum: ['Intern', 'Junior', 'Mid', 'Senior', 'Expert']
  },
  mustHave: {
    type: [String]
  },
  niceToHave: {
    type: [String]
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company'
  }
});

OfferSchema.pre('save', function (next) {
  if (this.salaryMin >= this.salaryMax) {
    const err = new Error('Maximum salary must be greater than minimum salary');
    next(err);
  } else {
    next();
  }
});

module.exports = mongoose.model('Offer', OfferSchema);
