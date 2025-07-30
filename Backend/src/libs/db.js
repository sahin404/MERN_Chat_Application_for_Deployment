import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const dbConnect = async()=>{
    try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('DB Connected Successfully');
    }
    catch(err){
        console.log('An error occured to connect db', {message: err.message});
    }
   
}