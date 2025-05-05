import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, TextField } from '@mui/material';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { Grid, CircularProgress } from "@mui/material";
import Select from '@mui/material/Select';
import { AppButton } from "../../components";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import { contactType } from "../../service/Constants";
function StepperForm() {
  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup.array()
      .of(yup.string()
        .email("Invalid email").required("Email is required")
      ),
    password: yup.string().required("Username is required"),

  });

  type FormValues = {
    username: string;
    email?: string[];
    password: string;

  };
  const form = useForm<FormValues>({
    defaultValues: {
      username: "rimsha",
      email: [],
      password: ""

    },
    resolver: yupResolver(schema),
    mode: "all"
  });
const spinSessionform = useForm<KidSpinSessionFormValues>({
    defaultValues: {
      kidId: "",
      userId: "",
      date: new Date(),
      trmLevel: "",
      spinType: "",
      behaviours: [{
        presentingBehaviour: "",
        intervention: "",
        need: "",
        support: "",
        whatsWorkingWell: "",
        whatsNotWorkingWell: "",
        whatNeedToHappen: ""
      }]

    },
    //  resolver: yupResolver(schema),
    mode: "all"
  });
  const { register, control, handleSubmit, formState, reset, watch, getValues, setValue, trigger } = form;
  const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitSuccessful, isSubmitted, isSubmitting, submitCount } = formState;
  const [spinstep, setSpinStep] = useState(1);
  const [maxspinstep, setMaxSpinStep] = useState(2);
  const [emailCount, setEmailCount] = useState(1);
  //const [emailValues, setEmailValues] = useState([]);

  const handleNext = () => {
    if (spinstep === maxspinstep) {
      handleSubmit(onSubmit)();
    } else {
      setSpinStep(spinstep + 1);
      if (maxspinstep > 2) {
        setEmailCount(emailCount + 1); // Increment email count when moving to next step
      }

    }
  };

  const handleAddEmail = () => {
    setMaxSpinStep(maxspinstep + 1); // Increment max step count when adding email
  };
  const onSubmit = (event: any) => {
    console.log("Button submitted clicked")
    console.log(event);
    console.log(watch())
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mt: 3 }}>
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            {spinstep === 1 && (
              <>
                <TextField
                  {...register('username', { required: true })}
                  label="Username"
                  fullWidth
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
                <TextField
                  {...register('password', { required: true })}
                  type="password"
                  label="Password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </>
            )}
            {spinstep > 1 && (
              <TextField
                type="email"
                {...register(`email.${emailCount - 1}`, { required: true })}
                key={`Email_${emailCount - 1}`}
                label={`Email ${emailCount - 1}`}
                error={!!errors.email?.[emailCount - 1]}
                helperText={errors.email?.[emailCount - 1]?.message}
                fullWidth


              />
            )}
            {spinstep > 1 && spinstep <= maxspinstep && (
              <Button type="button" variant="contained" onClick={handleAddEmail}>
                Add another email
              </Button>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              {
                spinstep === maxspinstep &&
                <Button

                  variant="contained"
                  onClick={(event) => {
                    console.log("Button submitted clicked")
                    onSubmit(event);
                  }}

                >
                  Submit
                </Button>

              }
              {
                spinstep !== maxspinstep &&
                <Button
                  type="button"
                  variant="contained"
                  onClick={(event) => {
                    setSpinStep(spinstep + 1);
                    if (maxspinstep > 2) {
                      setEmailCount(emailCount + 1); // Increment email count when moving to next step
                    }       
                  }}
                >
                  Next
                </Button>

              }



              {/* <Button
              type={spinstep === maxspinstep ? 'submit' : 'button'}
              variant="contained"
              onClick={(event) => {
                if (spinstep === maxspinstep) {
                  // Handle form submission only if it's the last step
                  onSubmit(event);
                } else {
                  handleNext();
                  setMaxSpinStep(prevStep => prevStep + 1); // Increment maxspinstep here
                }
              }}
            >
              {spinstep === maxspinstep ? 'Submit' : 'Next'}
            </Button> */}
            </Box>
          </form>
        </Box>
      </Box>
    </Box>

  );
};

export default StepperForm;
