const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    title:{
        type : String,
        required : true
    },
    description:{
        type : String,
        required : true,
    },
    tag:{
        type : String,
        default : 'General'
    },
    time:{
        type : Date,
        default : Date.now
    }
    
})

module.exports = mongoose.model('Note' , NoteSchema);