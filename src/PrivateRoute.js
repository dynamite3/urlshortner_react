import { Route, Redirect } from "react-router-dom";

export function PrivateRoute({ children, ...rest }) {
  const hastoken = localStorage.getItem('auth-token');

  return (
    <Route {...rest} render={() => {
      return hastoken !== null && hastoken!=="undefined"
        ?
        children
        :
        <Redirect to={{ pathname: '/login' }} />;
    }}>
    </Route>
  );
}
