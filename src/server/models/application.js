import { DataTypes } from 'sequelize';
import { sequelize } from './db.js';

const application = sequelize.define("application", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        minlength: 2,
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jobType:{
        type: DataTypes.ENUM("Full-time", "Part-time", "Internship"),
        allowNull: false
    },
    status:{
        type: DataTypes.ENUM("Applied", "Interviewing", "Offered", "Rejected"),
        allowNull: false
    },
    appliedDate:{
        type: DataTypes.DATE,
        allowNull: true
    },
    notes:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }


})

export default application;