import { Formik, useFormik } from 'formik';
import Button from '@material-ui/core/Button';
import { useEffect, useState } from 'react';
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

const validationSchema = yup.object({
    emailId: yup.string().required().email("Proper Email id is required!"),
    password: yup.string().required("Provide password!"),

})

export function LogIn({ loginORsignupflag, setloginORsignupflag }) {

    const [showPassword, setshowPassword] = useState(true);

    const [afterSubmitFlag,setafterSubmitFlag] = useState(false);
    const[resultMessage,setresultMessage]=useState(null)

    var history = useHistory();

    const formik = useFormik({
        initialValues: {
            emailId: "",
            password: ""
        },
        onSubmit: (values) => {
            verifyCredentials(values.emailId,values.password,afterSubmitFlag,setafterSubmitFlag,resultMessage,setresultMessage)
        },
        validationSchema: validationSchema
    })


    function verifyCredentials(emailId,password,afterSubmitFlag,setafterSubmitFlag,resultMessage,setresultMessage){

        // console.log(emailId)
        // console.log(password)
        function handleLoginSubmit(){
            history.push("/content")
        }

        fetch(apiendpoint+"/login",
        {
            method: "POST",
            headers: { 'Content-Type': "application/json", 'Access-Control-Allow-Origin': "*" },
            body: JSON.stringify(
                {
                    EmailId:emailId,
                    Password: password
                }),
        })
        .then((data) => data.json())
        .then((data)=>{
            console.log(data);
            setafterSubmitFlag(true);
            setresultMessage(data.message);
            return data
        })
        .then((data)=>{
            
            if(data.message !=="Invalid Credentials"){
                localStorage.setItem("auth-token",data.token);
                localStorage.setItem("currentUserId",data.id);

            }
            
            formik.resetForm()
            if(data.message=="Successfull Login")
            {
                handleLoginSubmit()
            }
        })

        

    
    }

    return (
        <div >
            <h1 className="sh">Log In</h1>
            <form id="from" onSubmit={formik.handleSubmit}>
                <TextField
                    id="filled-basic"
                    name="emailId"
                    label="Email"
                    margin="normal"
                    placeholder="enter your email id "
                    value={formik.values.emailId}
                    onChange={formik.handleChange}
                    error={formik.touched.emailId && Boolean(formik.errors.emailId)}
                    helperText={formik.touched.emailId && formik.errors.emailId}
                />
                <div id="passblock">
                    <TextField
                        id="filled-basic"
                        name="password"
                        label="Password"
                        margin="normal"
                        autocomplete="off"
                        type={showPassword ? "password" : "text"}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        style={{ width: "100%" }}
                    />
                    {
                        !showPassword ?
                            <VisibilityIcon id="sbt" onClick={() => setshowPassword(!showPassword)} /> :
                            <VisibilityOffIcon id="sbt" onClick={() => setshowPassword(!showPassword)} />
                    }
                </div>
                
                <div id="but_text" onClick={() => setloginORsignupflag(1)}>Not user? Sign up here</div>
                <div id="but_text" onClick={() => setloginORsignupflag(2)}>Forgot Password ?</div>
                <div className="buttondiv">
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </div>

            </form>
            <div id="resultMessage">
                    <h1>
                    {
                        afterSubmitFlag ? `${resultMessage} !` : ""
                    }
                    </h1>
                </div>

        </div>
    );
}
