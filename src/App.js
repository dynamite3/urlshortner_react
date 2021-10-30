import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Card, Col, Container, Row } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import { Field, ErrorMessage } from "formik"
import { SignUp } from './SignUp';
import { Email, Reddit } from '@material-ui/icons';
import { useState } from 'react';
import { LogIn } from './LogIn';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import Nav from 'react-bootstrap/Nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar'
import { ForgotPass } from './ForgotPass';
import { PrivateRoute } from './PrivateRoute';

import 'bootstrap/dist/css/bootstrap.min.css';

import { CC } from './CC';
import { Home } from './Home';

function App() {
  return (
    <>
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto" id="navitems">
                <Link to="/">Home </Link>
                <Link to="/login">Login </Link>
                <Link to="/content">Content </Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

      </div>

      <div className="content">
        <Switch>
          <Route path="/login"> <MainApp />  </Route>
          {/* <Route path="/content"> <Content/> </Route> */}
          <PrivateRoute path="/content"><CC /></PrivateRoute>
          <PrivateRoute path="/content/UsersUrls/:id"><CC /></PrivateRoute>
          <Route exact path="/">  <Home />  </Route>
          <Route path="*"> <Notfound />  </Route>
        </Switch>
      </div>


    </>
  )
}


function MainApp() {

  const [loginORsignupflag, setloginORsignupflag] = useState(0)
  return (
    <div className="App">
      <Container className="mainDiv">
        <div className="row">
          <div className="col-md-7 col-sm-12 col-lg-7 c1" id='c1'>
            <Image className="disimg" src="https://cdn.dribbble.com/users/452635/screenshots/2809164/illu_sign_up.png" fluid className="loginImage" />
          </div>
          <div className="col-md-5 col-sm-12 col-lg-5 c2" id='c2'>
            {
              loginORsignupflag === 0 ?

                <LogIn loginORsignupflag={loginORsignupflag} setloginORsignupflag={setloginORsignupflag} />
                :
                loginORsignupflag === 1 ?
                  <SignUp loginORsignupflag={loginORsignupflag} setloginORsignupflag={setloginORsignupflag} />
                  :
                  <ForgotPass loginORsignupflag={loginORsignupflag} setloginORsignupflag={setloginORsignupflag} />
            }
          </div>
        </div>
      </Container>
    </div>
  );
}



function Notfound() {
  return (
    <h1>Page Not Found</h1>
  )
}
export default App;