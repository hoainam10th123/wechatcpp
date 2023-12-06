import { Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid, Link, TextField, Typography } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from 'yup';
import { useStore } from "../../stores/stores";
import { router } from "../../router/Routes";
import { toast } from "react-toastify";


export default function SignUp() {
    const { userStore } = useStore()
    const validationSchema = yup.object().shape({
        displayName: yup.string().required('displayName is required'),
        email: yup.string().required('Email is required').email('Invalid email'),
        password: yup.string().required('Password is required')
        .min(6, 'Password should be of minimum 6 characters length'),
        repassword: yup.string().required('Please retype your password.')
        .oneOf([yup.ref('password')], 'Your passwords do not match.'),        
    });

    const formik = useFormik({
        initialValues: {
            displayName: '',
            email: '',
            password: '',
            repassword:'',
        },
        validationSchema: validationSchema,
        onSubmit: (values, actions) => {
            userStore.register(values).then(() => {
                toast.success('Register success!')
                router.navigate('/chathome')
            }).catch(err => {
                actions.setSubmitting(false);
            })
        },
    });

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="displayName"
                            name="displayName"
                            label="DisplayName"
                            value={formik.values.displayName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.displayName && Boolean(formik.errors.displayName)}
                            helperText={formik.touched.displayName && formik.errors.displayName}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            name="email"
                            label="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="password"
                            name="password"
                            label="password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="repassword"
                            name="repassword"
                            label="Repet password"
                            type="password"
                            value={formik.values.repassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.repassword && Boolean(formik.errors.repassword)}
                            helperText={formik.touched.repassword && formik.errors.repassword}
                        />
                        <FormControlLabel
                            control={<Checkbox value="allowExtraEmails" color="primary" />}
                            label="I want to receive inspiration, marketing promotions and updates via email."
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
                            type="submit">
                            {formik.isSubmitting ? 'Loading...' : 'Sign Up'}
                        </Button>
                    </form>

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>
    );
}

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}