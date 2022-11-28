import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {loginTC} from './authReducer';
import {AppRootStateType, useAppSelector} from '../../app/store';
import {Navigate} from 'react-router-dom';

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}
export const Login = () => {
    const dispatch = useDispatch()
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    // const isLoggedIn = useAppSelector(state=>state.auth.isLoggedIn)  // можно и так достать данные

    const formik = useFormik({
        //     validate: (values) => {
        //         if(!values.email) {
        //             return {
        //                 email: 'Email is required'
        //             }
        //         }
        //         if(!values.password) {
        //             return {
        //                 password: 'Password is required'
        //             }
        //         } else if(values.password.length <= 3) {
        //             return {
        //                 password: 'must be more 3 characters'
        //             }
        //         }
        // },
        validate: (values) => {
            const errors: FormikErrorType = {}

            if (!values.email) {
                errors.email = 'required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'invalid email address'
            }
            if (!values.password) {
                errors.password = 'required'
            } else if (values.password.length < 3) {
                errors.password = 'must be more 3 characters'
            }
            return errors
        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: values => {
            // alert(JSON.stringify(values));
            dispatch(loginTC(values))
            formik.resetForm()
        },
    });

    if (isLoggedIn) {  //автоматически навигейтит на тодолисты
        return <Navigate  to={"/"} />
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        {/*<p>To log in get registered*/}
                        {/*    <a href={'https://social-network.samuraijs.com/'}*/}
                        {/*       target={'_blank'}> here*/}
                        {/*    </a>*/}
                        {/*</p>*/}
                        {/*<p>or use common test account credentials:</p>*/}
                        {/*<p>Email: free@samuraijs.com</p>*/}
                        {/*<p>Password: free</p>*/}
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email &&
                            <div style={{color: 'red'}}>{formik.errors.email}</div>}
                        <TextField type="password" label="Password"
                                   margin="normal"
                                   {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password &&
                            <div style={{color: 'red'}}>{formik.errors.password}</div>}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox
                                {...formik.getFieldProps('rememberMe')}
                                checked={formik.values.rememberMe}
                            />}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}