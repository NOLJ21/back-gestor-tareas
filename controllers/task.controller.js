const db = require('../models');
const Task = db.Task;

exports.createTask = async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body;
        const newTask = await Task.create({
            title,
            description,
            status: status || 'pendiente',
            dueDate,
            userId: req.userId
        });
        res.status(201).json({ message: 'Tarea creada exitosamente', task: newTask });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear tarea', error });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.id, userId: req.userId }
        });
        if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tarea', error });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.id, userId: req.userId }
        });
        if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

        // Reglas de negocio
        if (task.status === 'completada') {
            return res.status(400).json({ message: 'No se puede modificar una tarea completada' });
        }
        if (task.status !== 'pendiente' && req.body.status === 'pendiente') {
            return res.status(400).json({ message: 'No se puede volver a estado pendiente' });
        }
        if (req.body.status === 'completada' && task.status !== 'en progreso') {
            return res.status(400).json({ message: 'Solo se puede completar una tarea en progreso' });
        }

        await task.update(req.body);
        res.json({ message: 'Tarea actualizada', task });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar tarea', error });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.id, userId: req.userId }
        });
        if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

        if (task.status !== 'completada') {
            return res.status(400).json({ message: 'Solo se puede eliminar una tarea completada' });
        }

        await task.destroy();
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar tarea', error });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const where = { userId: req.userId };

        // Filtrado por estado si viene en query
        if (req.query.status) {
            const validStatuses = ['pendiente', 'en progreso', 'completada'];
            if (!validStatuses.includes(req.query.status)) {
                return res.status(400).json({ message: 'Estado inválido' });
            }
            where.status = req.query.status;
        }

        const tasks = await db.Task.findAll({ where });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tareas', error });
    }
};

exports.getTasksByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Fechas de inicio y fin son requeridas' });
        }

        const tasks = await Task.findAll({
            where: {
                userId: req.userId,
                dueDate: {
                    [db.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
                }
            }
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tareas por fecha', error });
    }
}

exports.getTaskByTitle = async (req, res) => {
    try {
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({ message: 'El título es requerido' });
        }

        const tasks = await Task.findAll({
            where: {
                userId: req.userId,
                title: {
                    [db.Sequelize.Op.like]: `%${title}%`
                }
            }
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tareas por título', error });
    }
}
