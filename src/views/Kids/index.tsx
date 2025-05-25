import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { Row, Col, Container } from "react-bootstrap";
import styled from "styled-components";
import Drawer from '@mui/material/Drawer';
import React, { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { DrawerHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Pagination from '@mui/material/Pagination';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../utils/form';
import { useSnackbar } from 'notistack';
import constants from '../../service/Constants';
import { AppButton, AppLink, AppIconButton, AppAlert, AppForm } from '../../components';
import { GetAxios } from '../../service/AxiosHelper';
import { parseJwt } from "../../hooks";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
import * as yup from "yup";
export const DashboardCard = styled.div`
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
export const DashboardCardpurple = styled.div`
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

const TitleCard = styled.div`
overflow: hidden;
white-space: nowrap;
padding-left: 0.75rem;
padding-right: 0.75rem;
text-overflow: ellipsis;
font-size: 1rem;
font-family: font-family:  "Helvetica", "Arial", sans-serif;
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

const PageHeading = styled.div`
font-size: 2rem;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: bold;
line-height: 1.167;
letter-spacing: -0.01562em;
    color: #111111;
    margin-bottom:15px;


`
const PageHeadingSmall = styled.div`
font-size: 0.875rem;
font-family:  "Helvetica", "Arial", sans-serif;
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


export const createKidschema = yup.object().shape({
    createdByUserId: yup.string().required('Required'),
    name: yup.string().required('Required'),
    preferredName: yup.string().required('Required'),
    gender: yup.string().required('Required'),
    email: yup.string().email("Invalid email address").required('Required')
        .test(
            "not-yopmail",
            "not allowed",
            (value) => !value || !value.endsWith("@yopmail.com")
        ),
    phone: yup.string().required('Required'),
    mostRecentAddress: yup.string().required('Required'),
    dateOfBirth: yup.date().required('Required'),

});

const VALIDATE_FORM_CREATE_KID = {
    name: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    preferredName: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    gender: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    email: {
        //presence: { allowEmpty: false, message: 'required ' },
        email: { message: 'must be a valid email address.' },
    },
    phone: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    dateOfBirth: {
        presence: { allowEmpty: false, message: 'required ' },
    },




};




function Kids(props: Iprops) {
    const PAGE_SIZE = 12; // Number of items per page
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [selectedStatus, setSelectedStatus] = useState<string>(" ");
    const [searchName, setSearchName] = useState("");
    const userToken = useSelector((state: AppStore) => state.auth.accessToken);
    const parsedClaims = parseJwt(userToken?.token || '');
    const userId = parsedClaims.id;
    const createform = useForm<KidCreateModel>({
        defaultValues: {
            createdByUserId: userId, gender: "",
            dateOfBirth: new Date(), mostRecentAddress: "",

            email: "", name: "", preferredName: "",

        },
        resolver: yupResolver(createKidschema),
        mode: "all"
    });
    const [kidList, setKidList] = useState<KidListModel[]>();
    const { enqueueSnackbar } = useSnackbar();
    const [submitLoading, setSubmitLoading] = useState<boolean>();
    const { register: createRegister, formState: { errors: createError, isValid: createIsValid, isSubmitting: createSubmitting }, reset: createReset, watch: createWatch, getValues: createGetValues, setValue: createSetValue } = createform;

    // Function to get the current page of kids based on pagination
    const getCurrentPageKids = (): KidListModel[] => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return (kidList || []).slice(startIndex, endIndex);
    };
    const [picture, setPicture] = useState('http://waqarsts-001-site1.ktempurl.com/dummy.jpg');


    // Function to handle page change
    const handlePageChange = (event: any, page: number) => {
        setCurrentPage(page);
    };
    const onStatusChange = (event: any) => {
        setSelectedStatus(event.target.value);
    };
    const onSearchChange = (event: any) => {
        setSearchName(event.target.value);
    };


    const toggleDrawer = (open: any) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setOpen(open);
    };

    const onhandlePrint = (event: any) => {


        window?.print();
    };

    const getKidList = () => {

        const obj = {} as any;
        obj.Status = selectedStatus;
        obj.Search = searchName;
        GetAxios().post(constants.Api_Url + 'Kid/GetKids', obj).then(res => {
            if (res.data.success) {
                console.log(res)
                setKidList(res.data.list);

            }
        })
    };

    useEffect(() => {

        getKidList();

    }, [selectedStatus, searchName]);



    const handleFormSubmit = (event: SyntheticEvent) => {
        setSubmitLoading(true);
        event.preventDefault();


        const formData = new FormData();
        formData.append('Name', createGetValues("name"));
        formData.append('PreferredName', createGetValues("preferredName"));
        formData.append('Gender', createGetValues("gender"));
        formData.append('Email', createGetValues("email"));
        formData.append('Phone', createGetValues("phone"));
        formData.append('MostRecentAddress', createGetValues("mostRecentAddress"));
        formData.append('DateOfBirth', moment(createGetValues("dateOfBirth")).format('YYYY-MM-DDTHH:mm:ss'));
        formData.append('CreatedByUserId', userId || "");
        GetAxios().post(constants.Api_Url + 'Kid/CreateKid', formData).then(res => {
            setSubmitLoading(false);
            if (res.data.success) {

                enqueueSnackbar("Form was successfully submitted.", {
                    variant: 'success', style: { backgroundColor: '#5f22d8' },
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
                //close Model //Fetch list
                toggleDrawer(false)(event);
                // toggleDrawer(false);
                createReset();
                getKidList();
            } else {
                console.warn(res);
                enqueueSnackbar("Unable to create kid.", {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            }
        }).catch(err => {
            setSubmitLoading(false);
            enqueueSnackbar("Unable to create kid.", {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
        });

    };
    return (
        <>
            <Container fluid-sm>
              
                <PageHeading style={{ color: "#2a0560" }}>
                    Kids
                </PageHeading>
                <PageHeadingSmall className="text-body-tertiary">Your Kids</PageHeadingSmall>
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
                            <FormControl variant="outlined" className='me-4' size="small" sx={{ minWidth: '120px' }} >
                                <Select
                                    name="selectedStatus"
                                    value={selectedStatus}
                                    onChange={onStatusChange}
                                    sx={{
                                        border: "0px solid #C4C4C4",
                                        height: "min-content",
                                        minWidth: "10rem",
                                        background: "transparent",
                                        borderRadius: "30px",
                                        width: "100px",
                                        backgroundColor: "#F5F5F5",
                                        borderColor: "none",
                                        fontSize: "14px"
                                    }}
                                >
                                    {/* <MenuItem key="select_status1" value={" "}> Select Status</MenuItem> */}
                                    <MenuItem key="select_status2" value="IN_HOME">In Home</MenuItem>
                                    <MenuItem key="select_status3" value="MOVED_OUT">Moved Out</MenuItem>
                                    <MenuItem key="select_status4" value="MOVING_OUT">Moving Out</MenuItem>
                                    <MenuItem key="select_status5" value="NEW">New</MenuItem>
                                    <MenuItem key="select_status6" value="DECLINED">Declined</MenuItem>
                                </Select>
                            </FormControl>
                            <PlusButton onClick={toggleDrawer(true)}>
                                <AddIcon className="d-flex" />
                            </PlusButton>

                        </div>
                    </Grid>
                    {(getCurrentPageKids() || []).map((item: KidListModel, index: any) => {
                        return (
                            <Grid item xs={12} md={4} key={(currentPage - 1) * 2 + index + 1}>
                                <DashboardCard className="mb-1" onClick={() => { navigate("/kids/" + item.id) }}>

                                    <DisplayStart>
                                        <ImgParentDiv>
                                            <img src={item.avatar != '' ? constants.Kid_Avatar + item?.avatar + ".png" : picture} alt="" className="userLogoKids"
                                            />
                                           
                                        </ImgParentDiv>
                                        
                                        <TitleCard style={{ color: "#2a0560" }}>

                                            {item.name}
                                            <br></br>
                                            <SubtitleCard>
                                                {item.houseName}
                                            </SubtitleCard>
                                        </TitleCard>

                                    </DisplayStart>
                                </DashboardCard>
                            </Grid>

                        );
                    })}
                    {/* <Grid item xs={12} md={4}>
                        <DashboardCardpurple className="mb-1">
                            <DisplayStart>
                                <ImgParentDiv>
                                    <img src="https://api.dicebear.com/avatar.svg" alt="" className="userLogoKids" />
                                </ImgParentDiv>
                                <TitleCard>
                                    Kane
                                </TitleCard>
                            </DisplayStart>

                        </DashboardCardpurple>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <DashboardCard className="mb-1">
                            <DisplayStart>
                                <ImgParentDiv>
                                    <img src="https://api.dicebear.com/avatar.svg" alt="" className="userLogoKids" />
                                </ImgParentDiv>
                                <TitleCard>
                                    Smith
                                </TitleCard>
                            </DisplayStart>

                        </DashboardCard>
                    </Grid> */}

                    <div>
                        <div onClick={toggleDrawer(true)} data-attr='drawer'></div>
                        <Drawer className="Mui-Drawe-w" anchor="right" open={open} onClose={toggleDrawer(false)}>

                            <AppForm onSubmit={handleFormSubmit}>
                                <Box>
                                    <DrawerHeadingParent>
                                        <DrawerHeading style={{ color: "#2a0560" }} >Create Kid</DrawerHeading>
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
                                            />
                                            <TextField id="standard-basic2" className="mb-4" fullWidth label="Preferred Name:*" variant="standard"
                                                {...createRegister("preferredName", { required: true })}
                                                error={!!createError.preferredName}
                                                helperText={createError.preferredName?.message} />
                                            <FormControl variant="standard" fullWidth className="mb-4">
                                                <InputLabel id="kidGenderLabel">Gender:*</InputLabel>

                                                <Select
                                                    labelId="kidGenderLabel"
                                                    id="kidAlertKidselect"
                                                    placeholder="Gender:*"
                                                    error={!!createError.gender} value={createWatch("gender")}
                                                    {...createRegister("gender", { required: true })}
                                                    label="Gender:*"
                                                >
                                                    <MenuItem key={"kid_male"} value="Male">Male</MenuItem>
                                                    <MenuItem key={"kid_female"} value="Female">Female</MenuItem>
                                                </Select>

                                                <FormHelperText style={{ color: "Red" }}>
                                                    {createError.gender?.message}
                                                </FormHelperText>
                                            </FormControl>

                                            <TextField id="standard-basic4" className="mb-4" fullWidth label="Email:*" variant="standard"
                                                {...createRegister("email", { required: true })} error={!!createError.email}
                                                helperText={createError.email?.message} />
                                            <TextField id="standard-basic5" className="mb-4" fullWidth label="Phone:*" variant="standard"
                                                {...createRegister("phone", { required: true })} error={!!createError.phone}
                                                helperText={createError.phone?.message} />
                                                  <InputLabel id="kidRecordingDate" >Date Of Birth:*</InputLabel>
                                            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                                                <DateTimePicker
                                                    onChange={(event: any) => { createSetValue("dateOfBirth", event) }}
                                                  disableClock
                                                    format="MM/dd/yyyy"
                                                    value={createWatch("dateOfBirth")}
                                                    clearIcon={null}

                                                    required
                                                />
                                                <FormHelperText style={{ color: "Red" }} >
                                                    {createError.dateOfBirth?.message}
                                                </FormHelperText>
                                            </div>


                                            <TextField id="standard-basic7" {...createRegister("mostRecentAddress", { required: true })} className="mb-4" fullWidth label="Most Recent Address:*" multiline
                                                rows={4}
                                                variant="standard"
                                                error={!!createError.mostRecentAddress}
                                                helperText={createError.mostRecentAddress?.message} />

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
                                            <AppButton type="submit" className='btnLogin' disabled={!createIsValid} >
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
                        <Pagination count={Math.ceil((kidList?.length || 0) / PAGE_SIZE)} page={currentPage} onChange={handlePageChange} />

                    </Stack>
                    <div>
                        <DisplayNumber>
                            {/* Displaying {kidList?.length} of {kidList?.length} Kids */}

                            Displaying {((currentPage - 1) * PAGE_SIZE) + 1} of {Math.min(currentPage * PAGE_SIZE, kidList?.length as any)} of {kidList?.length} Kids

                        </DisplayNumber>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default Kids;
