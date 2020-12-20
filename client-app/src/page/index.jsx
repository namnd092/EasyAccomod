import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Switch,
    Route,
    BrowserRouter as Router,
    Link,
    Redirect,
} from 'react-router-dom';
import { HomePage } from './HomePage';
import PostPage from './PostPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NotFound from '../components/NotFound';
import ProfilePage from './ProfilePage';
import PrivateRoute from '../components/PrivateRoute';
import AuthRoute from '../components/AuthRoute';
import './style.css';
import authApi from '../api/authApi';
import { setUser } from '../redux/slice/userSlice';
import effectGetInfo from '../utils/Auth';
import ApprovedPage from './ApprovedPage';
import NewPostPage from './NewPostPage';
import FavoritePage from './FavoritePage';
import MyPostPage from './MyPostPage';
import EditPostPage from './EditPostPage';
import Role from '../models/data/role';
import ApiUrl from '../constants/ApiUrl';
import Axios from 'axios';

export const Page = () => {
    const dispatch = useDispatch();
    const [role, setRole] = React.useState('');
    const token = localStorage.getItem('token') || '';
    useEffect(() => {
        async function effectGetInfo() {
            Axios.get('https://localhost:44360/' + ApiUrl.GET_ACCOUNT_INFO, {
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(async (response) => {
                    const infoResponse = await response.data;
                    await dispatch(setUser({ ...infoResponse }));
                })
                .catch((error) => console.log(error));
        }

        effectGetInfo();

        return () => {};
    });

    return (
        <Router>
            <Header role={role} />
            <main>
                <div className="width_box">
                    <Switch>
                        <Route exact path="/">
                            <HomePage />
                        </Route>
                        <Route path="/post/:id" exact>
                            <PostPage />
                        </Route>
                        {/* <Route path="/login" role={role}>
                            <LoginPage handle={handle}/>
                        </Route>
                        <Route path="/register" role={role}>
                            <RegisterPage />
                        </Route>
                        <Route path="/profile">
                            <ProfilePage />
                        </Route> */}
                        {/* <Route path="/approved">
                            <ApprovedPage />
                        </Route> */}
                        <PrivateRoute
                            path="/approved"
                            component={ApprovedPage}
                            roles={[Role.ADMIN]}
                        />
                        <PrivateRoute
                            path="/newpost"
                            component={NewPostPage}
                            roles={[Role.ADMIN, Role.OWNER]}
                        />
                        {/* <PrivateRoute path="/newpost">
                            <NewPostPage />
                        </PrivateRoute> */}
                        <PrivateRoute
                            component={FavoritePage}
                            roles={[Role.RENTER]}
                            path="/favorite"
                        />
                        <PrivateRoute
                            component={MyPostPage}
                            roles={[Role.OWNER]}
                            path="/my-post"
                        />
                        <AuthRoute component={LoginPage} path="/login" />
                        <AuthRoute component={RegisterPage} path="/register" />
                        <PrivateRoute
                            component={ProfilePage}
                            roles={[Role.OWNER, Role.OWNER_PENDING]}
                            path="/profile"
                        />
                        <PrivateRoute
                            component={EditPostPage}
                            roles={[Role.ADMIN, Role.OWNER]}
                            path="/post/:id/edit"
                        />
                        <Route component={NotFound} path="/notfound" />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </main>
            <Footer />
        </Router>
    );
};

// Page.propTypes = {
//     prop: PropTypes
// }
