const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URL, {
                // No need for useNewUrlParser and useUnifiedTopology
            });
            console.log('Connected to MongoDB successfully');
        }
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
};

export default connectDb;
