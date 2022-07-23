import React, {useState,useEffect} from "react";
import { TextField, Button,Typography,Paper } from "@material-ui/core";
import FileBase from 'react-file-base64';
import {useDispatch} from 'react-redux';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import useStyles from './styles';
import { createPost, updatePost , getMyPosts} from "../../actions/posts";

const Form = ({currentId, setCurrentId}) => {
    const [postData, setPostData] = useState({
         title:'', message:'', tags:'', selectedFile:''
    });
 
    const post = useSelector((store)=> currentId? store.posts.posts.find((p)=> p._id === currentId): null );
    const user = JSON.parse(localStorage.getItem('profile'));
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();


    useEffect(()=>{
        if(post)
            setPostData(post);
    },[post])

    const myPosts = ()=>{
        console.log('my posts');
        dispatch(getMyPosts(user.result._id));
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        
        if(currentId){
            dispatch(updatePost(currentId,{...postData, name: user?.result?.name}));
        }
        else{
            dispatch(createPost({...postData, name: user?.result?.name},history));
        }
        clear();
    }
    const clear = ()=>{
        setCurrentId(null);
        setPostData({title:'', message:'', tags:'', selectedFile:''});
    }


    if(!user?.result?.name){
        return (
            <Paper className={classes.paper} elevation={6}>
                <Typography variant='h6' align='center'>
                    Please sign in to your own account to create memory like others.
                </Typography>
            </Paper>
        )
    }

    return ( 
        <Paper className={classes.paper} elevation={3}>
            <Button color='primary' variant='outlined' onClick={()=> myPosts()}>My Posts</Button>
            <form  autoComplete='off' noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">{currentId ? 'Editing' : 'Creating'} a Memory</Typography>
                <TextField name='title' variant='outlined' label='Title' fullWidth value={postData.title} onChange={(e)=> setPostData({...postData, title: e.target.value})} />
                <TextField name='message' variant='outlined' label='Message' fullWidth rows={3} multiline value={postData.message} onChange={(e)=> setPostData({...postData, message: e.target.value})} />
                <TextField name='tags' variant='outlined' label='Tags' placeholder="separate tags with comma  tag1,tag2,tag3 " fullWidth value={postData.tags} onChange={(e)=> setPostData({...postData, tags: e.target.value.toLocaleLowerCase().split(',')})} />
                <div className={classes.fileInput}><Typography variant='subtitle1' >Upload an image </Typography><FileBase  type='file' multiple={false} onDone={({base64})=> setPostData({...postData, selectedFile: base64}) } /></div>
                <Button className={classes.buttonSubmit} variant='contained' color='primary' size='large' type='submit' fullWidth >Submit</Button>
                <Button variant='contained' color='secondary' size='small' onClick={clear} fullWidth >Clear</Button>
            
            </form>

        </Paper>
     );
}
 
export default Form;