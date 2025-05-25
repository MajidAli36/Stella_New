import { AppBar, Toolbar, Typography, Box, Icon, IconButton, InputLabel } from '@mui/material';
import { Grid, CircularProgress } from "@mui/material";
import { FunctionComponent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import GroupIcon from '@mui/icons-material/Group';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';
import DoneIcon from '@mui/icons-material/Done';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { Controller } from "react-hook-form";
import FormControlLabel from '@mui/material/FormControlLabel';
import { setIsAuthenticated, setSignout } from '../../store';
import { localStorageGet, localStorageSet, localStorageDelete } from '../../utils/localStorage';
import { parseJwt } from '../../hooks';
import styled from "styled-components";
import constants from '../../service/Constants';
import { AppButton, AppLink, AppIconButton, AppAlert, AppForm } from '../../components';
import { GetAxios } from '../../service/AxiosHelper';
import Drawer from '@mui/material/Drawer';
import FormHelperText from '@mui/material/FormHelperText';
import React, { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { updatepasswordschema, usermanageschema } from '../../service/ValidationSchema';
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Divider from '@mui/material/Divider';
import moment from 'moment';
import { DrawerHeading, DrawerStepHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
const NotifcattionDivIcon = styled.div`
width: 40px;
height: 40px;
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
color: #fdfdfd;
margin-right:25px;
    background-color: #bdbdbd;
&:hover{  
   opacity: 0.75;


}
`

const NotifcattionName = styled.div`
color: #111111;
font-size: 14px;
    font-family:  "Helvetica", "Arial", sans-serif;
    font-weight: bold;
    line-height: 1.167;
    letter-spacing: 0em;
    &:hover{  
      opacity: 0.75;
   
   
   }
`

const NotifcattionNameMuted = styled.div`
color: rgba(0, 0, 0, 0.54);
    font-size: 0.75rem;
    font-family:  "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1.43;
    letter-spacing: 0.01071em;
    text-align:left;
    margin-top:5px;
    &:hover{  
      opacity: 0.75;
   
   
   }
`

interface Props {
  endNode?: ReactNode;
  startNode?: ReactNode;
  title?: string;
}

/**
 * Renders TopBar composition
 * @component TopBar
 */
const TopBar: FunctionComponent<Props> = ({ endNode, startNode, title = '', ...restOfProps }) => {
  const navigate = useNavigate();
  const userToken = useSelector((state: AppStore) => state.auth.accessToken);
  const parsedClaims = parseJwt(userToken?.token || '');
  const userId = parsedClaims.id;
  const [submitLoading, setSubmitLoading] = useState<boolean>();
  const [emailDisable, setEmailDisable] = useState<boolean>(false);
  const [selectedHouse, setSelectedHouse] = useState('00000000-0000-0000-0000-000000000000'); // Set the default value here
  const [openAlertView, setOpenAlertView] = React.useState(false);
  const [alertViewModel, setAlertViewModel] = useState<AlertViewModel>();
   const [isChecked, setIsChecked] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChangeHouse = (event: any) => {
    setSelectedHouse(event.target.value);
    //navigate to that house
    if (event.target.value == "00000000-0000-0000-0000-000000000000") {
      //window.location = "/homes/" + event.target.value
      navigate("/homes");
    }
    else {
      navigate("/homes/" + event.target.value);
    }
  };

   const {
    control,
    handleSubmit,
    watch,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: {
      enable2FA: false
    }
  });

  const enable2FA = watch("enable2FA");

  // const navigateToNewPage = () => {
  //   // use the navigate function to navigate to /new-page
  //   navigate("/new-page");
  // };

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [houseList, setHouseList] = useState<HouseListModel[]>();


  const [notificationList, setNotificationList] = useState<NotificationListModel[]>();
  const [openManageAccount, setOpenManageAccount] = useState(false);
  const [notificationCount, setNoificationCount] = useState(null);
  const dispatch = useDispatch();
  const handleNotificationClick = (event: any) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };
  const user = useSelector((state: AppStore) => state.auth.accessToken);

  const handleSignOut = () => {

    dispatch(setIsAuthenticated(false))
    dispatch(setSignout(false));
    localStorageSet("expireTime", "");
    localStorageSet('token', "");
    localStorageSet('expiry', "");
    localStorageSet('generated', "");

    navigate('/auth/login', { replace: true });
    handleClose();
  };




  const getHouseList = () => {

    GetAxios().get(constants.Api_Url + 'House/GetHouses?search=' + "" + "&moveOut=" + true).then(res => {
      if (res.data.success) {

        setHouseList(res.data.list);
      }
    })
  };


  const onClickNotication = (Id: string) => (event: any) => {
    console.log(Id);

    GetAxios().get(constants.Api_Url + 'Dashboard/SetNotificationFirst?nId=' + Id).then(res => {
      if (res.data.success) {

        getNotificationList();

      }
    })
  };


  const onClickNoticationAll = () => (event: any) => {

    GetAxios().get(constants.Api_Url + 'Dashboard/SetNotificationAll?userId=' + userId).then(res => {
      if (res.data.success) {

        getNotificationList();

      }
    })
  };

  const toggleDrawer = (open: any) => (event: any) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    handleClose();
    setOpenManageAccount(open);

  };

  const handleClickNotification = (hid: any, isKid: any, youngPersonId: any) => (event: any) => {
    if (isKid == true) {
      navigate("/kids/" + youngPersonId);
    }
    else if (hid != undefined && hid != "" && hid != '') {
      navigate("/homes/" + hid);
    }
    else {
      navigate("/dashboard");
    }

  };



  const getNotificationList = () => {

    GetAxios().get(constants.Api_Url + 'Dashboard/GetNotifications?userId=' + userId + "&houseId=00000000-0000-0000-0000-000000000000" + "&kidId=00000000-0000-0000-0000-000000000000").then(res => {
      if (res.data.success) {
        setNotificationList(res.data.list);
        setNoificationCount(res.data.list.length);

      }
    })
  };




  const usermanageform = useForm<UpdateProfileModal>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      id: userId,
      //email: "",

    },
    resolver: yupResolver(usermanageschema),
    mode: "onBlur"
  });

  

  const updatePasswordform = useForm<ChangePasswordModel>({
    defaultValues: {
      currentPassword: "",
      repeatPassword: "",
      newPassword: "",
      id: userId,

    },
    resolver: yupResolver(updatepasswordschema),
    mode: "onBlur"
  });
  const { register: usermanageRegister, handleSubmit: handleUserManageSubmit, formState: { errors: manageError, isValid: usermanageIsValid, isSubmitting: manageSubmitting }, reset: usermanageReset, watch: usermanageWatch, getValues: usermanageGetValues, setValue: usermanageSetValue } = usermanageform;
  const { register: updatePasswordRegister, handleSubmit: handleUpdatePasswordSubmit, formState: { errors: updatepwError, isValid: updatpwIsValid, isSubmitting: updatepwSubmitting }, reset: updatepwReset, watch: updatepwWatch, getValues: updatepwGetValues, setValue: updatepwSetValue } = updatePasswordform;


  const handleOpenManageAccount = (event: SyntheticEvent) => {

    GetAxios().get(constants.Api_Url + 'User/GetUserProfile?userId=' + userId).then(res => {
      setOpenManageAccount(true);
      handleClose();
      if (res.data.success) {
        usermanageform.reset(res.data.data);

      }
    })
   
  };


      const handle2FA = (event: any) => {
         const isChecked = event.target.checked;
        setIsChecked(isChecked);

        if (isChecked) {
          const userEmail = localStorage.getItem("userEmail");

          if (!userEmail) {
            console.error("User email not found in localStorage.");
            return;
          }

          GetAxios()
            .post(`${constants.Api_Url}TwoFactorAuth/setup`, { userEmail })
            .then((res) => {
              if (res.data.success) {
                setAlertViewModel(res.data.data);
              } else {
                console.error("2FA setup failed:", res.data.message);
              }
            })
            .catch((error) => {
              console.error("2FA setup error:", error);
            });
        } else {
          // Optionally handle disabling 2FA here
        }
    }

  const toggleDrawerViewAlert = (open: any, aid: string) => (event: any) => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
    getAlertDetail(aid);
    setOpenAlertView(open);
}

