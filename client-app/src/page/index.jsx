import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
    Switch,
    Route,
    BrowserRouter as Router,
    Link,
    Redirect,
} from 'react-router-dom'
import { HomePage } from './HomePage'
import PostPage from './PostPage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import Header from '../components/Header'
import Footer from '../components/Footer'
import NotFound from '../components/NotFound'
import ProfilePage from './ProfilePage'
import PrivateRoute from '../components/PrivateRoute'
import AuthRoute from '../components/AuthRoute'
import './style.css'
import authApi from '../api/authApi'
import { setUser } from '../redux/slice/userSlice'
import effectGetInfo from '../utils/Auth'

export const Page = () => {
    const dispatch = useDispatch()
    
    useEffect(() => {
        effectGetInfo(dispatch);
    })
    
    return (
        <Router>
            <Header />
            <main>
                <div className="width_box">
                    <Switch>
                        <Route exact path="/">
                            <HomePage />
                        </Route>
                        <Route path="/post/:id">
                            <PostPage />
                        </Route>
                        <Route path="/login">
                            <LoginPage />
                        </Route>
                        <Route path="/register">
                            <RegisterPage />
                        </Route>
                        {/* <Route path="/profile">
                            <ProfilePage />
                        </Route>
                        <AuthRoute component={LoginPage} roles={[]} path="/login" />
                        <AuthRoute
                            component={RegisterPage}
                            roles={[]}
                            path="/register"
                        /> */}
                        <PrivateRoute
                            component={ProfilePage}
                            roles={['admin', 'renter', 'owner']}
                            path="/profile"
                        />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </main>
            <Footer />
        </Router>
    )
}

// Page.propTypes = {
//     prop: PropTypes
// }
