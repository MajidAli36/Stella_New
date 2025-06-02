import { Box, Grid, Typography, CircularProgress, FormHelperText, Menu } from "@mui/material";
import { Row, Col, Container } from "react-bootstrap";
import Drawer from '@mui/material/Drawer';
import React, { SyntheticEvent, useCallback, useState, useEffect, useContext } from 'react';
import { DrawerHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Pagination from '@mui/material/Pagination';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from "@mui/material";
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '../../utils/form';
import { useSnackbar } from 'notistack';
import constants from '../../service/Constants';
import { AppButton, AppLink, AppIconButton, AppAlert, AppForm } from '../../components';
import { GetAxios } from '../../service/AxiosHelper';
import { useForm, useFieldArray, FieldErrors, Controller } from "react-hook-form";
import { createUserSchema, updateUserSchema, addpasswordschema } from "../../service/ValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { DashboardCard, DashboardCardpurple, DisplayBetween, DisplayNumber, DisplayStart, PlusButton, PageHeading, PageHeadingSmall, TitleCard, SubtitleCard, AlertHeading, GreyBox, GreyBoxDesc, GreyBoxHeading, GreyBoxHeadingParent, GreyBoxParent, ImgParentDiv } from "./UserStyleSheet";
import Divider from '@mui/material/Divider';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
interface Iprops {
}



function Users(props: Iprops) {
    const PAGE_SIZE = 12; // Number of items per page
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openCreate, setOpenCreate] = React.useState(false);
    const [openView, setOpenView] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [emailDisable, setEmailDisable] = React.useState(false);
    
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchName, setSearchName] = useState("");
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleClickOpenDialog = () => {
        handleClose();
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const createform = useForm<UserCreateModal>({
        defaultValues: {
            firstName: '', lastName: '', role: '', email: '', houseId: ''
        },
        resolver: yupResolver(createUserSchema),
        mode: "all"
    });
    const editform = useForm<UpdateUserModel>({
        defaultValues: {
            id: "", role: '', houseId: '', email: ''
        },
        resolver: yupResolver(updateUserSchema),
        mode: "all"
    });
    const updatePasswordform = useForm<AddPasswordModel>({
        defaultValues: {
            confirmPassword: "",
            newPassword: "",
            id: "",
        },
        resolver: yupResolver(addpasswordschema),
        mode: "all"
    });
    const { register: createRegister, handleSubmit: handleCreateSubmit, formState: { errors: createError, isValid: createIsValid, isSubmitting: createSubmitting }, reset: createReset, watch: createWatch, getValues: createGetValues, setValue: createSetValue } = createform;
    const { register: editRegister, handleSubmit: handleEditSubmit, formState: { errors: editError, isValid: editIsValid, isSubmitting: editSubmitting }, reset: editReset, watch: editWatch, getValues: editGetValues, setValue: editSetValue } = editform;
    const { register: updatePasswordRegister, handleSubmit: handleUpdatePasswordSubmit, formState: { errors: updatepwError, isValid: updatpwIsValid, isSubmitting: updatepwSubmitting }, reset: updatepwReset, watch: updatepwWatch, getValues: updatepwGetValues, setValue: updatepwSetValue } = updatePasswordform;

    const [staffList, setStaffList] = useState<StaffListModel[]>();
    const [houseList, setHouseList] = useState<HouseListModel[]>();
    const [userDetail, setUserDetail] = useState<UserProfileModel>();
    const [currentUserId, setCurrentUserId] = useState<string>();
    const { enqueueSnackbar } = useSnackbar();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    // Function to get the current page of kids based on pagination
    const getCurrentPageUsers = (): StaffListModel[] => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return (staffList || []).slice(startIndex, endIndex);
    };

    // Function to handle page change
    const handlePageChange = (event: any, page: number) => {
        setCurrentPage(page);
    };

    const onSearchChange = (event: any) => {
        setSearchName(event.target.value);
    };

    const onhandlePrint = (event: any) => {
       
        window?.print();
    };

    const toggleDrawer = (open: any, type: string, userId: string) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setCurrentUserId(userId);
        if (type == "Create") {
            setOpenCreate(open); setOpenView(false); setOpenEdit(false);
        }
        else if (type == "Edit") {

            setOpenCreate(false); setOpenView(false); setOpenEdit(false);

        }
        else if (type == "View") {
            handleClose();
            if (open) {
                getUserProfileDetail(userId);
            }
            else {
                setOpenCreate(false); setOpenView(false); setOpenEdit(false);
            }


        }

    };

    const getHouseList = () => {

        GetAxios().get(constants.Api_Url + 'House/GetHouses?search=' + "&moveOut=" + false).then(res => {
            if (res.data.success) {

                setHouseList(res.data.list);
                console.log(res.data.list);
            }
        })
    };
    const getStaffList = () => {
        GetAxios().get(constants.Api_Url + 'User/GetUsers?search=' + searchName).then(res => {
            if (res.data.success) {

                setStaffList(res.data.list);

            }
        })
    };
    const getUserHouseRoleDetail = (userId: string, houseId: string, role: string, email: string) => {
        editform.setValue("id", userId);
        editform.setValue("role", role.trim());
        editform.setValue("houseId", houseId != "" ? houseId.toUpperCase() : "");
        editform.setValue("email", email != "" ? email.toUpperCase() : "");
        
        setOpenCreate(false); setOpenView(false); setOpenEdit(true);
 
        var userRole =  localStorage.getItem("userRole");
        userRole = userRole?.trim() as any;
        if(userRole?.toUpperCase() == "ADMIN"){
          setEmailDisable(false);
        }
        else{
          setEmailDisable(true);
        }

        console.log(editform.getValues())

    };
    const getUserProfileDetail = (userId: string) => {
        GetAxios().get(constants.Api_Url + 'User/PublicView?userId=' + userId).then(res => {
            if (res.data.success) {
                setUserDetail(res.data.data);
                setOpenCreate(false); setOpenView(true); setOpenEdit(false);
            }
        })
    };
    useEffect(() => {

        getHouseList();

    }, []);
    useEffect(() => {

        getStaffList();

    }, [searchName]);


    const SetRole = (roleName: string) => {
        if (roleName == "ADMIN") {
            return "Admin";
        }
        if (roleName == "SENIOR_USER") {
            return "Senior Support Worker";
        }
        if (roleName == "USER") {
            return "Support Worker";
        }
        if (roleName == "HOUSE_MANAGER") {
            return "Homes Manager";
        }

    }

    const [picture, setPicture] = useState('http://waqarsts-001-site1.ktempurl.com/dummy.jpg');

    const RevokeAccess = (event: SyntheticEvent) => {
      GetAxios().get(`${constants.Api_Url}User/RevokeAccess?userId=${userDetail?.id ?? ""}`).then(res => {
            if (res.data.success) {
                setOpenCreate(false); setOpenView(false); setOpenEdit(true);
                setOpenDialog(false);
                enqueueSnackbar("Revoked access Successfully", {
                    variant: 'success',  style: { backgroundColor: '#5f22d8'},
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
                
            }
        })
    }
    const handleCreateFormSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('FirstName', createGetValues("firstName"));
        formData.append('LastName', createGetValues("lastName"));
        formData.append('Email', createGetValues("email"));
        formData.append('Role', createGetValues("role"));
        formData.append('HouseId', createGetValues("houseId"));

        GetAxios().post(constants.Api_Url + 'User/InviteUser', formData).then(res => {

            if (res.data.success) {

                enqueueSnackbar("Form was successfully submitted.", {
                    variant: 'success',  style: { backgroundColor: '#5f22d8'},
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
                //close Model //Fetch list
                //not working 
                toggleDrawer(false, "Create", "")(event);
                createform.reset();
                getStaffList();
            } else {
                console.warn(res);
                enqueueSnackbar("Unable to create user.", {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            }
        }).catch(err => {

            enqueueSnackbar("Unable to create user.", {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
        });



    };
    const handleEditFormSubmit = (event: SyntheticEvent) => {
        event.preventDefault();

        console.log(editform)
        const formData = new FormData();
        formData.append('id', currentUserId ?? "");
        formData.append('houseId', editGetValues("houseId"));
        formData.append('role', editGetValues("role"));
        formData.append('email', editGetValues("email"));
        GetAxios().post(constants.Api_Url + 'User/UpdateUserHouseRole', formData)
            .then(res => {

                if (res.data.success) {
                    enqueueSnackbar("Form was successfully submitted.", {
                        variant: 'success',  style: { backgroundColor: '#5f22d8'},
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });
                    editform.reset();
                    getStaffList();
                    toggleDrawer(false, "Edit", "")(event);

                } else {
                    console.warn(res);
                    enqueueSnackbar("Unable to team member.", {
                        variant: 'error',
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });
                }
            })
            .catch(err => {

                enqueueSnackbar("Something went wrong.", {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            });

        if (updatpwIsValid) {
            const formData2 = new FormData();
            formData2.append('id', currentUserId ?? "");
            formData2.append('newPassword', updatepwGetValues("newPassword"));
            formData2.append('confirmPassword', updatepwGetValues("confirmPassword"));

            GetAxios().post(constants.Api_Url + 'Auth/AddPassword', formData2)
                .then(res => {

                    if (res.data.success) {
                        // enqueueSnackbar("Form was successfully submitted.", {
                        //   variant: 'success',
                        //   anchorOrigin: { vertical: 'top', horizontal: 'right' },
                        // });

                    } else {
                        console.warn(res);
                        enqueueSnackbar("Unable to update password.", {
                            variant: 'error',
                            anchorOrigin: { vertical: 'top', horizontal: 'right' },
                        });
                    }
                })
                .catch(err => {

                    enqueueSnackbar("Something went wrong.", {
                        variant: 'error',
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });
                });
        }

    };
    return (
        <>
            <Container fluid-sm>
                <PageHeading style={{color: "#2a0560"}}>
                Team Members
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

                            <PlusButton onClick={toggleDrawer(true, "Create", "")}>
                                <AddIcon className="d-flex" />
                            </PlusButton>

                        </div>
                    </Grid>
                    {(getCurrentPageUsers() || []).map((item: StaffListModel, index: any) => {
                        return (
                            <Grid  item xs={12} md={4} key={(currentPage - 1) * 2 + index + 1} onClick={toggleDrawer(true, "View", item.id)}>
                                <DashboardCard className="mb-1">
                                    <DisplayStart>
                                        {/* <ImgParentDiv color={item.houseColor}>
                                            {item.firstName !== "" ? item.firstName.charAt(0).toUpperCase() + item.lastName.charAt(0).toUpperCase() : "A"}
                                        </ImgParentDiv> */}
                                         <ImgParentDiv>
                                            <img src={item.houseColor!=''? constants.Kid_Avatar+item?.houseColor +".png": picture}  alt="" className="userLogoKids"
                                               />
                                        </ImgParentDiv>

                                        <TitleCard style={{color: "#2a0560"}}>
                                            {item.firstName} {item.lastName}
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


                    <div>

                        <Drawer className="Mui-Drawe-w" anchor="right" open={openCreate} onClose={toggleDrawer(false, "Create", "")}>

                            <AppForm onSubmit={handleCreateFormSubmit}>
                                <Box>
                                    <DrawerHeadingParent>
                                        <DrawerHeading style={{color: "#2a0560"}}>Invite Team Member</DrawerHeading>
                                    </DrawerHeadingParent>
                                    <DrawerBody>
                                        <div style={{
                                            padding: "2.5rem", width: "100%"

                                        }}>

                                            <TextField id="standard-basic1" className="mb-4" fullWidth label="First Name:*"
                                                variant="standard"
                                                {...createRegister("firstName", { required: true })} error={!!createError.firstName}
                                                helperText={createError.firstName?.message} />
                                            <TextField id="standard-basic2" className="mb-4" fullWidth label="Last Name:*" variant="standard"
                                                {...createRegister("lastName", { required: true })} error={!!createError.lastName}
                                                helperText={createError.lastName?.message} />

                                            <TextField id="standard-basic3" className="mb-4" fullWidth label="Email:*" variant="standard"
                                                    {...createRegister("email", { required: true })} error={!!createError.email}
                                                    helperText={createError.email?.message}/>

                                                {/* <FormControl variant="standard" fullWidth className="mb-4">
                                                    <InputLabel id="role-label">Role:*</InputLabel>
                                                    <Controller
                                                        name="role"
                                                        control={createform.control}
                                                        rules={{ required: 'Role is required' }}
                                                        render={({ field }) => (
                                                        <Select
                                                            labelId="role-label"
                                                            id="role-select"
                                                            {...field}
                                                            error={!!createError.role}
                                                            label="Role:*"
                                                        >
                                                            <MenuItem value="ADMIN">Admin</MenuItem>
                                                            <MenuItem value="HOUSE_MANAGER">Homes Manager</MenuItem>
                                                            <MenuItem value="SENIOR_USER">Senior Support Worker</MenuItem>
                                                            <MenuItem value="USER">Support Worker</MenuItem>
                                                        </Select>
                                                        )}
                                                    />
                                                    <FormHelperText style={{ color: 'Red' }}>
                                                        {createError.role?.message}
                                                    </FormHelperText>
                                                </FormControl> */}


                                                <Controller
                                                    name="role"
                                                    control={createform.control}
                                                    rules={{ required: "Role is required" }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            labelId="demo-simple-select-standard-label"
                                                            id="demo-simple-select-standard"
                                                            placeholder="Role:*"
                                                            error={!!createError.role}
                                                        >
                                                            <MenuItem key={"role_1"} value="ADMIN">Admin</MenuItem>
                                                            <MenuItem key={"role_2"} value="HOUSE_MANAGER">Homes Manager</MenuItem>
                                                            <MenuItem key={"role_3"} value="SENIOR_USER">Senior Support Worker</MenuItem>
                                                            <MenuItem key={"role_4"} value="USER">Support Worker</MenuItem>
                                                        </Select>
                                                    )}
                                                />
                                                <FormHelperText style={{ color: "Red" }}>
                                                    {createError.role?.message}
                                                </FormHelperText>


                                         
                                                {/* <FormControl variant="standard" fullWidth className="mb-5">
                                                    <InputLabel id="houseLabel">Homes:*</InputLabel>
                                                    <Controller
                                                        name="houseId"
                                                        control={createform.control}
                                                        rules={{ required: 'House is required' }}
                                                        render={({ field }) => (
                                                        <Select
                                                            labelId="houseLabel"
                                                            id="houseId-select"
                                                            {...field}
                                                            error={!!createError.houseId}
                                                            label="House:*"
                                                        >
                                                            {(houseList || []).map((item: HouseListModel) => (
                                                            <MenuItem key={`house_${item.id}`} value={item.id}>
                                                                {item.name}
                                                            </MenuItem>
                                                            ))}
                                                        </Select>
                                                        )}
                                                    />
                                                    <FormHelperText style={{ color: 'Red' }}>
                                                        {createError.houseId?.message}
                                                    </FormHelperText>
                                              </FormControl> */}

                                            <Controller
                                                name="houseId"
                                                control={createform.control}
                                                rules={{ required: "House is required" }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        labelId="houseLabel"
                                                        id="demo-simple-select-standard2"
                                                        placeholder="Homes:*"
                                                        error={!!createError.houseId}
                                                    >
                                                        {(houseList || []).map((item: HouseListModel) => (
                                                            <MenuItem key={"house_" + item.id} value={item.id}>
                                                                {item.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                            <FormHelperText style={{ color: "Red" }}>
                                                {createError.houseId?.message}
                                            </FormHelperText>


                                        </div>
                                        <div className="d-flex align-items-center justify-content-between" style={{
                                            padding: "2.5rem", width: "100%",
                                        }}>
                                            <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Create", "")}>
                                                Cancel
                                            </Button>
                                            <Button variant="text" color="inherit" onClick={() => {
                                                window?.print();
                                            }}>
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

                        <Drawer className="Mui-Drawe-w" anchor="right" open={openView} onClose={toggleDrawer(false, "View", "")}>
                            <Box>
                                <DrawerHeadingParent>
                                    <DrawerHeading style={{color: "#2a0560"}}>View Team Member</DrawerHeading>
                                    <>
                                        <IconButton
                                            aria-controls="simple-menu"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >

                                            <MenuItem key="Edit" onClick={() => { getUserHouseRoleDetail(userDetail?.id ?? "", userDetail?.houseId ?? "", userDetail?.role ?? "ADMIN", userDetail?.email ?? "") }}>
                                                Edit
                                            </MenuItem>
                                            <MenuItem key="Revoke" onClick={handleClickOpenDialog}>
                                                Revoke
                                            </MenuItem>

                                        </Menu>
                                    </>
                                </DrawerHeadingParent>

                                <DrawerBody>
                                    <div style={{
                                        padding: "2.5rem", width: "100%"

                                    }}>
                                        <div className="mb-4">

                                            <DisplayStart>
                                                <ImgParentDiv color={userDetail?.houseColor ?? "#d3d3d3"}>
                                                    {userDetail?.firstName !== "" ? userDetail?.firstName ?? "".charAt(0).toUpperCase() + userDetail?.lastName ?? "".charAt(0).toUpperCase() : "A"}
                                                </ImgParentDiv>

                                                <TitleCard>
                                                    {userDetail?.firstName} {userDetail?.lastName}
                                                    <br />
                                                    <SubtitleCard>
                                                        {userDetail?.houseName}
                                                    </SubtitleCard>
                                                </TitleCard>

                                            </DisplayStart>
                                        </div>

                                        <Box style={{ display: 'flex', flexDirection: 'column', }}>

                                            <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                    Email
                                                </Typography>
                                                <Typography variant="body1">{userDetail?.email}</Typography>
                                            </Box>
                                            <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                    Phone
                                                </Typography>
                                                <Typography variant="body1">{userDetail?.phone}</Typography>
                                            </Box>
                                            <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                    Address
                                                </Typography>
                                                <Typography variant="body1">{userDetail?.address}</Typography>
                                            </Box>
                                            <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                    Role
                                                </Typography>
                                                <Typography variant="body1">{SetRole(userDetail?.role ?? "ADMIN")}</Typography>
                                            </Box>
                                            <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                    Date Created
                                                </Typography>
                                                <Typography variant="body1">{userDetail?.dateCreated}</Typography>
                                            </Box>
                                        </Box>



                                    </div>
                                    <div className="d-flex align-items-center justify-content-between" style={{
                                        padding: "2.5rem", width: "100%",
                                    }}>
                                        <Button variant="text" color="inherit" onClick={toggleDrawer(false, "View", "")}>
                                            Cancel
                                        </Button>
                                        <Button variant="text" color="inherit" onClick={() => {
                                            window?.print();
                                        }}>
                                            Print
                                        </Button>


                                    </div>
                                </DrawerBody>
                            </Box>

                        </Drawer>
                        <Drawer className="Mui-Drawe-w" anchor="right" open={openEdit} onClose={toggleDrawer(false, "Edit", "")}>
                            <AppForm onSubmit={handleEditFormSubmit}>
                                <Box>
                                    <DrawerHeadingParent>
                                        <DrawerHeading style={{color: "#2a0560"}}>Edit Team Members</DrawerHeading>
                                    </DrawerHeadingParent>
                                    <DrawerBody>
                                        <div style={{
                                            padding: "2.5rem", width: "100%"

                                        }}>

                                            <FormControl variant="standard" fullWidth className="mb-4">
                                                <InputLabel id="demo-simple-select-standard-label">Role:*</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-standard-label"
                                                    id="demo-simple-select-standard"
                                                    placeholder="Role:*" label="Role:*"
                                                    value={editWatch("role")}
                                                    {...editRegister("role", { required: true })} error={!!editError.role}

                                                >

                                                    <MenuItem key={"role_1"} value="ADMIN">Admin</MenuItem>
                                                    <MenuItem key={"role_2"} value="HOUSE_MANAGER">Homes Manager</MenuItem>
                                                    <MenuItem key={"role_3"} value="SENIOR_USER">Senior Support Worker</MenuItem>
                                                    <MenuItem key={"role_4"} value="USER">Support Worker</MenuItem>


                                                </Select>
                                                <FormHelperText style={{ color: "Red" }}>
                                                    {editError.role?.message}
                                                </FormHelperText>
                                            </FormControl>
                                            <FormControl variant="standard" fullWidth className="mb-5">
                                                <InputLabel id="houseLabel">Homes:*</InputLabel>
                                                <Select
                                                    labelId="houseLabel"
                                                    id="demo-simple-select-standard2"
                                                    label="Homes:*"
                                                    value={editWatch("houseId")}
                                                    placeholder="Homes:*"
                                                    {...editRegister("houseId", { required: true })} error={!!editError.houseId}

                                                >
                                                    {(houseList || []).map((item: HouseListModel, index: any) => {
                                                        return (
                                                            <MenuItem key={"house_" + item.id} value={item.id}>{item.name}</MenuItem>

                                                        );
                                                    })}

                                                </Select>
                                                <FormHelperText style={{ color: "Red" }}>
                                                    {editError.houseId?.message}
                                                </FormHelperText>
                                            </FormControl>

                                            <TextField id="standard-basicp" className="mb-4" fullWidth label="Email:*" variant="standard"
                                                                    {...editRegister("email", { required: true })} error={!!editError.email}
                                                                    helperText={editError.email?.message} disabled={emailDisable}/>


                                            <Box style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                                                <Divider />
                                                <Typography style={{ marginTop: '-12px', width: 'fit-content', marginLeft: 'auto', marginRight: 'auto', padding: '0 4px', }}>
                                                    Update Password
                                                </Typography>
                                            </Box>


                                            <TextField id="standard-basic4" className="mb-4" fullWidth label="New Password:*" variant="standard" type='password'
                                                {...updatePasswordRegister("newPassword", { required: true })} error={!!updatepwError.newPassword}
                                                helperText={updatepwError.newPassword?.message} />
                                            <TextField id="standard-basicp" className="mb-4" fullWidth label="Repeat Password:*" variant="standard" type='password'
                                                {...updatePasswordRegister("confirmPassword", { required: true })} error={!!updatepwError.confirmPassword}
                                                helperText={updatepwError.confirmPassword?.message} />

                                            
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between" style={{
                                            padding: "2.5rem", width: "100%"
                                        }}>
                                            <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Edit", "")}>
                                                Cancel
                                            </Button>
                                            <Button variant="text" color="inherit" onClick={onhandlePrint}>
                                                Print
                                            </Button>

                                            <AppButton type="submit" className='btnLogin' disabled={!editIsValid} >
                                                {!editSubmitting ?
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
                <div>
                    <Dialog
                        open={openDialog}
                        onClose={handleCloseDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Revoke User?
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to revoke access to {userDetail?.firstName} {userDetail?.lastName} for {userDetail?.houseName}?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="text" color="inherit" onClick={handleCloseDialog}>
                                CANCEL
                            </Button>
                            <AppButton type="button" className='btnLogin' onClick={(event:SyntheticEvent)=>{RevokeAccess(event)}} autoFocus>
                                REVOKE ACCESS
                            </AppButton>
                           
                        </DialogActions>
                    </Dialog>
                </div>
                <div className="d-flex align-items-center w-100 justify-content-between">
                    <Stack spacing={2}>
                        <Pagination count={Math.ceil((staffList?.length || 0) / PAGE_SIZE)} page={currentPage} onChange={handlePageChange} />

                    </Stack>
                    <div>
                        <DisplayNumber>
                            {/* Displaying {staffList?.length} of {staffList?.length} Staffs */}


                            Displaying {((currentPage - 1) * PAGE_SIZE) + 1} of {Math.min(currentPage * PAGE_SIZE, staffList?.length as any)} of {staffList?.length} Team Members
                        </DisplayNumber>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default Users;
