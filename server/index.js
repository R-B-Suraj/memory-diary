import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';


const app = express();
dotenv.config();


app.use(bodyParser.json({limit:"30mb", extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user',userRoutes);
app.get('/',(req,res)=>{
    res.send('APP Is Running...');
});

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.NEW_CONNECTION_URL,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        app.listen(PORT, ()=>console.log(`server running on port ${PORT}`));
    })
    .catch((err)=>{
        console.log(err.message);
    });
