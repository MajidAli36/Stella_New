import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import constants from '../../../service/Constants';
import { GetAxios } from '../../../service/AxiosHelper';
import { setCurrentUserToken, setIsAuthenticated } from '../../../store';
import { useDispatch } from 'react-redux';
import { SignInManager } from "../../../hooks";

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const manager = new SignInManager();
  const dispatch = useDispatch(); 

  const email = location.state?.email;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      enqueueSnackbar("Invalid access. Redirecting to login...", {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      navigate('/login');
    }
  }, [email, enqueueSnackbar, navigate]);

  const handleVerify = useCallback(async () => {
    if (!otp || otp.length !== 6) {
      enqueueSnackbar("Please enter a valid 6-digit code", {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      return;
    }

    setLoading(true);

    try {
      const response = await GetAxios().post(
        constants.Api_Url + 'TwoFactorAuth/VerifyOtp/verify',
        { Otp: otp, Email: email }
      );

      if (response.status === 200) {
        enqueueSnackbar("OTP verified successfully!", {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });

        const tempToken = localStorage.getItem("tempToken");

        if (tempToken) {
          const claims = { token: tempToken, expiry: new Date(Date.now() + 60 * 60 * 1000).toISOString() };
          manager.SetToken(claims);
          dispatch(setCurrentUserToken(claims));
          dispatch(setIsAuthenticated(true));
          navigate('/dashboard', { replace: true });
        } else {
          enqueueSnackbar("Session expired. Please login again.", {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          });
          navigate('/login', { replace: true });
        }
      }

    } catch (err) {
      enqueueSnackbar("Invalid OTP. Please try again.", {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    } finally {
      setLoading(false);
    }
  }, [otp, email, enqueueSnackbar, navigate, dispatch, manager]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2,
        p: 3
      }}
    >
      <Typography variant="h4" gutterBottom>
        Two-Factor Authentication
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please enter the 6-digit code
      </Typography>
      <TextField
        label="6-digit code"
        variant="outlined"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
        inputProps={{ maxLength: 6 }}
        sx={{ width: 300 }}
      />
      <Button
        variant="contained"
        onClick={handleVerify}
        disabled={loading || otp.length !== 6}
        sx={{ width: 300 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Verify'}
      </Button>
    </Box>
  );
};

export default OTPVerification;
