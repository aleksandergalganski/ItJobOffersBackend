const mongoose = require('mongoose');
const slugify = require('slugify');
const Company = require('./Company');
const ErrorResponse = require('../utils/errorResponse');

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
  experienceLevel: {
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
    next(new ErrorResponse('Maximum salary must be greater than minimum salary', 400));
  } else {
    next();
  }
});

OfferSchema.pre('save', async function (next) {
  const company = await Company.findById(this.company);
  this.slug = slugify(this.name + ' ' + company.name, { lower: true });
  next();
});

module.exports = mongoose.model('Offer', OfferSchema);
