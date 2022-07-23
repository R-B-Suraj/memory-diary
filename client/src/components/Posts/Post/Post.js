import React, { useState } from 'react';
import { ButtonBase, Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';


import useStyles from './styles';
import { deletePost, likePost } from '../../../actions/posts';



const Post = ({ post, setCurrentId }) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const history = useHistory();
    const [likes, setLikes] = useState(post?.likes);
    const userId = (user?.result?.googleId || user?.result?._id);
    const hasLikedPost = likes.find((like) => like === userId);

    const handleLike = () => {
        dispatch(likePost(post._id));
        if (hasLikedPost) {
            setLikes(likes.filter((id) => id !== userId))
        } else {
            setLikes([...likes, userId]);
        }
    };
    const Likes = () => {
        if (likes.length > 0) {
            return likes.find((like) => like === userId)
                ? (
                    <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}</>
                ) : (
                    <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
                );
        }

        return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
    };

    const handleEdit = (e, id) => {
        e.stopPropagation();
        setCurrentId(id);
        window.scrollTo(0, 200);
    }
    const openPost = () => {
        history.push(`/posts/${post._id}`);
    }

    return (
        <Card className={classes.card} raised elevation={6}>
            <ButtonBase className={classes.cardAction} onClick={openPost} >
                <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
                <div className={classes.overlay}>
                    <Typography variant='h6'>{post.name}</Typography>
                    <Typography variant='body2'>{moment(post.createdAt).fromNow()}</Typography>
                </div>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                    <div className={classes.overlay2} name="edit">
                        <Button onClick={(e) => handleEdit(e, post._id)} style={{ color: 'white' }} size="small" >
                            edit
                        </Button>
                    </div>
                )}
                <div className={classes.details}>
                    <Typography variant='body2' color='textSecondary'>{post.tags.map((tag) => '#' + tag + ' ')}</Typography>
                </div>
                <Typography className={classes.title} variant='h6' gutterBottom>{post.title}</Typography>

                <CardContent>
                    <div style={{ overflow: "hidden", textOverflow: "clip", height:'70px' }}>
                        <Typography nowrap variant='body2' color='textSecondary'>
                           {post.message}
                        </Typography>
                    </div>
                    
                </CardContent>
            </ButtonBase>

            <CardActions className={classes.cardActions}>
                <Button size='small' color='primary' onClick={handleLike} disabled={!user?.result}>
                    <Likes />
                </Button>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                    <Button size='small' color='secondary' onClick={() => dispatch(deletePost(post._id))}>
                        <DeleteIcon fontSize='small' /> Delete
                    </Button>
                )}
            </CardActions>


        </Card>
    );
}

export default Post;