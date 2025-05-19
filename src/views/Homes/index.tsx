import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { Row, Col, Container } from "react-bootstrap";
import styled from "styled-components";
import * as yup from "yup";
import { AppBar, Toolbar, Icon, IconButton } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import React, { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { DrawerHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
import SelectCommon from "../../components/FormComponents";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Pagination from '@mui/material/Pagination';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import constants from '../../service/Constants';
import { AppButton, AppLink, AppIconButton, AppAlert, AppForm } from '../../components';
import { GetAxios } from '../../service/AxiosHelper';
import HouseIcon from '@mui/icons-material/House';
import usePagination from "../../components/CustomPagination";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
const DashboardCard = styled.div`
width: 100%;
cursor: pointer;
padding: 1.5rem 1.5rem;
flex-grow: 1;
flex-shrink: 0;
border-radius: 8px;
box-shadow: 0px 8px 24px -8px rgba(0,0,0,0.25);
&:hover{
    opacity: 0.75;

}
`
const DashboardCardpurple = styled.div`
width: 100%;
cursor: pointer;
padding: 1.5rem 1.5rem;
flex-grow: 1;
flex-shrink: 0;
border-radius: 8px;
box-shadow: 0px 8px 24px -8px rgba(0,0,0,0.25);
background: linear-gradient(90deg, rgb(116, 32, 216) 3.75rem, rgb(255 255 255) 3.75rem);
&:hover{
    opacity: 0.75;

}
`

export const DisplayBetween = styled.div`
display:flex;
align-items:center;
justify-content: space-between;
`

export const DisplayStart = styled.div`
display:flex;
align-items:center;
column-gap: 1rem;
justify-content: flex-start;`
const IconBox = styled.div`
background-color: rgb(241, 232, 251);
padding: 3px;
font-size: 1.125rem;
text-align: center;
transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
border-radius: 50%;
`
const TitleCard = styled.div`
overflow: hidden;
white-space: nowrap;
padding-left: 0.75rem;
padding-right: 0.75rem;
text-overflow: ellipsis;
font-size: 1rem;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: bold;
line-height: 1.167;
letter-spacing: 0em;
`

const SubtitleCard = styled.div`
overflow: hidden;
white-space: nowrap;
font-size: 0.8rem; 
font-weight: normal; 
color: #888; 
margin-top:10px;

`;
const AlertHeading = styled.div`
font-size: 1rem;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: bold;
line-height: 1.167;
letter-spacing: 0em;
color: #111111;

`
const GreyBoxParent = styled.div`
width: 100%;
height: 500px;
display: flex;
flex-direction: column;
justify-content: space-between;
`
const GreyBox = styled.div`
background: rgb(250, 250, 250);
flex: 1 1 0%;
width: 100%;
height: 100%;
display: flex;
padding: 2rem;
min-height: inherit;
align-items: center;
row-gap: 1rem;
flex-direction: column;
justify-content: center;
`
const GreyBoxHeading = styled.div`
color: rgba(0, 0, 0, 0.54);
font-size: 1.25rem;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: 500;
line-height: 1.6;
letter-spacing: 0.0075em;
`
const GreyBoxDesc = styled.div`
color: rgba(0, 0, 0, 0.54);
font-size: 0.875rem;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: 400;
line-height: 1.5;
letter-spacing: 0.00938em;
`

const GreyBoxHeadingParent = styled.div`
display: flex;
gap: 0.25rem;
max-width: 20rem;
text-align: center;
flex-direction: column;
`
const PageHeading = styled.div`
font-size: 2rem;
font-family: League Spartan, sans-serif;
font-weight: bold;
line-height: 1.167;
letter-spacing: -0.01562em;
    color: #111111;
    margin-bottom:15px;


`
const PageHeadingSmall = styled.div`
font-size: 0.875rem;
font-family: League Spartan, sans-serif;
font-weight: 400;
line-height: 1.5;
letter-spacing: 0.00938em;
color: rgba(0, 0, 0, 0.54);
margin-bottom:25px;


`
const PlusButton = styled.div`
color: #fafafa;
padding: 8px;
font-size: 27px;
box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
aspect-ratio: 1 / 1;   
background-color: #2a0560;
text-align: center;
transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
border-radius: 50%;
width:40px;
height:40px;
cursor:pointer;
&:hover{
    opacity:0.9;
}


`
const ImgParentDiv = styled.div`
background-color: ${(props: { color?: string }) => props.color != "" ? props.color : "rgb(189, 189, 189)"};
color: rgb(250, 250, 250);
width: 5rem;
height: 5rem;
display: flex;
overflow: hidden;
position: relative;
font-size: 1.25rem;
align-items: center;
flex-shrink: 0;
font-family:  "Helvetica", "Arial", sans-serif;
line-height: 1;
user-select: none;
border-radius: 50%;
justify-content: center;
`
const DisplayNumber = styled.div`
color: rgba(0, 0, 0, 0.54);
font-size: 0.75rem;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: 400;
line-height: 1.66;
letter-spacing: 0.03333em;
`
interface Iprops {
}


export const createhouseschema = yup.object().shape({
    name: yup.string().required('Required'),
    phone: yup.string().required('Required'),
    location: yup.string().required('Required'),
    color: yup.string().required('Required'),
    lat: yup.string().nullable().notRequired(),
    long: yup.string().nullable().notRequired(),
});
interface FormStateValues {
    name: string;
    phone: string;
    location: string;
    color: string;
    lat?: string | null;
    long?: string | null;
}


function Houses(props: Iprops) {
    const PAGE_SIZE = 12; // Number of items per page
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [colorList, setColorList] = useState<any[]>();
    const [locationList, setLocationList] = useState<LocationSelectModel[]>();

    const [searchName, setSearchName] = useState("");

    const createform = useForm<FormStateValues>({
        defaultValues: {
            name: '', phone: '', location: '', color: '', lat: '', long: ''
        },
        resolver: yupResolver(createhouseschema),
        mode: "all"
    });
    const { register: createRegister, formState: { errors: createError, isValid: createIsValid, isSubmitting: createSubmitting }, reset: createReset, watch: createWatch, getValues: createGetValues, setValue: createSetValue } = createform;

    const [houseList, setHouseList] = useState<HouseListModel[]>();
    const { enqueueSnackbar } = useSnackbar();
    const [submitLoading, setSubmitLoading] = useState<boolean>();
    const { currentPage, handlePaginate, pageCount, setCount, setCurrentPage, } = usePagination({ take: PAGE_SIZE, count: 0 });

    const onSearchChange = (event: any) => {
        setSearchName(event.target.value);
    };


    // const handleLocationChange = (event: any) => {
    //     console.log("changed")
    //     const { name, value } = event.target as HTMLInputElement;
    //     const selectedLocation = locationList?.find((location) => location.label === value);

    //     const lat = selectedLocation ? selectedLocation.point[1] : '';
    //     const long = selectedLocation ? selectedLocation.point[0] : '';

    //     const updatedValues = {
    //         ...formState.values,
    //         [name]: value,
    //         lat: lat,
    //         long: long,
    //     };
    //     setFormState({
    //         ...formState,
    //         values: updatedValues,
    //         touched: {
    //             ...formState.touched,
    //             [name]: true,
    //         },
    //     });
    // };
    // const handleLocationSelectChange = (newValue: LocationSelectModel) => {
    //     const selectedLocation = locationList?.find((location) => location.label === newValue.label);

    //     const lat = selectedLocation ? selectedLocation.point[1] : '';
    //     const long = selectedLocation ? selectedLocation.point[0] : '';

    //     const myValues = {
    //         ...formState.values,
    //         location: newValue.label,
    //         lat: lat,
    //         long: long,
    //     };
    //     setFormState({
    //         ...formState,
    //         values: myValues,
    //         touched: {
    //             ...formState.touched,
    //             location: true,
    //         },
    //     });
    // };

    const toggleDrawer = (open: any) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setOpen(open);
    };

    const getHouseList = () => {
        setCurrentPage(1);
        GetAxios().get(constants.Api_Url + 'House/GetHouses?search=' + searchName + "&moveOut=" + true).then(res => {
            if (res.data.success) {

                setHouseList(res.data.list);
                setCount(res.data.list.length);
            }
        })
    };
    useEffect(() => {

        getHouseList();

    }, [searchName]);

    useEffect(() => {


        GetAxios().get(constants.Api_Url + 'General/GetHouseColors').then(res => {
            if (res.data.success) {

                setColorList(res.data.list);

            }
        })
        GetAxios().get(constants.Api_Url + 'General/GetHouseLocations').then(res => {
            if (res.data.success) {

                setLocationList(res.data.list);

            }
        })
    }, []);

    const onhandlePrint = (event: any) => {
        window?.print();
    };

    const [picture, setPicture] = useState('http://waqarsts-001-site1.ktempurl.com/dummy.jpg');

    const handleFormSubmit = (event: SyntheticEvent) => {
        setSubmitLoading(true);
        event.preventDefault();
        console.log("form submit")
        console.log(createGetValues())

        const formData = new FormData();
        formData.append('Name', createGetValues("name"));
        formData.append('Color', createGetValues("color"));
        formData.append('Location', createGetValues("location"));
        formData.append('Phone', createGetValues("phone"));
        //formData.append('Lat', formState.values.lat);
        //formData.append('Long', formState.values.long);

        console.log(formData)
        GetAxios().post(constants.Api_Url + 'House/CreateHouse', formData).then(res => {
            setSubmitLoading(false);
            if (res.data.success) {

                enqueueSnackbar("Form was successfully submitted.", {
                    variant: 'success', style: { backgroundColor: '#5f22d8' },
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
                //close Model //Fetch list
                // toggleDrawer(false);
                toggleDrawer(false)(event);
                createReset();
                getHouseList();
            } else {
                console.warn(res);
                enqueueSnackbar("Unable to create house. ", {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            }
        }).catch(err => {
            setSubmitLoading(false);
            enqueueSnackbar("Something went wrong.", {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
        });

    };
    return (
        <>
            <Container fluid-sm>
                <PageHeading style={{ color: "#2a0560" }}>
                    Homes
                </PageHeading>

                <Grid className='mb-4' container spacing={5}>
                    <Grid item xs={12} md={6}>
                        <TextField

                            variant="outlined"
                            size="small"
                            placeholder="Search"
                            name="searchName"
                            value={searchName}
                            onChange={onSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: '500px',
                                borderRadius: 16,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: 16, // Adjust the border radius for the outline as well
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.87)', // Change border color on hover if desired

                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className="d-flex justify-content-end align-items-center">

                            <PlusButton onClick={toggleDrawer(true)}>
                                <AddIcon className="d-flex" />
                            </PlusButton>

                        </div>
                    </Grid>
                    {(houseList || []).slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((item: HouseListModel, index: any) => {
                        return (

                            <Grid item xs={12} md={4} key={(currentPage - 1) * 2 + index + 1}>
                                <DashboardCard className="mb-1" onClick={() => { navigate("/homes/" + item.id) }}>
                                    <DisplayStart>
                                        {/* <ImgParentDiv color={item.color}>
                                            <div><HouseIcon /></div>

                                        </ImgParentDiv> */}
                                        <ImgParentDiv>
                                            <img src={item.color != '' ? constants.Kid_Avatar + item?.color + ".png" : picture} alt="" className="userLogoKids"
                                            />
                                        </ImgParentDiv>
                                        <TitleCard style={{ color: "#2a0560" }}>
                                            {item.name}

                                            <br></br>
                                            <SubtitleCard>
                                                {item.address}
                                            </SubtitleCard>
                                        </TitleCard>

                                    </DisplayStart>
                                    <DisplayStart>

                                    </DisplayStart>
                                </DashboardCard>
                            </Grid>

                        );
                    })}


                    <div>
                        <div onClick={toggleDrawer(true)} data-attr='drawer'></div>
                        <Drawer className="Mui-Drawe-w" anchor="right" open={open} onClose={toggleDrawer(false)}>

                            <AppForm onSubmit={handleFormSubmit}>
                                <Box>
                                    <DrawerHeadingParent>
                                        <DrawerHeading>Create Homes</DrawerHeading>
                                    </DrawerHeadingParent>
                                    <DrawerBody>
                                        <div style={{
                                            padding: "2.5rem", width: "100%"

                                        }}>
                                            <TextField id="standard-basic1" className="mb-4" fullWidth label="Name:*"
                                                variant="standard"
                                                {...createRegister("name", { required: true })}
                                                error={!!createError.name}
                                                helperText={createError.name?.message}
                                            />  <TextField id="standard-basic1" className="mb-4" fullWidth label="Phone:*"
                                                variant="standard"
                                                {...createRegister("phone", { required: true })}
                                                error={!!createError.phone}
                                                helperText={createError.phone?.message}
                                            />  <TextField id="standard-basic1" className="mb-4" fullWidth label="Location:*"
                                                variant="standard"
                                                {...createRegister("location", { required: true })}
                                                error={!!createError.location}
                                                helperText={createError.location?.message}
                                            />

                                            {/* <Autocomplete
                                                options={locationList || []}
                                                getOptionLabel={(option) => option.label}
                                                // getOptionSelected={(option, value) => option.label === value.label}
                                                value={locationList?.find((location) => location.label === formState.values.location) || null}
                                                onChange={(event, newValue) => {
                                                    if (newValue) {
                                                        handleLocationSelectChange(newValue);
                                                    } else {
                                                        const myValues = {
                                                            ...formState.values,
                                                            location: "",
                                                            lat: "",
                                                            long: "",
                                                        };
                                                        setFormState({
                                                            ...formState,
                                                            values: myValues,
                                                            touched: {
                                                                ...formState.touched,
                                                                location: true,
                                                            },
                                                        });
                                                    }
                                                }}
                                                filterOptions={(options, { inputValue }) => {
                                                    if (inputValue.trim() === '') {
                                                        return [];
                                                    }
                                                    return options.filter((option) =>
                                                        option.label.toLowerCase().includes(inputValue.toLowerCase())
                                                    );
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Location:*"
                                                        className="mb-4"
                                                        variant="standard"
                                                        error={fieldHasError('location')}
                                                        helperText={fieldHasError('location') ? formState.errors.location : ''}
                                                    />
                                                )}
                                                clearOnBlur
                                                clearOnEscape
                                            /> */}


                                            {/* <FormControl variant="standard" fullWidth className="mb-4">
                                                <InputLabel id="demo-simple-select-standard-label">Location:*</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-standard-label"
                                                    id="demo-simple-select-standard"

                                                    name="location"
                                                    value={formState.values.location}
                                                    onChange={handleLocationChange}
                                                >

                                                    {(locationList || []).map((item: any, index: any) => {
                                                        return (
                                                            <MenuItem key={"location_" + index} value={item.label}>{item.label}</MenuItem>

                                                        );
                                                    })}
                                                </Select>
                                            </FormControl> */}

                                            <FormControl variant="standard" fullWidth className="mb-4">
                                                <InputLabel id="demo-simple-select-standard-label">Homes Colour:*</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-standard-label"
                                                    id="demo-simple-select-standard"
                                                    error={!!createError.color}  value={createWatch("color")}
                                                    {...createRegister("color", { required: true })}
                                                >
                                                    {(colorList || []).map((item: any, index: any) => {
                                                        return (
                                                            <MenuItem key={"color_" + item.key} value={item.value}>{item.key}</MenuItem>

                                                        );
                                                    })}

                                                </Select>
                                            </FormControl>

                                        </div>
                                        <div className="d-flex align-items-center justify-content-between" style={{
                                            padding: "2.5rem", width: "100%"
                                        }}>
                                            <Button variant="text" color="inherit" onClick={toggleDrawer(false)}>
                                                Cancel
                                            </Button>
                                            <Button variant="text" color="inherit" onClick={onhandlePrint}>
                                                Print
                                            </Button>
                                            <AppButton type="submit" className='btnLogin' disabled={!createIsValid}>
                                                {!createSubmitting ?
                                                    'Submit'
                                                    : (
                                                        <CircularProgress size={24} />
                                                    )}
                                            </AppButton>

                                        </div>
                                    </DrawerBody>
                                </Box>


                            </AppForm>
                        </Drawer>
                    </div>
                </Grid >
                <div className="d-flex align-items-center w-100 justify-content-between">
                    <Stack spacing={2}>

                        <Pagination count={pageCount} page={currentPage} onChange={(event: any, page: number) => { setCurrentPage(page) }} />

                    </Stack>
                    <div>
                        <DisplayNumber>

                            Displaying {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, pageCount)} of {pageCount} Homes

                        </DisplayNumber>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default Houses;
