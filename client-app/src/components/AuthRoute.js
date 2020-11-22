const { Route, Redirect } = require("react-router-dom");
const auth = localStorage.getItem('token') !== null;

const AuthRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        if(auth){
            return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        }
        return <Component {...props}/>
    }} >
    </Route>
)

export default AuthRoute;
