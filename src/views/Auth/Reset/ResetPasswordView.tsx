import { SyntheticEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, TextField, InputAdornment, Typography, Paper, Box, ThemeProvider, CircularProgress } from '@mui/material';
//import { useAppStore } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { AppButton, AppLink, AppIconButton, AppAlert, AppForm } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../../utils/form';
import httpService from '../../../service/httpService';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import constants from '../../../service/Constants';
import '../../../index.css';
import { useSnackbar } from 'notistack';


const VALIDATE_FORM_RESET_PASSWORD = {
  code: {
    presence: { allowEmpty: false, message: 'required' },

  },
  newPassword: {
    //   presence: { allowEmpty: false, message: 'required' },
    format: {
      minimum: 8,
      pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\[\]{}()\\\/"'<>|~`=+#?!@$:%^&*\-_;.,]).{8,}$/,
      message: 'require 1 lower and upper case letter, 1 number and 1 special character.',
    },
  }
};

interface FormStateValues {
  code?: string | any;
  newPassword?: string | any;
  confirmPassword?: string | any;
}


/**
 * Renders "Reset Password" view for Forgot Password flow
 * url: /auth/reset/password
 * @page ResetPassword
 */
const ResetPasswordView = () => {
  const navigate = useNavigate();
  // const [, dispatch] = useAppStore();
  var { formState, onFieldChange, fieldGetError, fieldHasError, isFormValid, setFormState } = useAppForm({
    validationSchema: VALIDATE_FORM_RESET_PASSWORD,
    initialValues: { code: '', newPassword: '', confirmPassword: '' } as FormStateValues,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>();
  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);


  const { enqueueSnackbar } = useSnackbar();
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

  const passwordsMatch = () => {
    return formState.values.newPassword === formState.values.confirmPassword;
  };

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      setSubmitLoading(true);
      const formData = new FormData();
      formData.append('Code', formState.values.code);
      formData.append('NewPassword', formState.values.newPassword);
      const requestOptions = {
        method: 'POST',
        // headers: {
        //  Accept: 'application/json',
        //  'Content-Type': 'application/json',
        //  'data': JSON.stringify(objUser)
        // },
        body: formData
      };



      fetch(constants.Api_Url + 'Auth/ResetPassword', requestOptions).then(response => response.json())
        .then(response => {
          setSubmitLoading(false);

          if (response.success) {


            enqueueSnackbar("Password reset successfully.", {
              variant: 'success', style: { backgroundColor: '#5f22d8' },
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
            navigate('/auth/login', { replace: true });
          } else {
            enqueueSnackbar("The code entered does not match the one that was sent via email.", {
              variant: 'error',
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
          }

        });



    },
    [navigate, formState.values]
  );

  //const handleCloseError = useCallback(() => setError(undefined), []);

  return (
    <AppForm onSubmit={handleFormSubmit}>
      <Grid container sx={{
        minHeight: '660px',
        overflow: 'hidden',
        height: '100vh',
      }}>
        <Grid item md={6} sx={{
          height: '100%',
          '@media screen and (max-width: 960px)': {
            display: 'none',
          },
        }}>
          <img className='h-100 loginImg' src='https://dev.d23dq0r447t0u2.amplifyapp.com/static/media/loginImage.b031e7679ff1df88ffb7.jpg' alt="Kids" />
        </Grid>

        <Grid item md={6} sx={{
          height: '100%',
        }}>
          <Paper sx={{
            height: '100%',
            borderRadius: '0px',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '50px',
            paddingBottom: '50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
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
              <img className='loginFormlogo' src="https://majidalipl-001-site4.otempurl.com/fabriclogo.png" alt="Logo" />
            </Box>
            <div className='w-50'>
              <h5 className='text-center'>Reset Your Password</h5>
              <Typography>
                <TextField

                  label="Code"
                  name="code"
                  value={formState.values.code}
                  error={fieldHasError('code')}
                  helperText={fieldHasError('code') ? formState.errors.code : ""}
                  onChange={handleInputChange}
                  {...SHARED_CONTROL_PROPS}
                />
              </Typography>
              <Typography>
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  label="NewPassword"
                  name="newPassword"
                  value={formState.values.newPassword}
                  error={fieldHasError('newPassword')}
                  helperText={fieldHasError('newPassword') ? formState.errors.newPassword : ""}
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

                <TextField
                  type={showPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formState.values.confirmPassword}
                  error={fieldHasError('confirmPassword')}
                  helperText={fieldHasError('confirmPassword') ? formState.errors.confirmPassword : ""}
                  onChange={handleInputChange}
                  {...SHARED_CONTROL_PROPS}
                />
                {formState.values.confirmPassword && !passwordsMatch() && (
                  <Typography variant="body2" color="error">
                    Passwords do not match.
                  </Typography>
                )}

              </Typography>

              {/* {error ? (
              <AppAlert severity="error" onClose={handleCloseError}>
                {error}
              </AppAlert>
            ) : null} */}
              <Grid container justifyContent="center" alignItems="center">
                <AppButton type="submit" className='btnLogin' disabled={!isFormValid()}>
                  {!submitLoading ?
                    'RESET PASSWORD'
                    : (
                      <CircularProgress size={24} />
                    )}
                </AppButton>

              </Grid>
            </div>
            <div>

            </div>
          </Paper>


        </Grid>
      </Grid>
    </AppForm>

  );
};

export default ResetPasswordView;
