
import mongoose from "mongoose";
const conncetdb = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database Coonection", connect.connection.name, connect.connection.host)
    } catch (error) {
        console.log(err);
        process.exit(1);
    }
};

export default conncetdb