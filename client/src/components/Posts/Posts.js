import React from 'react';
import {useSelector} from 'react-redux';
import {Grid,CircularProgress,Typography} from '@material-ui/core';

import Post from './Post/Post';
import useStyles from './styles';
 
const Posts = ({setCurrentId}) => {
    const classes = useStyles();
    const {posts, isLoading} = useSelector((store)=> store.posts);
   
    if(!posts.length && !isLoading) return (<h1 style={{color:'red'}}>No Posts Available for this search criteria.</h1>);

    return ( 
        isLoading ? <div><CircularProgress style={{marginBottom: '15px'}}/> <Typography>Loading Images may take some time</Typography> </div>: (
            <Grid className={classes.container} container alignItems='stretch' spacing={3}>
                {
                    posts.map((post)=> (
                        <Grid item key={post._id} xs={12} sm={12} md={6} lg={3}>
                            <Post post={post} setCurrentId={setCurrentId} />
                        </Grid>
                    ))
                }
            </Grid>
        )
     );
}
 
export default Posts;