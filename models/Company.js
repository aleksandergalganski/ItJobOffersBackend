const mongoose = require('mongoose');
const slugify = require('slugify');
const Offer = require('./Offer');

const CompanySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxLength: [50, 'Name can not be more than 50 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  mainLocation: {
    type: String,
    required: [true, 'Please add a main location']
  },
  foundedIn: {
    type: Number,
    required: [true, 'Please add a year of founding company'],
    min: [0, 'Year of founding company must be greater than 0']
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
  technologies: {
    type: [String],
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  companySize: {
    type: Number,
    min: [0, 'Company size must be greater than 0']
  },
  facebookLink: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  instagramLink: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  linkedinLink: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  logo: {
    type: String,
    default: 'no-logo.jpg'
  }
});

CompanySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Delete all offers from company
CompanySchema.pre('remove', async function (next) {
  await this.model('Offer').deleteMany({ company: this._id });
  next();
});

module.exports = mongoose.model('Company', CompanySchema);
