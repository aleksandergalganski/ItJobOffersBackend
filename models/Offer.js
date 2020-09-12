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
  slug: {
    type: String,
    required: true,
    unique: true
  },
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
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  mustHave: {
    type: [String]
  },
  niceToHave: {
    type: [String]
  },
  city: {
    type: String,
    required: [true, 'Please add a city']
  },
  postCode: {
    type: String,
    required: [true, 'Please add a post code'],
    match: [/^[0-9]{2}-[0-9]{3}$/, 'Please add a valid polish post code']
  },
  street: {
    type: String,
    required: [true, 'Please add a street name']
  },
  streetNumber: {
    type: String,
    required: [true, 'Please add a street number']
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
    ref: 'Company',
    required: true
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
  this.slug = slugify(this.name + ' ' + company.name + ' ' + this._id, { lower: true });
  next();
});

OfferSchema.pre('remove', async function (next) {
  await this.model('Application').deleteMany({ offer: this._id });
  next();
});

module.exports = mongoose.model('Offer', OfferSchema);
