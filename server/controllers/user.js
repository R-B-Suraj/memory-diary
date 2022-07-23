import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/user.js';

dotenv.config();

export const signin = async (req,res)=>{
    const {email,password} = req.body;

    try{
        const existingUser = await User.findOne({email});
        if(!existingUser)
            return res.status(200).json({message:"User doesn't exist"});

        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);
        if(!isPasswordCorrect)
            return res.status(200).json({message: "Invalid credentials"});

        const token = jwt.sign({email: existingUser.email, id: existingUser._id},process.env.SECRET_STRING,{expiresIn: "72h"});
        return res.status(200).json({result: existingUser, token});
        
    }catch(err){
        res.status(500).json({message: 'something went wrong'});
    }
}





export const signup = async (req,res)=>{
    const {email,password,firstName,lastName,confirmPassword} = req.body;
    
    
    try{
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(200).json({message:'User already Exists'});
        
        if(password !== confirmPassword) return res.status(200).json({message:"Passwords don't match"});
        
        const hashedPassword = await bcrypt.hash(password,12);
        
        const result = await User.create({email,password: hashedPassword, name: `${firstName} ${lastName}`});
        
        const token = jwt.sign({email: result.email, id: result._id},process.env.SECRET_STRING,{expiresIn: "72h"});
        
        return res.status(200).json({result: result, token});
        
    }catch(err){
        res.status(500).json({message: 'something went wrong'});
        
    }
}