import React, { useState } from "react";
import { Avatar, Button, Paper, Grid, Container, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import GoogleLogin from 'react-google-login';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {LOGOUT} from '../../constants/actionTypes';



import useStyles from './styles';
import Input from './Input';
import Icon from './Icon';
import { AUTH } from '../../constants/actionTypes';
import { signin, signup } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }

const Auth = () => {

    const [showpassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(true);
    const [formData, setFormData] = useState(initialState);
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const { authData } = useSelector((store) => store.auth);
    console.log('auth data ', authData);



    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) {
            dispatch(signup(formData, history))
        } else {
            dispatch(signin(formData, history))
        }

    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };
    const handleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    }
    const switchMode = () => {
        setIsSignup(prevState => !prevState);
        setShowPassword(false);
        dispatch({type: LOGOUT});
    }
    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;
        try {
            dispatch({ type: AUTH, data: { result, token } });
            history.push('/');
        } catch (err) {
            console.log(err);
        }
    }
    const googleFailure = (err) => {
        console.log(err);
        console.log('Google Sign In was unsuccessful. Try Again Later');
    }

    return (
        <Container component='main' maxWidth='xs'>

            <Paper className={classes.paper} elevation={3}>
            <Grid container justifyContent="center">
                        <Grid item>
                            <Button variant='outlined' onClick={switchMode}>
                                {isSignup ? 'Already have an account ? Log In' : "Don't have an account ? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant='h5'>{isSignup ? 'Sign Up' : 'Log In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name='firstName' label='First Name' handleChange={handleChange} autoFocus half />
                                    <Input name='lastName' label='Last Name' handleChange={handleChange} half />
                                </>
                            )
                        }
                        <Input name='email' label='Email Address' handleChange={handleChange} type='email' />
                        <Input name='password' label='Password' handleChange={handleChange} type={showpassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        {
                            isSignup && <Input name='confirmPassword' label='Repeat Password' handleChange={handleChange} type='password' />
                        }
                    </Grid>
                    {
                        authData?.message && (
                            <h3 style={{ color: 'red',fontFamily:'monospace' }}>{authData.message}</h3>
                        )
                    }

                    <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                        {isSignup ? 'Sign Up' : 'Log In'}
                    </Button>
                    <GoogleLogin
                        disabled
                        clientId="1029936683974-2ejkpmdt6bqdn2jkav12km9jcgebvtam.apps.googleusercontent.com"
                        render={(renderProps) => (
                            <Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant='contained'>
                                Google Sign In
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy='single_host_origin'
                    />
                    
                </form>
            </Paper>
        </Container>
    );
}

export default Auth;