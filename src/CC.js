import Button from '@material-ui/core/Button';
import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Formik, useFormik } from 'formik';
import { TextField } from '@material-ui/core';



import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import DeleteIcon from "@mui/material/Icon"  


import * as yup from 'yup';
import { DeleteForeverTwoTone } from '@material-ui/icons';

const apiendpoint = "http://localhost:4444"


const validationSchema = yup.object({
    longUrl: yup.string().required("Url is required!").url("Not a Vlaid url"),
})

export function CC() {
    var history = useHistory();
    const currentUser = localStorage.getItem('currentUserId');
    const currentAuth = localStorage.getItem('auth-token');
    const [UserUrls, setUserUrls] = useState([])
    history.push("/content/UsersUrls/" + localStorage.getItem('currentUserId'))

    const formik = useFormik({
        initialValues: {
            longUrl: "",
        },
        onSubmit: async (values) => {
            console.log(values)
            addUrlToShorten(currentUser, values.longUrl)
            formik.resetForm()
            console.log("resetform")
        },
        validationSchema: validationSchema
    })

    function addUrlToShorten(userId, longUrl) {
        fetch(apiendpoint + "/shorten",
            {
                method: "POST",
                headers: { 'Content-Type': "application/json", 'Access-Control-Allow-Origin': "*", 'auth-token': localStorage.getItem('auth-token') },
                body: JSON.stringify(
                    {
                        longUrl,
                        createrBy:localStorage.getItem('currentUserId')
                    }),
            })
            .then((data) => data.json())
            .then((data) => {
                console.log(data)
                if (data != "Invalid longUrl") {
                    addUsersUrls(currentUser, data)
                }
            })

    }

    async function addUsersUrls(currentUser, data) {

        console.log(currentUser, data)
        await fetch(apiendpoint + "/content/UserShorten",
            {
                method: "POST",
                headers: { 'Content-Type': "application/json", 'Access-Control-Allow-Origin': "*", 'auth-token': localStorage.getItem('auth-token') },
                body: JSON.stringify(
                    {
                        currentUser,
                        data
                    }),
            })
            .then(() => {
                formik.resetForm()
                ShowUsersUrl()
            })

    }

    function ShowUsersUrl() {
        fetch(apiendpoint + "/content/UsersUrls/" + localStorage.getItem('currentUserId'),
            {
                method: "GET",
                headers: { 'Content-Type': "application/json", 'Access-Control-Allow-Origin': "*", 'auth-token': localStorage.getItem('auth-token') },
            })
            .then((data) => data.json())
            .then((data) => {
                console.log(data)
                setUserUrls(data)

            })

    }
    function DeleteForeverTwoTone(id){
        console.log(id)
        fetch(apiendpoint + "/content/deleteshorten",
            {
                method: "DELETE",
                headers: { 'Content-Type': "application/json", 'Access-Control-Allow-Origin': "*", 'auth-token': localStorage.getItem('auth-token') },
                body: JSON.stringify(
                    {
                        id
                    }),
            })
            .then(() => {
                ShowUsersUrl()
            })
    }


    useEffect(() => {
        ShowUsersUrl()
    }, [])


    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    return (
        <>
            <Button variant="contained" color="secondary"
                onClick={() => {
                    localStorage.removeItem("auth-token");
                    localStorage.removeItem("currentUserId");
                    history.push("/login");
                    ShowUsersUrl()
                }}
            >
                Log Out
            </Button>
            <h1>Welcome To URL SHORTNER</h1>
            <div style={{ backgroundColor: "whitesmoke", margin: "2rem", borderRadius: "10px" }}>
                <form id="from" onSubmit={formik.handleSubmit}>
                    <TextField
                        id="filled-basic"
                        name="longUrl"
                        label="...Url"
                        margin="normal"
                        placeholder="Enter url to be shortened"
                        autoComplete="off"
                        value={formik.values.longUrl}
                        onChange={formik.handleChange}
                        error={formik.touched.longUrl && Boolean(formik.errors.longUrl)}
                        helperText={formik.touched.longUrl && formik.errors.longUrl}
                        style={{ backgroundColor: "white", margin: "1rem 2rem" }}
                    />
                    <Button type="submit" variant="contained" color="primary"
                        style={{ margin: "1rem 2rem" }}
                    >
                        ADD Url
                    </Button>

                </form>
            </div>
            <div>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="left">Action</StyledTableCell>
                                <StyledTableCell align="left">CreatedAT</StyledTableCell>
                                <StyledTableCell align="left">Short URL</StyledTableCell>
                                <StyledTableCell align="left">Hit Count</StyledTableCell>
                                <StyledTableCell align="left">Long URL</StyledTableCell>
                                
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                UserUrls
                                    ?
                                    
                                    UserUrls.map((row) => (
                                        <StyledTableRow key={row.name}>
                                            <StyledTableCell align="left"><button onClick={()=>{
                                                DeleteForeverTwoTone(row._id)
                                            }}>🗑️delete</button></StyledTableCell>
                                            <StyledTableCell align="left">{row.date}</StyledTableCell>
                                            <StyledTableCell align="left">{row.shortUrl}</StyledTableCell>
                                            <StyledTableCell align="left">{row.HitCount}</StyledTableCell>
                                            <StyledTableCell align="left">{row.longUrl}</StyledTableCell>
                                        </StyledTableRow>

                                    ))
                                    : ""
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>

        </>
    );
}
