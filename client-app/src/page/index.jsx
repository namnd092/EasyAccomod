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
import ApprovedPage from './ApprovedPage'
import NewPostPage from './NewPostPage'

export const Page = () => {
    const dispatch = useDispatch()
    const [role, setRole] = React.useState('');
    useEffect(() => {
        async function effectGetInfo(){
            const response = await authApi.getAccountInfoByToken();
            const {role} = await response;
            setRole(role);
        }
        effectGetInfo();
    }, [])

    return (
        <Router>
            <Header role={role}/>
            <main>
                <div className="width_box">
                    <Switch>
                        <Route exact path="/">
                            <HomePage />
                        </Route>
                        <Route path="/post/:id">
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
                        <Route path="/approved">
                            <ApprovedPage/>
                        </Route>
                        <Route path="/newpost">
                            <NewPostPage/>
                        </Route>
                        <AuthRoute 
                            component={LoginPage}
                            path="/login" 
                            role={role}
                        />
                        <AuthRoute
                            component={RegisterPage}
                            path="/register"
                            role={role}
                        />
                        <PrivateRoute
                            component={ProfilePage}
                            roles={['admin', 'renter', 'owner']}
                            path="/profile"
                            role={role}
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
