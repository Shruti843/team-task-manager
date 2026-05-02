const express = require('express');
const { protect } = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'Admin') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query);
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== 'Completed';
    }).length;

    res.json({
      totalTasks,
      completedTasks,
      overdueTasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
