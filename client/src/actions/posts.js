import * as api from '../api';
import { COMMENT,FETCH_POST,START_LOADING,END_LOADING,FETCH_ALL,FETCH_BY_SEARCH,CREATE,UPDATE,DELETE } from '../constants/actionTypes';



export const getPost = (id)=> async (dispatch)=>{

    try{
        dispatch({type: START_LOADING});
        const {data} = await api.fetchPost(id);
        
        dispatch({type: FETCH_POST,payload: data});
        dispatch({type: END_LOADING});
    }catch(err){
        console.log(err);
    }
}

export const getPosts = (page)=> async (dispatch)=>{

    try{
        dispatch({type: START_LOADING});
        const {data} = await api.fetchPosts(page);
        
        dispatch({type: FETCH_ALL,payload: data});
        dispatch({type: END_LOADING});
    }catch(err){
        console.log(err);
    }
}

export const getMyPosts = (_id)=> async (dispatch)=>{
    
    try{
        console.log('inside actions getMyPosts');
        dispatch({type: START_LOADING});
        const {data} = await api.fetchMyPosts(_id);
        
        dispatch({type: FETCH_ALL,payload: data});
        dispatch({type: END_LOADING});
    }catch(err){
        console.log(err);
    }
}

export const getPostBySearch = (searchQuery)=> async (dispatch)=>{
    try{
        dispatch({type: START_LOADING});
        const {data:{ data }}= await api.fetchPostsBySearch(searchQuery);

        dispatch({type: FETCH_BY_SEARCH,payload: data});
        dispatch({type: END_LOADING});
        
    }catch(err){
        console.log(err);
    }
}

export const createPost = (post,history)=> async (dispatch)=>{
    try{
        dispatch({type: START_LOADING});
        const {data} = await api.createPost(post);
        dispatch({type: END_LOADING});
        history.push(`/posts/${data._id}`);
        dispatch({type:CREATE, payload: data});
        
    }catch(err){
        console.log(err);
    }
}

export const updatePost= (id,post)=> async (dispatch)=>{
    try{
        
        const {data} = await api.updatePost(id,post);
        dispatch({type:UPDATE, payload:data});
    }catch(err){
        console.log(err);
    }
}

export const deletePost = (id)=> async (dispatch)=>{
    try{
        await api.deletePost(id);
        dispatch({type:DELETE, payload: id});
    }catch(err){
        console.log(err);
    }
}

export const likePost = (id)=> async (dispatch)=>{
    try{
        const {data} = await api.likePost(id);
        dispatch({type:UPDATE,payload:data});
    }catch(err){
        console.log(err);
    }
}

export const commentPost = (value,id)=> async (dispatch)=>{
    try{
        const {data} = await api.comment(value,id);
        dispatch({type: COMMENT, payload:data});
        return data.comments;
    }catch(err){
        console.log(err);
    }
}