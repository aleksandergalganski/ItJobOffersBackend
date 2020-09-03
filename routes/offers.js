const express = require('express');
const {
  getOffers,
  deleteOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer
} = require('../controllers/offers');
const { protect, checkRole } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getOffers)
  .post(protect, createOffer)
  .delete(protect, checkRole('admin'), deleteOffers);

router
  .route('/:offerId')
  .get(getOffer)
  .put(protect, updateOffer)
  .delete(protect, deleteOffer);

module.exports = router;
