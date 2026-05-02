const express = require('express');
const { protect, admin } = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');

const router = express.Router();

// Get tasks (Admin gets all, Member gets assigned tasks)
router.get('/', protect, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin') {
      tasks = await Task.find({}).populate('project', 'name').populate('assignedTo', 'name email');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id }).populate('project', 'name').populate('assignedTo', 'name email');
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create task (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      dueDate
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update task status (Admin or Assigned Member)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    const updatedTask = await task.save();
    
    // populate before sending
    await updatedTask.populate('project', 'name');
    await updatedTask.populate('assignedTo', 'name email');

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
