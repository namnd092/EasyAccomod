import { useState } from 'react';
import {useSelector} from 'react-redux'
const { Route, Redirect } = require("react-router-dom");
const auth = localStorage.getItem('token')
function AuthRoute({ component: Component, roles, ...rest }) {
    const roleAuth = useSelector(state => state.user.role);
    const [role, setRole] = useState(roleAuth);
    
    return (
        <Route {...rest} render={props => {
            if(auth){
                return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            }
            return <Component {...props}/>
        }} >
        </Route>
    );
}

export default AuthRoute;