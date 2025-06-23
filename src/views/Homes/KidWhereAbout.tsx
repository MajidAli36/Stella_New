import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { Theme, useTheme } from '@mui/material/styles';
import { Row, Col, Container } from "react-bootstrap";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSnackbar } from 'notistack';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Icon, IconButton } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { SubtitleCard, getStyles } from "../Dashboard/DashboardScreenStyle";
import { DrawerHeading, DrawerStepHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
import { VALIDATE_FORM_PERSON_ON_CALL_LOG, kidwhereaboutschema, VALIDATE_FORM_PROFESSIONAL_CONTACT, VALIDATE_FORM_KID_RECORDING, VALIDATE_FORM_KID_PAYMENT, coachingschema, incidentschema, spinschema, alertschema } from '../../service/ValidationSchema';
import SelectCommon from "../../components/FormComponents";
import { DashboardCard, PageHeading, PageHeadingSmall, GreyBox, AlertHeading, IconBox, ImgParentDiv, ImgParentDivLg, ImgParentDivSmall, GreyBoxParent, GreyBoxDesc, GreyBoxHeading, GreyBoxHeadingParent, TitleCard, SmallTitleCard, GreenTextLabel, GreenTextLabelSmall, Greenbtndiv, DashboardCardBgGreen, DashboardCardBgGreenChildDiv, DashboardCardBgGreenChildDivCol, DashboardCardBgGreenChildDivCol2, DashboardCardpurple, DisplayBetween, DisplayNumber, DisplayStart, MoveInDiv, MoveInlbl, FlexBetween, PlusButton } from "./HouseScreenStyle";
import FormHelperText from '@mui/material/FormHelperText';
import TaskTab from "./TasksTab";
import { AppButton, AppForm } from '../../components';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import HouseCustomTabPanel from "../../components/Tabs/houseTabsComponent";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import MeetingRoom from "@mui/icons-material/MeetingRoom";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import '../../index.css'; import { useAppForm } from '../../utils/form';
import { parseJwt } from "../../hooks";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { GetAxios } from '../../service/AxiosHelper';
import React, { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import AddAnotherButton from '../../service/AddAnotherButton';
import { yupResolver } from "@hookform/resolvers/yup";
import ActivityLog from "./ActivityLog";
import constants, { coachingSessionCategories } from '../../service/Constants';
import { MenuProps, contactType, TrmText, contactedOptions, incidentCategoryOption } from '../../service/Constants';
import { VALIDATE_FORM_Kid_Location } from "../../service/ValidationSchema";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import RoomTab from "./RoomTab";
import { createTheme, ThemeProvider } from '@mui/system';
import ModeIcon from '@mui/icons-material/Mode';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
interface Iprops {
    houseId: string
}

export default function KidWhereAbout(props: Iprops) {
    const userToken = useSelector((state: AppStore) => state.auth.accessToken);
    const parsedClaims = parseJwt(userToken?.token || '');
    const userId = parsedClaims.id;
    const [kidLocations, setKidLocations] = React.useState<HouseKidLocationViewModal[]>();
    const [selectStatus, setSelectedStatus] = React.useState("All");
    const [openKidLocation, setOpenKidLocation] = React.useState(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>();


    const whereaboutform = useForm<KidWhereAboutModel>({
        defaultValues: {
            status: "HOME", note: "", loggedInUserId: userId, incidentNumber: "", kidId: "", date: new Date()
        },
        resolver: yupResolver(kidwhereaboutschema),
        mode: "all"
    });
    const { register: whereaboutRegister, formState: { errors: whereaboutError, isValid: whereaboutIsValid, isSubmitting: whereaboutSubmitting }, reset: whereaboutReset, watch: whereaboutWatch, getValues: whereaboutGetValues, setValue: whereaboutSetValue } = whereaboutform;

    const getLocationList = (status: string) => {
        if (props.houseId != null && props.houseId != undefined) {
            console.log(constants.Api_Url);
            GetAxios().get(constants.Api_Url + 'House/GetHouseKidLocations?houseId=' + props.houseId + "&status=" + status).then(res => {
                if (res.data.success) {
                    setKidLocations(res.data.list);

                }
            })
        }
    }
    const toggleDrawer = (open: any, type: string, kidId: string, locationStatus: string) => (event: any) => {
        console.log(locationStatus);
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        if (type == "KidLocation") {
            whereaboutSetValue("status", locationStatus);
            whereaboutSetValue("kidId", kidId);
            if (open == false) { setListVisible(false) }
            setOpenKidLocation(open);
        }


    };

    const handleLocationListWithStatus = () => {
        getLocationList("ALL");
    }

    const { enqueueSnackbar } = useSnackbar();
    const [isListVisible, setListVisible] = useState(false);

    const handleKidLocationFormSubmit = (event: SyntheticEvent) => {
        console.log("handle kid location form submit")
        const formattedDate = moment(whereaboutGetValues("date")).format('YYYY-MM-DDTHH:mm:ss');
        const formData = new FormData();
        formData.append('date', formattedDate);
        formData.append('KidId', whereaboutGetValues("kidId"));
        formData.append("Status", whereaboutGetValues("status"));
        formData.append("Note", whereaboutGetValues("note") ?? "");
        formData.append('LoggedInUserId', userId || "");
        formData.append('IncidentNumber', whereaboutGetValues("incidentNumber") ?? "");
        setListVisible(false);
        GetAxios().post(constants.Api_Url + 'Kid/UpdateKidWhereAboutHouse', formData).then(res => {
            if (res.data.success) {

                enqueueSnackbar("Form was successfully submitted.", {
                    variant: 'success', style: { backgroundColor: '#5f22d8' },
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
                //close Model //Fetch list
                toggleDrawer(false, "KidLocation","", "HOME")(event);



            } else {
                console.warn(res);
                enqueueSnackbar("Unable to update young person location", {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            }
        }).catch(err => {

            enqueueSnackbar("Unable to update young person location", {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
        });

    };
const statusOptions = [
 
  { value: "MISSING", label: "Missing" },
  { value: "HOME", label: "At Home" },
  { value: "UNAUTHORISED", label: "Unauthorised" },
  { value: "AUTHORISED", label: "Authorised" },
  { value: "OUT", label: "Out" },
];



    React.useEffect(() => {
       const getLocationList = (status: string) => {
  if (props.houseId) {
    GetAxios().get(
      `${constants.Api_Url}House/GetHouseKidLocations?houseId=${props.houseId}&status=${status}`
    ).then(res => {
      if (res.data.success) {
        setKidLocations(res.data.list);
      }
    });
  }
};
        // Fetch initial list with "ALL" status
        getLocationList("ALL");

    }, []);

    // const handleWhereAboutHomeStatus = (kidId: string) => {

    //     debugger;
    //     console.log("handle kid location form submit")
    //     const formData = new FormData();
    //     formData.append('KidId', kidId ?? "");
    //     formData.append("Status", locationStatus);
    //     formData.append("Note", locationformState.values.note);
    //     formData.append('LoggedInUserId', userId || "");
    //     formData.append('IncidentNumber', locationformState.values.incidentNumber);
    //     setListVisible(false);
    //     GetAxios().post(constants.Api_Url + 'Kid/UpdateKidWhereAboutHouse', formData).then(res => {
    //         debugger;
    //         if (res.data.success) {

    //             enqueueSnackbar("Form was successfully submitted.", {
    //                 variant: 'success', style: { backgroundColor: '#5f22d8' },
    //                 anchorOrigin: { vertical: 'top', horizontal: 'right' },
    //             });
    //             //close Model //Fetch list
    //             toggleDrawer(false, "KidLocation", locationStatus);



    //         } else {
    //             console.warn(res);
    //             enqueueSnackbar("Unable to update young person location", {
    //                 variant: 'error',
    //                 anchorOrigin: { vertical: 'top', horizontal: 'right' },
    //             });
    //         }
    //     }).catch(err => {

    //         enqueueSnackbar("Unable to update young person location", {
    //             variant: 'error',
    //             anchorOrigin: { vertical: 'top', horizontal: 'right' },
    //         });
    //     });
    // }
    return (<>
        <DashboardCard>
            <GreyBoxParent className=''>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <TitleCard style={{ color: "#2a0560" }}>Whereabout status </TitleCard>
                    <div className="w-200px">
                   <FormControl
  variant="outlined"
  className="me-4"
  size="small"
  sx={{ minWidth: '120px' }}
>
  <Select
    name="selectedStatus"
    value={selectStatus}
    onChange={(e) => {
      const selected = e.target.value;
      setSelectedStatus(selected);
      getLocationList(selected);
    }}
    displayEmpty
    sx={{
      border: "0px solid #C4C4C4",
      height: "min-content",
      minWidth: "10rem",
      background: "transparent",
      borderRadius: "30px",
      width: "100px",
      backgroundColor: "#F5F5F5",
      fontSize: "14px"
    }}
    renderValue={(selected) => {
      if (!selected || selected === "") {
        return <span style={{ color: "#888" }}>All</span>;
      }
      const found = statusOptions.find(opt => opt.value === selected);
      return found ? found.label : "All";
    }}
  >
    <MenuItem value="ALL">All</MenuItem>
    {statusOptions.map((status) => (
      <MenuItem key={status.value} value={status.value}>
        {status.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>


                    </div>
                </div>
                <GreyBox>
                    <Box>
                        {(kidLocations || []).map((kidDetail: HouseKidLocationViewModal, index: any) => {
                            return (
                                <div>
                                    <DashboardCard>
                                        <DisplayBetween>

                                            <DisplayBetween>
                                                <ImgParentDivSmall>
                                                    {kidDetail?.status !== "" && kidDetail?.status != undefined ? kidDetail?.status ?? "".substring(0, 1).toUpperCase() : "HA"}

                                                </ImgParentDivSmall>
                                                <div>
                                                    <SmallTitleCard>
                                                        {kidDetail?.kidName}
                                                    </SmallTitleCard>

                                                    <TitleCard style={{ color: "#2a0560" }}>
                                                        {kidDetail?.status ?? "Home"}
                                                    </TitleCard>
                                                    <SmallTitleCard>
                                                        {kidDetail?.missingNoteTime}
                                                    </SmallTitleCard>
                                                </div>

                                            </DisplayBetween>
                                            <div>
                                                <div onClick={() => { setListVisible(true) }}>
                                                    <ExpandLess className="text-dark" /></div>
                                                <div onClick={() => { setListVisible(true) }}>
                                                    <ExpandMore className="text-dark" /></div>
                                            </div>
                                        </DisplayBetween>


                                    </DashboardCard>
                                    {isListVisible && (
                                        <List
                                            style={{
                                                position: 'absolute',
                                                top: 240,
                                                right: 118,
                                                background: 'white',
                                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                                zIndex: 1,
                                            }}
                                        >
                                            <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", kidDetail.kidId, "HOME")}>At Home</ListItem>
                                            <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", kidDetail.kidId, "MISSING")}>Missing</ListItem>
                                            <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", kidDetail.kidId, "UNAUTHORISED")}>UnAuthorised</ListItem>
                                            <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", kidDetail.kidId, "AUTHORISED")}>Authorised</ListItem>
                                            <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", kidDetail.kidId, "OUT")}>Out</ListItem>

                                        </List>
                                    )}
                                </div>);
                        })}
                        <GreyBoxHeadingParent>
                            <div className='svgWidth'>
                                <svg style={{ maxWidth: "14rem", maxHeight: "14rem" }} id="b21613c9-2bf0-4d37-bef0-3b193d34fc5d" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="647.63626" height="632.17383" viewBox="0 0 647.63626 632.17383"><path d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z" transform="translate(-276.18187 -133.91309)" fill="#f2f2f2"></path><path d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="190.15351" cy="24.95465" r="20" fill="#0AB472"></circle><circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff"></circle><path d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z" transform="translate(-276.18187 -133.91309)" fill="#e6e6e6"></path><path d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="433.63626" cy="105.17383" r="20" fill="#0AB472"></circle><circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff"></circle></svg>
                            </div>
                            <GreyBoxHeading>
                                No Whereabouts


                            </GreyBoxHeading>
                            <GreyBoxDesc>
                                Try assigning a whereabouts status to a kid and come back later.
                            </GreyBoxDesc>

                        </GreyBoxHeadingParent>
                    </Box>

                </GreyBox>
            </GreyBoxParent>


            <Drawer className="Mui-Drawe-w" anchor="right" open={openKidLocation} onClose={toggleDrawer(false, "KidLocation", "", "HOME")}>
                <AppForm onSubmit={handleKidLocationFormSubmit}>
                    <Box>
                        <DrawerHeadingParent>
                            <DrawerHeading style={{ color: "#2a0560" }}>Kid Location</DrawerHeading>
                        </DrawerHeadingParent>
                        <DrawerBody>
                            <div style={{
                                padding: "2.5rem", width: "100%"

                            }}>

                                <InputLabel id="kidRecordingDate" >Date:*</InputLabel>
                                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                                    <DateTimePicker
                                        onChange={(event: any) => { whereaboutSetValue("date", event) }}
                                        format="MM/dd/yyyy HH:mm"
                                        value={whereaboutWatch("date")}
                                        clearIcon={null}
                                        required
                                    />
                                    <FormHelperText style={{ color: "Red" }} >
                                        {whereaboutError.date?.message}
                                    </FormHelperText>
                                </div>

                                <TextField id="kidInicidentNumber" className="mb-4" fullWidth label="Note:*" variant="standard"
                                    {...whereaboutRegister("note", { required: { value: true, message: "Required" } })}
                                    error={!!whereaboutError.note}
                                    helperText={whereaboutError.note?.message}
                                />



                                {
                                    whereaboutWatch("status") == "MISSING" &&
                                    <TextField id="kidInicidentNumber" className="mb-4" fullWidth label="Police Incident Report Number:*" variant="standard"
                                        {...whereaboutRegister("incidentNumber", { required: { value: true, message: "Required" } })}
                                        error={!!whereaboutError.incidentNumber}
                                        helperText={whereaboutError.incidentNumber?.message}
                                    />

                                }

                            </div>
                            <div className="d-flex align-items-center justify-content-between" style={{
                                padding: "2.5rem", width: "100%"
                            }}>
                                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "KidLocation", "", "HOME")}>
                                    Cancel
                                </Button>
                                <Button variant="text" color="inherit" onClick={() => {
                                    window?.print();
                                }}>
                                    Print
                                </Button>
                                <AppButton type="submit" className='btnLogin' disabled={!whereaboutIsValid} >
                                    {!submitLoading ?
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




        </DashboardCard>



        <div className="d-flex align-items-center justify-content-end">
            <Icon style={{ height: "unset" }}>  <ChevronLeftIcon className='text-body-tertiary iconHeight' /></Icon>
            <Icon></Icon>
            <Icon style={{ height: "unset" }}>  <ChevronRightIcon className='text-body-tertiary iconHeight' /></Icon>
        </div></>


    );
}

