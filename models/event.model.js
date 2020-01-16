const mongoose = require('mongoose')
const {
    resources
} = require('../helpers/db.helper')

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    restaurant: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    start_date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    end_date: {
        type: String,
        required: true
    },
    start_time: {
        type: String,
        required: true
    },
    end_time: {
        tupe: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    coordinates: {
         latitude: {
             type: String,
             required: true
         },
         longitude: {
             type: String,
             required: true
         }
    },
    image: {
        type: String
    },
    created_at: {
        type: Date,
        required: new Date()
    },
    incharge_name: {
        type: String,
        required: true
    },
    incharge_contact: {
        type: String,
        required: true
    },
    website: {
        type: String
    },
    created_by: {
        type: String,
        required: true
    },
    is_confirmed: {
        is_confirmed: {
            type: Boolean,
            default: false
        },
        confirmed_at: {
            type: Date
        },
        confirmed_by: {
            type: String
        }
    },
    interested: {
        type: [String],
        default: []
    },
    is_disabled: {
        is_disabled: {
            type: Boolean,
            default: false
        },
        disabled_at: {
            type: Date
        },
        disabled_by: {
            type: String
        }
    },
})

const Event = resources.model('Event', EventSchema)
module.exports = Event