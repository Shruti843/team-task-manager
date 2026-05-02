const express = require('express');
const { protect, admin } = require('../middleware/auth');
const Project = require('../models/Project');

const router = express.Router();

// Get projects (Admin gets all, Member gets assigned projects)
router.get('/', protect, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find({}).populate('members', 'name email').populate('createdBy', 'name');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('members', 'name email').populate('createdBy', 'name');
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create project (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const project = await Project.create({
      name,
      description,
      members,
      createdBy: req.user._id
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
