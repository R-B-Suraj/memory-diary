import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getMyPosts = async (req,res)=>{
    const {id}= req.params;
    console.log(id);
    try{
        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find({creator: id});
        const sent = {data: posts, currentPage: 1,numberOfPages: Math.ceil(total/8)};
        res.status(200).json(sent);
    }catch(err){
        res.status(404).json({message: err});
    }
}

export const getPosts = async (req,res)=>{
    const {page} = req.query;
    try{
        const LIMIT = 8;
        const startIndex = (Number(page)-1)*LIMIT;
        const total = await PostMessage.countDocuments({});
        
        const posts = await PostMessage.find().sort({createdAt:-1}).limit(LIMIT).skip(startIndex);
        
        const sent = {data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT)};
        
        res.status(200).json(sent);
    }catch(err){
        res.status(404).json({message: err});
    }
};

export const getPostsBySearch = async (req,res)=>{
    const {searchQuery, tags} = req.query;
    try{
        const title = new RegExp(searchQuery,'i');
        const posts = await PostMessage.find({ $or: [ {title}, {tags: {$in: tags.split(',')} } ]});
        res.json({data: posts});
        
    }catch(err){
        res.status(404).json({message: err});
    }
}

export const createPost = async (req,res)=>{
    const post = req.body;
    

    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});
    try{
        await newPost.save();
        res.status(201).json(newPost);
    }catch(err){
        res.status(409).json({message: err});
    }
}


export const getPost = async (req,res)=>{
    const {id} = req.params;

    try{
        const post = await PostMessage.findById(id);
        res.status(200).json(post);

    }catch(err){
        res.status(404).json({message: err});
    }
}

export const updatePost = async (req,res)=>{
    const {id: _id}= req.params;
    if(!mongoose.Types.ObjectId.isValid(_id))
        res.status(400).send('No Posts with that id');
    
    const post = req.body;
    const updatedPost = await PostMessage.findByIdAndUpdate(_id,{...post,_id},{new: true});
    res.json(updatedPost);
}

export const deletePost = async (req,res)=>{
    const {id}= req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        res.status(400).send('No Posts with that id');
    
    await PostMessage.findByIdAndRemove(id);
    res.json({message: 'post deleted successfully'});
}

export const likePost = async (req,res)=>{
    const {id}= req.params;

    if(!req.userId) return res.json({message:'Unauthenticated User'});

    if(!mongoose.Types.ObjectId.isValid(id))
        res.status(400).send('No Posts with that id');

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id)=> id=== String(req.userId));
    if(index === -1){
        post.likes.push(req.userId);
    }else{
        post.likes = post.likes.filter((id)=> id !== String(req.userId));

    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new: true});
    res.json(updatedPost);
}

export const commentPost = async (req,res)=>{
    const {id}= req.params;
    const {value}= req.body;

    const post = await PostMessage.findById(id);
    post.comments.push(value);
    const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new: true});
    res.json(updatedPost);
}