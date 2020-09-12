const express = require('express');
const {
  getOffers,
  deleteOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  getOfferBySlug
} = require('../controllers/offers');
const { protect, checkRole } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(getOffers).post(protect, createOffer).delete(protect, deleteOffers);

router
  .route('/:offerId')
  .get(getOfferById)
  .put(protect, updateOffer)
  .delete(protect, deleteOffer);

router.route('/slug/:slug').get(getOfferBySlug);

module.exports = router;