const getAlertDetail = (aid: string) => {
    GetAxios().get(constants.Api_Url + 'Dashboard/GetAlertById?aid=' + aid).then(res => {
        if (res.data.success) {
            setAlertViewModel(res.data.data);
            
        }
    })
};


  const toggleDrawerAlertClose = (open: any) => (event: any) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setOpenAlertView(false);
  };

  const handleUserManageFormSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setSubmitLoading(true);
    console.log(usermanageGetValues())
    const formData = new FormData();
    formData.append('id', usermanageGetValues("id"));
    formData.append('firstName', usermanageGetValues("firstName"));
    formData.append('lastName', usermanageGetValues("lastName"));
    formData.append('phone', usermanageGetValues("phone"));
    formData.append('address', usermanageGetValues("address"));

    GetAxios().post(constants.Api_Url + 'User/UpdateUserProfile', formData)
      .then(res => {
        setSubmitLoading(false);
        if (res.data.success) {
          enqueueSnackbar("Form was successfully submitted.", {
            variant: 'success', style: { backgroundColor: '#5f22d8' },
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          });

          toggleDrawer(false)(event);


        } else {
          console.warn(res);
          enqueueSnackbar("Unable to team members.", {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          });
        }
      })
      .catch(err => {
        setSubmitLoading(false);
        enqueueSnackbar("Something went wrong.", {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
      });

    if (updatpwIsValid) {
      const formData2 = new FormData();
      formData2.append('id', userId);
      formData2.append('currentPassword', updatepwGetValues("currentPassword"));
      formData2.append('newPassword', updatepwGetValues("newPassword"));
      formData2.append('repeatPassword', updatepwGetValues("repeatPassword"));

      GetAxios().post(constants.Api_Url + 'Auth/UpdatePassword', formData2)
        .then(res => {
          setSubmitLoading(false);
          if (res.data.success) {
            enqueueSnackbar("Form was successfully submitted.", {
              variant: 'success', style: { backgroundColor: '#5f22d8' },
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });

            toggleDrawer(false)(event);


          } else {
            console.warn(res);
            enqueueSnackbar("Unable to update password.", {
              variant: 'error',
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
          }
        })
        .catch(err => {
          setSubmitLoading(false);
          enqueueSnackbar("Something went wrong.", {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          });
        });
    }




  };
  const onhandlePrint = (event: any) => {
    window?.print();
  };


  useEffect(() => {
    getHouseList();
    // Use setTimeout to reset the countdown after it reaches 0
    getNotificationList();
    const interval = setInterval(() => {
      getNotificationList();
    }, 20000);
    return () => {
      clearInterval(interval);
    };


  }, []);


  return (
    <AppBar
      component="div"
      className='parentAppBAr'
      sx={
        {
          paddingTop: "0rem",
          paddingBottom: "0rem"
          // boxShadow: 'none', // Uncomment to hide shadow
        }
      }
      {...restOfProps}
    >
      <Toolbar className='parentHeaderdiv' disableGutters sx={{ paddingX: 1, justifyContent: 'space-between' }}>
        {/* {startNode} */}
        <div className='d-flex'>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img className='headerLogo' src="https://majidalipl-001-site4.otempurl.com/fabriclogo.png" alt="Logo" />
          </Box>
          <ul className='list-style-none d-flex align-items-center mb-0 navbarlistHeader'>
            <li className='ms-1'>
              <Link to="/Dashboard">
                <Tooltip title="Main Dashboard" placement="top" >
                  <IconButton className='headerIcon'>
                    <Icon>  <DashboardIcon className='text-body-tertiary iconHeight' /></Icon> {/* Replace with the icon you want to use */}
                  </IconButton>
                </Tooltip>
              </Link>
            </li>
            <li className='ms-1'>
              <Link to="/Homes">
                <Tooltip title="Homes" placement="top" >
                  <IconButton className='headerIcon'>
                    <Icon>  <LocationCityIcon className=' iconHeight' /></Icon> {/* Replace with the icon you want to use */}
                  </IconButton>
                </Tooltip>
              </Link>
            </li>
            <li className='ms-1'>
              <Link to="/Users">
                <Tooltip title="Team Members" placement="top" >
                  <IconButton className='headerIcon'>
                    <Icon>  <GroupIcon className='text-body-tertiary iconHeight' /></Icon> {/* Replace with the icon you want to use */}
                  </IconButton>
                </Tooltip>
              </Link>
            </li>
            <li className='ms-1'>
              <Link to="/Kids">
                <Tooltip title="Kids" placement="top" >
                  <IconButton className='headerIcon'>
                    <Icon>  <ChildCareIcon className='text-body-tertiary iconHeight' /></Icon> {/* Replace with the icon you want to use */}
                  </IconButton>
                </Tooltip>
              </Link>
            </li>
            <li className='ms-1'>
              <Link to="/reports">
                <Tooltip title="Reports" placement="top" >
                  <IconButton className='headerIcon'>
                    <Icon>  <BarChartIcon className='text-body-tertiary iconHeight' /></Icon> {/* Replace with the icon you want to use */}
                  </IconButton>
                </Tooltip>
              </Link>
            </li>
            {/* <li className='ms-1'>
              <Link to="/settings">
                <Tooltip title="Settings" placement="top" >
                  <IconButton className='headerIcon'>
                    <Icon>  <SettingsIcon className='text-body-tertiary iconHeight' /></Icon>
                  </IconButton>
                </Tooltip>
              </Link>
            </li> */}

          </ul>
        </div>
        <div>
          <Typography variant="h6">
            <Box sx={{ minWidth: 400 }} className='dropdownDivHeader'>
              <FormControl variant="outlined" className='' size="small">
                <Select
                  value={selectedHouse}
                  onChange={handleChangeHouse}
                  sx={{
                    borderRadius: "30px",
                    width: "200px",
                    marginRight: "20px"
                  }}
                >
                  <MenuItem value="00000000-0000-0000-0000-000000000000">Houses</MenuItem>
                  {(houseList || []).map((item: HouseListModel, index: any) => {
                    return (
                      <MenuItem key={"nav_house_" + item.id + index} value={item.id}>{item.name}</MenuItem>

                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            {/* {title} */}
          </Typography>
        </div>

        <div>

          <div className='d-flex align-items-center notifcatonPaneldiv'>
            <div className="me-4">
              <IconButton
                size="large"
                aria-controls="notification-menu"
                aria-haspopup="true"
                onClick={handleNotificationClick}
                color="inherit"
              >
                <NotificationsIcon />
                {notificationCount}
              </IconButton>
              <Menu className='notifcationPopup'
                id="notification-menu"
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <div className="d-flex align-items-center justify-content-between px-3 mt-2">
                  <div>
                    <span style={{ borderRadius: '5px', fontSize: "16px", fontWeight: "700", color: "#000" }}>Notifications</span>
                  </div>
                  <div>
                    <Link to="">
                      <IconButton sx={{ borderRadius: '5px', fontSize: "14px", fontWeight: "500", color: "#000" }} onClick={onClickNoticationAll()}> Mark all as read</IconButton></Link>
                  </div>
                </div>
                <div className='text-center py-3'>

                  {(notificationList || []).map((item: NotificationListModel, index: any) => {
                    return (
                      <div className='d-flex align-items-center px-3 mb-4'>
                        <NotifcattionDivIcon  onClick={toggleDrawerViewAlert("true", item.id)}>
                          <NotificationsIcon />
                        </NotifcattionDivIcon>
                        <div>
                          <div onClick={handleClickNotification(item.houseId, item.isKid, item.youngPersonId)}>
                            <NotifcattionName>{item?.title}</NotifcattionName>
                          </div>
                          <NotifcattionNameMuted>{item?.timeAgo}</NotifcattionNameMuted>
                        </div>
                        <IconButton sx={{ marginLeft: "20px" }}>
                          <DoneIcon style={{ color: 'black' }} onClick={handleClickNotification(item.houseId, item.isKid, item.youngPersonId)}/>
                        </IconButton>
                      </div>

                    );
                  })}




                  {notificationList?.length == 0 &&
                    <label className='fw-medium' style={{
                      fontSize: "15px"
                    }}>
                      Nothing to see here</label>
                  }
                </div>
                {/* Add more notification options if needed */}
              </Menu>
            </div>

            <div>
              <Drawer className="Mui-Drawe-w" anchor="right" open={openManageAccount} onClose={toggleDrawer(false)}>
                <AppForm onSubmit={handleUserManageFormSubmit}>
                  <Box>
                    <DrawerHeadingParent>
                      <DrawerHeading>Update Team Members</DrawerHeading>
                    </DrawerHeadingParent>
                    <DrawerBody>
                      <div style={{
                        padding: "2.5rem", width: "100%"

                      }}>
                        <TextField id="standard-basic4" className="mb-4" fullWidth label="First Name:*" variant="standard"
                          {...usermanageRegister("firstName", { required: true })} error={!!manageError.firstName}
                          helperText={manageError.firstName?.message} />
                        <TextField id="standard-basic4" className="mb-4" fullWidth label="Last Name:*" variant="standard"
                          {...usermanageRegister("lastName", { required: true })} error={!!manageError.lastName}
                          helperText={manageError.lastName?.message} />
                        <TextField id="standard-basicp" className="mb-4" fullWidth label="Phone:*" variant="standard"
                          {...usermanageRegister("phone", { required: true })} error={!!manageError.phone}
                          helperText={manageError.phone?.message} />

                        <TextField id="standard-basic7" {...usermanageRegister("address", { required: true })} className="mb-4" fullWidth label="Address:*" multiline
                          rows={4}
                          variant="standard"
                          error={!!manageError.address}
                          helperText={manageError.address?.message} />

                          <FormControlLabel control={
                                                                                  <Checkbox
                                                                                      checked={isChecked}
                                                                                      onChange={handle2FA}
                                                                                      iconStyle={{ fill: 'red' }}
                                                                                      inputStyle={{ color: 'red' }}
                                                                                      style={{ color: 'green' }}
                                                                                  />
                                                                              } label="Enable 2FA" onChange={handle2FA} className='fontsize-11' />
                        
                     

                          
                        <Box style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                          <Divider />
                          <Typography style={{ marginTop: '-12px', width: 'fit-content', marginLeft: 'auto', marginRight: 'auto', padding: '0 4px', }}>
                            Update Password
                          </Typography>
                        </Box>

                        <TextField id="standard-basic4" className="mb-4" fullWidth label="Current Password:*" variant="standard" type='password'
                          {...updatePasswordRegister("currentPassword", { required: true })} error={!!updatepwError.currentPassword}
                          helperText={updatepwError.currentPassword?.message} />
                        <TextField id="standard-basic4" className="mb-4" fullWidth label="New Password:*" variant="standard" type='password'
                          {...updatePasswordRegister("newPassword", { required: true })} error={!!updatepwError.newPassword}
                          helperText={updatepwError.newPassword?.message} />
                        <TextField id="standard-basicp" className="mb-4" fullWidth label="Repeat Password:*" variant="standard" type='password'
                          {...updatePasswordRegister("repeatPassword", { required: true })} error={!!updatepwError.repeatPassword}
                          helperText={updatepwError.repeatPassword?.message} />
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

                        <AppButton type="submit" className='btnLogin' disabled={!usermanageIsValid} >
                          {!manageSubmitting ?
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
            <div>
              <Drawer className="Mui-Drawe-w" anchor="right" open={openAlertView} onClose={toggleDrawerAlertClose("false")}>
                <Box>

                  <DrawerHeadingParent>
                    <DrawerHeading> Alert Summary</DrawerHeading>
                    <>
                      {/* <IconButton
                                            aria-controls="simple-menu"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <MoreVertIcon />
                                        </IconButton> */}
                      {/* <Menu
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >

                                            <MenuItem key="Edit" onClick={() => { editKidRecording(activityNoteViewModel); }}>
                                                Edit
                                            </MenuItem>
                                            <MenuItem key="Revoke" onClick={handleClickOpenDialog}>
                                                Delete
                                            </MenuItem>

                                        </Menu> */}
                    </>
                  </DrawerHeadingParent>

                  <DrawerBody>
                    <div style={{
                      padding: "2.5rem", width: "100%"

                    }}>
                      <div className="mb-1">


                      </div>

                      <Box style={{ display: 'flex', flexDirection: 'column', gap: "4px", width: '100%', marginBottom: "4px" }}>

                        <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                          <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                            Kid:
                          </Typography>
                          <Typography variant="body1">{alertViewModel?.kidName ?? ""}</Typography>
                        </Box>

                        <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                          <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                            Title:
                          </Typography>
                          <Typography variant="body1">{alertViewModel?.title ?? ""}</Typography>
                        </Box>
                        <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                          <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                            Severity
                          </Typography>
                          <Typography variant="body1">{alertViewModel?.severity ?? ""}</Typography>
                        </Box>
                        <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                          <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                            Date created:
                          </Typography>
                          <Typography variant="body1">{moment(alertViewModel?.createdAt ?? new Date()).format('YYYY-MM-DDTHH:mm:ss')}</Typography>
                        </Box>
                      </Box>



                    </div>
                    <div className="d-flex align-items-center justify-content-between" style={{
                      padding: "2.5rem", width: "100%",
                    }}>
                      <Button variant="text" color="inherit" onClick={toggleDrawerAlertClose("false")}>
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
            </div>

            <div className='me-4'>
              <IconButton sx={{
                borderRadius: "5px",
                padding: "6px"
              }}
                aria-haspopup="true"
                onClick={handleClick}
                size="large"
                aria-controls="user-menu"
                color="inherit">
                <span className='fs-6 fw-medium'>
                  {parsedClaims?.name}
                </span>
                <KeyboardArrowDownIcon />
              </IconButton>


              <Menu
                sx={{
                  width: "300px"
                }}
                id="user-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <div className='py-3 text-center'>
                  <AccountCircle className='fs-65px text-black-50' />
                  <div className='py-1'>
                    <label className='fw-bold fs-6 '>{parsedClaims?.name}</label>
                  </div>
                  <div className='pb-2'>
                    <span className='text-capitalized'>{parsedClaims?.role}</span>
                  </div>
                  <AppButton className='btnLogin py-2' onClick={handleOpenManageAccount}>
                    Manage Account
                  </AppButton>
                  <Button variant="text" color="inherit" onClick={handleSignOut}>
                    <ExitToAppIcon className='pe-1' /> SIGN OUT
                  </Button>
                </div>
              </Menu>
            </div>
          </div>

        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
