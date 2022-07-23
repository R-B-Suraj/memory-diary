import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import decode from 'jwt-decode';

import useStyles from './styles';
import memoriesLogo from '../../images/memories.png';
import memoriesText from '../../images/memories-Text.png';
import { LOGOUT } from '../../constants/actionTypes';

const Navbar = () => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    const logout = () => {
        dispatch({ type: LOGOUT });
        setUser(null);        
    }

    const signin = (e)=>{
        e.stopPropagation();
        window.alert('refresh the page if unable to log in');
        history.push('/auth');
    }

    useEffect(() => {
        const token = user?.token;
        if (token) {
            const decodedToken = decode(token);
            if (decodedToken.exp * 1000 < new Date().getTime()) {
                logout();
            }
        }

        setUser(JSON.parse(localStorage.getItem('profile')));

    }, [location])
 

    return (
        <AppBar className={classes.appBar} position='static' color='inherit'>
            <Link to='/' className={classes.brandContainer}>
                <img src={memoriesText} alt='icon' height='45px' />
                <img className={classes.image} src={memoriesLogo} alt="memories" height='40px' />
            </Link>
            <Toolbar className={classes.toolbar}>
                {
                    user ? (
                        <div className={classes.profile}>
                            <Avatar className={classes.purpule} alt={user.result.name} src={user.result.imageUrl}>{user.result.name.charAt(0)}</Avatar> &nbsp;
                            <Typography className={classes.userName} variant='h6'>{user.result.name}</Typography> 
                            <Button variant='contained' className={classes.logout} color='secondary' onClick={logout}>Logout</Button>
                        </div>
                    ) : (
                        <Button onClick={(e)=> signin(e)} variant='contained' color='primary'>Sign Up / Log In</Button>
                    )
                }
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;