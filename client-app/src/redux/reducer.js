import userReducer from './slice/userSlice';
import authReducer from './slice/authSlice';
const rootReducer = {
    user: userReducer,
    auth: authReducer,
};

export default rootReducer;
