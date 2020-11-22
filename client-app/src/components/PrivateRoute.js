import NotFound from '../components/NotFound';
const { Route, Redirect } = require("react-router-dom");
const auth = localStorage.getItem('token') !== null;
const role = localStorage.getItem('role') || null;

const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        if (!auth) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
        if (roles && role && roles.indexOf(role.toLowerCase()) === -1) {
            return <NotFound/>
        }
        return <Component {...props}/>
    }} >
    </Route>
)

export default PrivateRoute;
