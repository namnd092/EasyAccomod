import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
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

import { setUser } from '../redux/slice/userSlice';

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
            Axios.get(`${import.meta.env.VITE_API_URL}/` + ApiUrl.GET_ACCOUNT_INFO, {
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
    }, [token]);

    return (
        <>
            <Header role={role} />
            <main>
                <div className="width_box">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/post/:id" element={<PostPage />} />
                        <Route
                            path="/approved/*"
                            element={
                                <PrivateRoute roles={[Role.ADMIN]}>
                                    <ApprovedPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/newpost/*"
                            element={
                                <PrivateRoute roles={[Role.ADMIN, Role.OWNER]}>
                                    <NewPostPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/favorite/*"
                            element={
                                <PrivateRoute roles={[Role.RENTER]}>
                                    <FavoritePage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/my-post/*"
                            element={
                                <PrivateRoute roles={[Role.OWNER]}>
                                    <MyPostPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/login/*"
                            element={
                                <AuthRoute>
                                    <LoginPage />
                                </AuthRoute>
                            }
                        />
                        <Route
                            path="/register/*"
                            element={
                                <AuthRoute>
                                    <RegisterPage />
                                </AuthRoute>
                            }
                        />
                        <Route
                            path="/profile/*"
                            element={
                                <PrivateRoute roles={[Role.OWNER, Role.OWNER_PENDING]}>
                                    <ProfilePage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/post/:id/edit"
                            element={
                                <PrivateRoute roles={[Role.ADMIN, Role.OWNER]}>
                                    <EditPostPage />
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </main>
            <Footer />
        </>
    );
};
