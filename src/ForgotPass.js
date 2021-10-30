import { Formik, useFormik } from 'formik';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';


import { useState } from 'react';
import PropTypes from 'prop-types';
import { color } from '@mui/system';
import { Email } from '@material-ui/icons';
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

})
const validationSchema2 = yup.object({
    resetCode: yup.string().required().min(6, 'Must be exactly 5 digits').max(6, 'Must be exactly 5 digits')
})

const validationSchema3 = yup.object({
    password:yup.string().password().required("Provide password!"),
    confirmPassword:yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required("Provide password!")
})

export function ForgotPass({ loginORsignupflag, setloginORsignupflag }) {
    const [usercheckflag, setusercheckflag] = useState(null)
    const [rflag, rsetflag] = useState(false)
    const [currentUser,setCurrentUser]=useState(null)
    const [InvalidResetKeyFlag,setInvalidResetKeyFlag]=useState(false)

    function generateResetCode(data) {
        console.log("here the data ", data)

        if (data.flag) {
            rsetflag(!rflag)
            setusercheckflag(data.flag)
            setCurrentUser(data.EmailId)
        }
        else {
            rsetflag(!rflag)
            setusercheckflag(data.flag)
        }
    }

    function checkUserExist(values) {

        fetch(apiendpoint + "/userExist",
            {
                method: "POST",
                headers: { 'Content-Type': "application/json", 'Access-Control-Allow-Origin': "*" },
                body: JSON.stringify(
                    {
                        EmailId: values.emailId,
                    }),
            })
            .then((data) => data.json())
            .then((data) => {
                // console.log(data)
                generateResetCode(data)

            })

    }

    function verfiyResetCode({resetCode}){
        console.log(resetCode)
        console.log(currentUser)
        fetch(apiendpoint + "/verfiyResetCode",
            {
                method: "POST",
                headers: { 'Content-Type': "application/json", 'Access-Control-Allow-Origin': "*" },
                body: JSON.stringify(
                    {
                        EmailId: currentUser,
                    }),
            })
            .then((data) => data.json())
            .then((d)=>
            {
                const randomFromDb=d.RandomNum
                console.log(randomFromDb)
                ismatach(randomFromDb,resetCode)
            })

    }

    function ismatach(randomFromDb,resetCode){
        if(randomFromDb==resetCode){
            handleClickOpen()
        }
        else{
            setInvalidResetKeyFlag(true)
        }

    }

    const formik = useFormik({
        initialValues: {
            emailId: "",
        },
        onSubmit: (values) => {
            checkUserExist(values)
        },
        validationSchema: validationSchema
    })

    const formik2 = useFormik({
        initialValues: {
            resetCode: "",
        },
        onSubmit: (values) => {
            verfiyResetCode(values)
        },
        validationSchema: validationSchema2
    })


    const [open, setOpen] = React.useState(false);
    //const [selectedValue, setSelectedValue] = React.useState(emails[1]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        //setSelectedValue(value);
    };

    return (
        <div>
            <h1 className="sh">Forgot Password</h1>
            <h3 style={{ color: "green" }}>Enter your registered e-mail id</h3>
            <form id="from" onSubmit={formik.handleSubmit}>
                <TextField
                    id="filled-basic"
                    name="emailId"
                    label="Email"
                    margin="normal"
                    value={formik.values.emailId}
                    onChange={formik.handleChange}
                    error={formik.touched.emailId && Boolean(formik.errors.emailId)}
                    helperText={formik.touched.emailId && formik.errors.emailId}
                />
                <Button type="submit" variant="contained" color="primary"
                >
                    submit
                </Button>

                <div id="but_text" onClick={() => setloginORsignupflag(0)}>Alredy user? Log In here</div>


                {
                    rflag ? (usercheckflag ? <h2 id="abt_user">You can Verify Now, check yoour mail </h2> : <h2 id="abt_user">User Does not exist</h2>) : ""
                }
                
            </form>

            <form id="from" onSubmit={formik2.handleSubmit}>
                <TextField
                    style={{ margin: "1rem" }}
                    id="filled-basic"
                    name="resetCode"
                    label="Reset Code"
                    autocomplete="off"
                    margin="18px"
                    value={formik2.values.resetCode}
                    onChange={formik2.handleChange}
                    error={formik2.touched.resetCode && Boolean(formik2.errors.resetCode)}
                    helperText={formik2.touched.resetCode && formik2.errors.resetCode}
                />
                <div className="buttondiv">
                    <Button type="submit" variant="contained" color="primary" 
                        // onClick={handleClickOpen}
                    >
                        CliCK here to Verify
                    </Button>
                </div>
            </form>

        
        {
            InvalidResetKeyFlag ? <h1 style={{backgroundColor:"red",margin:"1rem"}}>Invalid Reset Key</h1>:""
        }



            <SimpleDialog
                //selectedValue={selectedValue}
                id="reset_box"
                open={open}
                onClose={handleClose}
                currentUser={currentUser}
            />

        </div>
    );
}


