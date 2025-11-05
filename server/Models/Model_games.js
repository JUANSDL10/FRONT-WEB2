const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const Model_comments = require('./Model_comments');
const gameSchema = new mongoose.Schema({
    Nombre_juego:{
        type: String,
        required: true
    },
    Cantidad: {
        type: Number,
        require: true
    },
    Precio:{
        type:Number,
        required: true
    },
    Informacion:{
        type: String,
        required: true
    },
    Vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Relación con Company
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    // Relación con Category (puede tener múltiples categorías)
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }],
    // Relación con Media (para imágenes/videos)
    media: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        required: true
    }],
     rating: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating',
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments',
    }]
});
module.exports = mongoose.model('Games', gameSchema);