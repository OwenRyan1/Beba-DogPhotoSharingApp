const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// general info schema
const generalInfoSchema = new Schema({
    dailyPrompt: [
        { 
            prompt: {type: Object,
                trim: true
            },
            time: {type: Date,
                default: Date.now()
            }
        }
    ]
});

const generalInfo = mongoose.model('General Info', generalInfoSchema);
module.exports = generalInfo;