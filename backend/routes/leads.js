const express = require('express');
const { 
  getLeads, 
  getLead, 
  createLead, 
  updateLead, 
  deleteLead 
} = require('../controllers/leadController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;