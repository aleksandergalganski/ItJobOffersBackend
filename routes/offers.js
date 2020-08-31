const express = require('express');
const {
  getOffers,
  deleteOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer
} = require('../controllers/offers');

const router = express.Router({ mergeParams: true });

router.route('/').get(getOffers).post(createOffer).delete(deleteOffers);

router.route('/:offerId').get(getOffer).put(updateOffer).delete(deleteOffer);

module.exports = router;
