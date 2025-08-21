import { SyntheticEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, TextField, InputAdornment, Typography, Paper, Box, ThemeProvider, CircularProgress } from '@mui/material';
//import { useAppStore } from '../../../store';
import { AppButton, AppLink, AppIconButton, AppAlert, AppForm } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../../utils/form';
import {GetAxios} from '../../../service/AxiosHelper';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import constants from '../../../service/Constants';
import '../../../index.css';
import { useSnackbar } from 'notistack';
import { SignInManager } from "../../../hooks";
import { setCurrentUserToken, setIsAuthenticated} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
const VALIDATE_FORM_LOGIN_EMAIL = {
  email: {
    //presence: { allowEmpty: false, message: 'required ' },
    email: { message: 'must be a valid email address.' },
  },
  password: {
    //presence: { allowEmpty: false},
    // length: {
    //   minimum: 8,
    //   maximum: 32,
    //   message: 'must be between 8 and 32 characters.',
    // },
    format: {
      minimum: 8,
      pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\[\]{}()\\\/"'<>|~`=+#?!@$:%^&*\-_;.,]).{8,}$/,
      message: 'require 1 lower and upper case letter, 1 number and 1 special character.',
    },

  }
};

interface FormStateValues {
  email?: string | any;
  password?: string | any;
}


/**
 * Renders "Login with Email" view for Login flow
 * url: /auth/login/email
 * @page LoginEmail
 */
const LoginEmailView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  //const [, dispatch] = useAppStore();
  var { formState, onFieldChange, fieldGetError, fieldHasError, isFormValid, setFormState } = useAppForm({
    validationSchema: VALIDATE_FORM_LOGIN_EMAIL,
    initialValues: { email: '', password: '' } as FormStateValues,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>();
  const [submitLoading, setSubmitLoading] = useState<boolean>();
  const { enqueueSnackbar } = useSnackbar();
  var manager = new SignInManager();
  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);



  const handleInputChange = (event: SyntheticEvent) => {
    const { name, value } = event.target as HTMLInputElement;

    const updatedValues = {
      ...formState.values,
      [name]: value,
    };

    setFormState({
      ...formState,
      values: updatedValues,
      touched: {
        ...formState.touched,
        [name]: true,
      },
    });
  };




  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      setSubmitLoading(true);
      event.preventDefault();
   
      const formData = new FormData();
      formData.append('Email', formState.values.email);
      formData.append('Password', formState.values.password);
      const requestOptions = {
        method: 'POST',
        // headers: {
        //  Accept: 'application/json',
        //  'Content-Type': 'application/json',
        //  'data': JSON.stringify(objUser)
        // },
        body: formData
      };

   
      fetch(constants.Api_Url + 'Auth/Login', requestOptions)
  .then(response => response.json())
  .then(response => {
    setSubmitLoading(false);

    if (response.success === false) {
      enqueueSnackbar("Please check email or password.", {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    } else {
      debugger;
          if (response.data.enable2FA) {
        // User has 2FA enabled - store temp token and redirect to OTP verification
        localStorage.setItem("tempToken", response.data.token);
        navigate('/verify-otp', { replace: true, state: { email: formState.values.email } });
      } else {
         manager.SetToken(response.data);
      localStorage.setItem("userEmail", response.data.email);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("userId", response.data.id);
      dispatch(setCurrentUserToken(response.data));
      dispatch(setIsAuthenticated(true));

 
        // 2FA is not enabled - redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    }
  });
      },
    [dispatch, navigate, formState.values]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  return (

    <AppForm onSubmit={handleFormSubmit}>
      <Grid container sx={{
        minHeight: '660px',
        overflow: 'hidden',
        height: '100vh',
      }}>
        {/* <Grid item md={6} sx={{
          height: '100%',
          '@media screen and (max-width: 960px)': {
            display: 'none',
          },
        }}>
          <img className='h-100 loginImg' src='https://dev.d23dq0r447t0u2.amplifyapp.com/static/media/loginImage.b031e7679ff1df88ffb7.jpg' alt="Kids" />
        </Grid> */}

        <Grid item md={7} sx={{
          height: '100%',
          margin:'auto'
        }}>
          <Box sx={{
            height: '100%',
            borderRadius: '0px',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '50px',
            paddingBottom: '50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center ',
            '@media screen and (max-width: 960px)': {
              width: '100vw',
            }
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img className='loginFormlogo' 
              src='https://stellabackend.onrender.com/fabriclogo.png' alt="Logo" />
            </Box>
            <div className='w-50'>
              <h5 className='text-center mb-0'>Welcome</h5>
              <Typography>
                <TextField
                  label="Email"
                  name="email"
                  value={formState.values.email}
                  error={fieldHasError('email')}
                  helperText={fieldHasError('email')?formState.errors.email:""}
                  onChange={handleInputChange}
                  {...SHARED_CONTROL_PROPS}
                />
              </Typography>
              <Typography>
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  name="password"
                  value={formState.values.password}
                  error={fieldHasError('password')}
                  helperText={fieldHasError('password')?formState.errors.password:""}
                  onChange={handleInputChange}
                  {...SHARED_CONTROL_PROPS}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AppIconButton
                          aria-label="toggle password visibility"
                          icon={showPassword ? 'visibilityon' : 'visibilityoff'}
                          title={showPassword ? 'Hide Password' : 'Show Password'}
                          onClick={handleShowPasswordClick}
                          onMouseDown={eventPreventDefault}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Typography>

              {/* {error ? (
              <AppAlert severity="error" onClose={handleCloseError}>
                {error}
              </AppAlert>
            ) : null} */}
              <Grid container justifyContent="center" alignItems="center">
                <AppButton type="submit" className='btnLogin' disabled={!isFormValid()}>
                  {!submitLoading ?
                    'Log-In'
                    : (
                      <CircularProgress size={24} />
                    )}
                </AppButton>

              </Grid>
            </div>
            <div>
              <Button variant="text" color="inherit" component={AppLink} to="/auth/recovery/password">
               Reset your password
              </Button>
            </div>
          </Box>


        </Grid>
      </Grid>
    </AppForm>

  );
};

export default LoginEmailView;
