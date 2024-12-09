const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String, 
        require : true
    },
    email: {
        type: String, 
        require : true
    },
    password_hash: {
        type: String, 
        require : true
    },
    name: {
        type: String, 
        require : true
    }
    // Products for sale ?
});

module.exports =  mongoose.model('User',userSchema);

