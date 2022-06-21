const mongoose = require('mongoose')

const JobSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Company Name is Required'],
        maxLength: 50
    },
    position: {
        type: String,
        required: [true, 'Position Name is Required'],
        maxLength: 100
    },
    status: {
        type: String,
        enum: ['interview','rejected','pending'],
        default: 'pending'
    },
    createdBy: {
        type:mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user']
    }

}, {timestamps: true})

module.exports = mongoose.model('Job', JobSchema)