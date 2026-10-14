import React, { Suspense, lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './HomePage';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NotFound from '../components/NotFound';
import PrivateRoute from '../components/PrivateRoute';
import AuthRoute from '../components/AuthRoute';
import './style.css';

import { fetchAccountInfo, restoreSession } from '../redux/session';

import Role from '../models/data/role';
import { LinearProgress } from '../ui';

// Pages other than the home page load on demand to keep the initial bundle small.
const PostPage = lazy(() => import('./PostPage'));
const LoginPage = lazy(() => import('./LoginPage'));
const RegisterPage = lazy(() => import('./RegisterPage'));
const ProfilePage = lazy(() => import('./ProfilePage'));
const ApprovedPage = lazy(() => import('./ApprovedPage'));
const NewPostPage = lazy(() => import('./NewPostPage'));
const FavoritePage = lazy(() => import('./FavoritePage'));
const MyPostPage = lazy(() => import('./MyPostPage'));
const EditPostPage = lazy(() => import('./EditPostPage'));

export const Page = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    useEffect(() => {
        dispatch(restoreSession());
    }, [dispatch]);
    useEffect(() => {
        if (!token) return;
        // A 401 is handled globally (the session ends); other failures leave the user logged out of the UI only.
        dispatch(fetchAccountInfo()).catch(() => {});
    }, [token, dispatch]);

    return (
        <>
            <Header />
            <main>
                <div className="mx-auto w-[95%] max-w-[1100px]">
                    <Suspense fallback={<LinearProgress />}>
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
                    </Suspense>
                </div>
            </main>
            <Footer />
        </>
    );
};
