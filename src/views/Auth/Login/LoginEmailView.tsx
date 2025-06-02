import { SyntheticEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, TextField, InputAdornment, Typography, Box, CircularProgress } from '@mui/material';
import { AppButton, AppLink, AppIconButton, AppForm } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../../utils/form';
import { GetAxios } from '../../../service/AxiosHelper';
import constants from '../../../service/Constants';
import { useSnackbar } from 'notistack';
import { SignInManager } from "../../../hooks";
import { setCurrentUserToken, setIsAuthenticated } from '../../../store';
import { useDispatch } from 'react-redux';

const VALIDATE_FORM_LOGIN_EMAIL = {
  email: {
    email: { message: 'must be a valid email address.' },
  },
  password: {
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

const LoginEmailView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formState, onFieldChange, fieldGetError, fieldHasError, isFormValid, setFormState } = useAppForm({
    validationSchema: VALIDATE_FORM_LOGIN_EMAIL,
    initialValues: { email: '', password: '' } as FormStateValues,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>();
  const { enqueueSnackbar } = useSnackbar();
  const manager = new SignInManager();

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
      event.preventDefault();
      setSubmitLoading(true);
   
      try {
        const formData = new FormData();
        formData.append('Email', formState.values.email);
        formData.append('Password', formState.values.password);
        
        const response = await fetch(constants.Api_Url + 'Auth/Login', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        console.log("Login API response:", data); // <-- Add this line
        setSubmitLoading(false);

        if (!data.success) {
          enqueueSnackbar("Please check email or password.", {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          });
          return;
        }

        // Store user email for potential 2FA verification
        localStorage.setItem("userEmail", formState.values.email);
         console.log(localStorage.getItem("userEmail"));
        if (data.data.enable2FA) {
          // User has 2FA enabled - store temp token and redirect to OTP verification
          localStorage.setItem("tempToken", data.token);
          navigate('/verify-otp', { replace: true, state: { email: formState.values.email } });

        } else {
          // No 2FA - complete login
          manager.SetToken(data.data.token);
          localStorage.setItem("userRole", data.data.role);
          dispatch(setCurrentUserToken(data.data));
          dispatch(setIsAuthenticated(true));
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        setSubmitLoading(false);
        enqueueSnackbar("An error occurred during login.", {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
      }
    },
    [dispatch, navigate, formState.values, enqueueSnackbar]
  );

  return (
    <AppForm onSubmit={handleFormSubmit}>
      <Grid container sx={{
        minHeight: '660px',
        overflow: 'hidden',
        height: '100vh',
      }}>
        <Grid item md={7} sx={{
          height: '100%',
          margin: 'auto'
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
              <img 
                className='loginFormlogo' 
                src='https://majidalipl-001-site4.otempurl.com/fabriclogo.png' 
                alt="Logo" 
              />
            </Box>
            <div className='w-50'>
              <h5 className='text-center mb-0'>Welcome</h5>
              <Typography>
                <TextField
                  label="Email"
                  name="email"
                  value={formState.values.email}
                  error={fieldHasError('email')}
                  helperText={fieldHasError('email') ? formState.errors.email : ""}
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
                  helperText={fieldHasError('password') ? formState.errors.password : ""}
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

              <Grid container justifyContent="center" alignItems="center">
                <AppButton 
                  type="submit" 
                  className='btnLogin' 
                  disabled={!isFormValid()}
                >
                  {!submitLoading ?
                    'Log-In'
                    : <CircularProgress size={24} />}
                </AppButton>
              </Grid>
            </div>
            <div>
              <Button 
                variant="text" 
                color="inherit" 
                component={AppLink} 
                to="/auth/recovery/password"
              >
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