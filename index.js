const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const noteRoutes = require('./routes/note');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json()); // For req.body in json 

app.use('/api/note' , noteRoutes);
app.use('/api/auth' , authRoutes);

mongoose.connect('mongodb+srv://jay:jayme143@cluster0.0a5mx.mongodb.net/yourBook' , () => {
    app.listen(4000 , () => {
        console.log("Server runnnig on port 4000!");
    });
})


