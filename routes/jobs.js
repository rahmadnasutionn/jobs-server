const express = require('express');
const router = express.Router();

const {
    getAllJobs,
    createJobs,
    getJob,
    updateJob,
    deleteJob
} = require('../controllers/jobs');

router.post('/', createJobs);
router.get('/', getAllJobs);
router.get('/:id', getJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;