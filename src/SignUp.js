import { Formik, useFormik } from 'formik';
import Button from '@material-ui/core/Button';
import { useState } from 'react';
import React from 'react';
import { TextField } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { useHistory } from "react-router-dom";


import * as yup from 'yup';
import YupPassword from 'yup-password'
YupPassword(yup)
// const apiendpoint = "http://localhost:4444"
const apiendpoint ="https://ulshortner3.herokuapp.com/"

const validationSchema=yup.object({
    firstName:yup.string().required("First name required!"),
    lastName:yup.string().required("Last name required!"),
    emailId:yup.string().required().email("Proper Email id is required!"),
    password:yup.string().password().required("Provide password!"),
    confirmPassword:yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required("Provide password!")
  })

export function SignUp( {loginORsignupflag,setloginORsignupflag}) {

    const [showPassword, setshowPassword] = useState(true)
    const [cshowPassword, csetshowPassword] = useState(true)

    const formik=useFormik({
        initialValues:{
            firstName:"",
            lastName:"",
            emailId:"",
            password:"",
            confirmPassword:""
        },
        onSubmit:(values) => {
            addUser(values)
        },
        validationSchema:validationSchema
    })

    function addUser({firstName,lastName,emailId,password}){
        fetch(apiendpoint+"/signUp",
        {
            method: "POST",
            headers: { 'Content-Type': "application/json", 'Access-Control-Allow-Origin': "*" },
            body: JSON.stringify(
                {
                    FirstName: firstName,
                    LastName: lastName,
                    EmailId: emailId,
                    Password: password,
                }),
        })
        .then((data) => data.json())
        .then((data)=>{console.log(data);formik.resetForm()})
    }


  return (
          <div>
            <h1 className="sh">Sign Up</h1>
            <form id="from" onSubmit={formik.handleSubmit}>
                <TextField 
                id="filled-basic" 
                name="firstName" 
                label="First Name" 
                margin="normal" 
                value={formik.values.firstName} 
                onChange={formik.handleChange} 
                error={formik.touched.firstName  && Boolean(formik.errors.firstName)} 
                helperText={formik.touched.firstName && formik.errors.firstName}
                />

                <TextField 
                id="filled-basic" 
                name="lastName" 
                label="Last Name" 
                margin="normal" 
                value={formik.values.lastName} 
                onChange={formik.handleChange}
                error={formik.touched.lastName  && Boolean(formik.errors.lastName)} 
                helperText={formik.touched.lastName && formik.errors.lastName}
                />
                <TextField 
                id="filled-basic" 
                name="emailId" 
                label="Email" 
                margin="normal" 
                value={formik.values.emailId} 
                onChange={formik.handleChange}
                error={formik.touched.emailId  && Boolean(formik.errors.emailId)} 
                helperText={formik.touched.emailId && formik.errors.emailId}
                />
                <div id="passblock">
                <TextField
                id="filled-basic" 
                name="password" 
                label="Password" 
                margin="normal" 
                type="password"
                autocomplete="off"
                type={showPassword ? "password" : "text"}
                value={formik.values.password} 
                onChange={formik.handleChange}
                error={formik.touched.password  && Boolean(formik.errors.password)} 
                helperText={formik.touched.password && formik.errors.password}
                style={{width:"100%"}} 
                />
                {
                !showPassword ?
                <VisibilityIcon id="sbt" onClick={()=>setshowPassword(!showPassword)}/> :
                <VisibilityOffIcon  id="sbt" onClick={()=>setshowPassword(!showPassword)}/>
                }
                </div>
                <div  id="passblock">
                <TextField 
                id="filled-basic" 
                name="confirmPassword" 
                label="Confirm Password" 
                type={cshowPassword ? "password" : "text"}
                margin="normal" 
                autocomplete="off"
                value={formik.values.confirmPassword} 
                onChange={formik.handleChange}
                error={formik.touched.confirmPassword  && Boolean(formik.errors.confirmPassword)} 
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                style={{width:"100%"}} 
                />
               {
                !cshowPassword ?
                <VisibilityIcon  id="sbt" onClick={()=>csetshowPassword(!cshowPassword)}/> :
                <VisibilityOffIcon   id="sbt" onClick={()=>csetshowPassword(!cshowPassword)}/>
                }
                </div>

                <div id="but_text" onClick={()=>setloginORsignupflag(0)}>Alredy user? Log In here</div>
              <div className="buttondiv">
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
                <Button variant="contained" color="secondary"
                    onClick={()=>formik.resetForm()}
                >
                  Reset
                </Button>
              </div>
            </form>
          </div>
  );
}
