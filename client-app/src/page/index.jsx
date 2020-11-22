import React from 'react'
import PropTypes from 'prop-types'
import {Switch, Route, BrowserRouter as Router, Link, Redirect} from 'react-router-dom';
import {HomePage} from './HomePage'
import PostPage from './PostPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage'
import Header from '../components/Header';
import Footer from '../components/Footer'
import NotFound from '../components/NotFound'
import ProfilePage from './ProfilePage'
import PrivateRoute from '../components/PrivateRoute'
import AuthRoute from '../components/AuthRoute'
import './style.css'

export const Page = () => {
    
    return (
        <Router>
            <Header/>
            <main>
                <Switch>
                    <Route exact path='/'>
                        <HomePage/>
                    </Route>
                    <Route path='/post/:id'>
                        <PostPage/>
                    </Route>
                    <AuthRoute component={LoginPage} roles={[]} path='/login'/>
                    <AuthRoute component={RegisterPage} roles={[]} path='/register'/>
                    <PrivateRoute component={ProfilePage} roles={['admin', 'renter', 'owner']} path='/profile'/>
                    <Route component={NotFound}/>
                </Switch>
            </main>
            <Footer/>
        </Router>
    )
}

// Page.propTypes = {
//     prop: PropTypes
// }

