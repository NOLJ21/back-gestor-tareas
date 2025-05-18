module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM('pendiente', 'en progreso', 'completada'),
            defaultValue: 'pendiente'
        },
        dueDate: DataTypes.DATE
    });

    return Task;
};
