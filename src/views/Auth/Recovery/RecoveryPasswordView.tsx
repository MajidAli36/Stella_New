import { SyntheticEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, TextField, InputAdornment, Typography, Paper, Box, ThemeProvider, CircularProgress } from '@mui/material';
//import { useAppStore } from '../../../store';
import { AppButton, AppLink, AppIconButton, AppAlert, AppForm } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../../utils/form';
import httpService from '../../../service/httpService';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import constants from '../../../service/Constants';
import '../../../index.css';
import { useSnackbar } from 'notistack';
import { setIsAuthenticated} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';

const VALIDATE_FORM_RECOVERY_PASSWORD = {
  email: {
    // presence: { allowEmpty: false, message: 'required' },
    email: { message: 'must be a valid email address' },
  },
};

interface FormStateValues {
  email: string;
}

interface Props {
  email?: string;
}

/**
 * Renders "Recover Password" view for Login flow
 * url: /uth/recovery/password
 * @page RecoveryPassword
 * @param {string} [props.email] - pre-populated email in case the user already enters it
 */
const RecoveryPasswordView = ({ email = '' }: Props) => {
  const { formState, onFieldChange, fieldGetError, fieldHasError, isFormValid } = useAppForm({
    validationSchema: VALIDATE_FORM_RECOVERY_PASSWORD,
    initialValues: { email } as FormStateValues,
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>();
 // const [, dispatch] = useAppStore();
  const [submitLoading, setSubmitLoading] = useState<boolean>();
  const { enqueueSnackbar } = useSnackbar();
  const handleFormSubmit = async (event: SyntheticEvent) => {
    setSubmitLoading(true);
    event.preventDefault();


    const obj = {} as any;
    obj.Email = formState.values.email;
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        //  'data': JSON.stringify(objUser)
      },
      body: JSON.stringify(obj)
    };
    // await api.auth.recoverPassword(values);
 
    fetch(constants.Api_Url + 'Auth/ForgotPassword', requestOptions).then(response => response.json())
      .then(response => {
       
        setSubmitLoading(false);
        if (response.success) {

         
          //Navigate to reset password
          navigate('/auth/reset', { replace: true });

          enqueueSnackbar("An email has been sent to reset your password.", {
            variant: 'success',  style: { backgroundColor: '#5f22d8'},
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          });

        } else {

          enqueueSnackbar("Email not found.", {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          });
        }

      });


    //Show message with instructions for the user

  };

  const handleCloseError = useCallback(() => setMessage(undefined), []);

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
              <img className='loginFormlogo' src="https://stellabackend.onrender.com/fabriclogo.png" alt="Logo" />
            </Box>
            <div className='w-50'>
              <h5 className='text-center'>Reset Your Password</h5>

              <h6>Please enter the email address you'd like your password reset information sent to.</h6>
              <Typography>
                <TextField
                  required
                  label="Email"
                  name="email"
                  value={formState.values.email}
                  error={fieldHasError('email')}
                  helperText={fieldHasError('email')?formState.errors.email:""}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
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
                    'RESET PASSWORD'
                    : (
                      <CircularProgress size={24} />
                    )}
                </AppButton>

              </Grid>
            </div>
            <div>
              <Button variant="text" color="inherit" component={AppLink} to="/auth/login">
                LOGIN
              </Button>
            </div>
          </Paper>


        </Grid>
      </Grid>
    </AppForm>

  );
};

export default RecoveryPasswordView;
