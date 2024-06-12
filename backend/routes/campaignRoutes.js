const express = require('express');
const { createCampaign, getCampaigns, sendMessage  } = require('../controllers/campaignController');

const router = express.Router();

router.post('/', createCampaign);
router.get('/', getCampaigns);
router.post('/message', sendMessage);


module.exports = router;
