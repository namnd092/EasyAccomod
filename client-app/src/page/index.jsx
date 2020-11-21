import React from 'react'
import PropTypes from 'prop-types'
import {Switch, Route, BrowserRouter as Router, Link} from 'react-router-dom';
import {HomePage} from './HomePage'
import PostPage from './PostPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage'
import Header from '../components/Header';
import Footer from '../components/Footer'
import NotFound from '../components/NotFound'
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={Component} />
)
export const Page = () => {
    
    return (
        <Router>
            <Header/>
            <Switch>
                <Route exact path='/'>
                    <HomePage/>
                </Route>
                <Route path='/post/:id'>
                    <PostPage/>
                </Route>
                <Route path='/login'>
                    <LoginPage/>
                </Route>
                <Route path='/register'>
                    <RegisterPage/>
                </Route>
                <Route component={NotFound}/>
            </Switch>
            <Footer/>
        </Router>
    )
}

// Page.propTypes = {
//     prop: PropTypes
// }

