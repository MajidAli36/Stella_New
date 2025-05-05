import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import React from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AppButton } from "../../components";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import { contactType } from "../../service/Constants";
export function Sample() {
    const schema = yup.object().shape({
        username: yup.string().required("Username is required"),
        email: yup.string().email("Invalid email").required("Email is required"),
        color: yup.string().required("Color is required"),
        contact: yup.array()
            .of(yup.string()
                .min(1, "at least 1")
                .required("required")
            ),

    });

    type FormValues = {
        username: string;
        email: string;
        color: string;
        contact?: string[];
    };
    function getStyles(name: string, personName: string[], theme: Theme) {
        return {
            fontWeight:
                personName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }
    const form = useForm<FormValues>({
        defaultValues: {
            username: "rimsha",
            email: "",
            contact: [],
            color: ""

        },
        resolver: yupResolver(schema),
        mode: "all"
    });
    const theme = useTheme();
    const { register, control, handleSubmit, formState, reset, watch, getValues, setValue, trigger } = form;
    const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitSuccessful, isSubmitted, isSubmitting, submitCount } = formState;
    //console.log(errors, touchedFields, dirtyFields, isDirty);
    //is dirty represent all not individual field //helpful in form submission
    //submitCount // no of times form sucessfully submit
    //is submitting can be used to didable submit button
    //console.log(isSubmitting);
    //is submitted renains true until form is reset
    const onSubmit = (data: any) => {
        console.log("form submitted")
        console.log(data);
    }
    //for custom error messages
    const onError = (error: FieldErrors) => {
        console.log("form submitted")
        console.log(error);
    }
    // const { fields, append, remove } = useFieldArray({
    //     name: "user", control
    // })

    // React.useEffect(() => {
    //     const subscription = watch((value) => {
    //         console.log(value)
    //     });
    //     return (() => {
    //         subscription.unsubscribe();
    //     })
    // }, [watch])

    // React.useEffect(() => {
    //     if (isSubmitSuccessful) {
    //         reset()
    //     }

    // }, [reset, isSubmitSuccessful])
    const watchnne = watch("username", "email")
    const watchfull = watch();
    //touched relate to onchnge interact with element
    //dirty when value change from default value
    const handleGetValues = () => {
        console.log("Values " + getValues())

        console.log("Values " + getValues(["email", "username"]))
    }
    const handleSetValues = () => {

        console.log("Values " + setValue("username", "", { shouldDirty: true, shouldTouch: true, shouldValidate: true }))

    }


    const handleMultiselect = (event: any) => {
        const value = event.target.value;
        setValue("contact", typeof value === "string" ? value.split(",") : value)

    }
    return (<>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <TextField id="proFrom" className="mb-4" fullWidth label="UserName: *" variant="standard"
                {...register("username")}
                error={!!errors.username} helperText={errors.username?.message}
            />

            <TextField id="proTo" className="mb-4" fullWidth label="Email: *" variant="standard"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
            />
            <FormControl variant="standard" fullWidth className="mb-2">
                <InputLabel id="demo-simple-select-standard-label">Color:*</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label2"
                    id="demo-simple-select-standard2"
                    {...register("color")}
                    error={!!errors.color}

                >
                    <MenuItem key={"color_" + 3} value="">Please</MenuItem>
                    <MenuItem key={"color_" + 3} value="Red">Red</MenuItem>
                    <MenuItem key={"house_" + 3} value="Blue">Blue</MenuItem>
 
                </Select>

                <FormHelperText>
                    {errors.color?.message}
                </FormHelperText>

            </FormControl>
            {/* <FormControl variant="standard" fullWidth className="mb-2">

                <TextField
                    label="Contact:*"
                    id="contact"

                    {...register("contact")}
                    onChange={handleMultiselect}
                    error={!!errors.contact}
                    select

                    SelectProps={{
                        multiple: true,
                        value: Array.isArray(getValues("contact")) ? getValues("contact") : []

                    }
                    }
                >

                    <MenuItem key={"contact_" + 1} value="Police">Police</MenuItem>
                    <MenuItem key={"contact_" + 2} value="HR">HR</MenuItem>
                    <MenuItem key={"contact_" + 3} value="Head">Head</MenuItem>
                </TextField>

                <FormHelperText>
                    {errors.contact?.message}
                </FormHelperText>

            </FormControl> */}
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-name-label">Contact Name</InputLabel>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    {...register("contact")}
                    onChange={handleMultiselect}
                    value={watch("contact") || []} // Ensure value prop is an array
                    error={!!errors.contact}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 48 * 4.5 + 8,
                                width: 250,
                            },
                        },
                    }}
                >
                    {contactType.map((item, index) => (
                        <MenuItem
                            key={item.copy + 3}
                            value={item.value}
                            style={getStyles(item.value, watch("contact") || [], theme)} // Use watch to get selected values

                        >
                            {item.copy}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <AppButton type="submit" className='btnLogin' disabled={!isDirty || isSubmitting} >
                {!isSubmitting ?
                    'Submit'
                    : (
                        <CircularProgress size={24} />
                    )}
            </AppButton>
            <button type="button" onClick={() => { reset() }}>Reset</button>

            <button type="button" onClick={handleGetValues}>Get Values</button>
            <button type="button" onClick={handleSetValues}>Set Values</button>
            <button type="button" onClick={() => { trigger() }}>Validate All</button>
            <button type="button" onClick={() => { trigger("username") }}>Validate Username</button>
        </form>




    </>);




}

