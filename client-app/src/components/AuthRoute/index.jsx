const { Route, Redirect } = require('react-router-dom');

function AuthRoute({ component: Component, ...rest }) {
    const isAuth = !!localStorage.getItem('token');
    return (
        <Route
            {...rest}
            render={(props) => {
                if (isAuth) {
                    return (
                        <Redirect
                            to={{
                                pathname: '/',
                                state: { from: props.location },
                            }}
                        />
                    );
                }
                return <Component {...props} />;
            }}
        ></Route>
    );
}

export default AuthRoute;
