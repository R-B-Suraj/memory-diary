import { combineReducers } from "redux";

import posts from './posts';
import auth from './auth';

// store
export default combineReducers({
    posts,auth
});