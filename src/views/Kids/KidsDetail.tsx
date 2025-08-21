import { Box, Grid, Typography, CircularProgress, makeStyles, Tab, Tabs, ThemeProvider } from "@mui/material";
import { Row, Col, Container } from "react-bootstrap";
import { PageHeading, PageHeadingSmall, getStyles, SubtitleCard, FlexBetween, SmallTitleCard, TitleCard, ImgParentDiv, ImgParentDivLg, ImgParentDivSmall, DashboardCard, DashboardCardBgGreen, DashboardCardBgGreenChildDiv, DashboardCardBgGreenChildDivCol, DashboardCardBgGreenChildDivCol2, GreenTextLabel, GreenTextLabelSmall, Greenbtndiv, GreyBox, GreyBoxDesc, GreyBoxHeading, GreyBoxHeadingParent, GreyBoxParent, MoveInDiv, MoveInlbl, DashboardCardpurple, DisplayBetween, DisplayNumber, DisplayStart, AlertHeading, PlusButton } from './KidScreenStyle'
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Theme, useTheme } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React, { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { AppBar, Toolbar, Icon, IconButton } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Drawer from '@mui/material/Drawer';
import { DrawerHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
import InputLabel from '@mui/material/InputLabel';
import { List, ListItem } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { VALIDATE_FORM_KID_RECORDING, kidmovehouseschema, kidmoveinschema, alertschemakid, spinschema, proContactSchema, recordingactivityschema, kidwhereaboutschema, coachingschema, kidpaymentschema, kidnote2schema, proContactKidSchema, incidentschema, moveoutschema, VALIDATE_FORM_Move_In, VALIDATE_FORM_KID_NOTE, VALIDATE_FORM_Move_Young_Person, VALIDATE_FORM_Kid_Location, VALIDATE_FORM_KID_PAYMENT, VALIDATE_FORM_MOVE_OUT, VALIDATE_FORM_PROFESSIONAL_CONTACT, VALIDATE_FORM_PROFESSIONAL_CONTACT_KID } from '../../service/ValidationSchema';
import { contactType, MenuProps, TrmText, contactedOptions, incidentCategoryOption } from '../../service/Constants';
import Button from '@mui/material/Button';
import { AppButton } from "../../components";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import MeetingRoom from "@mui/icons-material/MeetingRoom";
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import { GetAxios } from '../../service/AxiosHelper';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../utils/form';
import { AppLink, AppIconButton, AppAlert, AppForm } from '../../components';
import { useSelector } from 'react-redux';
import { parseJwt } from "../../hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import constants, { coachingSessionCategories } from '../../service/Constants';
import { Route, Routes } from 'react-router-dom';
import OutlinedInput from '@mui/material/OutlinedInput';
import KidTaskTab from "./KidTaskTab";
import ActivityLogTab from "./ActivityLogTab";
import KidProfileTab from "./KidProfileTab";
import FileTab from "../Homes/FileTab";
import PropTypes from 'prop-types';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import Alert from '@mui/material/Alert';
import usePagination from "../../components/CustomPagination";

interface Iprops {
}



interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function KidsDetail(props: Iprops) {

    const navigate = useNavigate();

    const [isChecked, setIsChecked] = useState(false);
    const userToken = useSelector((state: AppStore) => state.auth.accessToken);
    const parsedClaims = parseJwt(userToken?.token || '');
    const userId = parsedClaims.id;
    const userRole = parsedClaims.role;
    console.log(userRole);
    const [openKidMoveIn, setOpenKidMoveIn] = React.useState(false);
    const [openKidMoveHouse, setOpenKidMoveHouse] = React.useState(false);
    const [openKidLocation, setOpenKidLocation] = React.useState(false);
    const [openKidRecording, setOpenKidRecording] = React.useState(false);
    const [openKidPayment, setOpenKidPayment] = React.useState(false);
    const [openKidProContact, setOpenKidProContact] = React.useState(false);
    const [openKidMoveOut, setOpenKidMoveOut] = React.useState(false);
    const [openKidNote, setOpenKidNote] = React.useState(false);
    const [openKidIncident, setOpenKidIncident] = React.useState(false);
    const [openKidCoaching, setOpenKidCoaching] = React.useState(false);
    const [openSpinSession, setOpenSpinSession] = React.useState(false);
    const [spinstep, setSpinStep] = useState(1);
    const [maxspinstep, setMaxSpinStep] = useState(2);
    const [behaviourCount, setBehaviourCount] = useState(1);
    const [coachingstep, setCoachingstep] = useState(1);
    const [maxcoachstep, setMaxCoachStep] = useState(2);
    const [kidCount, setKidCount] = useState(1);
    const [subCategories, setSubCategories] = useState(coachingSessionCategories[0].subCategories); // State to hold subcategories for the selected category
    const [openAlertForm, setOpenAlertForm] = React.useState(false);
    const [kidDetail, setKidDetail] = useState<KidViewModel>();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const [submitLoading, setSubmitLoading] = useState<boolean>();
    const [picture, setPicture] = useState('http://waqarsts-001-site1.ktempurl.com/dummy.jpg');
    const { kidId } = useParams();
    const [locationStatus, setLocationStatus] = React.useState("Home");
    const [valueTab, setValueTab] = useState(0);
    const [message, setMessage] = React.useState("");

    let myref: any = null;
    const onFileSelected = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setPicture(reader.result?.toString() || '');

                const axios = GetAxios();
                const formData = new FormData();
                formData.append('picture', e.target.files[0])
                formData.append('id', kidId?.toString() ?? "")
                axios.patch(constants.Api_Url + 'Kid/UpdateProfilePicture', formData).then(res => {
                    if (res.data.success) {
                        // setPictureLoaded(true);
                        getKidDetal();
                        enqueueSnackbar("Pic updated successfully.", {
                            variant: 'success', style: { backgroundColor: '#5f22d8' },
                            anchorOrigin: { vertical: 'top', horizontal: 'right' },
                        });
                    } else {

                        enqueueSnackbar("Unable to update.", {
                            variant: 'error',
                            anchorOrigin: { vertical: 'top', horizontal: 'right' },
                        });
                    }
                }).catch(err => {
                    console.error(err);
                    enqueueSnackbar("Unable to update.", {
                        variant: 'error',
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });
                });

            });
            reader.readAsDataURL(e.target.files[0]);

        }
    }

    const handleBrowse = function (e: any) {
        e.preventDefault();
        myref.click();

    };
    const kidmovehouseform = useForm<MoveKidModel>({
        defaultValues: {
            id: "", loggedInUserId: userId, houseId: "", roomId: ""
        },
        resolver: yupResolver(kidmovehouseschema),
        mode: "all"
    });
    const { register: kidmovehouseRegister, formState: { errors: kidmovehouseError, isValid: kidmovehouseIsValid, isSubmitting: kidmovehouseSubmitting }, reset: kidmovehouseReset, watch: kidmovehouseWatch, getValues: kidmovehouseGetValues, setValue: kidmovehouseSetValue } = kidmovehouseform;
    const kidmoveinform = useForm<MoveInKidModel>({
        defaultValues: {
            id: "", status: "", loggedInUserId: userId, houseId: "", roomId: "", moveInDate: new Date()
        },
        resolver: yupResolver(kidmovehouseschema),
        mode: "all"
    });
    const { register: kidmoveinRegister, formState: { errors: kidmoveinError, isValid: kidmoveinIsValid, isSubmitting: kidmoveinSubmitting }, reset: kidmoveinReset, watch: kidmoveinWatch, getValues: kidmoveinGetValues, setValue: kidmoveinSetValue } = kidmoveinform;

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const [isListVisible, setListVisible] = useState(false);

    const path = "/kids/" + kidId ?? "";
    const recordingform = useForm<KidRecordingFormValues>({
        defaultValues: {
            kidId: kidId,
            note: "",
            userId: userId,
            date: new Date(),
        },
        resolver: yupResolver(recordingactivityschema),
        mode: "all"
    });
    const kidpaymentform = useForm<KidPaymentFormValues>({
        defaultValues: {
            kidId: kidId,
            amount: 0,
            userId: userId,
            date: new Date(),
        },
        resolver: yupResolver(kidpaymentschema),
        mode: "all"
    });
    const kidnoteform = useForm<KidNoteFormValues>({
        defaultValues: {
            note: "", userId: userId, date: new Date(), kidId: kidId,
        },
        resolver: yupResolver(kidnote2schema),
        mode: "all"
    });

    const whereaboutform = useForm<KidWhereAboutModel>({
        defaultValues: {
            status: "HOME", note: "", loggedInUserId: userId, incidentNumber: "", kidId: kidId, date: new Date()
        },
        resolver: yupResolver(kidwhereaboutschema),
        mode: "all"
    });


    const { register: recordingRegister, formState: { errors: recordingError, isValid: recordingIsValid, isSubmitting: recordingSubmitting }, reset: recordingReset, watch: recordingWatch, getValues: recordingGetValues, setValue: recordingSetValue } = recordingform;
    const { register: paymentRegister, formState: { errors: paymentError, isValid: paymentIsValid, isSubmitting: paymentSubmitting }, reset: paymentReset, watch: paymentWatch, getValues: paymentGetValues, setValue: paymentSetValue } = kidpaymentform;
    const { register: noteRegister, formState: { errors: noteError, isValid: noteIsValid, isSubmitting: noteSubmitting }, reset: noteReset, watch: noteWatch, getValues: noteGetValues, setValue: noteSetValue } = kidnoteform;
    const { register: whereaboutRegister, formState: { errors: whereaboutError, isValid: whereaboutIsValid, isSubmitting: whereaboutSubmitting }, reset: whereaboutReset, watch: whereaboutWatch, getValues: whereaboutGetValues, setValue: whereaboutSetValue } = whereaboutform;

    const moveoutform = useForm<KidMoveOutFormValues>({
        defaultValues: {
            kidId: kidId,
            date: new Date(),
            note: "",

        },
        resolver: yupResolver(moveoutschema),
        mode: "all",
    });

    const spinSessionform = useForm<KidSpinSessionFormValues>({
        defaultValues: {
            kidId: kidId ?? "",
            userId: userId,
            date: new Date(),
            trmLevel: "",
            spinType: "",
            behaviours: [{
                presentingBehaviour: " ",
                intervention: "",
                need: " ",
                support: " ",
                whatsWorkingWell: " ",
                whatsNotWorkingWell: " ",
                whatNeedToHappen: " "
            }]

        },
        resolver: yupResolver(spinschema),
        mode: "all"
    });


    const coachingSessionform = useForm<KidCoachingFormValues>({
        defaultValues: {
            userId: userId,
            date: new Date(),
            category: "",
            subCategory: "",
            customSubCategory: "",
            kidActions: [{
                kidId: kidId ?? "",
                status: "",
                suggestions: "", // Adjust as needed
                actions: "",
                concerns: "",
                note: "",
            }],
        },
        resolver: yupResolver(coachingschema),
        mode: "all",
    });


    const recordIncidentform = useForm<RecordIncidentFormValues>({
        defaultValues: {
            kidId: kidId,
            userId: "",
            date: new Date(),
            location: "",
            incidentCategory: [],
            witnesses: "",
            contacted: [],
            policeIncidentNumber: "",
            note: ""

        },
        //resolver: yupResolver(incidentschema),
        mode: "all"
    });



    const alertform = useForm<CreateAlertFormValues>({
        defaultValues: {
            kidId: kidId,
            userId: userId,
            title: "",
            severity: "",
            date: new Date(),
            isKid: "1",
        },
        resolver: yupResolver(alertschemakid),
        mode: "all"
    });

    const proContactform = useForm<ProfessionalContactFormValues>({
        defaultValues: {
            kidId: "",
            userId: userId,
            date: new Date(),
            type: "",
            to: "",
            from: "",
            note: "",
        },
        resolver: yupResolver(proContactKidSchema),
        mode: "all"
    });

    const PAGE_SIZE = 5; // Number of items per page
    const { currentPage: currentPageAlert, pageCount: AlertPageCount, setCount: setAlertCount, setCurrentPage: setCurrentPageAlert } = usePagination({ take: PAGE_SIZE, count: 0 });
    const { register: spinRegister, handleSubmit: handleSpinSubmit, formState: { errors: spinError, isValid: spinIsValid, isSubmitting: spinSubmitting }, reset: spinReset, watch: spinWatch, getValues: spinGetValues, setValue: spinSetValue } = spinSessionform;
    const { register: incidentRegister, handleSubmit: handleIncidentSubmit, formState: { errors: incidentError, isValid: incidentIsValid, isSubmitting: incidentSubmitting }, reset: incidentReset, watch: incidentWatch, getValues: incidentGetValues, setValue: incidentSetValue } = recordIncidentform;
    const { register: coachingRegister, handleSubmit: handleCoachingSubmit, formState: { errors: coachingError, isValid: coachingIsValid, isSubmitting: coachingSubmitting }, reset: coachingReset, watch: coachingWatch, getValues: coachingGetValues, setValue: coachingSetValue } = coachingSessionform;
    const { register: proContactRegister, handleSubmit: handleProContactSubmit, formState: { errors: proContactError, isValid: proContactIsValid, isSubmitting: proContactSubmitting }, reset: proContactReset, watch: proContactWatch, getValues: proContactGetValues, setValue: proContactSetValue } = proContactform;
    const { register: moveoutRegister, handleSubmit: handlemoveoutSubmit, formState: { errors: moveoutError, isValid: moveoutIsValid, isSubmitting: moveoutSubmitting }, reset: moveoutReset, watch: moveoutWatch, getValues: moveoutGetValues, setValue: moveoutSetValue } = moveoutform;
    const { register: alertRegister, handleSubmit: handleAlertSubmit, formState: { errors: alertError, isValid: alertIsValid, isSubmitting: alertSubmitting }, reset: alertReset, watch: alertWatch, getValues: alertGetValues, setValue: alertSetValue } = alertform;
    const [notificationList, setNotificationList] = useState<NotificationListModel[]>();
    const { currentPage, handlePaginate, pageCount, setCount, setCurrentPage, } = usePagination({ take: PAGE_SIZE, count: 0 });
    //const [houseList, setHouseList] = useState<SelectList[]>();
    const [kidList, setKidListHouse] = useState<KidListModel[]>();
    const [houseList, setHouseList] = useState<HouseListModel[]>();
    const [openAlertView, setOpenAlertView] = React.useState(false);
    const [alertViewModel, setAlertViewModel] = useState<AlertViewModel>();

    const [roomList, setRoomList] = useState<SelectList[]>();
    const getRoomList = (houseId: any) => {
        if (houseId != null && houseId != undefined) {
            GetAxios().get(constants.Api_Url + 'General/GetRoomSelectList?hId=' + houseId).then(res => {
                if (res.data.success) { setRoomList(res.data.list); }
            })
        }
    }

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };




    // const handleMoveKidFieldChange = (event: any) => {

    //     const { name, value } = event.target as HTMLInputElement;

    //     const updatedValues = {
    //         ...formState.values,
    //         [name]: value,
    //     };
    //     if (name == "houseId") {

    //         getRoomList(value);
    //     }

    //     setFormState({
    //         ...formState,
    //         values: updatedValues,
    //         touched: {
    //             ...formState.touched,
    //             [name]: true,
    //         },
    //     });

    //     console.log(formState);
    // };

    // const handleMoveInKidFieldChange = (event: any) => {
    //     console.log("changed")
    //     const { name, value } = event.target as HTMLInputElement;

    //     const updatedValues2 = {
    //         ...moveInformState.values,
    //         [name]: value,
    //     };
    //     if (name == "houseId") {
    //         getRoomList(value);
    //     }

    //     setmoveInformState({
    //         ...moveInformState,
    //         values: updatedValues2,
    //         touched: {
    //             ...moveInformState.touched,
    //             [name]: true,
    //         },
    //     });
    // };





    const getHouseList = () => {

        if (localStorage.getItem("userRole") == "ADMIN") {

            GetAxios().get(constants.Api_Url + 'House/GetHousesDashboardWithRole?role=' + "ADMIN").then(res => {
                if (res.data.success) {
                    console.log(res.data.list);
                    setHouseList(res.data.list);
                }
            })

        }
        else {
            GetAxios().get(constants.Api_Url + 'House/GetHousesDashboard?search=' + "" + "&moveOut=" + true).then(res => {
                if (res.data.success) {
                    setHouseList(res.data.list);
                }
            })
        }
    };


    const toggleDrawer = (open: any, type: string, locationStatus: string) => (event: any) => {
        console.log(locationStatus);
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        if (type == "MoveKid") {
            kidmovehouseReset();
            setOpenKidProContact(false); setOpenKidMoveOut(false); setOpenKidMoveIn(false); setOpenKidMoveHouse(open); setOpenKidLocation(false); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false);
            setOpenKidCoaching(false); setOpenKidIncident(false); setOpenAlertForm(false);
        }
        else if (type == "MoveInKid") {
            kidmoveinReset();
            setOpenKidProContact(false); setOpenKidMoveOut(false); setOpenKidMoveIn(open); setOpenKidMoveHouse(false); setOpenKidLocation(false); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false);
            setOpenKidCoaching(false); setOpenKidIncident(false); setOpenAlertForm(false);
        }
        else if (type == "KidLocation") {
            whereaboutReset();
            setOpenKidProContact(false); setOpenKidMoveOut(false); whereaboutSetValue("status", locationStatus);
            if (open == false) { setListVisible(false) }
            setOpenKidMoveIn(false); setOpenKidMoveHouse(false); setOpenKidLocation(open); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false);
            setOpenKidCoaching(false); setOpenKidIncident(false); setOpenAlertForm(false);
        }
        else if (type == "Recording") {
            recordingReset();
            setOpenKidMoveIn(false); setOpenKidMoveHouse(false); setOpenKidLocation(false);
            setOpenKidProContact(false); setOpenKidMoveOut(false); setOpenKidRecording(open); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false);
            setOpenKidCoaching(false); setOpenKidIncident(false); setOpenAlertForm(false);
        }
        else if (type == "Payment") {
            paymentReset();
            setOpenKidProContact(false); setOpenKidMoveOut(false); setOpenKidMoveIn(false); setOpenKidMoveHouse(false); setOpenKidLocation(false);
            setOpenKidRecording(false); setOpenKidPayment(open); setOpenSpinSession(false); setOpenKidNote(false);
            setOpenKidCoaching(false); setOpenKidIncident(false); setOpenAlertForm(false);
        }
        else if (type == "Spin") {
            setOpenKidProContact(false); setOpenKidMoveOut(false); setSpinStep(1); setMaxSpinStep(2); setBehaviourCount(1); spinReset(); setOpenKidMoveIn(false); setOpenKidMoveHouse(false); setOpenKidLocation(false);
            setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(open); setOpenKidNote(false);
            setOpenKidCoaching(false); setOpenKidIncident(false); setOpenAlertForm(false);
        }
        else if (type == "Note") {
            noteReset();
            setOpenKidProContact(false); setOpenKidMoveOut(false); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(open);
            setOpenKidCoaching(false); setOpenKidIncident(false); setOpenKidMoveIn(false); setOpenKidMoveHouse(false); setOpenKidLocation(false); setOpenAlertForm(false);
        }
        else if (type == "Incident") {
            setOpenKidProContact(false); setOpenKidMoveOut(false); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false);
            setOpenKidCoaching(false); setOpenKidIncident(open); setOpenKidMoveIn(false); setOpenKidMoveHouse(false); setOpenKidLocation(false); setOpenAlertForm(false);
        }
        else if (type == "Coaching") {
            setCoachingstep(1); setMaxCoachStep(2); setKidCount(1); setOpenKidProContact(false); setOpenKidMoveOut(false); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false);
            setOpenKidCoaching(open); setOpenKidIncident(false); setOpenKidMoveIn(false); setOpenKidMoveHouse(false); setOpenKidLocation(false); setOpenAlertForm(false);
        }
        else if (type == "ProContact") {
            setOpenKidProContact(open); proContactform.reset(); setOpenKidMoveOut(false); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false);
            setOpenKidCoaching(false); setOpenKidIncident(false); setOpenKidMoveIn(false); setOpenKidMoveHouse(false); setOpenKidLocation(false); setOpenAlertForm(false);
        }
        else if (type == "MoveOut") {
            setOpenKidProContact(false); setOpenKidMoveOut(open); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false);
            setOpenKidCoaching(false); setOpenKidIncident(false); setOpenKidMoveIn(false); setOpenKidMoveHouse(false); setOpenKidLocation(false); setOpenAlertForm(false);
        }
        else if (type == "Alert") {
            setOpenKidProContact(false); setOpenKidMoveOut(false); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false);
            setOpenKidCoaching(false); setOpenKidIncident(false); setOpenKidMoveIn(false); setOpenKidMoveHouse(false); setOpenKidLocation(false); setOpenAlertForm(true);
        }

    };


    const getKidDetal = () => {
        GetAxios().get(constants.Api_Url + 'Kid/GetKid?kId=' + kidId).then(res => {
            if (res.data.success) {

                setKidDetail(res.data.data);
                setPicture(constants.Kid_Avatar + res.data.data?.avatar);
            }
        })
    };


    useEffect(() => {

        getKidDetal();
        getHouseList();
        getNotificationList();
        //setOpenAlertForm(true);
        // getKidListHouse();

    }, []);

    const handleCategoryChange = (event: any) => {
        const selectedCategory = event.target.value;
        coachingSetValue("category", selectedCategory);
        const selectedCategoryObject = coachingSessionCategories.find(category => category.label === selectedCategory);
        if (selectedCategoryObject) {
            setSubCategories(selectedCategoryObject.subCategories || []); // Set subcategories or an empty array if none found
        } else {
            setSubCategories([]); // If no category is selected or category not found, clear subcategories
        }
    };
    const handleSpinFormSubmit = (event: any) => {
        event.preventDefault();
        setSubmitLoading(true);

        const formData = new FormData();
        formData.append('kidId', spinGetValues("kidId") ?? "");
        formData.append('userId', userId ?? "");
        formData.append('trmLevel', spinGetValues("trmLevel") ?? "");
        formData.append('spinType', spinGetValues("spinType") ?? "");
        formData.append('date', moment(spinGetValues("date")).format('YYYY-MM-DDTHH:mm:ss'));
        spinGetValues("behaviours")?.forEach((value: SpinBehaviourFormValues, index: number) => {
            formData.append(`behaviours[${index}].presentingBehaviour`, value.presentingBehaviour);
            formData.append(`behaviours[${index}].intervention`, value.intervention);
            formData.append(`behaviours[${index}].need`, value.need);
            formData.append(`behaviours[${index}].support`, value.support);
            formData.append(`behaviours[${index}].whatsWorkingWell`, value.whatsWorkingWell);
            formData.append(`behaviours[${index}].whatsNotWorkingWell`, value.whatsNotWorkingWell);
            formData.append(`behaviours[${index}].whatNeedToHappen`, value.whatNeedToHappen);
        });
        console.log(formData);
        GetAxios().post(constants.Api_Url + 'Dashboard/SaveSpinSession', formData)
            .then(res => {
                setSubmitLoading(false);
                if (res.data.success) {
                    enqueueSnackbar("Form was successfully submitted.", {
                        variant: 'success', style: { backgroundColor: '#5f22d8' },
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawer(false, "Spin", "")(event);
                    spinReset();
                    getKidDetal();
                } else {
                    console.warn(res);
                    enqueueSnackbar("Unable to save spin session.", {
                        variant: 'error',
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });
                }
            })
            .catch(err => {
                setSubmitLoading(false);
                enqueueSnackbar("Something went wrong. Form unable to submit", {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            });
    };
    const checkCoachingStepValidation = async () => {
        try {
            let isValid = false;

            if (coachingstep === 1) {
                // Validate fields relevant to the first step
                isValid = await coachingSessionform.trigger([
                    'kidActions.0.kidId',
                    'date',
                    'category',
                    'subCategory',
                    'customSubCategory'
                ]);
            } else {
                // Validate fields relevant to the second step
                isValid = await coachingSessionform.trigger([
                    `kidActions.0.status`,
                    `kidActions.0.suggestions`,
                    `kidActions.0.note`,
                    `kidActions.0.actions`,
                    `kidActions.0.concerns`
                ]);
            }

            if (isValid) {
                setCoachingstep(coachingstep + 1); // Proceed to the next step
            } else {
                throw new Error('Form validation failed');
            }
        } catch (error) {
            // Handle validation errors here
            console.error('Validation failed:', error);
        }
    };
    const handleCoachingFormSubmit = (event: any) => {
        event.preventDefault();
        if (!coachingIsValid) {
            return;
        }
        else {

            setSubmitLoading(true);
            const subCat = coachingGetValues("subCategory") != "" ? coachingGetValues("subCategory") : coachingGetValues("customSubCategory");
            const date = moment(coachingGetValues("date")).format('YYYY-MM-DDTHH:mm:ss');

            const formData = new FormData();
            formData.append('userId', userId ?? "");
            formData.append('date', date);
            formData.append('category', coachingGetValues("category") ?? "");
            formData.append('subCategory', subCat ?? "");
            // formData.append('customSubCategory', coachingGetValues("customSubCategory") ?? "");
            coachingGetValues("kidActions")?.forEach((value: KidCoachingActionValues, index: number) => {
                formData.append(`kidActions[${index}].kidId`, value.kidId);
                formData.append(`kidActions[${index}].actions`, value.actions);
                formData.append(`kidActions[${index}].status`, value.status);
                formData.append(`kidActions[${index}].concerns`, value.concerns);
                formData.append(`kidActions[${index}].suggestions`, value.suggestions);
                formData.append(`kidActions[${index}].note`, value.note);

            });
            console.log(formData);
            GetAxios().post(constants.Api_Url + 'Dashboard/SaveCoachingSession', formData)
                .then(res => {
                    setSubmitLoading(false);
                    if (res.data.success) {
                        enqueueSnackbar("Form was successfully submitted.", {
                            variant: 'success', style: { backgroundColor: '#5f22d8' },
                            anchorOrigin: { vertical: 'top', horizontal: 'right' },
                        });

                        toggleDrawer(false, "Coaching", "")(event);
                        coachingReset();
                        getKidDetal();
                    } else {
                        console.warn(res);
                        enqueueSnackbar("Unable to save coaching session.", {
                            variant: 'error',
                            anchorOrigin: { vertical: 'top', horizontal: 'right' },
                        });
                    }
                })
                .catch(err => {
                    setSubmitLoading(false);
                    enqueueSnackbar("Something went wrong. Form unable to submit", {
                        variant: 'error',
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });
                });
        }
    };
    const handleIncidentFormSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        setSubmitLoading(true);
        console.log(incidentGetValues())
        const formData = new FormData();
        formData.append('kidId', incidentGetValues("kidId") ?? "");
        formData.append('userId', userId ?? "");
        formData.append('note', incidentGetValues("note"));
        formData.append('location', incidentGetValues("location"));
        formData.append('date', moment(incidentGetValues("date")).format('YYYY-MM-DDTHH:mm:ss'));
        formData.append('witnesses', incidentGetValues("witnesses"));
        incidentGetValues("incidentCategory").forEach((value: string, index: number) => {
            formData.append(`incidentCategory[${index}]`, value);
        });
        incidentGetValues("contacted").forEach((value: string, index: number) => {
            formData.append(`contacted[${index}]`, value);
        });
        formData.append('policeIncidentNumber', incidentGetValues("policeIncidentNumber"));

        GetAxios().post(constants.Api_Url + 'Dashboard/SaveRecordIncident', formData)
            .then(res => {
                setSubmitLoading(false);
                if (res.data.success) {
                    enqueueSnackbar("Form was successfully submitted.", {
                        variant: 'success', style: { backgroundColor: '#5f22d8' },
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawer(false, "Incident", "")(event);
                    incidentReset();
                    getKidDetal();
                } else {
                    console.warn(res);
                    enqueueSnackbar("Unable to save record incident.", {
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

    };
    const onhandlePrint = (event: any) => {
        window?.print();
    };
    const handleAddBehviour = (event: any) => {
        setIsChecked(event.target.checked);
        if (event.target.checked) {
            setMaxSpinStep(maxspinstep + 1);
        }
        else {
            // setMaxSpinStep(maxspinstep - 1);
        }
    }

    const handleMultiselect = (event: any) => {
        const value = event.target.value;
        incidentSetValue(event.target.name, typeof value === "string" ? value.split(",") : value)
    }
    const handleMoveKidFormSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        setSubmitLoading(true);
        const formData = new FormData();
        formData.append('Id', kidId ?? "");
        formData.append('LoggedInUserId', userId);
        formData.append('HouseId', kidmovehouseGetValues("houseId"));
        formData.append('RoomId', kidmovehouseGetValues("roomId"));
        GetAxios().post(constants.Api_Url + 'Kid/MoveKidToHouse', formData).then(res => {
            setSubmitLoading(false);
            if (res.data.success) {

                enqueueSnackbar("Successfully moved young person.", {
                    variant: 'success', style: { backgroundColor: '#5f22d8' },
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
                //close Model //Fetch list
                toggleDrawer(false, "MoveKid", "")(event);
                kidmovehouseReset();
                setRoomList([]);
                getKidDetal();

            } else {
                console.warn(res);
                enqueueSnackbar("Unable to move young person.", {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            }
        }).catch(err => {
            setSubmitLoading(false);
            enqueueSnackbar("Unable to move young person.", {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
        });



    };


    const handleMoveInKidFormSubmit = (event: SyntheticEvent) => {

        setSubmitLoading(true);

        const formData = new FormData();
        formData.append('Id', kidId ?? "");
        formData.append("Status", kidmoveinGetValues("status"));
        formData.append("MoveInDate", moment(kidmoveinGetValues("moveInDate")).format('YYYY-MM-DDTHH:mm:ss'));
        formData.append('LoggedInUserId', userId);
        formData.append('HouseId', kidmoveinGetValues("houseId") ?? "");
        formData.append('RoomId', kidmoveinGetValues("roomId") ?? "");


        GetAxios().post(constants.Api_Url + 'Kid/MoveInKid', formData).then(res => {
            setSubmitLoading(false);
            if (res.data.success) {

                enqueueSnackbar("Form was successfully submitted.", {
                    variant: 'success', style: { backgroundColor: '#5f22d8' },
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
                //close Model //Fetch list
                toggleDrawer(false, "MoveInKid", "")(event);
                // toggleDrawer(false);
                kidmoveinReset();
                setRoomList([]);
                getKidDetal();
            } else {
                console.warn(res);
                enqueueSnackbar("Unable to move in young person.", {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            }
        }).catch(err => {
            setSubmitLoading(false);
            enqueueSnackbar("Unable to move in young person.", {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
        });
    };

    const handleKidLocationFormSubmit = (event: SyntheticEvent) => {
        debugger;

        setSubmitLoading(true);
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
            setSubmitLoading(false);
            if (res.data.success) {
                getKidDetal();
                enqueueSnackbar("Form was successfully submitted.", {
                    variant: 'success', style: { backgroundColor: '#5f22d8' },
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
                //close Model //Fetch list
                toggleDrawer(false, "KidLocation", locationStatus)(event);
                whereaboutReset();


            } else {
                console.warn(res);
                enqueueSnackbar("Unable to update young person location", {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            }
        }).catch(err => {
            setSubmitLoading(false);
            enqueueSnackbar("Unable to update sakdjdsjyoung person location", {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
        });

    };


    const handleRecordingFormSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        setSubmitLoading(true);
        const formData = new FormData();
        const formattedDate = moment(recordingGetValues("date")).format('YYYY-MM-DDTHH:mm:ss');
        formData.append('kidId', recordingGetValues("kidId"));
        formData.append('userId', userId ?? "");
        formData.append('note', recordingGetValues("note"));
        formData.append('date', formattedDate);
        GetAxios().post(constants.Api_Url + 'Dashboard/SaveKidRecording', formData)
            .then(res => {
                setSubmitLoading(false);
                if (res.data.success) {
                    enqueueSnackbar("Form was successfully submitted.", {
                        variant: 'success', style: { backgroundColor: '#5f22d8' },
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawer(false, "Recording", "")(event);
                    recordingReset();
                    getKidDetal();
                } else {
                    console.warn(res);
                    enqueueSnackbar("Unable to save kid recording.", {
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


    };
    const handleNoteFormSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        setSubmitLoading(true);
        console.log(noteGetValues())
        const formData = new FormData();
        if (noteGetValues("kidId") == '' && noteGetValues("houseId") == '') {
            enqueueSnackbar("Please select atleast kid or home.", {
                variant: 'error', // Change variant to 'error' for red color
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
        }


        formData.append('kidId', noteGetValues("kidId") ?? "");
        formData.append('houseId', noteGetValues("houseId") ?? "");
        formData.append('userId', userId ?? "");
        formData.append('note', noteGetValues("note"));
        formData.append('date', moment(noteGetValues("date")).format('YYYY-MM-DDTHH:mm:ss'));
        GetAxios().post(constants.Api_Url + 'Dashboard/SaveGeneralNote', formData)
            .then(res => {
                setSubmitLoading(false);
                if (res.data.success) {
                    enqueueSnackbar("Form was successfully submitted.", {
                        variant: 'success', style: { backgroundColor: '#5f22d8' },
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawer(false, "Note", "")(event);
                    getKidDetal();
                    noteReset();
                } else {
                    console.warn(res);
                    enqueueSnackbar("Unable to save general note.", {
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

    };


    const handlePaymentFormSubmit = (event: any) => {
        event.preventDefault();
        setSubmitLoading(true);
        console.log(paymentGetValues());
        const formData = new FormData();
        formData.append('kidId', paymentGetValues("kidId") ?? "");
        formData.append('userId', userId ?? "");
        formData.append('amount', paymentGetValues("amount")?.toString());
        formData.append('date', moment(paymentGetValues("date")).format('YYYY-MM-DDTHH:mm:ss'));

        console.log(formData);
        GetAxios().post(constants.Api_Url + 'Dashboard/SaveKidPayment', formData)
            .then(res => {
                setSubmitLoading(false);
                if (res.data.success) {
                    enqueueSnackbar("Form was successfully submitted.", {
                        variant: 'success', style: { backgroundColor: '#5f22d8' },
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawer(false, "Payment", "")(event);
                    noteReset();
                    getKidDetal();
                } else {
                    console.warn(res);
                    enqueueSnackbar("Unable to save kid payment.", {
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
    };


    const handleMoveOutFormSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        setSubmitLoading(true);

        const formattedDate = moment(moveoutGetValues("date")).format('YYYY-MM-DDTHH:mm:ss');

        console.log(moveoutGetValues())
        const formData = new FormData();
        formData.append('kidId', kidId ?? "");
        formData.append('note', moveoutGetValues("note"));
        formData.append('date', formattedDate);
        GetAxios().post(constants.Api_Url + 'Kid/MoveOutKid', formData)
            .then(res => {
                setSubmitLoading(false);
                if (res.data.success) {
                    enqueueSnackbar("Form was successfully submitted.", {
                        variant: 'success', style: { backgroundColor: '#5f22d8' },
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawer(false, "Note", "")(event);
                    moveoutReset();
                    getKidDetal();
                } else {
                    console.warn(res);
                    enqueueSnackbar("Unable to move out kid.", {
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

    };

    const handleProContactFormSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        setSubmitLoading(true);
        console.log(proContactRegister);


        const formData = new FormData();
        formData.append('KidId', kidId ?? "");
        formData.append('UserId', userId ?? "");
        formData.append('Note', proContactGetValues("note"));
        formData.append('Date', moment(proContactGetValues("date")).format('YYYY-MM-DDTHH:mm:ss'));
        formData.append('To', proContactGetValues("to"));
        formData.append('From', proContactGetValues("from"));
        formData.append('Type', proContactGetValues("type"));
        GetAxios().post(constants.Api_Url + 'Kid/SaveProfessionalContact', formData)
            .then(res => {
                setSubmitLoading(false);
                if (res.data.success) {
                    enqueueSnackbar("Form was successfully submitted.", {
                        variant: 'success', style: { backgroundColor: '#5f22d8' },
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawer(false, "ProContact", "")(event);
                    proContactReset();
                    getKidDetal();
                } else {
                    console.warn(res);
                    enqueueSnackbar("Unable to save professional contact.", {
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

    };

    const chooseMessage = (message: any) => {
        //alert("majid ali");
        setMessage(message);
        localStorage.setItem('TabRiskManagement', message);
        setValue(2);
    };

    const toggleDrawerAlert = (open: any, type: string) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setOpenAlertForm(open); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false); alertReset();
        coachingReset(); setOpenKidCoaching(false); setOpenKidIncident(false); setCoachingstep(1); setMaxCoachStep(2); setKidCount(1);

    };


    const handleChangeTaskIndex = (newValue: any) => {
        setValueTab(newValue);
        alert(newValue);
    };

    const toggleDrawerViewAlert = (open: any, aid: string) => (event: any) => {
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


    const getNotificationList = () => {

        GetAxios().get(constants.Api_Url + 'Dashboard/GetNotifications?userId=' + userId + "&houseId=00000000-0000-0000-0000-000000000000" + "&kidId=" + kidId).then(res => {
            if (res.data.success) {
                setNotificationList(res.data.list);
                setCurrentPageAlert(1);
                setAlertCount(res.data.list.length);

            }
        })
    };

    const handleAlertFormSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        setSubmitLoading(true);
        const formattedDate = moment(alertGetValues("date")).format('YYYY-MM-DDTHH:mm:ss');

        console.log(alertGetValues())
        const formData = new FormData();
        formData.append('kidId', kidId ?? "");
        formData.append('userId', userId ?? "");
        formData.append('title', alertGetValues("title"));
        formData.append('severity', alertGetValues("severity"));
        formData.append('date', formattedDate);
        formData.append('isKid', "1");
        GetAxios().post(constants.Api_Url + 'Dashboard/CreateAlert', formData)
            .then(res => {
                setSubmitLoading(false);
                if (res.data.success) {
                    enqueueSnackbar("Form was successfully submitted.", {
                        variant: 'success', style: { backgroundColor: '#5f22d8' },
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawerAlert(false, "Alert");
                    getNotificationList();
                    incidentReset();
                    setOpenAlertForm(false);
                    // setLogUpdate(logUpdate + 1);
                } else {
                    console.warn(res);
                    enqueueSnackbar("Unable to save alert.", {
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

    };

    // const getKidListHouse = () => {
    //     GetAxios().get(constants.Api_Url + 'House/GetHouseKids?houseId=' + houseId).then(res => {
    //         if (res.data.success) {

    //             console.log(res)
    //             setKidListHouse(res.data.list);
    //         }
    //     })
    // };
    const [listVisibleKidId, setListVisibleKidId] = useState<string | null>(null);
    const [listAnchor, setListAnchor] = useState<{ top: number; left: number } | null>(null);

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
    return (
        <>
            <Container fluid-sm>
                <PageHeading style={{ color: "#2a0560" }}>
                    {kidDetail?.preferredName || kidDetail?.name}
                    <br />

                </PageHeading>
                <GreenTextLabel >
                    {kidDetail?.houseName}
                </GreenTextLabel>
                <Grid className='mb-4' container spacing={5}>
                    <Grid item xs={12} md={7}>
                        <DashboardCardBgGreen className="mb-1">
                            <DashboardCardBgGreenChildDiv>

                                <ImgParentDivLg>
                                    <input
                                        className="hidden d-none"
                                        id='logo-input' ref={(r) => { myref = r }} type='file' onChange={onFileSelected}
                                    />
                                    <img src={picture} className="userLogoKids" onClick={handleBrowse} />

                                </ImgParentDivLg>


                                <DashboardCardBgGreenChildDivCol>
                                    <DashboardCardBgGreenChildDivCol2>
                                        <GreenTextLabel >
                                            {kidDetail?.roomName || "No Room"}
                                        </GreenTextLabel>
                                        <GreenTextLabelSmall>
                                            Room
                                        </GreenTextLabelSmall>
                                    </DashboardCardBgGreenChildDivCol2>
                                    <DashboardCardBgGreenChildDivCol2>
                                        <GreenTextLabel>
                                            {kidDetail?.dateofBirth || ""}
                                        </GreenTextLabel>
                                        <GreenTextLabelSmall>
                                            Date of Birth
                                        </GreenTextLabelSmall>
                                    </DashboardCardBgGreenChildDivCol2>
                                    <DashboardCardBgGreenChildDivCol2>
                                        <GreenTextLabel>
                                            {kidDetail?.phone || "Unknown"}
                                        </GreenTextLabel>
                                        <GreenTextLabelSmall>
                                            Contact No.
                                        </GreenTextLabelSmall>
                                    </DashboardCardBgGreenChildDivCol2>
                                </DashboardCardBgGreenChildDivCol>

                            </DashboardCardBgGreenChildDiv>
                            <Greenbtndiv onClick={toggleDrawer(true, "MoveKid", "")}>
                                <IconButton>
                                    <MeetingRoom sx={{ color: "#0AB472" }} />
                                </IconButton>
                            </Greenbtndiv>
                        </DashboardCardBgGreen>
                    </Grid>
                    {kidDetail?.status != "MOVED_OUT" &&
                        <Grid item xs={12} md={5}>

                            <DashboardCard>
                                <DisplayBetween>

                                    <DisplayBetween>
                                        <ImgParentDivSmall>
                                            {kidDetail?.locationStatus !== "" && kidDetail?.locationStatus != undefined ? kidDetail?.locationStatus ?? "".substring(0, 1).toUpperCase() : "HA"}

                                        </ImgParentDivSmall>
                                        <div>
                                            <TitleCard style={{ color: "#2a0560" }}>
                                                {kidDetail?.locationStatus ?? "Home"}
                                            </TitleCard>
                                            <SmallTitleCard>
                                                {kidDetail?.missingNoteTime}
                                            </SmallTitleCard>
                                        </div>

                                    </DisplayBetween>
                                    <div>
                                        <div onClick={(e) => handleShowList(kidDetail?.id ?? "", e)}>
                                            <ExpandLess className="text-dark" />
                                        </div>
                                        <div onClick={(e) => handleShowList(kidDetail?.id ?? "", e)}>
                                            <ExpandMore className="text-dark" />
                                        </div>
                                    </div>
                                </DisplayBetween>


                            </DashboardCard>

                            {listVisibleKidId === kidDetail?.id && listAnchor && (
                                <List
                                   id="kid-action-list"
            style={{
                cursor: "pointer",
                position: "absolute",
                top: listAnchor.top,
                left: listAnchor.left,
                background: "white",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
            }}
                                >
                                    <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", "HOME")}>At Home</ListItem>
                                    <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", "MISSING")}>Missing</ListItem>
                                    <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", "UNAUTHORISED")}>UnAuthorised</ListItem>
                                    <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", "AUTHORISED")}>Authorised</ListItem>
                                    <ListItem className="cursor-pointer" onClick={toggleDrawer(true, "KidLocation", "OUT")}>Out</ListItem>

                                </List>
                            )}

                            <div className="d-flex align-items-center justify-content-between">
                                <AlertHeading style={{ color: "#2a0560" }}>
                                    Alerts
                                </AlertHeading>
                                <Link to="">
                                    {/* <IconButton className='headerIcon' onClick={toggleDrawer(true, "Alert")}>
                                    <Icon>  <AddIcon className='text-body-tertiary iconHeight' /></Icon>
                                </IconButton> */}


                                    <PlusButton onClick={toggleDrawer(true, "Alert", "")}>
                                        <AddIcon className="d-flex" />
                                    </PlusButton>
                                </Link>
                            </div>
                            <GreyBox className="mt-1">




                                <Box>
                                    {notificationList != undefined && notificationList.length > 0 &&
                                        <>

                                            {(notificationList || []).slice((currentPageAlert - 1) * PAGE_SIZE, currentPageAlert * PAGE_SIZE).map((item: NotificationListModel, index: any) => {
                                                return (
                                                    <div>
                                                        {item.severity === "HIGH" ? (
                                                            <Alert style={{ backgroundColor: "#ff5757", width: "500px" }} severity="success" icon={false} className='d-block mb-3' key={(currentPage - 1) * 2 + index + 1} onClick={toggleDrawerViewAlert("true", item.id)}>
                                                                <div className='d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <IconButton sx={{ marginLeft: "20px" }}>
                                                                            <ReportGmailerrorredIcon />
                                                                        </IconButton>
                                                                    </div>

                                                                    <div >
                                                                        <label className="mb-0">
                                                                            {item.title}
                                                                        </label>
                                                                    </div>
                                                                    <div>
                                                                        <label className="fw-bold fs-7">
                                                                            {item.description}
                                                                        </label>
                                                                    </div>
                                                                    <div>
                                                                        <label className="fw-bold fs-7">
                                                                            {item.timeAgo}
                                                                        </label>
                                                                    </div>

                                                                </div>
                                                            </Alert>
                                                        ) : (
                                                            <Alert style={{ backgroundColor: "orange", width: "500px" }} severity="success" icon={false} className='d-block mb-3' key={(currentPage - 1) * 2 + index + 1} onClick={toggleDrawerViewAlert("true", item.id)}>
                                                                <div className='d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <IconButton sx={{ marginLeft: "20px" }}>
                                                                            <WarningAmberIcon />
                                                                        </IconButton>
                                                                    </div>

                                                                    <div >
                                                                        <label className="mb-0">
                                                                            {item.title}
                                                                        </label>
                                                                    </div>
                                                                    <div>
                                                                        <label className="fw-bold fs-7">
                                                                            {item.description}
                                                                        </label>
                                                                    </div>
                                                                    <div>
                                                                        <label className="fw-bold fs-7">
                                                                            {item.timeAgo}
                                                                        </label>
                                                                    </div>

                                                                </div>
                                                            </Alert>
                                                        )}




                                                    </div>

                                                );
                                            })}
                                            <Stack spacing={2}>

                                                <Pagination count={AlertPageCount} page={currentPageAlert} onChange={(event: any, page: number) => { setCurrentPageAlert(page) }} />

                                            </Stack>
                                        </>}

                                    {notificationList == undefined || notificationList.length == 0 &&
                                        <> <GreyBox><GreyBoxHeadingParent>
                                            <div className='svgWidth'>
                                                <svg id="b21613c9-2bf0-4d37-bef0-3b193d34fc5d" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="647.63626" height="632.17383" viewBox="0 0 647.63626 632.17383"><path d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z" transform="translate(-276.18187 -133.91309)" fill="#f2f2f2"></path><path d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="190.15351" cy="24.95465" r="20" fill="#0AB472"></circle><circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff"></circle><path d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z" transform="translate(-276.18187 -133.91309)" fill="#e6e6e6"></path><path d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="433.63626" cy="105.17383" r="20" fill="#0AB472"></circle><circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff"></circle></svg>
                                            </div>
                                            <GreyBoxHeading>
                                                No Alerts
                                            </GreyBoxHeading>
                                            <GreyBoxDesc>
                                                If there should be an alert, try creating one. Otherwise, kick back and relax.
                                            </GreyBoxDesc>
                                        </GreyBoxHeadingParent></GreyBox></>
                                    }

                                </Box>

                            </GreyBox>
                            <div className="d-flex justify-content-end mt-1">
                                <Stack spacing={2}>
                                    <Pagination count={0} />
                                </Stack>


                            </div>
                        </Grid>
                    }

                    {kidDetail?.status?.trim() == "NEW" &&
                        <Grid item xs={12} md={5}>
                            <MoveInDiv onClick={toggleDrawer(true, "MoveInKid", "")}>
                                <FlexBetween>
                                    <MoveInlbl style={{ color: "#2a0560" }}>
                                        Move In
                                    </MoveInlbl>
                                    <IconButton>
                                        <ChevronRightIcon className="text-dark" />
                                    </IconButton>
                                </FlexBetween>
                            </MoveInDiv>
                        </Grid>
                    }
                    {kidDetail?.status?.trim() == "IN_HOME" &&
                        <> <Grid item xs={12} md={5}>
                            <MoveInDiv onClick={toggleDrawer(true, "Recording", "")}>
                                <FlexBetween>
                                    <MoveInlbl style={{ color: "#2a0560" }}>
                                        Kid Recording
                                    </MoveInlbl>
                                    <IconButton>
                                        <ChevronRightIcon className="text-dark" />
                                    </IconButton>
                                </FlexBetween>
                            </MoveInDiv>
                        </Grid> <Grid item xs={12} md={5}>
                                <MoveInDiv onClick={toggleDrawer(true, "Spin", "")}>
                                    <FlexBetween>
                                        <MoveInlbl style={{ color: "#2a0560" }}>
                                            Spin Session
                                        </MoveInlbl>
                                        <IconButton>
                                            <ChevronRightIcon className="text-dark" />
                                        </IconButton>
                                    </FlexBetween>
                                </MoveInDiv>
                            </Grid> <Grid item xs={12} md={5}>
                                <MoveInDiv onClick={toggleDrawer(true, "Coaching", "")}>
                                    <FlexBetween>
                                        <MoveInlbl style={{ color: "#2a0560" }}>
                                            Coaching Session
                                        </MoveInlbl>
                                        <IconButton>
                                            <ChevronRightIcon className="text-dark" />
                                        </IconButton>
                                    </FlexBetween>
                                </MoveInDiv>
                            </Grid>  <Grid item xs={12} md={5}>
                                <MoveInDiv onClick={toggleDrawer(true, "Incident", "")}>
                                    <FlexBetween>
                                        <MoveInlbl style={{ color: "#2a0560" }}>
                                            Record Incident
                                        </MoveInlbl>
                                        <IconButton>
                                            <ChevronRightIcon className="text-dark" />
                                        </IconButton>
                                    </FlexBetween>
                                </MoveInDiv>
                            </Grid> <Grid item xs={12} md={5}>
                                <MoveInDiv onClick={toggleDrawer(true, "Note", "")}>
                                    <FlexBetween>
                                        <MoveInlbl style={{ color: "#2a0560" }}>
                                            General Note
                                        </MoveInlbl>
                                        <IconButton>
                                            <ChevronRightIcon className="text-dark" />
                                        </IconButton>
                                    </FlexBetween>
                                </MoveInDiv>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <MoveInDiv onClick={toggleDrawer(true, "Payment", "")}>
                                    <FlexBetween>
                                        <MoveInlbl style={{ color: "#2a0560" }}>
                                            Kid Payment
                                        </MoveInlbl>
                                        <IconButton>
                                            <ChevronRightIcon className="text-dark" />
                                        </IconButton>
                                    </FlexBetween>
                                </MoveInDiv>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <MoveInDiv onClick={toggleDrawer(true, "ProContact", "")}>
                                    <FlexBetween>
                                        <MoveInlbl style={{ color: "#2a0560" }}>
                                            Professional Contact
                                        </MoveInlbl>
                                        <IconButton>
                                            <ChevronRightIcon className="text-dark" />
                                        </IconButton>
                                    </FlexBetween>
                                </MoveInDiv>
                            </Grid>
                        </>

                    }
                    {
                        ((userRole.trim() === 'ADMIN' || userRole.trim() === 'HOUSE_MANAGER') && kidDetail?.status.trim() !== 'MOVED_OUT') &&
                        <Grid item xs={12} md={5}>
                            <MoveInDiv onClick={toggleDrawer(true, "MoveOut", "")}>
                                <FlexBetween>
                                    <MoveInlbl style={{ color: "#2a0560" }}>
                                        Move Out
                                    </MoveInlbl>
                                    <IconButton>
                                        <ChevronRightIcon className="text-dark" />
                                    </IconButton>
                                </FlexBetween>
                            </MoveInDiv>
                        </Grid>
                    }
                    {
                        kidDetail?.status.trim() == 'MOVED_OUT' &&
                        <Grid item xs={12} md={5}>
                            <MoveInDiv onClick={toggleDrawer(true, "Note", "")}>
                                <FlexBetween>
                                    <MoveInlbl style={{ color: "#2a0560" }}>
                                        General Note
                                    </MoveInlbl>
                                    <IconButton>
                                        <ChevronRightIcon className="text-dark" />
                                    </IconButton>
                                </FlexBetween>
                            </MoveInDiv>
                        </Grid>
                    }
                    <Grid item xs={12} md={12}>
                        {/* <Tabs value={value} onChange={handleChange} indicatorColor="primary"
                            textColor="primary" aria-label="Choose between displaying the young person's details and files.">


                            <Tab label="TASK" {...a11yProps(0)} />
                            <Tab label="DETAILS" {...a11yProps(1)} />
                            <Tab label="ACTIVITY" {...a11yProps(2)} />
                            <Tab label="FILES" {...a11yProps(3)} />
                        </Tabs> */}


                        <Tabs value={value}
                            onChange={handleChange}
                            sx={{
                                "& button": { borderRadius: 2.5 },
                                "& button:hover": { backgroundColor: '#2a0560', color: "white" },
                                "& button:active": { color: 'white;', backgroundColor: '#2a0560' },
                                "& button.Mui-selected": { color: 'white;', backgroundColor: '#2a0560' }
                            }}
                            aria-label="Choose between displaying the young person's details and files."
                        >





                            <Tab label="TASK" {...a11yProps(0)} />
                            <Tab label="DETAILS" {...a11yProps(1)} />
                            <Tab label="ACTIVITY" {...a11yProps(2)} />
                            <Tab label="FILES" {...a11yProps(3)} />
                        </Tabs>



                        <CustomTabPanel value={value} index={0}>
                            {kidDetail?.id && (
                                <KidTaskTab
                                    kidId={kidDetail.id}
                                    houseId={kidDetail.houseId}
                                    status={kidDetail.status}
                                    title={`${kidDetail.name}'${kidDetail?.name?.substring(
                                        kidDetail?.name.length - 1
                                    ) === 's'
                                        ? ''
                                        : 's'
                                        } Tasks`}
                                />
                            )}
                        </CustomTabPanel>

                        <CustomTabPanel value={value} index={1}>
                            <KidProfileTab chooseMessage={chooseMessage} />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
                            <ActivityLogTab kidId={kidDetail?.id} message={message} />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={3}>
                            {kidDetail?.id && (
                                <FileTab
                                    context="kid"
                                    kidId={kidDetail?.id}
                                    houseId={kidDetail?.houseId}
                                />
                            )}
                        </CustomTabPanel>
                        {/* <Route path={`${path}/tasks/group/:group`}>
                                <TaskGroupViewTab />
                            </Route> */}
                        {/* <Redirect to={`${path}/tasks`} /> */}

                    </Grid>

                    <Drawer className="Mui-Drawe-w" anchor="right" open={openKidMoveHouse} onClose={toggleDrawer(false, "MoveKid", "")}>
                        <AppForm onSubmit={handleMoveKidFormSubmit}>
                            <Box>
                                <DrawerHeadingParent>
                                    <DrawerHeading style={{ color: "#2a0560" }}>Move Young Person</DrawerHeading>
                                </DrawerHeadingParent>
                                <DrawerBody>
                                    <div style={{
                                        padding: "2.5rem", width: "100%"

                                    }}>
                                        <FormControl variant="standard" fullWidth className="mb-2">
                                            <InputLabel id="demo-simple-select-standard-label">Homes:*</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-standard-label2"
                                                id="demo-simple-select-standard2"
                                                error={!!kidmovehouseError.houseId}
                                                {...kidmovehouseRegister("houseId", { required: true })}
                                                value={kidmovehouseWatch("houseId")}
                                                onChange={(event) => { getRoomList(event.target.value); kidmovehouseSetValue("houseId", event.target.value) }}
                                            >


                                                {(houseList || []).map((item: HouseListModel, index: any) => {
                                                    return (
                                                        <MenuItem key={"house_" + item.id} value={item.id}>{item.name}</MenuItem>

                                                    );
                                                })}

                                            </Select>

                                            <FormHelperText>
                                                {kidmovehouseError.houseId?.message}
                                            </FormHelperText>

                                        </FormControl>
                                        {kidmovehouseWatch("houseId") && (
                                            <FormControl variant="standard" fullWidth className="mb-2">
                                                <InputLabel id="demo-simple-select-standard-label">Room:*</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-standard-label2"
                                                    id="demo-simple-select-standard2"
                                                    error={!!kidmovehouseError.roomId}
                                                    {...kidmovehouseRegister("roomId", { required: true })}
                                                    value={kidmovehouseWatch("roomId")}
                                                >
                                                    {(roomList || []).map((item: SelectList, index: any) => {
                                                        return (
                                                            <MenuItem key={"houseRoom_" + index + item.key} value={item.key}>{item.value}</MenuItem>

                                                        );
                                                    })}

                                                </Select>
                                                <FormHelperText>
                                                    {kidmovehouseError.roomId?.message}
                                                </FormHelperText>

                                            </FormControl>)}
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between" style={{
                                        padding: "2.5rem", width: "100%"
                                    }}>
                                        <Button variant="text" color="inherit" onClick={toggleDrawer(false, "MoveKid", "")}>
                                            Cancel
                                        </Button>
                                        <Button variant="text" color="inherit" onClick={() => {
                                            window?.print();
                                        }}>
                                            Print
                                        </Button>
                                        <AppButton type="submit" className='btnLogin' disabled={!kidmovehouseIsValid} >
                                            {!kidmovehouseSubmitting ?
                                                'Submit'
                                                : (
                                                    <CircularProgress size={24} />
                                                )}
                                        </AppButton>

                                    </div>
                                </DrawerBody>
                            </Box>;
                        </AppForm>
                    </Drawer>
                    <Drawer className="Mui-Drawe-w" anchor="right" open={openKidMoveIn} onClose={toggleDrawer(false, "MoveInKid", "")}>
                        <AppForm onSubmit={handleMoveInKidFormSubmit}>
                            <Box>
                                <DrawerHeadingParent>
                                    <DrawerHeading style={{ color: "#2a0560" }}>Move In</DrawerHeading>
                                </DrawerHeadingParent>
                                <DrawerBody>
                                    <div style={{
                                        padding: "2.5rem", width: "100%"

                                    }}>
                                        <FormControl variant="standard" fullWidth className="mb-2">
                                            <InputLabel id="demo-simple-select-standard-label">Status:*</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-standard-label2"
                                                id="demo-simple-select-standard2"
                                                error={!!kidmoveinError.status}
                                                {...kidmoveinRegister("status", { required: true })}
                                                value={kidmoveinWatch("status")}
                                            >

                                                <MenuItem key={"status_A"} value="IN_HOME">Approved</MenuItem>
                                                <MenuItem key={"status_d"} value="DECLINED">Declined</MenuItem>

                                            </Select>

                                            <FormHelperText>
                                                {kidmoveinError.status?.message}
                                            </FormHelperText>

                                        </FormControl>
                                        {
                                            kidmoveinWatch("status") == "IN_HOME" &&

                                            <>
                                                <InputLabel id="kidSpinDate" >Move In Date::*</InputLabel>
                                                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                                                    <DateTimePicker
                                                        onChange={(event: any) => { kidmoveinSetValue("moveInDate", event) }}
                                                        format="MM/dd/yyyy HH:mm"
                                                        value={kidmoveinWatch("moveInDate")}
                                                        clearIcon={null}

                                                        required
                                                    />
                                                    <FormHelperText style={{ color: "Red" }} >
                                                        {kidmoveinError.moveInDate?.message}
                                                    </FormHelperText>
                                                </div>

                                                <FormControl variant="standard" fullWidth className="mb-2">
                                                    <InputLabel id="demo-simple-select-standard-label">Homes:*</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-standard-label2"
                                                        id="demo-simple-select-standard2"
                                                        error={!!kidmovehouseError.houseId}
                                                        {...kidmovehouseRegister("houseId", { required: true })}
                                                        value={kidmovehouseWatch("houseId")}
                                                        onChange={(event) => { getRoomList(event.target.value); kidmovehouseSetValue("houseId", event.target.value) }}

                                                    >

                                                        {(houseList || []).map((item: HouseListModel, index: any) => {
                                                            return (
                                                                <MenuItem key={"house_" + item.id} value={item.id}>{item.name}</MenuItem>

                                                            );
                                                        })}

                                                    </Select>
                                                    <FormHelperText style={{ color: "Red" }} >
                                                        {kidmoveinError.houseId?.message}
                                                    </FormHelperText>
                                                </FormControl>
                                                {kidmovehouseWatch("houseId") &&
                                                    <FormControl variant="standard" fullWidth className="mb-2">
                                                        <InputLabel id="demo-simple-select-standard-label">Room:*</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-standard-label2"
                                                            id="demo-simple-select-standard2"
                                                            error={!!kidmoveinError.roomId}
                                                            {...kidmoveinRegister("roomId", { required: true })}
                                                            value={kidmoveinWatch("roomId")}
                                                        >
                                                            {(roomList || []).map((item: SelectList, index: any) => {
                                                                return (
                                                                    <MenuItem key={"housemRoom_" + index + item.key} value={item.key}>{item.value}</MenuItem>

                                                                );
                                                            })}

                                                        </Select>
                                                        <FormHelperText style={{ color: "Red" }} >
                                                            {kidmoveinError.roomId?.message}
                                                        </FormHelperText>
                                                    </FormControl>
                                                }

                                            </>
                                        }

                                    </div>
                                    <div className="d-flex align-items-center justify-content-between" style={{
                                        padding: "2.5rem", width: "100%"
                                    }}>
                                        <Button variant="text" color="inherit" onClick={toggleDrawer(false, "MoveInKid", "")}>
                                            Cancel
                                        </Button>
                                        <Button variant="text" color="inherit" onClick={() => {
                                            window?.print();
                                        }}>
                                            Print
                                        </Button>
                                        <AppButton type="submit" className='btnLogin' disabled={!kidmoveinIsValid} >
                                            {!kidmoveinSubmitting ?
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
                    <Drawer className="Mui-Drawe-w" anchor="right" open={openKidLocation} onClose={toggleDrawer(false, "KidLocation", "HOME")}>
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
                                        <Button variant="text" color="inherit" onClick={toggleDrawer(false, "KidLocation", "HOME")}>
                                            Cancel
                                        </Button>
                                        <Button variant="text" color="inherit" onClick={() => {
                                            window?.print();
                                        }}>
                                            Print
                                        </Button>
                                        <AppButton type="submit" className='btnLogin' disabled={!whereaboutIsValid} >
                                            {!whereaboutSubmitting ?
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
                    <Drawer className="Mui-Drawe-w" anchor="right" open={openKidRecording} onClose={toggleDrawer(false, "Recording", "")}>
                        <AppForm onSubmit={handleRecordingFormSubmit}>
                            <Box>
                                <DrawerHeadingParent>
                                    <DrawerHeading style={{ color: "#2a0560" }}> Kid Recording</DrawerHeading>
                                </DrawerHeadingParent>
                                <DrawerBody>
                                    <div style={{
                                        padding: "2.5rem", width: "100%"

                                    }}>
                                        <InputLabel id="kidRecordingDate" >Date:*</InputLabel>
                                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                                            <DateTimePicker
                                                onChange={(event: any) => { recordingSetValue("date", event) }}
                                                format="MM/dd/yyyy HH:mm"
                                                value={recordingWatch("date")}
                                                clearIcon={null}

                                                required
                                            />
                                            <FormHelperText style={{ color: "Red" }} >
                                                {recordingError.date?.message}
                                            </FormHelperText>
                                        </div>

                                        <TextField id="kidInicidentNumber" className="mb-4" fullWidth label="Note:*" variant="standard"
                                            {...recordingRegister("note", { required: { value: true, message: "Required" } })}
                                            error={!!recordingError.note}
                                            helperText={recordingError.note?.message}
                                        />


                                    </div>
                                    <div className="d-flex align-items-center justify-content-between" style={{
                                        padding: "2.5rem", width: "100%"
                                    }}>
                                        <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Recording", "")}>
                                            Cancel
                                        </Button>
                                        <Button variant="text" color="inherit" onClick={onhandlePrint}>
                                            Print
                                        </Button>

                                        <AppButton type="submit" color="#2a0560" className='btnLogin' disabled={!recordingIsValid} >
                                            {!recordingSubmitting ?
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
                    <Drawer className="Mui-Drawe-w" anchor="right" open={openKidNote} onClose={toggleDrawer(false, "Note", "")}>
                        <AppForm onSubmit={handleNoteFormSubmit}>
                            <Box>
                                <DrawerHeadingParent>
                                    <DrawerHeading> General Note</DrawerHeading>
                                </DrawerHeadingParent>
                                <DrawerBody>
                                    <div style={{
                                        padding: "2.5rem", width: "100%"

                                    }}>


                                        <FormControl variant="standard" fullWidth className="mb-5">
                                            <InputLabel id="houseLabel">Homes:*</InputLabel>

                                            <Select
                                                labelId="houseNoteLabel"
                                                id="houseNoteLabelHouseselect"
                                                error={!!noteError.houseId}
                                                {...noteRegister('houseId', { required: true })}
                                                value={noteWatch("houseId")}

                                            >
                                                {(houseList || []).map((item: HouseListModel, index: any) => {
                                                    return (
                                                        <MenuItem key={"house_" + item.id} value={item.id}>{item.name}</MenuItem>

                                                    );
                                                })}

                                            </Select>
                                            <FormHelperText style={{ color: "Red" }}>
                                                {noteError.kidId?.message}
                                            </FormHelperText>
                                        </FormControl>
                                        <InputLabel id="kidRecordingDate" >Date:*</InputLabel>
                                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                                            <DateTimePicker
                                                onChange={(event: any) => { noteSetValue("date", event) }}
                                                format="MM/dd/yyyy HH:mm"
                                                value={noteWatch("date")}
                                                clearIcon={null}

                                                required
                                            />
                                            <FormHelperText style={{ color: "Red" }} >
                                                {recordingError.date?.message}
                                            </FormHelperText>
                                        </div>

                                        <TextField id="kidInicidentNumber" className="mb-4" fullWidth label="Note:*" variant="standard"
                                            {...noteRegister("note", { required: { value: true, message: "Required" } })}
                                            error={!!noteError.note}
                                            helperText={noteError.note?.message}
                                        />

                                        <GreyBoxDesc>If no kid is selected, a note will be added against House.</GreyBoxDesc>

                                    </div>
                                    <div className="d-flex align-items-center justify-content-between" style={{
                                        padding: "2.5rem", width: "100%"
                                    }}>
                                        <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Note", "")}>
                                            Cancel
                                        </Button>
                                        <Button variant="text" color="inherit" onClick={onhandlePrint}>
                                            Print
                                        </Button>

                                        {/* <AppButton type="submit" className='btnLogin' disabled={!noteFormValid()} >
                                                {!submitLoading ?
                                                    'Submit'
                                                    : (
                                                        <CircularProgress size={24} />
                                                    )}
                                            </AppButton> */}


                                        <AppButton type="submit" className='btnLogin' disabled={!noteIsValid}>
                                            {!noteSubmitting ?
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
                    <Drawer className="Mui-Drawe-w" anchor="right" open={openKidPayment} onClose={toggleDrawer(false, "Payment", "")}>
                        <AppForm onSubmit={handlePaymentFormSubmit}>
                            <Box>
                                <DrawerHeadingParent>
                                    <DrawerHeading> Kid Payment</DrawerHeading>
                                </DrawerHeadingParent>
                                <DrawerBody>
                                    <div style={{
                                        padding: "2.5rem", width: "100%"

                                    }}>

                                        <InputLabel id="kidRecordingDate" >Date:*</InputLabel>
                                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                                            <DateTimePicker
                                                onChange={(event: any) => { paymentSetValue("date", event) }}
                                                format="MM/dd/yyyy HH:mm"
                                                value={paymentWatch("date")}
                                                clearIcon={null}

                                                required
                                            />
                                            <FormHelperText style={{ color: "Red" }} >
                                                {paymentError.date?.message}
                                            </FormHelperText>
                                        </div>

                                        <TextField id="kidInicidentNumber" className="mb-4" fullWidth label="Amount:*" variant="standard"
                                            {...paymentRegister("amount", { required: { value: true, message: "Required" } })}
                                            error={!!paymentError.amount}
                                            helperText={paymentError.amount?.message}
                                        />


                                    </div>
                                    <div className="d-flex align-items-center justify-content-between" style={{
                                        padding: "2.5rem", width: "100%"
                                    }}>
                                        <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Payment", "")}>
                                            Cancel
                                        </Button>
                                        <Button variant="text" color="inherit" onClick={onhandlePrint}>
                                            Print
                                        </Button>
                                        <AppButton type="submit" className='btnLogin' disabled={!paymentIsValid} >
                                            {!paymentSubmitting ?
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

                    <Drawer className="Mui-Drawe-w" anchor="right" open={openKidMoveOut} onClose={toggleDrawer(false, "MoveOut", "")}>
                        <AppForm onSubmit={handleMoveOutFormSubmit}>
                            <Box>
                                <DrawerHeadingParent>
                                    <DrawerHeading style={{ color: "#2a0560" }}> Move Out</DrawerHeading>
                                </DrawerHeadingParent>
                                <DrawerBody>
                                    <div style={{
                                        padding: "2.5rem", width: "100%"

                                    }}> <InputLabel id="kidRecordingDate" >Date:*</InputLabel>
                                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                                            <DateTimePicker
                                                onChange={(event: any) => { moveoutSetValue("date", event) }}
                                                format="MM/dd/yyyy HH:mm"
                                                value={moveoutWatch("date")}
                                                clearIcon={null}

                                                required
                                            />
                                            <FormHelperText style={{ color: "Red" }} >
                                                {moveoutError.date?.message}
                                            </FormHelperText>
                                        </div>


                                        <TextField id="moveoutnote"  {...moveoutRegister("note", { required: true })} className="mb-4" fullWidth label="Reason for Leaving" variant="standard" error={!!moveoutError.note}
                                            helperText={moveoutError.note?.message} />


                                    </div>
                                    <div className="d-flex align-items-center justify-content-between" style={{
                                        padding: "2.5rem", width: "100%"
                                    }}>
                                        <Button variant="text" color="inherit" onClick={toggleDrawer(false, "MoveOut", "")}>
                                            Cancel
                                        </Button>
                                        <Button variant="text" color="inherit" onClick={() => {
                                            window?.print();
                                        }}>
                                            Print
                                        </Button>

                                        <AppButton type="submit" className='btnLogin' disabled={!moveoutIsValid} >
                                            {!moveoutSubmitting ?
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
                    <Drawer className="Mui-Drawe-w" anchor="right" open={openKidProContact} onClose={toggleDrawer(false, "ProContact", "")}>
                        <AppForm onSubmit={handleProContactFormSubmit}>
                            <Box>
                                <DrawerHeadingParent>
                                    <DrawerHeading style={{ color: "#2a0560" }}> Professional Contact</DrawerHeading>
                                </DrawerHeadingParent>
                                <DrawerBody>
                                    <div style={{
                                        padding: "2.5rem", width: "100%"

                                    }}>
                                        <InputLabel id="kidRecordingDate" >Date:*</InputLabel>
                                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                                            <DateTimePicker
                                                onChange={(event: any) => { proContactSetValue("date", event) }}
                                                format="MM/dd/yyyy HH:mm"
                                                value={proContactWatch("date")}
                                                clearIcon={null}

                                                required
                                            />
                                            <FormHelperText style={{ color: "Red" }} >
                                                {proContactError.date?.message}
                                            </FormHelperText>
                                        </div>


                                        <FormControl variant="standard" fullWidth className="mb-5">
                                            <InputLabel id="ProtypeLabel">Type:*</InputLabel>
                                            <Select
                                                labelId="ProtypeLabel"
                                                id="Protypeselect"
                                                placeholder="Type:*"
                                                label="Type:*"
                                                {...proContactRegister("type", { required: true })}
                                                error={!!proContactError.type}

                                            >
                                                {(contactType || []).map((item: any, index: any) => {
                                                    return (
                                                        <MenuItem key={"type_" + index + 3} value={item.value}>{item.copy}</MenuItem>

                                                    );
                                                })}

                                            </Select>

                                            <FormHelperText style={{ color: "Red" }}>
                                                {proContactError.type?.message}
                                            </FormHelperText>

                                        </FormControl>
                                        <TextField id="proFrom" className="mb-4" fullWidth label="From: *" variant="standard"
                                            {...proContactRegister("from", { required: true })}
                                            error={!!proContactError.from}
                                            helperText={proContactError.from?.message} />
                                        <TextField id="proTo" className="mb-4" fullWidth label="To: *" variant="standard"
                                            {...proContactRegister("to", { required: true })}
                                            error={!!proContactError.to}
                                            helperText={proContactError.to?.message} />
                                        <TextField id="proNote" className="mb-4" fullWidth label="Note: *" variant="standard"
                                            {...proContactRegister("note", { required: true })}
                                            error={!!proContactError.note}
                                            helperText={proContactError.note?.message} />

                                    </div>
                                    <div className="d-flex align-items-center justify-content-between" style={{
                                        padding: "2.5rem", width: "100%"
                                    }}>
                                        <Button variant="text" color="inherit" onClick={toggleDrawer(false, "ProContact", "")}>
                                            Cancel
                                        </Button>
                                        <Button variant="text" color="inherit" onClick={() => {
                                            window?.print();
                                        }}>
                                            Print
                                        </Button>

                                        <AppButton type="submit" className='btnLogin' disabled={!proContactIsValid} >
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
                    <Drawer className="Mui-Drawe-w" anchor="right" open={openSpinSession} onClose={toggleDrawer(false, "Spin", "")}>
                        <AppForm onSubmit={handleSpinFormSubmit}>
                            <Box>
                                <DrawerHeadingParent>
                                    <DrawerHeading style={{ color: "#2a0560" }}> Spin Session Step {spinstep} of {maxspinstep}</DrawerHeading>

                                </DrawerHeadingParent>
                                <DrawerBody>
                                    <div style={{
                                        padding: "2.5rem", width: "100%"

                                    }}>
                                        {spinstep === 1 && (
                                            <>

                                                <InputLabel id="kidSpinDate" >Date:*</InputLabel>
                                                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                                                    <DateTimePicker
                                                        onChange={(event: any) => { spinSetValue("date", event) }}
                                                        format="MM/dd/yyyy HH:mm"
                                                        value={spinWatch("date")}
                                                        clearIcon={null}

                                                        required
                                                    />
                                                    <FormHelperText style={{ color: "Red" }} >
                                                        {spinError.date?.message}
                                                    </FormHelperText>
                                                </div>
                                                <FormControl variant="standard" fullWidth className="mb-5">
                                                    <InputLabel id="kidSpinTRMLabel">TRM Level:*</InputLabel>
                                                    <Select
                                                        labelId="kidSpinTRMLabel"
                                                        id="kidSpinTRMselect"
                                                        {...spinRegister('trmLevel', { required: true })}
                                                        value={spinWatch("trmLevel")}
                                                        label="TRM Level:*"
                                                    >
                                                        <MenuItem key="kid_trm_level1" value="1">1</MenuItem>
                                                        <MenuItem key="kid_trm_level1.5" value="1.5">1/2</MenuItem>
                                                        <MenuItem key="kid_trm_level2" value="2">2</MenuItem>
                                                        <MenuItem key="kid_trm_level2.5" value="2.5">2/3</MenuItem>
                                                        <MenuItem key="kid_trm_level3" value="3">3</MenuItem>
                                                        <MenuItem key="kid_trm_level3.5" value="3.5">3/4</MenuItem>
                                                        <MenuItem key="kid_trm_level4" value="4">4</MenuItem>
                                                        <MenuItem key="kid_trm_level4.5" value="4.5">4/5</MenuItem>
                                                        <MenuItem key="kid_trm_level5" value="5">5</MenuItem>
                                                        <MenuItem key="kid_trm_level6" value="6">6</MenuItem>


                                                    </Select>

                                                    <FormHelperText style={{ color: "Red" }}>
                                                        {spinError.trmLevel?.message}
                                                    </FormHelperText>
                                                </FormControl>
                                                <FormControl variant="standard" fullWidth className="mb-5">
                                                    <InputLabel id="kidSpinTypeLabel">Spin Type:*</InputLabel>
                                                    <Select
                                                        labelId="kidSpinTypeLabel"
                                                        id="kidSpinTypeselect"
                                                        {...spinRegister('spinType', { required: true })}
                                                        value={spinWatch("spinType")}
                                                        label="Spin Type:*"
                                                    >
                                                        <MenuItem key="kid_spin_type_level1" value="Initial">Initial Spin</MenuItem>
                                                        <MenuItem key="kid_spin_type_level1.5" value="Review">Review Spin</MenuItem>
                                                        <MenuItem key="kid_spin_type_level2" value="Unscheduled">Unscheduled Spin</MenuItem>



                                                    </Select>
                                                    <FormHelperText style={{ color: "Red" }}>
                                                        {spinError.spinType?.message}
                                                    </FormHelperText>
                                                </FormControl>



                                                <TrmText level={Number(spinGetValues("spinType")) || 0
                                                }

                                                />

                                            </>)}
                                        {spinstep > 1 && (
                                            <>
                                                <TextField
                                                    id={"kidSpinPresent" + behaviourCount} className="mb-4" fullWidth
                                                    label={"Presenting Behaviour: *"} variant="standard" InputLabelProps={{ shrink: true }}
                                                    {...spinRegister(`behaviours.${behaviourCount - 1}.presentingBehaviour`, { required: true })}
                                                    error={!!spinError.behaviours?.[behaviourCount - 1]?.presentingBehaviour}
                                                    helperText={spinError.behaviours?.[behaviourCount - 1]?.presentingBehaviour?.message}
                                                />
                                                <TextField
                                                    id={"kidSpinPresent" + behaviourCount} className="mb-4" fullWidth
                                                    label="Intervention: *" variant="standard" InputLabelProps={{ shrink: true }}
                                                    {...spinRegister(`behaviours.${behaviourCount - 1}.intervention`, { required: true })}
                                                    error={!!spinError.behaviours?.[behaviourCount - 1]?.intervention}
                                                    helperText={spinError.behaviours?.[behaviourCount - 1]?.intervention?.message}
                                                />

                                                <TextField
                                                    id={"kidSpinPresent" + behaviourCount} className="mb-4" fullWidth
                                                    label="Need: *" variant="standard" InputLabelProps={{ shrink: true }}
                                                    {...spinRegister(`behaviours.${behaviourCount - 1}.need`, { required: true })}
                                                    error={!!spinError.behaviours?.[behaviourCount - 1]?.need}
                                                    helperText={spinError.behaviours?.[behaviourCount - 1]?.need?.message}
                                                />
                                                <TextField
                                                    id={"kidSpinPresent" + behaviourCount} className="mb-4" fullWidth
                                                    label="Support: *" variant="standard" InputLabelProps={{ shrink: true }}
                                                    {...spinRegister(`behaviours.${behaviourCount - 1}.support`, { required: true })}
                                                    error={!!spinError.behaviours?.[behaviourCount - 1]?.support}
                                                    helperText={spinError.behaviours?.[behaviourCount - 1]?.support?.message}
                                                />
                                                <TextField
                                                    id={"kidSpinPresent" + behaviourCount} className="mb-4" fullWidth
                                                    label="What's working well: *
                                                        : *" variant="standard" InputLabelProps={{ shrink: true }}
                                                    {...spinRegister(`behaviours.${behaviourCount - 1}.whatsWorkingWell`, { required: true })}
                                                    error={!!spinError.behaviours?.[behaviourCount - 1]?.whatsWorkingWell}
                                                    helperText={spinError.behaviours?.[behaviourCount - 1]?.whatsWorkingWell?.message}
                                                /> <TextField
                                                    id={"kidSpinPresent" + behaviourCount} className="mb-4" fullWidth
                                                    label="What's not working well: *
                                                        " variant="standard" InputLabelProps={{ shrink: true }}
                                                    {...spinRegister(`behaviours.${behaviourCount - 1}.whatsNotWorkingWell`, { required: true })}
                                                    error={!!spinError.behaviours?.[behaviourCount - 1]?.whatsNotWorkingWell}
                                                    helperText={spinError.behaviours?.[behaviourCount - 1]?.whatsNotWorkingWell?.message}
                                                /> <TextField
                                                    id={"kidSpinPresent" + behaviourCount} className="mb-4" fullWidth
                                                    label="What needs to happen: *
                                                        " variant="standard" InputLabelProps={{ shrink: true }}
                                                    {...spinRegister(`behaviours.${behaviourCount - 1}.whatNeedToHappen`, { required: true })}
                                                    error={!!spinError.behaviours?.[behaviourCount - 1]?.whatNeedToHappen}
                                                    helperText={spinError.behaviours?.[behaviourCount - 1]?.whatNeedToHappen?.message}
                                                />
                                            </>
                                        )}
                                        {spinstep > 1 && spinstep <= maxspinstep && (
                                            <FormControlLabel control={
                                                <Checkbox
                                                    checked={isChecked}
                                                    onChange={handleAddBehviour}
                                                    iconStyle={{ fill: 'red' }}
                                                    inputStyle={{ color: 'red' }}
                                                    style={{ color: 'green' }}
                                                />
                                            } label="Add Another Behaviour" onChange={handleAddBehviour} className='fontsize-11' />

                                        )}
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between" style={{
                                        padding: "2.5rem", width: "100%"
                                    }}>
                                        <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Spin", "")}>
                                            Cancel
                                        </Button>
                                        <Button variant="text" color="inherit" onClick={() => {
                                            window?.print();
                                        }}>
                                            Print
                                        </Button>

                                        {
                                            spinstep !== maxspinstep &&
                                            <AppButton type="button" className='btnLogin'

                                                onClick={(event) => {
                                                    setSpinStep(spinstep + 1);
                                                    if (maxspinstep > 2) {
                                                        console.log("handle next");
                                                        spinSessionform.setValue(`behaviours.${behaviourCount}.presentingBehaviour`, "");
                                                        spinSessionform.setValue(`behaviours.${behaviourCount}.intervention`, "");
                                                        spinSessionform.setValue(`behaviours.${behaviourCount}.need`, "");
                                                        spinSessionform.setValue(`behaviours.${behaviourCount}.support`, "");
                                                        spinSessionform.setValue(`behaviours.${behaviourCount}.whatsWorkingWell`, "");
                                                        spinSessionform.setValue(`behaviours.${behaviourCount}.whatsNotWorkingWell`, "");
                                                        spinSessionform.setValue(`behaviours.${behaviourCount}.whatNeedToHappen`, "");
                                                        setIsChecked(false);
                                                        setBehaviourCount(behaviourCount + 1); // Increment email count when moving to next step
                                                    }
                                                }}
                                            >
                                                Next
                                            </AppButton>

                                        }
                                        {
                                            spinstep === maxspinstep &&
                                            <AppButton type="submit" className='btnLogin'
                                                onClick={(event) => {
                                                    console.log("Button submitted clicked")
                                                    handleSpinFormSubmit(event);
                                                }}

                                            >
                                                {!spinSubmitting ?
                                                    'Submit'
                                                    : (
                                                        <CircularProgress size={24} />
                                                    )}
                                            </AppButton>

                                        }


                                    </div>
                                </DrawerBody>
                            </Box>
                        </AppForm>
                    </Drawer>
                    <Drawer className="Mui-Drawe-w" anchor="right" open={openKidCoaching} onClose={toggleDrawer(false, "Coaching", "")}>
                        <AppForm onSubmit={handleCoachingFormSubmit}>
                            <Box>
                                <DrawerHeadingParent>
                                    <DrawerHeading> Coaching Session  {coachingstep} of {maxcoachstep}</DrawerHeading>
                                </DrawerHeadingParent>
                                <DrawerBody>
                                    <div style={{
                                        padding: "2.5rem", width: "100%"

                                    }}>
                                        {coachingstep === 1 && (
                                            <>


                                                <InputLabel id="kidRecordingDate" >Date:*</InputLabel>
                                                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                                                    <DateTimePicker
                                                        onChange={(event: any) => { coachingSetValue("date", event) }}
                                                        format="MM/dd/yyyy HH:mm"
                                                        value={coachingWatch("date")}
                                                        clearIcon={null}

                                                        required
                                                    />
                                                </div>

                                                <FormControl variant="standard" fullWidth className="mb-5">
                                                    <InputLabel id="kidCategoryLabel">Category:*</InputLabel>
                                                    <Select
                                                        labelId="kidCategoryLabel"
                                                        id="kidCategoryLabelKidselect"
                                                        value={coachingWatch("category")}
                                                        {...coachingRegister("category", {

                                                            required: true
                                                        })} onChange={handleCategoryChange}
                                                    >
                                                        {(coachingSessionCategories || []).map((item: CoachingSessionCategory, index: any) => {
                                                            return (
                                                                <MenuItem key={"coachingcategory_" + item.label + index + 3} value={item.label}>{item.label}</MenuItem>

                                                            );
                                                        })}

                                                    </Select>
                                                    <FormHelperText style={{ color: "Red" }}>
                                                        {coachingError.category?.message}
                                                    </FormHelperText>
                                                </FormControl>
                                                {coachingWatch("category") != "" && coachingWatch("category") != "Other" &&
                                                    <FormControl variant="standard" fullWidth className="mb-5">
                                                        <InputLabel id="kidCategoryLabel">Sub-Category:*</InputLabel>
                                                        <Select
                                                            labelId="kidCategoryLabel"
                                                            id="kidCategoryLabelKidselect"
                                                            value={coachingWatch("subCategory")}
                                                            {...coachingRegister("subCategory", {

                                                                required: true
                                                            })}
                                                        >
                                                            {(subCategories).map((item: string) => {
                                                                return (
                                                                    <MenuItem key={"coaching_subcategory_" + item + kidCount + 3} value={item}>{item}</MenuItem>

                                                                );
                                                            })}

                                                        </Select>
                                                        <FormHelperText style={{ color: "Red" }}>
                                                            {coachingError.subCategory?.message}
                                                        </FormHelperText>
                                                    </FormControl>}
                                                {
                                                    coachingWatch("category") != "" && coachingWatch("category") == "Other" &&
                                                    <TextField id="kidRecordingDate" className="mb-4" required type="text" fullWidth label="Sub-Category: *" variant="standard" InputLabelProps={{
                                                        shrink: true,
                                                    }}  {...coachingRegister("customSubCategory")}
                                                        value={coachingWatch("customSubCategory")}
                                                        error={!!coachingError.customSubCategory}
                                                        helperText={coachingError.customSubCategory?.message}
                                                    />
                                                }


                                            </>
                                        )}
                                        {coachingstep > 1 && (
                                            <>

                                                <div className="mb-1">

                                                    <DisplayStart>
                                                        <ImgParentDiv>
                                                            <img src={constants.Kid_Avatar + kidDetail?.avatar ?? ""} alt="" className="userLogoKids" />
                                                        </ImgParentDiv>
                                                        <TitleCard>
                                                            {kidDetail?.name ?? "Unknown"}
                                                            <br />
                                                            <SubtitleCard>
                                                                {kidDetail?.houseName ?? "No Homes"}
                                                            </SubtitleCard>
                                                        </TitleCard>
                                                    </DisplayStart>
                                                </div>
                                                <FormControl variant="standard" fullWidth className="mb-5">
                                                    <InputLabel id="kidStatusLabel">Session Status:*</InputLabel>
                                                    <Select
                                                        labelId="kidStatusLabel"
                                                        key={`kidActions.${coachingstep - 2}.status`}
                                                        id="kidStatusLabelKidselect"
                                                        value={coachingWatch(`kidActions.${coachingstep - 2}.status`)}
                                                        error={!!coachingError.kidActions?.[coachingstep - 2]?.status}
                                                        {...coachingRegister(`kidActions.${coachingstep - 2}.status`, { required: true })}
                                                    >

                                                        <MenuItem key={"coaching_status_" + "Scheduled"} value="scheduled">Scheduled</MenuItem>
                                                        <MenuItem key={"coaching_status_" + "UnScheduled"} value="unscheduled">UnScheduled</MenuItem>
                                                        <MenuItem key={"coaching_status_" + "NoShow"} value="noShow">No Show</MenuItem>

                                                    </Select>
                                                    <FormHelperText style={{ color: "Red" }}>
                                                        {coachingError.kidActions?.[coachingstep - 2]?.status?.message}
                                                    </FormHelperText>
                                                </FormControl>

                                                <TextField
                                                    type="text" className="mb-4"
                                                    {...coachingRegister(`kidActions.${coachingstep - 2}.note`, { required: true })}
                                                    key={`kidActions.${coachingstep - 2}.note`}
                                                    label="Note *" variant="standard" InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    value={coachingWatch(`kidActions.${coachingstep - 2}.note`)}

                                                    error={!!coachingError.kidActions?.[coachingstep - 2]?.note}
                                                    helperText={coachingError.kidActions?.[coachingstep - 2]?.note?.message}
                                                    fullWidth
                                                /><TextField
                                                    type="text" value={coachingWatch(`kidActions.${coachingstep - 2}.actions`)}

                                                    {...coachingRegister(`kidActions.${coachingstep - 2}.actions`, { required: true })}
                                                    key={`kidActions.${coachingstep - 2}.actions`} className="mb-4" variant="standard" InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    label="Actions *"
                                                    error={!!coachingError.kidActions?.[coachingstep - 2]?.actions}
                                                    helperText={coachingError.kidActions?.[coachingstep - 2]?.actions?.message}
                                                    fullWidth
                                                />
                                                <TextField
                                                    type="text"
                                                    value={coachingWatch(`kidActions.${coachingstep - 2}.concerns`)}

                                                    {...coachingRegister(`kidActions.${coachingstep - 2}.concerns`, { required: true })}
                                                    key={`kidActions.${coachingstep - 2}.concerns`}
                                                    label="Concerns *" className="mb-4" variant="standard" InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    error={!!coachingError.kidActions?.[coachingstep - 2]?.concerns}
                                                    helperText={coachingError.kidActions?.[coachingstep - 2]?.concerns?.message}
                                                    fullWidth
                                                />
                                                <TextField
                                                    type="text" value={coachingWatch(`kidActions.${coachingstep - 2}.suggestions`)}

                                                    {...coachingRegister(`kidActions.${coachingstep - 2}.suggestions`, { required: true })}
                                                    key={`kidActions.${coachingstep - 2}.suggestions`}
                                                    label="Suggestions *" className="mb-4" variant="standard" InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    error={!!coachingError.kidActions?.[coachingstep - 2]?.suggestions}
                                                    helperText={coachingError.kidActions?.[coachingstep - 2]?.suggestions?.message}
                                                    fullWidth
                                                />


                                            </>

                                        )}
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between" style={{
                                        padding: "2.5rem", width: "100%"
                                    }}>
                                        <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Coaching", "")}>
                                            Cancel
                                        </Button>
                                        <Button variant="text" color="inherit" onClick={onhandlePrint}>
                                            Print
                                        </Button>
                                        {
                                            coachingstep > 1 &&

                                            <AppButton className='btnLogin'
                                                type="button"
                                                variant="contained"
                                                onClick={(event) => {
                                                    setCoachingstep(coachingstep - 1)
                                                    //const kidActions= coachingGetValues("kidActions")?.splice(coachingstep - 2);
                                                    //coachingSetValue("kidActions", kidActions)
                                                }}
                                            >
                                                Previous
                                            </AppButton>
                                        }
                                        {
                                            coachingstep === maxcoachstep &&
                                            <AppButton type="submit" className='btnLogin'
                                                onClick={(event) => {

                                                    console.log("Button submitted clicked");
                                                    coachingSessionform.trigger();
                                                    console.log(coachingError);
                                                    handleCoachingFormSubmit(event);
                                                }}

                                            >

                                                Submit
                                            </AppButton>

                                        }
                                        {(coachingstep !== maxcoachstep) &&
                                            <AppButton className='btnLogin'
                                                type="button"
                                                variant="contained"
                                                onClick={(event) => {
                                                    checkCoachingStepValidation();


                                                }}
                                            >
                                                Next
                                            </AppButton>

                                        }

                                    </div>
                                </DrawerBody>
                            </Box>
                        </AppForm>
                    </Drawer>
                    <Drawer className="Mui-Drawe-w" anchor="right" open={openKidIncident} onClose={toggleDrawer(false, "Incident", "")}>
                        <AppForm onSubmit={handleIncidentFormSubmit}>
                            <Box>
                                <DrawerHeadingParent>
                                    <DrawerHeading style={{ color: "#2a0560" }}>  Record Incident</DrawerHeading>
                                </DrawerHeadingParent>
                                <DrawerBody>
                                    <div style={{
                                        padding: "2.5rem", width: "100%"

                                    }}>

                                        <InputLabel id="kidSpinDate" >Date:*</InputLabel>
                                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                                            <DateTimePicker
                                                onChange={(event: any) => { incidentSetValue("date", event) }}
                                                format="MM/dd/yyyy HH:mm"
                                                value={incidentWatch("date")}
                                                clearIcon={null}

                                                required
                                            />
                                            <FormHelperText style={{ color: "Red" }} >
                                                {incidentError.date?.message}
                                            </FormHelperText>
                                        </div>

                                        <TextField id="kidInicidentLocation" className="mb-4" fullWidth label="Location: *" variant="standard"
                                            {...incidentRegister('location', { required: { value: true, message: "Required" } })}
                                            error={!!incidentError.location}
                                            helperText={incidentError.location?.message}
                                        />
                                        <FormControl sx={{ m: 1, width: 300 }}>
                                            <InputLabel id="kidIncidentCategoryLabel">Incident Category: (Multiple Selection Possible)</InputLabel>
                                            <Select
                                                labelId="kidIncidentCategoryLabel"
                                                id="kidIncidentCategory"
                                                input={<OutlinedInput label="Incident Category: (Multiple Selection Possible)" />}
                                                multiple
                                                {...incidentRegister("incidentCategory", {
                                                    validate:
                                                    {
                                                        minLength: (fieldValue: string[]) => {
                                                            return (
                                                                fieldValue.length > 0 || "Required"
                                                            )
                                                        }
                                                    }
                                                })}
                                                onChange={handleMultiselect}
                                                value={incidentWatch("incidentCategory") || []}
                                                error={!!incidentError.incidentCategory}


                                            >
                                                {incidentCategoryOption.map((item: any, index: number) => (
                                                    <MenuItem
                                                        key={item.copy + index + 3}
                                                        value={item.value}
                                                        style={getStyles(item.value, incidentWatch("incidentCategory") || [], theme)}
                                                    >
                                                        {item.value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText style={{ color: "Red" }}>
                                                {incidentError.incidentCategory?.message}
                                            </FormHelperText>

                                        </FormControl>
                                        <TextField id="kidInicidentWitness" className="mb-4" fullWidth label="Witnesses: *" variant="standard"
                                            {...incidentRegister('witnesses', { required: { value: true, message: "Required" } })}
                                            error={!!incidentError.witnesses}
                                            helperText={incidentError?.witnesses?.message} />
                                        <FormControl sx={{ m: 1, width: 300 }}>
                                            <InputLabel id="kidIncidentContactedLabel">Who was contacted: (Multiple Selection Possible)</InputLabel>
                                            <Select
                                                labelId="kidIncidentContactedLabel"
                                                id="kidIncidentContacted"
                                                input={<OutlinedInput label="Who was contacted: (Multiple Selection Possible)" />}
                                                multiple
                                                {...incidentRegister("contacted", {
                                                    validate:
                                                    {
                                                        minLength: (fieldValue: string[]) => {
                                                            return (
                                                                fieldValue.length > 0 || "Required"
                                                            )
                                                        }
                                                    }
                                                })}
                                                onChange={handleMultiselect}
                                                value={incidentWatch("contacted") || []}
                                                error={!!incidentError.contacted}


                                            >
                                                {contactedOptions.map((item: any, index: number) => (
                                                    <MenuItem
                                                        key={item.copy + index + 3}
                                                        value={item.value}
                                                        style={getStyles(item.value, incidentWatch("contacted") || [], theme)}

                                                    >
                                                        {item.value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormHelperText style={{ color: "Red" }}>
                                            {incidentError.contacted?.message}
                                        </FormHelperText>
                                        <TextField id="kidInicidentNumber" className="mb-4" fullWidth label="Police Incident Report Number:*" variant="standard"
                                            {...incidentRegister("policeIncidentNumber", { required: { value: true, message: "Required" } })}
                                            error={!!incidentError.policeIncidentNumber}
                                            helperText={incidentError.policeIncidentNumber?.message}
                                        />
                                        <div>
                                            <Typography
                                                variant="h4"
                                                color="textSecondary"
                                                style={{ paddingBottom: '16px', textAlign: 'left' }}
                                            >
                                                Incident details:
                                            </Typography>
                                            <ol style={{ margin: 0, listStyle: 'none', padding: 0 }}>
                                                {[
                                                    `What happened before? Was there a build- up, any known triggers to the incident?`,
                                                    `Describe the incident? What did they say/how did they act? What did you to do manage this and what advice were you given?`,
                                                    'What happened after the incident?',
                                                ].map((prompt, i) => (
                                                    <li
                                                        style={{
                                                            marginLeft: 0,
                                                            textDecoration: 'none',
                                                            padding: 0,
                                                            marginBottom: '8px',
                                                        }}
                                                    >
                                                        <Typography align="left" color="textSecondary">
                                                            {i + 1 + ' . ' + prompt}
                                                        </Typography>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                        <TextField id="kidInicidentNote" className="mb-4" fullWidth label="Note: *" variant="standard"
                                            {...incidentRegister('note', { required: { value: true, message: "Required" } })}
                                            placeholder="Please add as much detail as to what happened before, during and after including who else was involved.',"
                                            error={!!incidentError.note}
                                            helperText={incidentError.note?.message}
                                        />

                                    </div>
                                    <div className="d-flex align-items-center justify-content-between" style={{
                                        padding: "2.5rem", width: "100%"
                                    }}>
                                        <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Incident", "")}>
                                            Cancel
                                        </Button>
                                        <Button variant="text" color="inherit">
                                            Print
                                        </Button>
                                        <AppButton type="submit" className='btnLogin' disabled={!incidentIsValid}  >
                                            {!incidentSubmitting ?
                                                'Submit'
                                                : (
                                                    <CircularProgress size={24} />
                                                )}
                                        </AppButton>

                                    </div>
                                </DrawerBody>
                            </Box>

                            <div>

                            </div>


                        </AppForm>
                    </Drawer>

                    <Drawer className="Mui-Drawe-w" anchor="right" open={openAlertView} onClose={toggleDrawerAlertClose(false)}>
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

                                        {/* <DisplayStart>
                                                <ImgParentDiv color={"#d3d3d3"}>

                                                    {activityNoteViewModel?.kidName !== "" ? activityNoteViewModel?.kidName ?? "".charAt(0).toUpperCase() + activityNoteViewModel?.kidName ?? "".charAt(0).toUpperCase() : "A"}
                                                </ImgParentDiv>
                                                <TitleCard>
                                                    {activityNoteViewModel?.kidName}
                                                    <br />
                                                    <SubtitleCard>
                                                        {activityNoteViewModel?.houseName}
                                                    </SubtitleCard>
                                                </TitleCard>

                                            </DisplayStart> */}
                                    </div>

                                    {/* <Box style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', marginBottom: "10px" }}>
                                            <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                Kid:
                                            </Typography>
                                            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                                                {alertViewModel?.kidName ?? ""}
                                            </Typography>
                                        </Box> */}
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
                                            <Typography variant="body1">{moment(alertViewModel?.createdAt).format('YYYY-MM-DDTHH:mm:ss')}</Typography>
                                        </Box>
                                    </Box>



                                </div>
                                <div className="d-flex align-items-center justify-content-between" style={{
                                    padding: "2.5rem", width: "100%",
                                }}>
                                    <Button variant="text" color="inherit" onClick={toggleDrawerAlertClose(false)}>
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

                    <Drawer className="Mui-Drawe-w" anchor="right" open={openAlertForm} onClose={toggleDrawerAlert(false, "Alert")}>
                        <AppForm onSubmit={handleAlertFormSubmit}>
                            <Box>
                                <DrawerHeadingParent>
                                    <DrawerHeading style={{ color: "#2a0560" }}> Create Alert</DrawerHeading>
                                </DrawerHeadingParent>
                                <DrawerBody>
                                    <div style={{
                                        padding: "2.5rem", width: "100%"

                                    }}>

                                        <TextField id="kidlertTitle" className="mb-4" fullWidth label="Title: *" variant="standard"
                                            {...alertRegister('title', { required: { value: true, message: "Required" } })}
                                            placeholder="Title"
                                            error={!!alertError.title}
                                            helperText={alertError.title?.message}
                                        />
                                        <FormControl variant="standard" fullWidth className="mb-5">
                                            <InputLabel id="kidSeverityLabel">Severity:*</InputLabel>
                                            <Select
                                                labelId="kidSeverityLabel"
                                                id="kidSeverityselect"
                                                {...alertRegister('severity', { required: true })}
                                                value={alertWatch("severity")}
                                                label="Severity:*"
                                            >   <MenuItem key="kid_severity_medium" value="MEDIUM">Medium</MenuItem>
                                                <MenuItem key="kid_severty_high" value="HIGH">High</MenuItem>

                                            </Select>
                                            <FormHelperText style={{ color: "Red" }}>
                                                {spinError.spinType?.message}
                                            </FormHelperText>
                                        </FormControl>
                                        <InputLabel id="kidAlertDateLabel">Date:*</InputLabel>
                                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                                            <DateTimePicker
                                                onChange={(event: any) => { alertSetValue("date", event) }}
                                                format="MM/dd/yyyy HH:mm"
                                                value={alertWatch("date")}
                                                required
                                            />
                                        </div>


                                    </div>
                                    <div className="d-flex align-items-center justify-content-between" style={{
                                        padding: "2.5rem", width: "100%"
                                    }}>
                                        <Button variant="text" color="inherit" onClick={toggleDrawerAlert(false, "Alert")}>
                                            Cancel
                                        </Button>
                                        <Button variant="text" color="inherit" onClick={() => {
                                            window?.print();
                                        }}>
                                            Print
                                        </Button>
                                        <AppButton type="submit" className='btnLogin' disabled={!alertIsValid}  >
                                            {!alertSubmitting ?
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
                </Grid >


            </Container>
        </>
    );
}

export default KidsDetail;




