import { Box, Grid, Typography, CircularProgress, Menu } from "@mui/material";
import { Theme, useTheme } from '@mui/material/styles';
import { Row, Col, Container } from "react-bootstrap";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSnackbar } from 'notistack';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Icon, IconButton } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { SubtitleCard, getStyles } from "../Dashboard/DashboardScreenStyle";
import { DrawerHeading, DrawerStepHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
import { recordingactivityschema, persononcallschema, kidpaymentschema, kidnote2schema, VALIDATE_FORM_PERSON_ON_CALL_LOG, VALIDATE_FORM_PROFESSIONAL_CONTACT, VALIDATE_FORM_KID_RECORDING, VALIDATE_FORM_KID_PAYMENT, coachingschema, incidentschema, spinschema, alertschema, proContactSchema } from '../../service/ValidationSchema';
import SelectCommon from "../../components/FormComponents";
import { DashboardCard, PageHeading, PageHeadingSmall, GreyBox, AlertHeading, IconBox, ImgParentDiv, ImgParentDivLg, ImgParentDivSmall, GreyBoxParent, GreyBoxDesc, GreyBoxHeading, GreyBoxHeadingParent, TitleCard, SmallTitleCard, GreenTextLabel, GreenTextLabelSmall, Greenbtndiv, DashboardCardBgGreen, DashboardCardBgGreenChildDiv, DashboardCardBgGreenChildDivCol, DashboardCardBgGreenChildDivCol2, DashboardCardpurple, DisplayBetween, DisplayNumber, DisplayStart, MoveInDiv, MoveInlbl, FlexBetween, PlusButton } from "./HouseScreenStyle";
import FormHelperText from '@mui/material/FormHelperText';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TaskTab from "./TasksTab";
import TableHead from '@mui/material/TableHead';
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
import '../../index.css';
import { useAppForm } from '../../utils/form';
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
import { useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import usePagination from "../../components/CustomPagination";
import RoomTab from "./RoomTab";
import { createTheme, ThemeProvider } from '@mui/system';
import ModeIcon from '@mui/icons-material/Mode';
import KidsTab from "./KidsTabs";
import FileTab from "./FileTab";
import KidWhereAbout from "./KidWhereAbout";
import { debug } from "console";
import Divider from '@mui/material/Divider';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import RemoveButton from "../../service/RemoveButton";
import * as yup from "yup";
import EditIcon from '@mui/icons-material/Edit';
import GoogleMapReact from 'google-map-react';

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
    const themePage = useTheme();

    const navigate = useNavigate();
    const userToken = useSelector((state: AppStore) => state.auth.accessToken);
    const parsedClaims = parseJwt(userToken?.token || '');
    const userId = parsedClaims.id;
    const [kidList, setKidListHouse] = useState<KidListModel[]>();
    const { enqueueSnackbar } = useSnackbar();
    const [openKidRecording, setOpenKidRecording] = React.useState(false);
    const [openKidPayment, setOpenKidPayment] = React.useState(false);
    const [openKidNote, setOpenKidNote] = React.useState(false);
    const [openKidIncident, setOpenKidIncident] = React.useState(false);
    const [openKidCoaching, setOpenKidCoaching] = React.useState(false);
    const [openSpinSession, setOpenSpinSession] = React.useState(false);
    const [openAlertForm, setOpenAlertForm] = React.useState(false);
    const [tasks, setTasks] = React.useState<TaskListModel[]>();

    const [isChecked, setIsChecked] = useState(false);
    const [openKidRecordingEdit, setOpenKidRecordingEdit] = React.useState(false);
    const [openKidLocationEdit, setOpenKidLocationEdit] = React.useState(false);
    const [openKidNoteEdit, setOpenKidNoteEdit] = React.useState(false);
    const [openKidIncidentEdit, setOpenKidIncidentEdit] = React.useState(false);
    const [openKidCoachingEdit, setOpenKidCoachingEdit] = React.useState(false);
    const [openSpinSessionEdit, setOpenSpinSessionEdit] = React.useState(false);
    const [openRiskFormEdit, setOpenRiskFormEdit] = React.useState(false);

    const [activityNoteViewModel, setActivityNoteViewModel] = useState<ActivityNoteViewModel>();
    const [spinSessionViewModel, setSpinSessionViewModel] = useState<SpinSessionViewModel>();
    const [coachingSessionViewModel, setCoachingSessionViewModel] = useState<CoachingSessionViewModel>();
    const [recordIncidentViewModel, setRecordIncidentViewModel] = useState<RecordIncidentViewModel>();
    const [generalNoteViewModel, setGeneralNoteViewModel] = useState<GeneralNoteViewModel>();
    const [kidLogLocationViewModel, setKidLogLocationViewModel] = useState<KidLogLocationViewModel>();
    const [riskAssessmentViewModel, setRiskAssessmentViewModel] = useState<RiskAssessmentViewModel>();

    const [logUpdate, setLogUpdate] = React.useState(0);
    const [taskListModel, setTaskListModel] = useState<TaskListModel[]>();

    const [submitLoading, setSubmitLoading] = useState<boolean>();
    const [spinstep, setSpinStep] = useState(1);
    const [maxspinstep, setMaxSpinStep] = useState(2);
    const [behaviourCount, setBehaviourCount] = useState(1);
    const [coachingstep, setCoachingstep] = useState(1);
    const [maxcoachstep, setMaxCoachStep] = useState(2);
    const [openKidProContact, setOpenKidProContact] = React.useState(false);
    const [openPersonOnCall, setOpenPersonOnCall] = React.useState(false);
    const [kidCount, setKidCount] = useState(1);
    const { hId } = useParams();
    const [subCategories, setSubCategories] = useState(coachingSessionCategories[0].subCategories); // State to hold subcategories for the selected category
    const [houseDetail, setHouseDetail] = useState<HouseViewModel>();


    const [selectedTime, setSelectedTime] = useState("0"); // Set the default value here
    const [selectedType, setSelectedType] = useState("All"); // Set the default value here

    const [managerList, setManagerList] = useState<SelectList[]>();
    const location = useLocation();
    const [houseList, setHouseList] = useState<HouseListModel[]>();

    const [openAlertView, setOpenAlertView] = React.useState(false);
    const [alertViewModel, setAlertViewModel] = useState<AlertViewModel>();

    const defaultProps = {
        center: {
            lat: 10.99835602,
            lng: 77.01502627
        },
        zoom: 11
    };


    //const AnyReactComponent = ({ text }) => <div>{text}</div>;

    const alertform = useForm<CreateAlertFormValues>({
        defaultValues: {
            kidId: "",
            userId: userId,
            title: "",
            severity: "",
            date: new Date(),
            isKid: "0",
        },
        resolver: yupResolver(alertschema),
        mode: "all"
    });
    const recordingform = useForm<KidRecordingFormValues>({
        defaultValues: {
            kidId: "",
            note: "",
            userId: userId,
            date: new Date(),
        },
        resolver: yupResolver(recordingactivityschema),
        mode: "all"
    });
    const kidpaymentform = useForm<KidPaymentFormValues>({
        defaultValues: {
            kidId: "",
            amount: 0,
            userId: userId,
            date: new Date(),
        },
        resolver: yupResolver(kidpaymentschema),
        mode: "all"
    });
    const kidnoteform = useForm<KidNoteFormValues>({
        defaultValues: {
            note: "", userId: userId, date: new Date()
        },
        resolver: yupResolver(kidnote2schema),
        mode: "all"
    });
    const personOnCallform = useForm<PersonOnCallLogFormModel>({
        defaultValues: {
            kidId: "",
            managerId: "",
            note: "",
            advice: "",
            reason: "",
            userId: userId,
            date: new Date(),
        },
        resolver: yupResolver(persononcallschema),
        mode: "all"
    });

    const spinSessionform = useForm<KidSpinSessionFormValues>({
        defaultValues: {
            kidId: "",
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

    // const taskFormModelForm = useForm<NewTaskFormModel>({
    //     defaultValues: {
    //         taskId: "",
    //         title: "",
    //         description: "",
    //         onlyAdmin: "",

    //     },
    //     resolver: yupResolver(tasks),
    //     mode: "all"
    // });

    const recordIncidentform = useForm<RecordIncidentFormValues>({
        defaultValues: {
            kidId: "",
            userId: "",
            date: new Date(),
            location: "",
            incidentCategory: [],
            witnesses: "",
            contacted: [],
            policeIncidentNumber: "",
            note: ""

        },
        //  resolver: yupResolver(incidentschema),
        mode: "onTouched"
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
        resolver: yupResolver(proContactSchema),
        mode: "all"
    });

    const [openCreate, setOpenCreate] = React.useState(false);
    const [openView, setOpenView] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openTaskEdit, setTaskOpenNewUpdate] = React.useState(false);
    const [users, setUsers] = React.useState<any>([]);
    const PAGE_SIZE = 5; // Number of items per page

    const [taskDashboardList, setTaskList] = useState<TaskListModel[]>();
    const [taskDetailsViewModel, setTaskDetailsViewModel] = useState<NewTaskViewModel>();
    const [openTaskDetailsEdit, setOpenTaskDetailsEdit] = React.useState(false);
    const [open, setOpen] = React.useState(false);


    const [selecttaskId, setSelecttaskId] = useState("00000000-0000-0000-0000-000000000000"); // Set the default value here
    const { currentPage, handlePaginate, pageCount, setCount, setCurrentPage, } = usePagination({ take: PAGE_SIZE, count: 0 });
    const { currentPage: currentPageAlert, pageCount: AlertPageCount, setCount: setAlertCount, setCurrentPage: setCurrentPageAlert } = usePagination({ take: PAGE_SIZE, count: 0 });



    const toggleDrawerTab = (open: any, type: string) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        if (type == "Create") {
            setOpenCreate(open);
        }
        else if (type == "View") {
            setOpenView(open);
        }
        else if (type == "Edit") {
            setOpenEdit(open);
        }
    };


    const toggleDrawerClose = (open: any) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setOpenTaskDetailsEdit(open);
    };






    const toggleOpenDrawer = (open: any, taskId: string) => (event: any) => {
        getTaskDetails(taskId);
        //setSelecttaskId(taskId);

    };


    const getTaskDetails = (taskId: string) => {
        GetAxios().get(constants.Api_Url + 'Task/GetTask?taskId=' + taskId).then(res => {
            if (res.data.success) {
                setTaskDetailsViewModel(res.data.data);
                setOpenTaskDetailsEdit(true);


            }
        })
    };

    const toggleDrawerHome = (open: any) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        // if(open == true){
        //     getHouseDetal();
        //     setOpen(open);
        // }
        // else{

        // }

        setOpen(open);
    };


    const createform = useForm<FormStateValues>({
        defaultValues: {
            name: '', phone: '', location: '', color: '', lat: '', long: ''
        },
        resolver: yupResolver(createhouseschema),
        mode: "all"
    });

    const { register: recordingRegister, formState: { errors: recordingError, isValid: recordingIsValid, isSubmitting: recordingSubmitting }, reset: recordingReset, watch: recordingWatch, getValues: recordingGetValues, setValue: recordingSetValue } = recordingform;
    const { register: paymentRegister, formState: { errors: paymentError, isValid: paymentIsValid, isSubmitting: paymentSubmitting }, reset: paymentReset, watch: paymentWatch, getValues: paymentGetValues, setValue: paymentSetValue } = kidpaymentform;
    const { register: noteRegister, formState: { errors: noteError, isValid: noteIsValid, isSubmitting: noteSubmitting }, reset: noteReset, watch: noteWatch, getValues: noteGetValues, setValue: noteSetValue } = kidnoteform;
    const { register: spinRegister, handleSubmit: handleSpinSubmit, formState: { errors: spinError, isValid: spinIsValid, isSubmitting: spinSubmitting }, reset: spinReset, watch: spinWatch, getValues: spinGetValues, setValue: spinSetValue } = spinSessionform;
    const { register: incidentRegister, handleSubmit: handleIncidentSubmit, formState: { errors: incidentError, isValid: incidentIsValid, isSubmitting: incidentSubmitting }, reset: incidentReset, watch: incidentWatch, getValues: incidentGetValues, setValue: incidentSetValue } = recordIncidentform;
    const { register: coachingRegister, handleSubmit: handleCoachingSubmit, formState: { errors: coachingError, isValid: coachingIsValid, isSubmitting: coachingSubmitting }, reset: coachingReset, watch: coachingWatch, getValues: coachingGetValues, setValue: coachingSetValue } = coachingSessionform;
    const { register: alertRegister, handleSubmit: handleAlertSubmit, formState: { errors: alertError, isValid: alertIsValid, isSubmitting: alertSubmitting }, reset: alertReset, watch: alertWatch, getValues: alertGetValues, setValue: alertSetValue } = alertform;
    const { register: proContactRegister, handleSubmit: handleProContactSubmit, formState: { errors: proContactError, isValid: proContactIsValid, isSubmitting: proContactSubmitting }, reset: proContactReset, watch: proContactWatch, getValues: proContactGetValues, setValue: proContactSetValue } = proContactform;
    // const { register: taskRegister, handleSubmit: handleTaskFormSubmit, formState: { errors: taskError, isValid: taskIsValid, isSubmitting: taskSubmitting }, reset: taskReset, watch: taskWatch, getValues: taskGetValues, setValue: taskSetValue } = taskFormModelForm;
    const { register: createRegister, formState: { errors: createError, isValid: createIsValid, isSubmitting: createSubmitting }, reset: createReset, watch: createWatch, getValues: createGetValues, setValue: createSetValue } = createform;
    const [notificationList, setNotificationList] = useState<NotificationListModel[]>();
    const { register: personOnCallRegister, formState: { errors: personOnCallError, isValid: personOnCallIsValid, isSubmitting: personOnCallSubmitting }, reset: personOnCallReset, watch: personOnCallWatch, getValues: personOnCallGetValues, setValue: personOnCallSetValue } = personOnCallform;
    const [colorList, setColorList] = useState<any[]>();



    const getNotificationList = () => {

        GetAxios().get(constants.Api_Url + 'Dashboard/GetNotifications?userId=' + userId + "&houseId=" + hId + "&kidId=00000000-0000-0000-0000-000000000000").then(res => {
            if (res.data.success) {
                setNotificationList(res.data.list);
                setCurrentPageAlert(1);
                setAlertCount(res.data.list.length);

            }
        })
    };


    const handleAddKid = () => {
        setKidCount(kidCount + 1);
        setMaxCoachStep(maxcoachstep + 1);
    };
    const handleRemoveKid = (index: number) => {
        setKidCount(kidCount - 1);
        setMaxCoachStep(maxcoachstep - 1);
        var array = coachingGetValues("kidActions") || []; // make a separate copy of the array
        array.splice(index, 1);
        coachingSetValue("kidActions", array)

    };
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

    const onhandlePrint = (event: any) => {
        window?.print();
    };

    const toggleDrawer = (open: any, type: string) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        if (type == "Recording") {
            recordingReset(); setOpenKidRecording(open); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false);
            setOpenKidCoaching(false); setOpenKidIncident(false); setOpen(false);
        }
        else if (type == "Payment") {
            paymentReset(); setOpenAlertForm(false); setOpenKidRecording(false); setOpenKidPayment(open); setOpenSpinSession(false); setOpenKidNote(false);
            setOpenKidCoaching(false); setOpenKidIncident(false); setOpen(false);
        }
        else if (type == "Spin") {
            setSpinStep(1); setMaxSpinStep(2); setBehaviourCount(1); spinReset();
            setOpenAlertForm(false); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(open); setOpenKidNote(false);
            setOpenKidCoaching(false); setOpenKidIncident(false); setOpen(false);
        }
        if (type == "Note") {
            noteReset(); setOpenAlertForm(false); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(open);
            setOpenKidCoaching(false); setOpenKidIncident(false); setOpen(false);
        }
        else if (type == "Incident") {
            incidentReset(); setOpenAlertForm(false); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false);
            setOpenKidCoaching(false); setOpenKidIncident(open); setOpen(false);
        }
        else if (type == "Coaching") {
            setOpenAlertForm(false); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false);
            coachingReset(); setOpenKidCoaching(open); setOpenKidIncident(false); setCoachingstep(1); setMaxCoachStep(2); setKidCount(1); setOpen(false);
        }
        else if (type == "Alert") {
            setOpenAlertForm(open); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false); alertReset();
            coachingReset(); setOpenKidCoaching(false); setOpenKidIncident(false); setCoachingstep(1); setMaxCoachStep(2); setKidCount(1); setOpen(false);
        }
        else if (type == "ProContact") {
            setOpenKidProContact(open); proContactform.reset();
            setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false); alertReset();
            coachingReset(); setOpenKidCoaching(false); setOpenKidIncident(false); setCoachingstep(1); setMaxCoachStep(2); setKidCount(1); setOpen(false);
        }
        else if (type == "CallLog") {
            setOpenPersonOnCall(open); setOpenKidRecording(false); setOpenKidPayment(false); setOpenSpinSession(false); setOpenKidNote(false); alertReset();
            coachingReset(); setOpenKidCoaching(false); setOpenKidIncident(false); setCoachingstep(1); setMaxCoachStep(2); setKidCount(1); setOpen(false);
        }



    };


    const toggleDrawerEdit = (open: any, type: string) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        if (type == "Recording") {
            setOpenKidRecordingEdit(open); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
            setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(false); setOpenRiskFormEdit(false);
        }
        else if (type == "Location") { //location
            setOpenRiskFormEdit(false); setOpenKidRecording(false); setOpenKidLocationEdit(open); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
            setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(false);
        }
        else if (type == "Spin") {
            setOpenRiskFormEdit(false); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(open); setOpenKidNoteEdit(false);
            setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(false);
        }
        if (type == "Note") {
            setOpenRiskFormEdit(false); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(open);
            setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(false);
        }
        else if (type == "Incident") {
            setOpenRiskFormEdit(false); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
            setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(open);
        }
        else if (type == "Coaching") {
            setOpenRiskFormEdit(false); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
            setOpenKidCoachingEdit(open); setOpenKidIncidentEdit(false);
        }
        else if (type == "Risk") {
            setOpenRiskFormEdit(open); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
            setOpenKidCoaching(false); setOpenKidIncident(false);
        }
    };


    const getHouseDetal = () => {
        GetAxios().get(constants.Api_Url + 'House/GetHouse?houseId=' + hId).then(res => {
            if (res.data.success) {

                setHouseDetail(res.data.data);
            }
        })
    };

    // useEffect(() => {
    //     getHouseDetal();


    // }, []);


    const getKidRecording = (logid: string) => {
        GetAxios().get(constants.Api_Url + 'Dashboard/GetKidRecording?logId=' + logid).then(res => {
            if (res.data.success) {
                setActivityNoteViewModel(res.data.data);
            }
        })
    };

    const getSpinSession = (logid: string) => {
        GetAxios().get(constants.Api_Url + 'Dashboard/GetSpinSession?logId=' + logid).then(res => {
            if (res.data.success) {
                setSpinSessionViewModel(res.data.data);
            }
        })
    };

    const getCoachingSession = (logid: string) => {
        GetAxios().get(constants.Api_Url + 'Dashboard/GetCoachingSession?logId=' + logid).then(res => {
            if (res.data.success) {
                setCoachingSessionViewModel(res.data.data);
            }
        })
    };

    const getRecordIncident = (logid: string) => {
        GetAxios().get(constants.Api_Url + 'Dashboard/GetRecordIncident?logId=' + logid).then(res => {
            if (res.data.success) {
                setRecordIncidentViewModel(res.data.data);
            }
        })
    };

    const getGeneralNote = (logid: string) => {
        GetAxios().get(constants.Api_Url + 'Dashboard/GetGeneralNote?logId=' + logid).then(res => {
            if (res.data.success) {
                setGeneralNoteViewModel(res.data.data);
            }
        })
    };

    const getKidLogLocation = (logid: string) => {
        GetAxios().get(constants.Api_Url + 'Dashboard/GetKidLogLocation?logId=' + logid).then(res => {
            if (res.data.success) {
                setKidLogLocationViewModel(res.data.data);
            }
        })
    };

    const getRiskAssessment = (logid: string) => {
        GetAxios().get(constants.Api_Url + 'Dashboard/GetRiskAssessment?logId=' + logid).then(res => {
            if (res.data.success) {
                setRiskAssessmentViewModel(res.data.data);
            }
        })
    };

    const getHouseList = () => {



        GetAxios().get(constants.Api_Url + 'House/GetHousesDashboard?search=' + "" + "&moveOut=" + true).then(res => {
            if (res.data.success) {

                setHouseList(res.data.list);
            }
        })


    };

    
    const handleAlertFormSubmit = (event: SyntheticEvent) => {
debugger;
        event.preventDefault();
        setSubmitLoading(true);
        const formattedDate = moment(alertGetValues("date")).format('YYYY-MM-DDTHH:mm:ss');

        console.log(alertGetValues())
        const formData = new FormData();
       formData.append('kidId', alertGetValues("kidId") ?? "");
        formData.append('userId', userId ?? "");
        formData.append('title', alertGetValues("title"));
        formData.append('severity', alertGetValues("severity"));
        formData.append('date', formattedDate);
        formData.append('isKid', "0");
        GetAxios().post(constants.Api_Url + 'Dashboard/CreateAlert', formData)
            .then(res => {
                setSubmitLoading(false);
                if (res.data.success) {
                    enqueueSnackbar("Form was successfully submitted.", {
                        variant: 'success', style: { backgroundColor: '#5f22d8' },
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawer(false, "Alert")(event);
                    getNotificationList();
                    incidentReset();
                    setLogUpdate(logUpdate + 1);
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
debugger;
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

                    toggleDrawer(false, "Recording")(event);
                    recordingReset();
                    setLogUpdate(logUpdate + 1);
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
    const handleProContactFormSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        setSubmitLoading(true);
        console.log(proContactGetValues())
        const formData = new FormData();
        formData.append('KidId', proContactGetValues("kidId"));
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

                    toggleDrawer(false, "ProContact")(event);
                    proContactform.reset();

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
    const handleCallLogFormSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        setSubmitLoading(true);
        console.log("");
        const formData = new FormData();
        formData.append('KidId', personOnCallGetValues("kidId") ?? "");
        formData.append('UserId', userId ?? "");
        formData.append('Note', personOnCallGetValues("note"));
        formData.append('Date', moment(personOnCallGetValues("date")).format('YYYY-MM-DDTHH:mm:ss'));
        formData.append('Reason', personOnCallGetValues("reason"));
        formData.append('Advice', personOnCallGetValues("advice"));
        formData.append('ManagerId', personOnCallGetValues("managerId"));
        GetAxios().post(constants.Api_Url + 'House/SavePersonOnCallLog', formData)
            .then(res => {
                setSubmitLoading(false);
                if (res.data.success) {
                    enqueueSnackbar("Form was successfully submitted.", {
                        variant: 'success', style: { backgroundColor: '#5f22d8' },
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawer(false, "CallLog")(event);
                    personOnCallReset();

                } else {
                    console.warn(res);
                    enqueueSnackbar("Unable to save person n call log", {
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

        // if (noteGetValues("kidId") == '' && noteGetValues("houseId") == '') {
        //     enqueueSnackbar("Please select atleast kid or home.", {
        //         variant: 'error', // Change variant to 'error' for red color
        //         anchorOrigin: { vertical: 'top', horizontal: 'right' },
        //     });
        // }


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

                    toggleDrawer(false, "Note")(event);
                    noteReset();
                    setLogUpdate(logUpdate + 1);
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

                    toggleDrawer(false, "Payment")(event);
                    noteReset();
                    setLogUpdate(logUpdate + 1);
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

                    toggleDrawer(false, "Spin")(event);
                    spinReset();

                    setLogUpdate(logUpdate + 1);
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
                    `kidActions.${coachingstep - 2}.status`,
                    `kidActions.${coachingstep - 2}.suggestions`,
                    `kidActions.${coachingstep - 2}.note`,
                    `kidActions.${coachingstep - 2}.actions`,
                    `kidActions.${coachingstep - 2}.concerns`
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

                        toggleDrawer(false, "Coaching")(event);
                        coachingReset();
                        setLogUpdate(logUpdate + 1);
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

                    toggleDrawer(false, "Incident")(event);
                    incidentReset();
                    setLogUpdate(logUpdate + 1);
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


    // const handleTaskFormSubmit = (event: SyntheticEvent) => {
    //     event.preventDefault();
    //     const formData = new FormData();
    //     formData.append('id', roomGetValues("id") ?? "");
    //     formData.append('houseId', props.houseId??"");
    //     formData.append('name', roomGetValues("name"));
    //     formData.append('color', roomGetValues("color") ?? "");

    //     GetAxios().post(constants.Api_Url + 'House/CreateUpdateRoom', formData)
    //         .then(res => {

    //             if (res.data.success) {
    //                 enqueueSnackbar("Form was successfully submitted.", {
    //                     variant: 'success',
    //                     anchorOrigin: { vertical: 'top', horizontal: 'right' },
    //                 });

    //                 toggleDrawer(false)(event);
    //                 roomform.setValue("name","");
    //                 roomform.setValue("color","");
    //                 roomform.setValue("id","");
    //                 getRoomList();

    //             } else {
    //                 console.warn(res);
    //                 enqueueSnackbar("Unable to manage room.", {
    //                     variant: 'error',
    //                     anchorOrigin: { vertical: 'top', horizontal: 'right' },
    //                 });
    //             }
    //         })
    //         .catch(err => {

    //             enqueueSnackbar("Something went wrong.", {
    //                 variant: 'error',
    //                 anchorOrigin: { vertical: 'top', horizontal: 'right' },
    //             });
    //         });

    // };
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

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
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



    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    function HouseCustomTabPanel(props: TabPanelProps) {
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

    function a1yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    const theme = createTheme({
        components: {
            MuiCheckbox: {
                styleOverrides: {
                    root: {
                        '&.Mui-checked': {
                            color: '#000', // Change this to your desired border color
                        },
                    },
                },
            },
        },
    });
    const getMangerList = () => {
        GetAxios().get(constants.Api_Url + 'User/GetAdminUsers').then(res => {
            if (res.data.success) {

                setManagerList(res.data.list);

            }
        })
    };
    const getTasksList = () => {
        setCurrentPage(1);
        const formData = new FormData();
        formData.append('sortBy', 'DLH');
        formData.append('assignedTo', 'All');
        formData.append("isPrivate", JSON.stringify(false));
        formData.append("isCompleted", JSON.stringify(false));
        formData.append("houseId", hId ?? "");
        formData.append("kidId", "");

        GetAxios().post(constants.Api_Url + 'Task/GetTasks', formData).then(res => {
            if (res.data.success) {
                setTaskList(res.data.list);
                console.log(res.data.list);
                setCount(res.data.data.length);
            }
        })
    };

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
        formData.append('Id', hId ?? "");
        //formData.append('Lat', formState.values.lat);
        //formData.append('Long', formState.values.long);

        console.log(formData)
        GetAxios().post(constants.Api_Url + 'House/UpdateHouse', formData).then(res => {
            setSubmitLoading(false);
            if (res.data.success) {

                enqueueSnackbar("Form was successfully submitted.", {
                    variant: 'success', style: { backgroundColor: '#5f22d8' },
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
                //close Model //Fetch list
                // toggleDrawer(false);
                toggleDrawerHome(false)(event);
                createReset();
                navigate("/homes");


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



    // React.useEffect(() => {
    //     getKidListHouse();
    //     getMangerList();

    // }, []);

    useEffect(() => {
        getMangerList();
        getHouseDetal();
        getHouseList();
        getKidListHouse();
        getNotificationList();
        // console.log('Location changed:', location);
    }, [location]);

    useEffect(() => {

        getTasksList();

        GetAxios().get(constants.Api_Url + 'General/GetHouseColors').then(res => {
            if (res.data.success) {

                setColorList(res.data.list);

            }
        })


    }, []);



    // const toggleDrawer = (open: any) => (event: any) => {
    //     if (
    //         event.type === 'keydown' &&
    //         (event.key === 'Tab' || event.key === 'Shift')
    //     ) {
    //         return;
    //     }

    //     setOpen(open);
    // };

    const getKidListHouse = () => {
        GetAxios().get(constants.Api_Url + 'House/GetHouseKids?houseId=' + hId).then(res => {
            if (res.data.success) {

                console.log(res)
                setKidListHouse(res.data.list);
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


    const getHouseDetailForView = (name: string, address: string, color: string, contact: string) => (event: any) => {
        createform.setValue("name", name);
        createform.setValue("phone", contact);
        createform.setValue("color", color);
        createform.setValue("location", address);

        setOpen(true);

    };


    return (
        <>
            <Container fluid-sm>
                <PageHeading style={{ color: "#2a0560" }}>
                    {houseDetail?.name}

                </PageHeading>
                <PageHeadingSmall className="text-body-tertiary">Homes</PageHeadingSmall>
                <Grid className='mb-4' container spacing={5}>
                    <Grid item xs={12} md={6}>
                        <div className="d-flex align-items-center justify-content-between">
                            <AlertHeading style={{ color: "#2a0560" }}>
                                Alerts
                            </AlertHeading>
                            <Link to="">
                                {/* <IconButton className='headerIcon' onClick={toggleDrawer(true, "Alert")}>
                                    <Icon>  <AddIcon className='text-body-tertiary iconHeight' /></Icon>
                                </IconButton> */}


                                <PlusButton onClick={toggleDrawer(true, "Alert")}>
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


                        <div>

                            <Drawer className="Mui-Drawe-w" anchor="right" open={openKidRecording} onClose={toggleDrawer(false, "Recording")}>
                                <AppForm onSubmit={handleRecordingFormSubmit}>
                                    <Box>
                                        <DrawerHeadingParent>
                                            <DrawerHeading style={{ color: "#2a0560" }}> Kid Recording</DrawerHeading>
                                        </DrawerHeadingParent>
                                        <DrawerBody>
                                            <div style={{
                                                padding: "2.5rem", width: "100%"

                                            }}>

                                                <FormControl variant="standard" fullWidth className="mb-5">
                                                    <InputLabel id="kidSpinLabel">Select Kid:*</InputLabel>
                                                    <Select
                                                        labelId="kidSpinLabel"
                                                        id="kidSpinLabelKidselect"
                                                        {...recordingRegister('kidId', { required: true })}
                                                        value={recordingWatch("kidId")}
                                                        label="Select Kid:*" error={!!recordingError.kidId}
                                                    >
                                                        {(kidList || []).map((item: KidListModel, index: any) => {
                                                            return (
                                                                <MenuItem key={"kid_spin_session" + item.id + index + 3} value={item.id}>{item.name}</MenuItem>

                                                            );
                                                        })}
                                                    </Select>

                                                    <FormHelperText style={{ color: "Red" }}>
                                                        {recordingError.kidId?.message}
                                                    </FormHelperText>
                                                </FormControl>
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
                                                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Recording")}>
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
                            <Drawer className="Mui-Drawe-w" anchor="right" open={openSpinSession} onClose={toggleDrawer(false, "Spin")}>
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
                                                        <FormControl variant="standard" fullWidth className="mb-5">
                                                            <InputLabel id="kidSpinLabel">Select Kid:*</InputLabel>

                                                            <Select
                                                                labelId="kidSpinLabel"
                                                                id="kidSpinLabelKidselect"
                                                                error={!!spinError.kidId}
                                                                {...spinRegister('kidId', { required: true })}
                                                                value={spinWatch("kidId")}
                                                                label="Select Kid:*"
                                                            >
                                                                {(kidList || []).map((item: KidListModel, index: any) => {
                                                                    return (
                                                                        <MenuItem key={"kid_spin_session" + item.id + index + 3} value={item.id}>{item.name}</MenuItem>

                                                                    );
                                                                })}
                                                            </Select>

                                                            <FormHelperText style={{ color: "Red" }}>
                                                                {spinError.kidId?.message}
                                                            </FormHelperText>
                                                        </FormControl>
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
                                                            label="What’s working well: *
                                                        : *" variant="standard" InputLabelProps={{ shrink: true }}
                                                            {...spinRegister(`behaviours.${behaviourCount - 1}.whatsWorkingWell`, { required: true })}
                                                            error={!!spinError.behaviours?.[behaviourCount - 1]?.whatsWorkingWell}
                                                            helperText={spinError.behaviours?.[behaviourCount - 1]?.whatsWorkingWell?.message}
                                                        /> <TextField
                                                            id={"kidSpinPresent" + behaviourCount} className="mb-4" fullWidth
                                                            label="What’s not working well: *
                                                        " variant="standard" InputLabelProps={{ shrink: true }}
                                                            {...spinRegister(`behaviours.${behaviourCount - 1}.whatsNotWorkingWell`, { required: true })}
                                                            error={!!spinError.behaviours?.[behaviourCount - 1]?.whatsNotWorkingWell}
                                                            helperText={spinError.behaviours?.[behaviourCount - 1]?.whatsNotWorkingWell?.message}
                                                        /> <TextField
                                                            id={"kidSpinPresent" + behaviourCount} className="mb-4" fullWidth
                                                            label="What needs to happen: *
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
                                                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Spin")}>
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
                            <Drawer className="Mui-Drawe-w" anchor="right" open={openKidCoaching} onClose={toggleDrawer(false, "Coaching")}>
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

                                                        {[...Array(kidCount)].map((_, index) => (
                                                            <FormControl variant="standard" fullWidth className="mb-5">
                                                                <InputLabel id="kidRecordingLabel">Kid:*</InputLabel>
                                                                <div className='d-flex align-items-center justify-content-between'>
                                                                    <Select
                                                                        style={{ width: "80%", height: "30px" }}
                                                                        labelId="kidRecordingLabel"
                                                                        label="Kid:*"
                                                                        id="kidRecordingLabelKidselect"
                                                                        value={coachingWatch(`kidActions.${index}.kidId`)}
                                                                        {...coachingRegister(`kidActions.${index}.kidId`, {

                                                                            required: true
                                                                        })}
                                                                    >{(kidList || []).map((item: KidListModel, index: any) => {
                                                                        return (
                                                                            <MenuItem key={"kid_" + item.id + index + 3} value={item.id}>{item.name}</MenuItem>

                                                                        );
                                                                    })}

                                                                    </Select>
                                                                    <RemoveButton onClick={() => { handleRemoveKid(index) }} disabled={index == 0} />
                                                                </div>



                                                                <FormHelperText style={{ color: "Red" }}>
                                                                    {coachingError.kidActions?.[index]?.kidId?.message}
                                                                </FormHelperText>
                                                            </FormControl>



                                                        ))} <AddAnotherButton onClick={handleAddKid} disabled={false} />

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
                                                            <TextField id="kidRecordingDate" className="mb-4" required type="text" fullWidth label="Sub-Category: *" variant="standard" InputLabelProps={{
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
                                                                    <img src={constants.Kid_Avatar + kidList?.find(kid => kid.id === coachingWatch(`kidActions.${coachingstep - 2}.kidId`))?.avatar + ".png"
                                                                    } alt="" className="userLogoKids" />
                                                                </ImgParentDiv>
                                                                <TitleCard>
                                                                    {
                                                                        kidList?.find(kid => kid.id === coachingWatch(`kidActions.${coachingstep - 2}.kidId`))?.name
                                                                    }
                                                                    <br />
                                                                    <SubtitleCard>
                                                                        {kidList?.find(kid => kid.id === coachingWatch(`kidActions.${coachingstep - 2}.kidId`))?.houseName
                                                                        }
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
                                                            label="Note *" variant="standard" InputLabelProps={{
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
                                                            label="Actions *"
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
                                                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Coaching")}>
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
                            <Drawer className="Mui-Drawe-w" anchor="right" open={openKidNote} onClose={toggleDrawer(false, "Note")}>
                                <AppForm onSubmit={handleNoteFormSubmit}>
                                    <Box>
                                        <DrawerHeadingParent>
                                            <DrawerHeading> General Note</DrawerHeading>
                                        </DrawerHeadingParent>
                                        <DrawerBody>
                                            <div style={{
                                                padding: "2.5rem", width: "100%"

                                            }}>

                                                {/* <FormControl variant="standard" fullWidth className="mb-5">
                                                    <InputLabel id="kidSpinLabel">Select Kid:*</InputLabel>
                                                    <Select
                                                        labelId="kidSpinLabel"
                                                        id="kidSpinLabelKidselect"
                                                        {...noteRegister('kidId', { required: true })}
                                                        value={noteWatch("kidId")}
                                                        label="Select Kid:*"
                                                    >
                                                        {(kidList || []).map((item: KidListModel, index: any) => {
                                                            return (
                                                                <MenuItem key={"kid_spin_session" + item.id + index + 3} value={item.id}>{item.name}</MenuItem>

                                                            );
                                                        })}
                                                    </Select>

                                                    <FormHelperText style={{ color: "Red" }}>
                                                        {noteError.kidId?.message}
                                                    </FormHelperText>
                                                </FormControl> */}
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
                                                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Note")}>
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

                            <Drawer className="Mui-Drawe-w" anchor="right" open={openKidPayment} onClose={toggleDrawer(false, "Payment")}>
                                <AppForm onSubmit={handlePaymentFormSubmit}>
                                    <Box>
                                        <DrawerHeadingParent>
                                            <DrawerHeading> Kid Payment</DrawerHeading>
                                        </DrawerHeadingParent>
                                        <DrawerBody>
                                            <div style={{
                                                padding: "2.5rem", width: "100%"

                                            }}>
                                                <FormControl variant="standard" fullWidth className="mb-5">
                                                    <InputLabel id="kidSpinLabel">Select Kid:*</InputLabel>
                                                    <Select
                                                        labelId="kidSpinLabel"
                                                        id="kidSpinLabelKidselect"
                                                        {...paymentRegister('kidId', { required: true })}
                                                        value={paymentWatch("kidId")}
                                                        label="Select Kid:*" error={!!paymentError.kidId}
                                                    >
                                                        {(kidList || []).map((item: KidListModel, index: any) => {
                                                            return (
                                                                <MenuItem key={"kid_spin_session" + item.id + index + 3} value={item.id}>{item.name}</MenuItem>

                                                            );
                                                        })}
                                                    </Select>

                                                    <FormHelperText style={{ color: "Red" }}>
                                                        {paymentError.kidId?.message}
                                                    </FormHelperText>
                                                </FormControl>
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
                                                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Payment")}>
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

                            <Drawer className="Mui-Drawe-w" anchor="right" open={openKidIncident} onClose={toggleDrawer(false, "Incident")}>
                                <AppForm onSubmit={handleIncidentFormSubmit}>
                                    <Box>
                                        <DrawerHeadingParent>
                                            <DrawerHeading style={{ color: "#2a0560" }}> Record Incident</DrawerHeading>
                                        </DrawerHeadingParent>
                                        <DrawerBody>
                                            <div style={{
                                                padding: "2.5rem", width: "100%"

                                            }}>
                                                <FormControl variant="standard" fullWidth className="mb-5">
                                                    <InputLabel id="kidIncidentLabel">Kid:*</InputLabel>
                                                    <Select
                                                        labelId="kidIncidentLabel"
                                                        id="kidIncidentLabelKidselect"
                                                        {...incidentRegister('kidId', { required: { value: true, message: "Required" } })}
                                                        error={!!spinError.kidId}
                                                    >
                                                        {(kidList || []).map((item: KidListModel, index: any) => {
                                                            return (
                                                                <MenuItem key={"kid_incident" + item.id + index + 3} value={item.id}>{item.name}</MenuItem>

                                                            );
                                                        })}

                                                    </Select>
                                                </FormControl>

                                                <FormHelperText style={{ color: "Red" }}>
                                                    {incidentError.kidId?.message}
                                                </FormHelperText>

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
                                                                style={getStyles(item.value, incidentWatch("incidentCategory") || [], themePage)}
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
                                                                style={getStyles(item.value, incidentWatch("contacted") || [], themePage)}

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
                                                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Incident")}>
                                                    Cancel
                                                </Button>
                                                <Button variant="text" color="inherit" onClick={() => {
                                                    window?.print();
                                                }}>
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


                                </AppForm>
                            </Drawer>
                            <Drawer className="Mui-Drawe-w" anchor="right" open={openAlertForm} onClose={toggleDrawer(false, "Alert")}>
                                <AppForm onSubmit={handleAlertFormSubmit}>
                                    <Box>
                                        <DrawerHeadingParent>
                                            <DrawerHeading style={{ color: "#2a0560" }}> Create Alert</DrawerHeading>
                                        </DrawerHeadingParent>
                                        <DrawerBody>
                                            <div style={{
                                                padding: "2.5rem", width: "100%"

                                            }}>
                                                { <FormControl variant="standard" fullWidth className="mb-4">
                                                    <InputLabel id="kidAlertLabel">Kid:*</InputLabel>

                                                    <Select
                                                        labelId="kidAlertLabel"
                                                        id="kidAlertKidselect"
                                                        {...alertRegister('kidId', { required: true })}
                                                        value={alertWatch("kidId")}
                                                        label="Select Kid:*"
                                                    >
                                                        {(kidList || []).map((item: KidListModel, index: any) => {
                                                            return (
                                                                <MenuItem key={"kid_watch" + item.id + index + 3} value={item.id}>{item.name}</MenuItem>

                                                            );
                                                        })}
                                                    </Select>

                                                    <FormHelperText style={{ color: "Red" }}>
                                                        {alertError.kidId?.message}
                                                    </FormHelperText>
                                                </FormControl> }
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
                                                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Alert")}>
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
                            <Drawer className="Mui-Drawe-w" anchor="right" open={openKidProContact} onClose={toggleDrawer(false, "ProContact")}>
                                <AppForm onSubmit={handleProContactFormSubmit}>
                                    <Box>
                                        <DrawerHeadingParent>
                                            <DrawerHeading style={{ color: "#2a0560" }}> Professional Contact</DrawerHeading>
                                        </DrawerHeadingParent>
                                        <DrawerBody>
                                            <div style={{
                                                padding: "2.5rem", width: "100%"

                                            }}>
                                                <FormControl variant="standard" fullWidth className="mb-5">
                                                    <InputLabel id="kidProLabel">Kid:*</InputLabel>
                                                    <Select
                                                        labelId="kidProLabel"
                                                        id="kidRecordingLabelKidselect"
                                                        placeholder="Kid:*"
                                                        label="Kid:*"
                                                        {...proContactRegister("kidId", { required: true })}
                                                        error={!!proContactError.kidId}
                                                    >
                                                        {(kidList || []).map((item: KidListModel, index: any) => {
                                                            return (
                                                                <MenuItem key={"kid_pro_contact" + item.id + index + 3} value={item.id}>{item.name}</MenuItem>

                                                            );
                                                        })}

                                                    </Select>

                                                    <FormHelperText style={{ color: "Red" }} >
                                                        {proContactError.kidId?.message}
                                                    </FormHelperText>

                                                </FormControl>


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
                                                        {incidentError.date?.message}
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
                                                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "ProContact")}>
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
                            <Drawer className="Mui-Drawe-w" anchor="right" open={openPersonOnCall} onClose={toggleDrawer(false, "CallLog")}>
                                <AppForm onSubmit={handleCallLogFormSubmit}>
                                    <Box>
                                        <DrawerHeadingParent>
                                            <DrawerHeading style={{ color: "#2a0560" }}> Person On Call Log</DrawerHeading>
                                        </DrawerHeadingParent>
                                        <DrawerBody>
                                            <div style={{
                                                padding: "2.5rem", width: "100%"

                                            }}>
                                                <FormControl variant="standard" fullWidth className="mb-5">
                                                    <InputLabel id="kidSpinLabel">Select Kid:*</InputLabel>
                                                    <Select
                                                        labelId="kidSpinLabel"
                                                        id="kidSpinLabelKidselect"
                                                        {...personOnCallRegister('kidId', { required: true })}
                                                        value={personOnCallWatch("kidId")}
                                                        error={!!personOnCallError.kidId}
                                                        label="Select Kid:*"
                                                    >
                                                        {(kidList || []).map((item: KidListModel, index: any) => {
                                                            return (
                                                                <MenuItem key={"kid_spin_session" + item.id + index + 3} value={item.id}>{item.name}</MenuItem>

                                                            );
                                                        })}
                                                    </Select>

                                                    <FormHelperText style={{ color: "Red" }}>
                                                        {personOnCallError.kidId?.message}
                                                    </FormHelperText>
                                                </FormControl>
                                                <InputLabel id="kidRecordingDate" >Date:*</InputLabel>
                                                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                                                    <DateTimePicker
                                                        onChange={(event: any) => { personOnCallSetValue("date", event) }}
                                                        format="MM/dd/yyyy HH:mm"
                                                        value={personOnCallWatch("date")}
                                                        clearIcon={null}

                                                        required
                                                    />
                                                    <FormHelperText style={{ color: "Red" }} >
                                                        {personOnCallError.date?.message}
                                                    </FormHelperText>
                                                </div>


                                                <FormControl variant="standard" fullWidth className="mb-5">
                                                    <InputLabel id="kidCallMLabel">Manager:*</InputLabel>
                                                    <Select
                                                        labelId="kidCallMLabel"
                                                        id="kidLogLabelMKidselect"
                                                        {...personOnCallRegister('managerId', { required: true })}
                                                        value={personOnCallWatch("managerId")}
                                                        error={!!personOnCallError.managerId}
                                                    >
                                                        {(managerList || []).map((item: SelectList, index: any) => {
                                                            return (
                                                                <MenuItem key={"kid_call_log_manger_admin" + item.key + index + 3} value={item.key}>{item.value}</MenuItem>

                                                            );
                                                        })}

                                                    </Select>
                                                    <FormHelperText style={{ color: "Red" }} >
                                                        {personOnCallError.managerId?.message}
                                                    </FormHelperText>

                                                </FormControl>
                                                <TextField id="proNote" className="mb-4" fullWidth label="Reason for Callout: *" variant="standard"
                                                    {...personOnCallRegister("reason", { required: true })}
                                                    error={!!personOnCallError.reason}
                                                    helperText={personOnCallError.reason?.message} />
                                                <TextField id="proNote" className="mb-4" fullWidth label="Advice Given: *" variant="standard"
                                                    {...personOnCallRegister("advice", { required: true })}
                                                    error={!!personOnCallError.advice}
                                                    helperText={personOnCallError.advice?.message} />
                                                <TextField id="proNote" className="mb-4" fullWidth label="Note: *" variant="standard"
                                                    {...personOnCallRegister("note", { required: true })}
                                                    error={!!personOnCallError.note}
                                                    helperText={personOnCallError.note?.message} />


                                            </div>
                                            <div className="d-flex align-items-center justify-content-between" style={{
                                                padding: "2.5rem", width: "100%"
                                            }}>
                                                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "CallLog")}>
                                                    Cancel
                                                </Button>
                                                <Button variant="text" color="inherit" onClick={() => {
                                                    window?.print();
                                                }}>
                                                    Print
                                                </Button>

                                                <AppButton type="submit" className='btnLogin' disabled={!personOnCallIsValid} >
                                                    {!personOnCallSubmitting ?
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
                            <Drawer className="Mui-Drawe-w" anchor="right" open={openKidRecordingEdit} onClose={toggleDrawerEdit(false, "Recording")}>
                                <Box>
                                    <DrawerHeadingParent>
                                        <DrawerHeading style={{ color: "#2a0560" }}> Kid Payment</DrawerHeading>
                                    </DrawerHeadingParent>
                                    <IconButton
                                        aria-controls="simple-menu"
                                        aria-haspopup="true"

                                    >
                                        <MoreVertIcon />
                                    </IconButton>

                                    <DrawerBody>
                                        <div style={{
                                            padding: "2.5rem", width: "100%"

                                        }}>
                                            <div className="mb-1">

                                                <DisplayStart>
                                                    <ImgParentDiv>
                                                        {activityNoteViewModel?.kidName !== "" ? activityNoteViewModel?.kidName ?? "".charAt(0).toUpperCase() + activityNoteViewModel?.kidName ?? "".charAt(0).toUpperCase() : "A"}
                                                    </ImgParentDiv>
                                                    <TitleCard>
                                                        {activityNoteViewModel?.kidName}
                                                        <br />
                                                        <SubtitleCard>
                                                            {activityNoteViewModel?.houseName}
                                                        </SubtitleCard>
                                                    </TitleCard>

                                                </DisplayStart>
                                            </div>

                                            <Box style={{ display: 'flex', flexDirection: 'column', gap: "2px" }}>

                                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                        Notes
                                                    </Typography>
                                                    <Typography variant="body1">{activityNoteViewModel?.note}</Typography>
                                                </Box>
                                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                        Homes
                                                    </Typography>
                                                    <Typography variant="body1">{activityNoteViewModel?.houseName}</Typography>
                                                </Box>
                                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                        Created by:
                                                    </Typography>
                                                    <Typography variant="body1">{activityNoteViewModel?.createdUserName}</Typography>
                                                </Box>
                                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                        Date created:
                                                    </Typography>
                                                    <Typography variant="body1">{moment(activityNoteViewModel?.date).format('YYYY-MM-DDTHH:mm:ss')}</Typography>
                                                </Box>
                                            </Box>



                                        </div>
                                        <div className="d-flex align-items-center justify-content-between" style={{
                                            padding: "2.5rem", width: "100%",
                                        }}>
                                            <Button variant="text" color="inherit" onClick={toggleDrawer(false, "View")}>
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
                        <div>
                            <Drawer className="Mui-Drawe-w" anchor="right" open={open} onClose={toggleDrawerHome(false)}>

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
                                                    value={createWatch("name")}
                                                    error={!!createError.name}
                                                    helperText={createError.name?.message}
                                                />  <TextField id="standard-basic1" className="mb-4" fullWidth label="Phone:*"
                                                    variant="standard"
                                                    {...createRegister("phone", { required: true })}
                                                    value={createWatch("phone")}
                                                    error={!!createError.phone}
                                                    helperText={createError.phone?.message}
                                                />  <TextField id="standard-basic1" className="mb-4" fullWidth label="Location:*"
                                                    variant="standard"
                                                    value={createWatch("location")}
                                                    {...createRegister("location", { required: true })}
                                                    error={!!createError.location}
                                                    helperText={createError.location?.message}
                                                />

                                                <FormControl variant="standard" fullWidth className="mb-4">
                                                    <InputLabel id="demo-simple-select-standard-label">Homes Colour:*</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-standard-label"
                                                        id="demo-simple-select-standard"
                                                        error={!!createError.color} value={createWatch("color")}
                                                        value={createWatch("color")}
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
                                                <Button variant="text" color="inherit" onClick={toggleDrawerHome(false)}>
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

                    </Grid>
                    <Grid item xs={12} md={6} className='h-100'>
                        <KidWhereAbout houseId={hId ?? ""} />
                    </Grid>

                    <Grid className='mb-5 mx-2 mt-2' container spacing={5}>
                        {houseDetail?.isMoveOutHouse == false && <>
                            <Grid item xs={12} md={3}>
                                <DashboardCard className="mb-3" onClick={toggleDrawer(true, "Recording")}>
                                    <DisplayStart>
                                        <IconBox>
                                            <ChevronRightIcon sx={{
                                                color: "#741FD8"
                                            }} />
                                        </IconBox>
                                        <TitleCard style={{ color: "#2a0560" }}>
                                            Kid Recording
                                        </TitleCard>
                                    </DisplayStart>

                                </DashboardCard>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <DashboardCard className="mb-3" onClick={toggleDrawer(true, "Spin")}>
                                    <DisplayStart>
                                        <IconBox>
                                            <ChevronRightIcon sx={{
                                                color: "#741FD8"
                                            }} />
                                        </IconBox>
                                        <TitleCard style={{ color: "#2a0560" }}>
                                            SPIN Session
                                        </TitleCard>
                                    </DisplayStart>

                                </DashboardCard>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <DashboardCard className="mb-3" onClick={toggleDrawer(true, "Coaching")}>
                                    <DisplayStart>
                                        <IconBox>
                                            <ChevronRightIcon sx={{
                                                color: "#741FD8"
                                            }} />
                                        </IconBox>
                                        <TitleCard style={{ color: "#2a0560" }}>
                                            Coaching Session
                                        </TitleCard>
                                    </DisplayStart>

                                </DashboardCard>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <DashboardCard className="mb-3" onClick={toggleDrawer(true, "Incident")}>
                                    <DisplayStart>
                                        <IconBox>
                                            <ChevronRightIcon sx={{
                                                color: "#741FD8"
                                            }} />
                                        </IconBox>
                                        <TitleCard style={{ color: "#2a0560" }}>
                                            Record Incident
                                        </TitleCard>
                                    </DisplayStart>

                                </DashboardCard>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <DashboardCard className="mb-3" onClick={toggleDrawer(true, "Payment")}>
                                    <DisplayStart>
                                        <IconBox>
                                            <ChevronRightIcon sx={{
                                                color: "#741FD8"
                                            }} />
                                        </IconBox>
                                        <TitleCard style={{ color: "#2a0560" }}>
                                            Kid Payment
                                        </TitleCard>
                                    </DisplayStart>

                                </DashboardCard>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <DashboardCard className="mb-3" onClick={toggleDrawer(true, "ProContact")}>
                                    <DisplayStart>
                                        <IconBox>
                                            <ChevronRightIcon sx={{
                                                color: "#741FD8"
                                            }} />
                                        </IconBox>
                                        <TitleCard style={{ color: "#2a0560" }}>
                                            Professional Contact
                                        </TitleCard>
                                    </DisplayStart>

                                </DashboardCard>

                            </Grid>
                            <Grid item xs={12} md={3}>
                                <DashboardCard className="mb-3" onClick={toggleDrawer(true, "CallLog")}>
                                    <DisplayStart>
                                        <IconBox>
                                            <ChevronRightIcon sx={{
                                                color: "#741FD8"
                                            }} />
                                        </IconBox>
                                        <TitleCard style={{ color: "#2a0560" }}>
                                            Person On Call Log
                                        </TitleCard>
                                    </DisplayStart>

                                </DashboardCard>

                            </Grid>
                        </>
                        }
                        <Grid item xs={12} md={3}>
                            <DashboardCard className="mb-3" onClick={toggleDrawer(true, "Note")}>
                                <DisplayStart>
                                    <IconBox>
                                        <ChevronRightIcon sx={{
                                            color: "#741FD8"
                                        }} />
                                    </IconBox>
                                    <TitleCard style={{ color: "#2a0560" }}>
                                        General Note
                                    </TitleCard>
                                </DisplayStart>

                            </DashboardCard>
                        </Grid>

                    </Grid >
                    <Grid item xs={12} md={12}>
                        <div className="kidsDetailBox">
                            <Box>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    sx={{
                                        "& button": { borderRadius: 2.5 },
                                        "& button:hover": { backgroundColor: '#2a0560', color: "white" },
                                        "& button:active": { color: 'white;', backgroundColor: '#2a0560' },
                                        "& button.Mui-selected": { color: 'white;', backgroundColor: '#2a0560' }
                                    }}
                                    aria-label="basic tabs example"
                                >


                                    <Tab label="DASHBOARD" {...a1yProps(0)} />
                                    <Tab label="ACTIVITY" {...a1yProps(1)} />
                                    <Tab label="TASKS" {...a1yProps(2)} />
                                    <Tab label="KIDS" {...a1yProps(3)} />
                                    <Tab label="ROOMS" {...a1yProps(4)} />
                                    <Tab label="FILES" {...a1yProps(5)} />
                                </Tabs>
                            </Box>
                            <HouseCustomTabPanel value={value} index={0}>
                                <Grid className='mb-4' container spacing={5}>
                                    <Grid item xs={12} md={6} className='h-100'>
                                        <IconButton style={{ color: "white" }} onClick={getHouseDetailForView(houseDetail?.name ?? "", houseDetail?.address ?? "", houseDetail?.color ?? "", houseDetail?.contact ?? "")} size="small" sx={{
                                            Color: "#2a0560",
                                            boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                                            backgroundColor: "#2a0560",
                                        }}>
                                            <ModeIcon sx={{ color: "white" }} className='' />
                                        </IconButton>
                                        <AlertHeading className='mb-4 pb-1' style={{ color: "#2a0560" }}>
                                            Homes Details
                                        </AlertHeading>

                                        <div style={{ height: '70vh', width: '100%' }}>
                                            <GoogleMapReact
                                                bootstrapURLKeys={{ key: "" }}
                                                defaultCenter={defaultProps.center}
                                                defaultZoom={defaultProps.zoom}
                                            >
                                                {/* <AnyReactComponent
                                                    lat={59.955413}
                                                    lng={30.337844}
                                                    text="My Marker"
                                                /> */}
                                            </GoogleMapReact>
                                        </div>


                                        <DashboardCardBgGreen>
                                            <DashboardCardBgGreenChildDivCol>
                                                <DashboardCardBgGreenChildDivCol2>
                                                    <div>
                                                        <GreenTextLabel>
                                                            {houseDetail?.address}
                                                        </GreenTextLabel>
                                                    </div>
                                                    <div>
                                                        <GreenTextLabelSmall>
                                                            Address
                                                        </GreenTextLabelSmall>
                                                    </div>
                                                </DashboardCardBgGreenChildDivCol2>
                                                <DashboardCardBgGreenChildDivCol2>
                                                    <div>
                                                        <GreenTextLabel>
                                                            {houseDetail?.contact}
                                                        </GreenTextLabel>
                                                    </div>
                                                    <div>
                                                        <GreenTextLabelSmall>
                                                            Contact No.
                                                        </GreenTextLabelSmall>
                                                    </div>
                                                </DashboardCardBgGreenChildDivCol2>
                                            </DashboardCardBgGreenChildDivCol>
                                        </DashboardCardBgGreen>
                                    </Grid>
                                    <Grid item xs={12} md={6} className='h-100'>
                                        <AlertHeading className='mb-4 pb-1' style={{ color: "#2a0560" }}>
                                            Tasks
                                        </AlertHeading>

                                        {taskDashboardList == undefined || taskDashboardList.length == 0 &&
                                            <GreyBoxParent className=''>
                                                <div className="d-flex align-items-center justify-content-between  mt-4">
                                                    <AlertHeading style={{ color: "#2a0560" }}>
                                                        All Tasks
                                                    </AlertHeading>
                                                    {/* Display Task List Here */}
                                                </div>
                                                <GreyBox>
                                                    <Box>
                                                        <GreyBoxHeadingParent>
                                                            <div className='svgWidth'>
                                                                <svg id="b21613c9-2bf0-4d37-bef0-3b193d34fc5d" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="647.63626" height="632.17383" viewBox="0 0 647.63626 632.17383"><path d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z" transform="translate(-276.18187 -133.91309)" fill="#f2f2f2"></path><path d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="190.15351" cy="24.95465" r="20" fill="#0AB472"></circle><circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff"></circle><path d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z" transform="translate(-276.18187 -133.91309)" fill="#e6e6e6"></path><path d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="433.63626" cy="105.17383" r="20" fill="#0AB472"></circle><circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff"></circle></svg>
                                                            </div>
                                                            <GreyBoxHeading>
                                                                No Tasks
                                                            </GreyBoxHeading>
                                                            <GreyBoxDesc>
                                                                If there should be an tasks, try creating one. Otherwise, kick back and relax.
                                                            </GreyBoxDesc>
                                                        </GreyBoxHeadingParent>
                                                    </Box>
                                                </GreyBox>
                                            </GreyBoxParent>
                                        }
                                        <div className="d-flex align-items-center justify-content-end">
                                            <Icon style={{ height: "unset" }}>  <ChevronLeftIcon className='text-body-tertiary iconHeight' /></Icon>
                                            <Icon></Icon>
                                            <Icon style={{ height: "unset" }}>  <ChevronRightIcon className='text-body-tertiary iconHeight' /></Icon>
                                        </div>

                                        <Box>
                                            {taskDashboardList != undefined && taskDashboardList.length > 0 &&
                                                <>
                                                    {((taskDashboardList || []).slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)).map((item: TaskListModel, index: any) => {
                                                        return (
                                                            <Alert style={{ backgroundColor: "#54d5cb" }} severity="success" icon={false} className='d-block mb-3' key={(currentPage - 1) * 2 + index + 1}>
                                                                <div className='d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <label className="mb-0">
                                                                            {item.title}
                                                                        </label>
                                                                    </div>
                                                                    <div>
                                                                        <label className="fw-bold fs-7">
                                                                            {moment(item.dueDate).format('YYYY-MM-DDTHH:mm:ss')}
                                                                        </label>
                                                                    </div>
                                                                    {/* <div>
                                                            <label className="mb-0">
                                                            {item.text}
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label>
                                                            {item.kidName}
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label>
                                                            {item.houseName}
                                                            </label>
                                                        </div> */}
                                                                    <div>
                                                                        <Link to="">
                                                                            {/* <IconButton className='headerIcon' onClick={() => { getTaskDetail(item.id ?? "") }}>
                                                                                    <Icon>  <ChevronRightIcon className='text-body-tertiary iconHeight' /></Icon>
                                                                                </IconButton> */}
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </Alert>
                                                        );
                                                    })}
                                                    <Stack spacing={2}>

                                                        <Pagination count={pageCount} page={currentPage} onChange={(event: any, page: number) => { setCurrentPage(page) }} />

                                                    </Stack>
                                                </>}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </HouseCustomTabPanel>
                            <HouseCustomTabPanel value={value} index={1}>
                                <ActivityLog logUpdate={logUpdate} ></ActivityLog>
                            </HouseCustomTabPanel>
                            <HouseCustomTabPanel value={value} index={2}>
                                <TaskTab
                                />
                            </HouseCustomTabPanel>
                            <HouseCustomTabPanel value={value} index={3}>
                                <KidsTab kidListHouse={kidList || []} />
                            </HouseCustomTabPanel>

                            <HouseCustomTabPanel value={value} index={4}>
                                <RoomTab houseId={hId ?? ""} />
                            </HouseCustomTabPanel>
                            <HouseCustomTabPanel value={value} index={5}>
                                <FileTab context="home" houseId={hId ?? ""} kidList={kidList || []} />
                            </HouseCustomTabPanel>

                        </div>

                    </Grid>
                </Grid >


            </Container>
        </>
    );
}

export default Houses;
