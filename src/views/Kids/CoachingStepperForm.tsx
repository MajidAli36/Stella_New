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
import { GetAxios } from '../../service/AxiosHelper';
import constants from '../../service/Constants';
import { coachingschema } from '../../service/ValidationSchema';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
function CoachingStepperForm() {
    const schema = yup.object().shape({
        userId: yup.string().required("Required"),
        date: yup.date().required("Required"),
        category: yup.string().required("Required"),
        subCategory:  yup.string().when('category', ([category], sch) => {
          return category !=="Other"
            ? sch.required("Required")
            : sch.notRequired();
        }),
        customSubCategory:  yup.string().when('category', ([category], sch) => {
            return category ==="Other"
              ? sch.required("Required")
              : sch.notRequired();
          }),
      
        kidActions: yup.array().of(
            yup.object().shape({
                kidId: yup.string().required('Required'),
                status: yup.string().required('Required'),
                suggestions: yup.string().required('Required'), // Adjust as needed
                actions: yup.string().required('Required'),
                concerns: yup.string().required('Required'),
                note: yup.string().required('Required'),
            })
        )
    });

    const form = useForm<KidCoachingFormValues>({
        defaultValues: {
            userId: "123456",
            date: new Date(),
            category: "",
            subCategory: "",
            customSubCategory: "",
            kidActions: [{
                kidId: "",
                status: "",
                suggestions: "", // Adjust as needed
                actions: "",
                concerns: "",
                note: "",
            }],
        },
        resolver: yupResolver(coachingschema),
        mode: "all"
    });

    const { register, control, handleSubmit, formState, reset, watch, getValues, setValue, trigger } = form;
    const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitSuccessful, isSubmitted, isSubmitting, submitCount } = formState;
    const [coachingstep, setCoachingstep] = useState(1);
    const [maxcoachstep, setMaxCoachStep] = useState(2);
    const [kidCount, setKidCount] = useState(1);
    const [kidList, setKidList] = useState<KidListModel[]>();
    const getKidList = () => {
        const obj = {} as any;
        obj.Status = "";
        obj.Search = "";
        GetAxios().post(constants.Api_Url + 'Kid/GetKids', obj).then(res => {
            if (res.data.success) {

                setKidList(res.data.list);

            }
        })
    };
    React.useEffect(() => {
        getKidList();

    }, []);
    const handleAddKid = () => {
        setKidCount(kidCount + 1);
        setMaxCoachStep(maxcoachstep+1);
    };
    const onSubmit = (event: any) => {
        console.log("Button submitted clicked")
        console.log(watch())
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ mt: 3 }}>
                <Box>
                    <div> {coachingstep} of {maxcoachstep}</div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {coachingstep=== 1 && (
                            <>
                                <TextField id="kidRecordingDate" className="mb-4" required type="date" fullWidth label="Date: *" variant="standard" InputLabelProps={{
                                    shrink: true,
                                }}  {...register("date")}
                                    error={!!errors.date}
                                    helperText={errors.date ? errors?.date?.message : ""}
                                />
                                {[...Array(kidCount)].map((_, index) => (
                                    <FormControl variant="standard" fullWidth className="mb-5">
                                        <InputLabel id="kidRecordingLabel">Kid:*</InputLabel>
                                        <Select
                                            labelId="kidRecordingLabel"
                                            id="kidRecordingLabelKidselect"
                                            {...register(`kidActions.${index}.kidId`, {

                                                required: true
                                            })}

                                        >
                                              <MenuItem key={"kid_" + 45} value={"Rimsha"}>Rimsha</MenuItem>
                                              <MenuItem key={"kid_" + 47} value={"Majid"}>Majid</MenuItem>

                                            {(kidList || []).map((item: KidListModel, index: any) => {
                                                return (
                                                    <MenuItem key={"kid_" + item.id + index + 3} value={item.id}>{item.name}</MenuItem>

                                                );
                                            })}

                                        </Select>
                                        <FormHelperText>
                                            {errors.kidActions?.[index]?.kidId?.message}
                                        </FormHelperText>
                                    </FormControl>



                                ))}

                              
                                    <Button type="button" variant="contained" onClick={handleAddKid}>
                                        Add another Kid
                                    </Button>
                              
                            </>
                        )}
                        {coachingstep > 1 && (
                            <>
                                <TextField
                                    type="text" 
                                    {...register(`kidActions.${coachingstep-2}.status`, { required: true })}
                                    key={`kidActions.${coachingstep-2}.status`}
                                    label={`kidActions.${coachingstep-2}.status`}
                                    error={!!errors.kidActions?.[coachingstep-2]?.status}
                                    helperText={errors.kidActions?.[coachingstep-2]?.message}
                                    fullWidth
                                />
                                <TextField
                                    type="text" 
                                    {...register(`kidActions.${coachingstep-2}.suggestions`, { required: true })}
                                    key={`kidActions.${coachingstep-2}.suggestions`}
                                    label={`kidActions.${coachingstep-2}.suggestions`}
                                    error={!!errors.kidActions?.[coachingstep-2]?.suggestions}
                                    helperText={errors.kidActions?.[coachingstep-2]?.message}
                                    fullWidth
                                />
                                <TextField
                                    type="text" 
                                    {...register(`kidActions.${coachingstep-2}.actions`, { required: true })}
                                    key={`kidActions.${coachingstep-2}.actions`}
                                    label={`kidActions.${coachingstep-2}.actions`}
                                    error={!!errors.kidActions?.[coachingstep-2]?.actions}
                                    helperText={errors.kidActions?.[coachingstep-2]?.message}
                                    fullWidth
                                />
                                <TextField
                                    type="text" 
                                    {...register(`kidActions.${coachingstep-2}.concerns`, { required: true })}
                                    key={`kidActions.${coachingstep-2}.concerns`}
                                    label={`kidActions.${coachingstep-2}.concerns`}
                                    error={!!errors.kidActions?.[coachingstep-2]?.concerns}
                                    helperText={errors.kidActions?.[coachingstep-2]?.message}
                                    fullWidth
                                />
                                <TextField
                                    type="text" 
                                    {...register(`kidActions.${coachingstep-2}.note`, { required: true })}
                                    key={`kidActions.${coachingstep-2}.note`}
                                    label={`kidActions.${coachingstep-2}.note`}
                                    error={!!errors.kidActions?.[coachingstep-2]?.note}
                                    helperText={errors.kidActions?.[coachingstep-2]?.message}
                                    fullWidth
                                />
                            </>

                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            {
                                coachingstep === maxcoachstep &&
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
                                coachingstep !== maxcoachstep &&
                                <Button
                                    type="button"
                                    variant="contained"
                                    onClick={(event) => {
                                       setCoachingstep(coachingstep+1)

                                    }}
                                >
                                    Next
                                </Button>

                            }
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>

    );
};

export default CoachingStepperForm;
