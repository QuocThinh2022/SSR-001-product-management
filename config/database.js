
const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connect mongodb success!')
    } catch (error) {
        console.log('Cannt connect mongodb!')
    }
}