function SimpleDialog(props) {
    var history = useHistory();
    const { onClose, selectedValue, open,currentUser } = props;

    const [showPassword, setshowPassword] = useState(true)
    const [cshowPassword, csetshowPassword] = useState(true)

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    const formik3 = useFormik({
        initialValues: {
            resetCode: "",
        },
        onSubmit: (values) => {
            updatePassword(values)
            
        },
        validationSchema: validationSchema3
    })

   

    function updatePassword(values){

        fetch(apiendpoint + "/setNewPassword",
            {
                method: "POST",
                headers: { 'Content-Type': "application/json", 'Access-Control-Allow-Origin': "*" },
                body: JSON.stringify(
                    {
                        EmailId: currentUser,
                        Password :values.password
                    }),
            })
            .then((data) => data.json())
            .then(history.push("/Content"))

    }


    return (
        <div id="dialog-box">

            <Dialog id="reset_box" onClose={handleClose} open={open}>
                <DialogTitle style={{ margin: "1rem" }}>change password for user {currentUser}</DialogTitle>
                <form id="from" onSubmit={formik3.handleSubmit}>
                <div  id="passblock" style={{ margin: "1rem" }}>
                <TextField
                
                id="filled-basic" 
                name="password" 
                label="Password" 
                margin="normal" 
                type="password"
                autocomplete="off"
                type={showPassword ? "password" : "text"}
                value={formik3.values.password} 
                onChange={formik3.handleChange}
                error={formik3.touched.password  && Boolean(formik3.errors.password)} 
                helperText={formik3.touched.password && formik3.errors.password}
                style={{width:"100%"}} 
                />
                {
                !showPassword ?
                <VisibilityIcon id="sbt" onClick={()=>setshowPassword(!showPassword)}/> :
                <VisibilityOffIcon  id="sbt" onClick={()=>setshowPassword(!showPassword)}/>
                }
                </div>
                <div  id="passblock" style={{ margin: "1rem" }}>
                <TextField 
                id="filled-basic" 
                name="confirmPassword" 
                label="Confirm Password" 
                type={cshowPassword ? "password" : "text"}
                margin="normal" 
                autocomplete="off"
                value={formik3.values.confirmPassword} 
                onChange={formik3.handleChange}
                error={formik3.touched.confirmPassword  && Boolean(formik3.errors.confirmPassword)} 
                helperText={formik3.touched.confirmPassword && formik3.errors.confirmPassword}
                style={{width:"100%"}} 
                />
                 {
                !cshowPassword ?
                <VisibilityIcon  id="sbt" onClick={()=>csetshowPassword(!cshowPassword)}/> :
                <VisibilityOffIcon   id="sbt" onClick={()=>csetshowPassword(!cshowPassword)}/>
                }
                </div>
                    <Button type="submit" variant="contained" color="primary" style={{ margin: "1rem" }}
                    >
                        Submit
                    </Button>
                </form>
            </Dialog>
        </div>

    )
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};
