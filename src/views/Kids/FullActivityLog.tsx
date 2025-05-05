

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Grid, Typography } from "@mui/material";
import { AppBar, Toolbar, Icon, IconButton } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import React, { useState, useEffect } from 'react';
import { DrawerHeading, DrawerStepHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
import { DashboardCard, DisplayBetween, DisplayNumber, GreyBox, SubtitleCard, GreyBoxDesc, DisplayStart, GreenTextLabel, GreenTextLabelSmall, GreyBoxParent, GreyBoxHeading, GreyBoxHeadingParent, AlertHeading, PlusButton, ImgParentDiv, ImgParentDivLg, ImgParentDivSmall, DashboardCardBgGreen, DashboardCardBgGreenChildDiv, DashboardCardBgGreenChildDivCol, DashboardCardBgGreenChildDivCol2, DashboardCardpurple, TitleCard, SmallTitleCard, PageHeading, PageHeadingSmall } from "./KidTabScreenStyles";
import SelectCommon from "../../components/FormComponents";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AppButton } from "../../components";
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import constants, { coachingSessionCategories } from '../../service/Constants';
import { MenuProps, TrmText, contactedOptions, incidentCategoryOption } from '../../service/Constants';
import { VALIDATE_FORM_KID_RECORDING, VALIDATE_FORM_KID_PAYMENT, coachingschema, incidentschema, spinschema } from '../../service/ValidationSchema';
import { GetAxios } from '../../service/AxiosHelper';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
interface Iprops {

}
export default function FullActivityLog(props: Iprops) {
    const [selectedTime, setSelectedTime] = useState("0"); // Set the default value here
    const [selectedType, setSelectedType] = useState("All"); // Set the default value here
    //const PAGE_SIZE = 5; // Number of items per page
    const [PAGE_SIZE, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [logList, setLogList] = useState<ActivityLogModel[]>();

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
    const [riskAssessmentViewModel, setRiskAssessmentViewModel] = useState<RiskAssessmentDashboardViewModel>();
    const [behaviourList, setBehavioursViewModel] = useState<BehavioursViewModel[]>();

    const [openLogActivity, setOpenLogActivity] = React.useState(false);
    const [openLogLocation, setOpenLogLocation] = React.useState(false);
    const [openLogNote, setOpenLogNote] = React.useState(false);
    const [openLogIncident, setOpenLogIncident] = React.useState(false);
    const [openLogCoaching, setOpenLogCoaching] = React.useState(false);
    const [openLogSpin, setOpenLogSpin] = React.useState(false);
    const [openLogRisk, setOpenLogRisk] = React.useState(false);



    const { kidId } = useParams();
    const [kidDetail, setKidDetail] = useState<KidViewModel>();
    const getCurrentPageLogs = (): ActivityLogModel[] => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return (logList || []).slice(startIndex, endIndex);
    };
    const getKidDetal = () => {
        GetAxios().get(constants.Api_Url + 'Kid/GetKid?kId=' + kidId).then(res => {
            if (res.data.success) {

                setKidDetail(res.data.data);

            }
        })

    };


    useEffect(() => {

        getKidDetal();


    }, []);
    const getLogList = () => {
        const formData = new FormData();
        formData.append('type', selectedType);
        formData.append('time', selectedTime);
        formData.append("kidId", kidId ?? "");
        formData.append("houseId", "");

        GetAxios().post(constants.Api_Url + 'Dashboard/GetLogs', formData).then(res => {
            if (res.data.success) {
                setLogList(res.data.list);
            }
        })
    };
    React.useEffect(() => {

        getLogList();

    }, [selectedTime, selectedType]);


    const toggleLogDrawer = (open: any, type: string) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        else if (type == "ACTIVITY") {
            setOpenLogActivity(open); setOpenLogCoaching(false); setOpenLogNote(false);
            setOpenLogIncident(false); setOpenLogLocation(false); setOpenLogRisk(false); setOpenLogSpin(false);
        }
        else if (type == "INCIDENT") {
            setOpenLogActivity(false); setOpenLogCoaching(false); setOpenLogNote(false);
            setOpenLogIncident(open); setOpenLogLocation(false); setOpenLogRisk(false); setOpenLogSpin(false);

        }
        else if (type == "COACHING_SESSION") {
            setOpenLogActivity(false); setOpenLogCoaching(open); setOpenLogNote(false);
            setOpenLogIncident(false); setOpenLogLocation(false); setOpenLogRisk(false); setOpenLogSpin(false);

        }
        else if (type == "LOCATION") {
            setOpenLogActivity(false); setOpenLogCoaching(false); setOpenLogNote(false);
            setOpenLogIncident(false); setOpenLogLocation(open); setOpenLogRisk(false); setOpenLogSpin(false);
        }
        else if (type == "SPIN_SESSION") {
            setOpenLogActivity(false); setOpenLogCoaching(false); setOpenLogNote(false);
            setOpenLogIncident(false); setOpenLogLocation(false); setOpenLogRisk(false); setOpenLogSpin(open);
        }
        else if (type == "NOTE") {
            setOpenLogActivity(false); setOpenLogCoaching(false); setOpenLogNote(open);
            setOpenLogIncident(false); setOpenLogLocation(false); setOpenLogRisk(false); setOpenLogSpin(false);
        }
        else if (type == "RISK_ASSESSMENT") {
            setOpenLogActivity(open); setOpenLogCoaching(false); setOpenLogNote(false);
            setOpenLogIncident(false); setOpenLogLocation(false); setOpenLogRisk(open); setOpenLogSpin(false);
        }
    };

    const getBehaviourList = (): BehavioursViewModel[] => {
        return (behaviourList || []);
    };


    const toggleDrawerClose = (open: any, type: string) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        type = type.toLowerCase();

        if (type == "activity") {

            setOpenKidRecordingEdit(open); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
            setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(false); setOpenRiskFormEdit(false);
        }
        else if (type == "location") { //location
            setOpenRiskFormEdit(false); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(open); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
            setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(false);
        }
        else if (type == "spin") {
            setOpenRiskFormEdit(false); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(open); setOpenKidNoteEdit(false);
            setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(false);
        }
        if (type == "note") {
            setOpenRiskFormEdit(false); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(open);
            setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(false);
        }
        else if (type == "incident") {
            setOpenRiskFormEdit(false); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
            setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(open);
        }
        else if (type == "coaching_session") {
            setOpenRiskFormEdit(false); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
            setOpenKidCoachingEdit(open); setOpenKidIncidentEdit(false);
        }
        else if (type == "risk") {
            setOpenRiskFormEdit(open); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
            setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(false);
        }
    };


    const getKidRecording = (logid: string) => {
        GetAxios().get(constants.Api_Url + 'Dashboard/GetKidRecording?logId=' + logid).then(res => {
            if (res.data.success) {
                setActivityNoteViewModel(res.data.data);
                setOpenKidRecordingEdit(true); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
                setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(false); setOpenRiskFormEdit(false);
            }
        })
    };

    const getSpinSession = (logid: string) => {
        GetAxios().get(constants.Api_Url + 'Dashboard/GetSpinSession?logId=' + logid).then(res => {
            if (res.data.success) {
                setSpinSessionViewModel(res.data.data);
                setBehavioursViewModel(res.data.data.behaviours);
                setOpenRiskFormEdit(false); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(true); setOpenKidNoteEdit(false);
                setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(false);
            }
        })
    };

    const getCoachingSession = (logid: string) => {
        GetAxios().get(constants.Api_Url + 'Dashboard/GetCoachingSession?logId=' + logid).then(res => {
            if (res.data.success) {
                setCoachingSessionViewModel(res.data.data);
                setOpenRiskFormEdit(false); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
                setOpenKidCoachingEdit(true); setOpenKidIncidentEdit(false);
            }
        })
    };

    const getRecordIncident = (logid: string) => {
        GetAxios().get(constants.Api_Url + 'Dashboard/GetRecordIncident?logId=' + logid).then(res => {
            if (res.data.success) {
                setRecordIncidentViewModel(res.data.data);
                setOpenRiskFormEdit(false); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
                setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(true);
            }
        })
    };

    const getGeneralNote = (logid: string) => {
        GetAxios().get(constants.Api_Url + 'Dashboard/GetGeneralNote?logId=' + logid).then(res => {
            if (res.data.success) {
                setGeneralNoteViewModel(res.data.data);
                setOpenRiskFormEdit(false); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(true);
                setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(false);
            }
        })
    };

    const getKidLogLocation = (logid: string) => {
        GetAxios().get(constants.Api_Url + 'Dashboard/GetKidLogLocation?logId=' + logid).then(res => {
            if (res.data.success) {
                setKidLogLocationViewModel(res.data.data);
                setOpenRiskFormEdit(false); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(true); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
                setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(false);
            }
        })
    };

    const getRiskAssessment = (logid: string) => {
        GetAxios().get(constants.Api_Url + 'Dashboard/GetRiskAssessment?logId=' + logid).then(res => {
            if (res.data.success) {
                setRiskAssessmentViewModel(res.data.data);
                setOpenRiskFormEdit(true); setOpenKidRecordingEdit(false); setOpenKidLocationEdit(false); setOpenSpinSessionEdit(false); setOpenKidNoteEdit(false);
                setOpenKidCoachingEdit(false); setOpenKidIncidentEdit(false);
            }
        })
    };


    const handleChangePerPage = (event: any, value: any) => {
        setPageSize(value.props.value);
    };

    const toggleDrawerEdit = (open: any, id: string, type: string) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        type = type.toLowerCase();
        if (type == "activity") {
            getKidRecording(id);

        }
        else if (type == "location") { //location
            getKidLogLocation(id);
        }
        else if (type == "spin_session") {
            getSpinSession(id);
        }
        if (type == "note") {
            getGeneralNote(id);

        }
        else if (type == "incident") {
            getRecordIncident(id);

        }
        else if (type == "coaching_session") {
            getCoachingSession(id);

        }
        else if (type == "risk_assessment") {
            getRiskAssessment(id);
        }
    };




    return (<>


        <Box className="screenContainer">
            <Typography
                variant="h4"
                color="textSecondary"
                style={{ paddingBottom: '16px' }}
            >
                Young person activity logs
            </Typography>
            <Typography variant="h6" style={{ paddingBottom: '32px', }}>
                {kidDetail?.name}
            </Typography>
            <Button
                style={{ marginTop: '32px', float: 'right', color: "#0AB472" }}
                variant="outlined"
                onClick={() => {
                    window?.print();
                }}
            >
                Print Logs
            </Button>


            <Box className='d-flex align-items-center justify-content-between mt-10' data-item="activity-log-header" style={{ marginTop: "40px" }}>
                <div>
                    <FormControl variant="outlined" className='' size="small">
                        <Select
                            value={PAGE_SIZE}
                            onChange={handleChangePerPage}
                            sx={{
                                borderRadius: "30px",
                                width: "200px",
                                marginRight: "20px"
                            }}
                        >
                            <MenuItem value={10} defaultValue={10}>10 per page</MenuItem>
                            <MenuItem value={25}>25 per page</MenuItem>
                            <MenuItem value={50}>50 per page</MenuItem>

                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" className='' size="small">
                        <Select
                            value={selectedTime}
                            onChange={(event: any) => { setSelectedTime(event.target.value) }}
                            sx={{
                                borderRadius: "30px",
                                width: "200px",
                                marginRight: "20px"
                            }}
                        >
                            <MenuItem value="0">Show: All Time</MenuItem>
                            <MenuItem value="7">Show: Last 7 days</MenuItem>
                            <MenuItem value="14">Show: Last 14 days</MenuItem>
                            <MenuItem value="39">Show: Last 30 days</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" className='' size="small">
                        <Select
                            value={selectedType}
                            onChange={(event: any) => { setSelectedType(event.target.value) }}
                            sx={{
                                borderRadius: "30px",
                                width: "200px",
                            }}
                        >
                            <MenuItem value="All">Type: All</MenuItem>
                            <MenuItem value="ACTIVITY">Type: Activity</MenuItem>
                            <MenuItem value="INCIDENT">Type: Incident</MenuItem>
                            <MenuItem value="COACHING_SESSION">Type: Coaching Session</MenuItem>
                            <MenuItem value="SPIN_SESSION">Type: SPIN Session</MenuItem>
                            <MenuItem value="NOTE">Type: Note</MenuItem>
                            <MenuItem value="LOCATION">Type: Location</MenuItem>
                            <MenuItem value="RISK_ASSESSMENT">Type: Risk Assessment</MenuItem>
                        </Select>
                    </FormControl>
                </div>

            </Box>

            <Typography variant="h6" gutterBottom>

                <div className='d-flex align-items-center'>
                    <div style={{width:"15%"}}>
                        <label className="mb-0">
                            Created Date
                        </label>
                    </div>
                    <div style={{width:"11%"}}>
                        <label className="mb-0">
                            Time
                        </label>
                    </div>
                    <div style={{width:"12%"}}>
                        <label className="mb-0">
                            Heading
                        </label>
                    </div>
                    <div style={{width:"28%"}}>
                        <label className="mb-0">
                            Notes
                        </label>
                    </div>
                    <div style={{width:"15%"}}>
                        <label className="mb-0">
                            Kid Name
                        </label>
                    </div>
                    <div style={{width:"15%"}}>
                        <label className="mb-0">
                            House Name
                        </label>
                    </div>
                    <div>
                        <label className="mb-0">
                            View
                        </label>
                    </div>
                </div>

            </Typography>

            <Box style={{ marginTop: "30px" }}>
                {logList != undefined && logList.length > 0 &&
                    <>
                        {(getCurrentPageLogs() || []).map((item: ActivityLogModel, index: any) => {
                            return (
                                <Alert style={{ backgroundColor: "#54d5cb" }} severity="success" icon={false} className='d-block mb-3' key={(currentPage - 1) * 2 + index + 1}>
                                    <div className='d-flex align-items-center justify-content-between'style={{overflowY:"auto"}}>
                                        <div style={{width:"20%",minWidth:"6.5rem"}}>
                                            <label className="mb-0">
                                            {moment(item.date??new Date()).format('YYYY-MM-DDTHH:mm:ss')}
                                      
                                            </label>
                                        </div>
                                        <div style={{width:"16%",minWidth:"5rem"}}>
                                            <label className="mb-0">
                                                {item.time}
                                            </label>
                                        </div>
                                        <div style={{width:"16%",minWidth:"5.2rem"}}>
                                            <label className="fw-bold fs-7">
                                                {item.heading}
                                            </label>
                                        </div>
                                        <div style={{width:"40%",minWidth:"10rem"}}>
                                            <label className="mb-0">
                                                {item.text}
                                            </label>
                                        </div>
                                        <div style={{width:"20%",minWidth:"5rem"}}>
                                            <label>
                                                {item.kidName}
                                            </label>
                                        </div>
                                        <div style={{width:"20%",minWidth:"5rem"}}>
                                            <label>
                                                {item.houseName}
                                            </label>
                                        </div>
                                        <div>
                                            <Link to="">
                                                <IconButton className='headerIcon' onClick={toggleDrawerEdit(true, item.id, item.type)}>
                                                    <Icon>  <ChevronRightIcon className='text-body-tertiary iconHeight' /></Icon>
                                                </IconButton>
                                            </Link>
                                        </div>
                                    </div>
                                </Alert>
                            );
                        })}
                        <Stack spacing={2}>

                            <Pagination count={Math.ceil((logList?.length) || 0 / PAGE_SIZE)} page={currentPage} onChange={(event: any, page: number) => { setCurrentPage(page) }} />

                        </Stack>
                    </>}

                {logList == undefined || logList.length == 0 &&
                    <> <GreyBox><GreyBoxHeadingParent>
                        <div className='svgWidth'>
                            <svg id="b21613c9-2bf0-4d37-bef0-3b193d34fc5d" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="647.63626" height="632.17383" viewBox="0 0 647.63626 632.17383"><path d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z" transform="translate(-276.18187 -133.91309)" fill="#f2f2f2"></path><path d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="190.15351" cy="24.95465" r="20" fill="#0AB472"></circle><circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff"></circle><path d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z" transform="translate(-276.18187 -133.91309)" fill="#e6e6e6"></path><path d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="433.63626" cy="105.17383" r="20" fill="#0AB472"></circle><circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff"></circle></svg>
                        </div>
                        <GreyBoxHeading>
                            No Activities Logged
                        </GreyBoxHeading>
                        <GreyBoxDesc>
                            Try adding an activity and coming back later.
                        </GreyBoxDesc>
                    </GreyBoxHeadingParent></GreyBox></>
                }

            </Box>
        </Box>

        <div>
            <Drawer className="Mui-Drawe-w" anchor="right" open={openKidRecordingEdit} onClose={toggleDrawerClose(false, "activity")}>
                <Box>
                    <DrawerHeadingParent>
                        <DrawerHeading style={{ color: "#2a0560" }}> Activity</DrawerHeading>
                    </DrawerHeadingParent>
                    <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"

                    >
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
                                        Notes:
                                    </Typography>
                                    <Typography variant="body1">{activityNoteViewModel?.note}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Homes:
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
                                    <Typography variant="body1">{moment(activityNoteViewModel?.date??new Date()).format('YYYY-MM-DDTHH:mm:ss')}</Typography>
                                </Box>
                            </Box>



                        </div>
                        <div className="d-flex align-items-center justify-content-between" style={{
                            padding: "2.5rem", width: "100%",
                        }}>
                            <Button variant="text" color="inherit" onClick={toggleDrawerClose(false, "activity")}>
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



            <Drawer className="Mui-Drawe-w" anchor="right" open={openKidIncidentEdit} onClose={toggleDrawerClose(false, "incident")}>
                <Box>
                    <DrawerHeadingParent>
                        <DrawerHeading style={{ color: "#2a0560" }}> Incident Log</DrawerHeading>
                    </DrawerHeadingParent>
                    <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"

                    >
                    </IconButton>

                    <DrawerBody>
                        <div style={{
                            padding: "2.5rem", width: "100%"

                        }}>
                            <div className="mb-1">

                                <DisplayStart>
                                    <ImgParentDiv>
                                        {recordIncidentViewModel?.kidName !== "" ? recordIncidentViewModel?.kidName ?? "".charAt(0).toUpperCase() + recordIncidentViewModel?.kidName ?? "".charAt(0).toUpperCase() : "A"}
                                    </ImgParentDiv>
                                    <TitleCard>
                                        {recordIncidentViewModel?.kidName}
                                        <br />
                                        <SubtitleCard>
                                            {recordIncidentViewModel?.houseName}
                                        </SubtitleCard>
                                    </TitleCard>

                                </DisplayStart>
                            </div>

                            <Box style={{ display: 'flex', flexDirection: 'column', gap: "2px" }}>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Location:
                                    </Typography>
                                    <Typography variant="body1">{recordIncidentViewModel?.location}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Category:
                                    </Typography>
                                    <Typography variant="body1">{recordIncidentViewModel?.incidentCategory}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Witnesses:
                                    </Typography>
                                    <Typography variant="body1">{recordIncidentViewModel?.witnesses}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Contacted:
                                    </Typography>
                                    <Typography variant="body1">{recordIncidentViewModel?.contacted}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Police Incident Report Number:
                                    </Typography>
                                    <Typography variant="body1">{recordIncidentViewModel?.policeIncidentNumber}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Notes:
                                    </Typography>
                                    <Typography variant="body1">{recordIncidentViewModel?.note}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Homes:
                                    </Typography>
                                    <Typography variant="body1">{recordIncidentViewModel?.houseName}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Created by:
                                    </Typography>
                                    <Typography variant="body1">{recordIncidentViewModel?.createdUserName}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Date created:
                                    </Typography>
                                    <Typography variant="body1">{moment(recordIncidentViewModel?.date ?? new Date()).format('YYYY-MM-DDTHH:mm:ss')}</Typography>
                                
                                </Box>
                            </Box>



                        </div>
                        <div className="d-flex align-items-center justify-content-between" style={{
                            padding: "2.5rem", width: "100%",
                        }}>
                            <Button variant="text" color="inherit" onClick={toggleDrawerClose(false, "incident")}>
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

            <Drawer className="Mui-Drawe-w" anchor="right" open={openKidCoachingEdit} onClose={toggleDrawerClose(false, "coaching_session")}>
                <Box>
                    <DrawerHeadingParent>
                        <DrawerHeading style={{ color: "#2a0560" }}> Coaching Session</DrawerHeading>
                    </DrawerHeadingParent>
                    <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"

                    >
                    </IconButton>

                    <DrawerBody>
                        <div style={{
                            padding: "2.5rem", width: "100%"

                        }}>
                            <div className="mb-1">

                                <DisplayStart>
                                    <ImgParentDiv>
                                        {coachingSessionViewModel?.kidName !== "" ? coachingSessionViewModel?.kidName ?? "".charAt(0).toUpperCase() + coachingSessionViewModel?.kidName ?? "".charAt(0).toUpperCase() : "A"}
                                    </ImgParentDiv>
                                    <TitleCard>
                                        {coachingSessionViewModel?.kidName}
                                        <br />
                                        <SubtitleCard>
                                            {coachingSessionViewModel?.houseName}
                                        </SubtitleCard>
                                    </TitleCard>

                                </DisplayStart>
                            </div>

                            <Box style={{ display: 'flex', flexDirection: 'column', gap: "2px" }}>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Category:
                                    </Typography>
                                    <Typography variant="body1">{coachingSessionViewModel?.category}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Sub-Category:
                                    </Typography>
                                    <Typography variant="body1">{coachingSessionViewModel?.subCategory}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Status:
                                    </Typography>
                                    <Typography variant="body1">{coachingSessionViewModel?.status}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Notes:
                                    </Typography>
                                    <Typography variant="body1">{coachingSessionViewModel?.note}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Concerns:
                                    </Typography>
                                    <Typography variant="body1">{coachingSessionViewModel?.concerns}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Notes:
                                    </Typography>
                                    <Typography variant="body1">{coachingSessionViewModel?.actions}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Homes:
                                    </Typography>
                                    <Typography variant="body1">{coachingSessionViewModel?.houseName}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Created by:
                                    </Typography>
                                    <Typography variant="body1">{coachingSessionViewModel?.createdUserName}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Date created:
                                    </Typography>
                                    <Typography variant="body1">{moment(coachingSessionViewModel?.date??new Date()).format('YYYY-MM-DDTHH:mm:ss')}</Typography>
                                  </Box>
                            </Box>



                        </div>
                        <div className="d-flex align-items-center justify-content-between" style={{
                            padding: "2.5rem", width: "100%",
                        }}>
                            <Button variant="text" color="inherit" onClick={toggleDrawerClose(false, "coaching_session")}>
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

            <Drawer className="Mui-Drawe-w" anchor="right" open={openKidNoteEdit} onClose={toggleDrawerClose(false, "note")}>
                <Box>
                    <DrawerHeadingParent>
                        <DrawerHeading style={{ color: "#2a0560" }}> General Note</DrawerHeading>
                    </DrawerHeadingParent>
                    <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"

                    >
                    </IconButton>

                    <DrawerBody>
                        <div style={{
                            padding: "2.5rem", width: "100%"

                        }}>
                            <div className="mb-1">

                                <DisplayStart>
                                    <ImgParentDiv>
                                        {generalNoteViewModel?.kidName !== "" ? generalNoteViewModel?.kidName ?? "".charAt(0).toUpperCase() + generalNoteViewModel?.kidName ?? "".charAt(0).toUpperCase() : "A"}
                                    </ImgParentDiv>
                                    <TitleCard>
                                        {generalNoteViewModel?.kidName}
                                        <br />
                                        <SubtitleCard>
                                            {generalNoteViewModel?.houseName}
                                        </SubtitleCard>
                                    </TitleCard>

                                </DisplayStart>
                            </div>

                            <Box style={{ display: 'flex', flexDirection: 'column', gap: "2px" }}>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Notes:
                                    </Typography>
                                    <Typography variant="body1">{generalNoteViewModel?.note}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Homes:
                                    </Typography>
                                    <Typography variant="body1">{generalNoteViewModel?.houseName}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Created by:
                                    </Typography>
                                    <Typography variant="body1">{generalNoteViewModel?.createdUserName}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Date created:
                                    </Typography>
                                    <Typography variant="body1">{moment(generalNoteViewModel?.date??new Date()).format('YYYY-MM-DDTHH:mm:ss')}</Typography>
                                  </Box>
                            </Box>



                        </div>
                        <div className="d-flex align-items-center justify-content-between" style={{
                            padding: "2.5rem", width: "100%",
                        }}>
                            <Button variant="text" color="inherit" onClick={toggleDrawerClose(false, "note")}>
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


            <Drawer className="Mui-Drawe-w" anchor="right" open={openKidLocationEdit} onClose={toggleDrawerClose(false, "location")}>
                <Box>
                    <DrawerHeadingParent>
                        <DrawerHeading style={{ color: "#2a0560" }}> Location</DrawerHeading>
                    </DrawerHeadingParent>
                    <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"

                    >
                    </IconButton>

                    <DrawerBody>
                        <div style={{
                            padding: "2.5rem", width: "100%"

                        }}>
                            <div className="mb-1">

                                <DisplayStart>
                                    <ImgParentDiv>
                                        {kidLogLocationViewModel?.kidName !== "" ? kidLogLocationViewModel?.kidName ?? "".charAt(0).toUpperCase() + kidLogLocationViewModel?.kidName ?? "".charAt(0).toUpperCase() : "A"}
                                    </ImgParentDiv>
                                    <TitleCard>
                                        {kidLogLocationViewModel?.kidName}
                                        <br />
                                        <SubtitleCard>
                                            {kidLogLocationViewModel?.houseName}
                                        </SubtitleCard>
                                    </TitleCard>

                                </DisplayStart>
                            </div>

                            <Box style={{ display: 'flex', flexDirection: 'column', gap: "2px" }}>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Notes:
                                    </Typography>
                                    <Typography variant="body1">{kidLogLocationViewModel?.note}</Typography>
                                </Box>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Police Incident Report Number:
                                    </Typography>
                                    <Typography variant="body1">{kidLogLocationViewModel?.incidentNumber}</Typography>
                                </Box>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Homes:
                                    </Typography>
                                    <Typography variant="body1">{kidLogLocationViewModel?.houseName}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Created by:
                                    </Typography>
                                    <Typography variant="body1">{kidLogLocationViewModel?.createdUserName}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Date created:
                                    </Typography>
                                    <Typography variant="body1">{moment(kidLogLocationViewModel?.date??new Date()).format('YYYY-MM-DDTHH:mm:ss')}</Typography>
                                </Box>
                            </Box>



                        </div>
                        <div className="d-flex align-items-center justify-content-between" style={{
                            padding: "2.5rem", width: "100%",
                        }}>
                            <Button variant="text" color="inherit" onClick={toggleDrawerClose(false, "location")}>
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


            <Drawer className="Mui-Drawe-w" anchor="right" open={openRiskFormEdit} onClose={toggleDrawerClose(false, "risk")}>
                <Box>
                    <DrawerHeadingParent>
                        <DrawerHeading style={{ color: "#2a0560" }}> Risk  Assessments</DrawerHeading>
                    </DrawerHeadingParent>
                    <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"

                    >
                    </IconButton>

                    <DrawerBody>
                        <div style={{
                            padding: "2.5rem", width: "100%"

                        }}>
                            <div className="mb-1">

                                <DisplayStart>
                                    <ImgParentDiv>
                                        {riskAssessmentViewModel?.kidName !== "" ? riskAssessmentViewModel?.kidName ?? "".charAt(0).toUpperCase() + riskAssessmentViewModel?.kidName ?? "".charAt(0).toUpperCase() : "A"}
                                    </ImgParentDiv>
                                    <TitleCard>
                                        {riskAssessmentViewModel?.kidName}
                                        <br />
                                        <SubtitleCard>
                                            {riskAssessmentViewModel?.houseName}
                                        </SubtitleCard>
                                    </TitleCard>

                                </DisplayStart>
                            </div>

                            <Box style={{ display: 'flex', flexDirection: 'column', gap: "2px" }}>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Notes:
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.note}</Typography>
                                </Box>


                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Risk of suicide or deliberate self harm:
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.suicide}</Typography>
                                </Box>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Risk of aggressive behaviour/violence:
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.aggressive}</Typography>
                                </Box>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Risk of self neglect or accidental self harm:
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.selfNeglect}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Risk of non-compliance with professional medical advice/treatment:
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.medical}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Risk due to mental ill health:
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.mentalHealth}</Typography>
                                </Box>


                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Risk due to alcohol or substance misuse
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.substance}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Risk of abuse by others
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.abuse}</Typography>
                                </Box>


                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Risk due to alcohol or substance misuse
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.substance}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Risk of abuse by others
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.abuse}</Typography>
                                </Box>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Risk due to physical/medical condition
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.physical}</Typography>
                                </Box>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Risk to the health of others (for example hygiene risk)
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.hygiene}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Risk due to environmental factors
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.environmental}</Typography>
                                </Box>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        A risk towards Young adults
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.youngPerson}</Typography>
                                </Box>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        A risk towards Older people
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.olderPerson}</Typography>
                                </Box>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        A risk towards Children
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.childern}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        A risk towards Women
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.women}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        A risk towards Men
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.men}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        A risk towards Family members
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.family}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        A risk towards Religious groups
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.region}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        A risk towards Any ethnic or racial groups (please specify in notes section)
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.race}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        A risk towards Lesbian, gay or bisexual people
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.lgb}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        A risk towards Transgendered people
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.transgender}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        A risk towards People with disabilities
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.disability}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        A risk towards Staff
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.staff}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Homes:
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.houseName}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Created by:
                                    </Typography>
                                    <Typography variant="body1">{riskAssessmentViewModel?.createdUserName}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Date created:
                                    </Typography>
                                    <Typography variant="body1">{moment(riskAssessmentViewModel?.date??new Date()).format('YYYY-MM-DDTHH:mm:ss')}</Typography>
                                  </Box>
                            </Box>



                        </div>
                        <div className="d-flex align-items-center justify-content-between" style={{
                            padding: "2.5rem", width: "100%",
                        }}>
                            <Button variant="text" color="inherit" onClick={toggleDrawerClose(false, "risk")}>
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

            <Drawer className="Mui-Drawe-w" anchor="right" open={openKidLocationEdit} onClose={toggleDrawerClose(false, "spin")}>
                <Box>
                    <DrawerHeadingParent>
                        <DrawerHeading style={{ color: "#2a0560" }}> Location</DrawerHeading>
                    </DrawerHeadingParent>
                    <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"

                    >
                    </IconButton>

                    <DrawerBody>
                        <div style={{
                            padding: "2.5rem", width: "100%"

                        }}>
                            <div className="mb-1">

                                <DisplayStart>
                                    <ImgParentDiv>
                                        {kidLogLocationViewModel?.kidName !== "" ? kidLogLocationViewModel?.kidName ?? "".charAt(0).toUpperCase() + kidLogLocationViewModel?.kidName ?? "".charAt(0).toUpperCase() : "A"}
                                    </ImgParentDiv>
                                    <TitleCard>
                                        {kidLogLocationViewModel?.kidName}
                                        <br />
                                        <SubtitleCard>
                                            {kidLogLocationViewModel?.houseName}
                                        </SubtitleCard>
                                    </TitleCard>

                                </DisplayStart>
                            </div>

                            <Box style={{ display: 'flex', flexDirection: 'column', gap: "2px" }}>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Notes:
                                    </Typography>
                                    <Typography variant="body1">{kidLogLocationViewModel?.note}</Typography>
                                </Box>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Police Incident Report Number:
                                    </Typography>
                                    <Typography variant="body1">{kidLogLocationViewModel?.incidentNumber}</Typography>
                                </Box>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Homes:
                                    </Typography>
                                    <Typography variant="body1">{kidLogLocationViewModel?.houseName}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Created by:
                                    </Typography>
                                    <Typography variant="body1">{kidLogLocationViewModel?.createdUserName}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Date created:
                                    </Typography>
                                    <Typography variant="body1">{moment(kidLogLocationViewModel?.date??new Date()).format('YYYY-MM-DDTHH:mm:ss')}</Typography>
                                </Box>
                            </Box>



                        </div>
                        <div className="d-flex align-items-center justify-content-between" style={{
                            padding: "2.5rem", width: "100%",
                        }}>
                            <Button variant="text" color="inherit" onClick={toggleDrawerClose(false, "spin")}>
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

            <Drawer className="Mui-Drawe-w" anchor="right" open={openSpinSessionEdit} onClose={toggleDrawerClose(false, "spin")}>
                <Box>
                    <DrawerHeadingParent>
                        <DrawerHeading style={{ color: "#2a0560" }}> Spin Session</DrawerHeading>
                    </DrawerHeadingParent>
                    <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"

                    >
                    </IconButton>

                    <DrawerBody>
                        <div style={{
                            padding: "2.5rem", width: "100%"

                        }}>
                            <div className="mb-1">

                                <DisplayStart>
                                    <ImgParentDiv>
                                        {spinSessionViewModel?.kidName !== "" ? spinSessionViewModel?.kidName ?? "".charAt(0).toUpperCase() + spinSessionViewModel?.kidName ?? "".charAt(0).toUpperCase() : "A"}
                                    </ImgParentDiv>
                                    <TitleCard>
                                        {spinSessionViewModel?.kidName}
                                        <br />
                                        <SubtitleCard>
                                            {spinSessionViewModel?.houseName}
                                        </SubtitleCard>
                                    </TitleCard>

                                </DisplayStart>
                            </div>

                            <Box style={{ display: 'flex', flexDirection: 'column', gap: "2px" }}>

                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Notes:
                                    </Typography>
                                    <Typography variant="body1">{spinSessionViewModel?.note}</Typography>
                                </Box>

                                {/* <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                    Police Incident Report Number:
                                                </Typography>
                                                <Typography variant="body1">{spinSessionViewModel?.incidentNumber}</Typography>
                                            </Box> */}


                                {/* {getBehaviourList() || []).map((item: BehavioursViewModel, index: any) => {
                                                return (
                                                    <div>
                                                        <Box>
                                                            <DrawerHeadingParent>
                                                                <DrawerHeading> </DrawerHeading>
                                                            </DrawerHeadingParent>
                                                        </Box>


                                                        <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                                House:
                                                            </Typography>
                                                            <Typography variant="body1">{spinSessionViewModel?.houseName}</Typography>
                                                        </Box>
                                                        <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                                Created by:
                                                            </Typography>
                                                            <Typography variant="body1">{spinSessionViewModel?.createdUserName}</Typography>
                                                        </Box>
                                                        <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                                Date created:
                                                            </Typography>
                                                            <Typography variant="body1">{spinSessionViewModel?.date}</Typography>
                                                        </Box>
                                                    </div>

                                                );
                                            })} */}



                                {(getBehaviourList() || []).map((item: BehavioursViewModel, index: any) => {
                                    return (
                                        <div>
                                            <Box>
                                                <DrawerHeadingParent>
                                                    <DrawerHeading>Behaviour {index} </DrawerHeading>
                                                </DrawerHeadingParent>
                                            </Box>


                                            <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                    Presenting Behaviour:
                                                </Typography>
                                                <Typography variant="body1">{item?.presentingBehaviour}</Typography>
                                            </Box>
                                            <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                    Intervention:
                                                </Typography>
                                                <Typography variant="body1">{item?.intervention}</Typography>
                                            </Box>
                                            <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                    Need:
                                                </Typography>
                                                <Typography variant="body1">{item?.need}</Typography>
                                            </Box>
                                            <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                    What’s working well:
                                                </Typography>
                                                <Typography variant="body1">{item?.whatsWorkingWell}</Typography>
                                            </Box>
                                            <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                    What’s not working well:
                                                </Typography>
                                                <Typography variant="body1">{item?.whatsNotWorkingWell}</Typography>
                                            </Box>
                                            <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                                    What needs to happen:
                                                </Typography>
                                                <Typography variant="body1">{item?.whatNeedToHappen}</Typography>
                                            </Box>
                                        </div>

                                    );
                                })}



                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Homes:
                                    </Typography>
                                    <Typography variant="body1">{spinSessionViewModel?.houseName}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Created by:
                                    </Typography>
                                    <Typography variant="body1">{spinSessionViewModel?.createdUserName}</Typography>
                                </Box>
                                <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                        Date created:
                                    </Typography>
                                    <Typography variant="body1">{moment(spinSessionViewModel?.date??new Date()).format('YYYY-MM-DDTHH:mm:ss')}</Typography>
                              
                                </Box>
                            </Box>



                        </div>
                        <div className="d-flex align-items-center justify-content-between" style={{
                            padding: "2.5rem", width: "100%",
                        }}>
                            <Button variant="text" color="inherit" onClick={toggleDrawerClose(false, "spin")}>
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
    </>);
}

