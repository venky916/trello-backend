// controllers/taskController.js
const Task = require('../models/Task');

// Get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new task
exports.createTask = async (req, res) => {
    const { title, description, status, priority, deadline } = req.body;

    try {
        const task = new Task({
            title,
            description,
            status,
            priority,
            deadline,
            user: req.user._id,
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Bad request' });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    const { title, description, status, priority, deadline } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.deadline = deadline || task.deadline;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: 'Bad request' });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
