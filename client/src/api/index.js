import axios from 'axios';
// https://memories-diary-backend.herokuapp.com/
const API = axios.create({baseURL: 'https://memories-diary-backend.herokuapp.com/'});

API.interceptors.request.use((req)=>{
    const user = JSON.parse(localStorage.getItem('profile'));
    
    if(user){
        req.headers.Authorization = `Bearer ${user.token}`;
    }
    return req;
})

export const fetchMyPosts = (_id)=> API.get(`/posts/myposts/${_id}`);
export const fetchPost = (id)=> API.get(`/posts/${id}`);
export const fetchPosts = (page)=> API.get(`/posts?page=${page}`);
export const fetchPostsBySearch = (searchQuery)=> API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`)
export const createPost = (newPost)=> API.post('/posts',newPost);
export const updatePost = (id,updatedPost)=>API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id)=> API.delete(`/posts/${id}`);
export const likePost = (id)=> API.patch(`/posts/${id}/likePost`);
export const comment = (value,id)=> API.post(`/posts/${id}/commentPost`,{value});


export const signIn = (formData)=> API.post('/user/signin',formData);
export const signUp = (formData)=> API.post('/user/signup',formData);