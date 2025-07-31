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
    const [listVisibleKidId, setListVisibleKidId] = useState<string | null>(null); // instead of isListVisible
    const [currentPage, setCurrentPage] = useState(1);
    const kidsPerPage = 4;
    const [listAnchor, setListAnchor] = useState<{ top: number; left: number } | null>(null);

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
    const toggleDrawer = (open: boolean, type: string, kidId: string, locationStatus: string) => (event: any) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        if (type === "KidLocation") {
            whereaboutSetValue("status", locationStatus);
            whereaboutSetValue("kidId", kidId);
            if (!open) setListVisibleKidId(null);
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
    const handleShowList = (kidId: string, event: React.MouseEvent<HTMLDivElement>) => {
        setListVisibleKidId(kidId);
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        setListAnchor({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
        });
    };
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // If the list is open and the click is outside the list, close it
            const list = document.getElementById('kid-action-list');
            if (list && !list.contains(event.target as Node)) {
                setListVisibleKidId(null);
                setListAnchor(null);
            }
        }
        if (listVisibleKidId && listAnchor) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [listVisibleKidId, listAnchor]);
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
      setCurrentPage(1); // <-- Reset to first page on filter change
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
                        {(kidLocations || [])
    .slice((currentPage - 1) * kidsPerPage, currentPage * kidsPerPage)
    .map((kidDetail: HouseKidLocationViewModal, index: any) => {
      return (
        <div key={kidDetail.kidId}>
          <DashboardCard>
            <DisplayBetween>
              <DisplayBetween>
                <ImgParentDivSmall>
                  {kidDetail?.status !== "" && kidDetail?.status != undefined
                    ? kidDetail?.status ?? "".substring(0, 1).toUpperCase()
                    : "HA"}
                </ImgParentDivSmall>
                <div style={{ width: 300 }}>
                  <TitleCard>{kidDetail?.kidName}</TitleCard>
                  <SmallTitleCard style={{ fontSize: "16px" }}>
                    {kidDetail?.status ?? "Home"}
                  </SmallTitleCard>
                  <SmallTitleCard>
                    {kidDetail?.missingNoteTime}
                  </SmallTitleCard>
                </div>
              </DisplayBetween>
              <div>
                <div onClick={(e) => handleShowList(kidDetail.kidId, e)}>
                  <ExpandLess className="text-dark" />
                </div>
                <div onClick={(e) => handleShowList(kidDetail.kidId, e)}>
                  <ExpandMore className="text-dark" />
                </div>
              </div>
            </DisplayBetween>
          </DashboardCard>
          {listVisibleKidId === kidDetail.kidId && listAnchor && (
            <List
              id="kid-action-list" // <-- Add this id
              style={{
                position: "absolute",
                top: listAnchor.top,
                left: listAnchor.left,
                background: "white",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
              }}
            >
              <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", kidDetail.kidId, "HOME")}>At Home</ListItem>
              <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", kidDetail.kidId, "MISSING")}>Missing</ListItem>
              <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", kidDetail.kidId, "UNAUTHORISED")}>UnAuthorised</ListItem>
              <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", kidDetail.kidId, "AUTHORISED")}>Authorised</ListItem>
              <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", kidDetail.kidId, "OUT")}>Out</ListItem>
            </List>
          )}
        </div>
      );
    })}
  {/* Pagination controls */}
  {kidLocations && kidLocations.length > kidsPerPage && (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
      <Pagination
        count={Math.ceil(kidLocations.length / kidsPerPage)}
        page={currentPage}
        onChange={(_, value) => setCurrentPage(value)}
        color="primary"
      />
    </div>
  )}
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

