
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { Link } from 'react-router-dom';
// import { DashboardCard, DisplayStart,DisplayBetween, ImgParentDivSmall, GreyBoxHeading, GreyBox, TitleCard, SmallTitleCard, GreenTextLabel, PlusButton, GreyBoxParent, GreyBoxHeadingParent, AlertHeading, GreyBoxDesc } from '../../views/Kids';
import { AppBar, Toolbar, Icon, IconButton } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { DashboardCard, PageHeading, PageHeadingSmall, GreyBox, AlertHeading, IconBox, ImgParentDiv, ImgParentDivLg, ImgParentDivSmall, GreyBoxParent, GreyBoxDesc, GreyBoxHeading, GreyBoxHeadingParent, TitleCard, SmallTitleCard, GreenTextLabel, GreenTextLabelSmall, Greenbtndiv, DashboardCardBgGreen, DashboardCardBgGreenChildDiv, DashboardCardBgGreenChildDivCol, DashboardCardBgGreenChildDivCol2, DashboardCardpurple, DisplayBetween, DisplayNumber, DisplayStart, MoveInDiv, MoveInlbl, FlexBetween, PlusButton } from "./HouseScreenStyle";
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { createTheme, ThemeProvider } from '@mui/system';
import ModeIcon from '@mui/icons-material/Mode';
import { AppForm } from '../../components';
import { useSelector } from 'react-redux';
import { parseJwt } from "../../hooks";
import TableRow from '@mui/material/TableRow';
import { createTaskSchema } from '../../service/ValidationSchema';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { yupResolver } from "@hookform/resolvers/yup";
import { SubtitleCard, getStyles } from "../Dashboard/DashboardScreenStyle";
import constants, { coachingSessionCategories } from '../../service/Constants';
import { GetAxios } from '../../service/AxiosHelper';
import { DrawerHeading, DrawerStepHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
import { useForm, useFieldArray, FieldErrors, Controller } from "react-hook-form";
import { useSnackbar } from 'notistack';
import React, { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import { Label } from '@mui/icons-material';
import usePagination from "../../components/CustomPagination";
import { useNavigate, useParams } from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
interface Iprops {

}
export default function TaskTab(props: Iprops) {
    const [openCreateEdit, setOpenCreateEdit] = React.useState(false);

    const [openView, setOpenView] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [users, setUsers] = React.useState<any>([]);
    const PAGE_SIZE = 5; // Number of items per page
    const { currentPage, handlePaginate, pageCount, setCount, setCurrentPage, } = usePagination({ take: PAGE_SIZE, count: 0 });
    const [tasks, setTasks] = React.useState<TaskListModel[]>();
    const [taskDetailsViewModel, setTaskDetailsViewModel] = useState<NewTaskViewModel>();
    const [openTaskDetailsEdit, setOpenTaskDetailsEdit] = React.useState(false);
    const [sortBy, setSortBy] = useState("DLH"); // Set the default value here
    const [assignTo, setAssignTo] = useState("All"); // Set the default value here
    const [isCompletedTask, setCompletedTask] = React.useState<boolean>(false);
    const [showComplete, setShowComplete] = useState(false); // Set the default value here
    const [hidePrivate, setHidePrivate] = useState(false); // Set the default value here
    const [selecttaskId, setSelecttaskId] = useState("00000000-0000-0000-0000-000000000000"); // Set the default value here
    const userToken = useSelector((state: AppStore) => state.auth.accessToken);
    const parsedClaims = parseJwt(userToken?.token || '');
    const userId = parsedClaims.id;
    const [type, setType] = React.useState<string>();
    const { hId } = useParams();
    const [kidList, setKidListHouse] = useState<KidListModel[]>();
    const createform = useForm<NewTaskFormModel>({
        defaultValues: {
            taskId: "",
            title: "",
            description: "",
            loggedInUserId: userId,
            dueDate: new Date(),
            houseId: hId ?? "",
            kidId: "",
            assignUserId: "",
            repeat: "",
            repeatEndDate: new Date(),
            onlyAdmin: ""

        },
        resolver: yupResolver(createTaskSchema),
        mode: "all"
    });
    const { register: createRegister, handleSubmit: handleCreateSubmit, formState: { errors: createError, isValid: createIsValid, isSubmitting: createSubmitting }, reset: createReset, watch: createWatch, getValues: createGetValues, setValue: createSetValue } = createform;
    const { enqueueSnackbar } = useSnackbar();
    const toggleDrawer = (open: any, type: string) => (event: any) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        if (type == "CreateUpdate") {
            //get basic detail 

            setOpenCreateEdit(open);

        }
        else if (type == "View") {
            setOpenView(open);
        }
    }
    const handleCreateEditTaskSubmit = (event: SyntheticEvent) => {
        event.preventDefault();

        console.log(createGetValues())
        const formData = new FormData();
        formData.append('taskId', createGetValues("taskId") ?? "");
        formData.append('loggedInUserId', userId ?? "");
        formData.append('title', createGetValues("title") ?? "");
        formData.append('description', createGetValues("description") ?? "");
        formData.append('dueDate', moment(createGetValues("dueDate")).format('YYYY-MM-DDTHH:mm:ss'));
        formData.append('houseId', createGetValues("houseId") ?? "");
        formData.append('kidId', createGetValues("kidId") ?? "");
        formData.append('assignUserId', createGetValues("assignUserId") ?? "");
        formData.append('repeat', createGetValues("repeat") ?? "");
        formData.append('repeatEndDate', moment(createGetValues("repeatEndDate")).format('YYYY-MM-DDTHH:mm:ss'));
        formData.append('onlyAdmin', createGetValues("onlyAdmin") ?? "");

        GetAxios().post(constants.Api_Url + 'Task/CreateUpdateTask', formData)
            .then(res => {

                if (res.data.success) {
                    enqueueSnackbar("Form was successfully submitted.", {
                        variant: 'success', style: { backgroundColor: '#5f22d8' },
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawer(false, "CreateUpdate")(event);

                } else {
                    console.warn(res);
                    enqueueSnackbar("Unable to save task.", {
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

    };
    const onhandlePrint = (event: any) => {
        window?.print();
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
        //getTaskDetails(taskId);
        setSelecttaskId(taskId);
        //var result = taskDetailsViewModel?.dueDate;
        setTaskDetailsViewModel(taskDetailsViewModel);

    };


    const getTaskDetails = (event: any, taskId: string) => {
        GetAxios().get(constants.Api_Url + 'Task/GetTask?taskId=' + taskId).then(res => {
            if (res.data.success) {
                setTaskDetailsViewModel(res.data.data);
                setOpenTaskDetailsEdit(true);


            }
        })
    };

    const getTaskDetail = (taskId: string) => {
        GetAxios().get(constants.Api_Url + 'Task/GetTask?taskId=' + taskId).then(res => {
            if (res.data.success) {
                createform.reset(res.data.data);
                createform.setValue("repeatEndDate", res.data.data.repeatDate);
                createform.setValue("loggedInUserId", userId); createform.setValue("dueDate", res.data.data.dueDate);
                setOpenCreateEdit(true);
            }
        })
    };

    React.useEffect(() => {
        GetAxios().get(constants.Api_Url + 'User/GetAdminUsers').then(res => {
            if (res.data.success) {
                setUsers(res.data.list);
            }
        })

        GetAxios().get(constants.Api_Url + 'House/GetHouseKids?houseId=' + hId).then(res => {
            if (res.data.success) {

                console.log(res)
                setKidListHouse(res.data.list);
            }
        })


    }, []);


    const getTasksList = () => {
        const formData = new FormData();
        formData.append('sortBy', sortBy);
        formData.append('assignedTo', assignTo);
        formData.append("isPrivate", JSON.stringify(hidePrivate));
        formData.append("isCompleted", JSON.stringify(showComplete));
        formData.append("houseId", hId ?? "");
        formData.append("kidId", "");
        setCurrentPage(1);
        GetAxios().post(constants.Api_Url + 'Task/GetTasks', formData).then(res => {
            if (res.data.success) {
                setTasks(res.data.list);
                //getTaskDetails(selecttaskId);
                //setOpenTaskDetailsEdit(true);
                console.log(res.data.list);
                setCount(res.data.list.length)

            }
        })
    };

    const stylesCheckbox = () => ({
        root: {
            "&$checked": {
                color: "rgba(0, 0, 0, 0.54)"
            }
        },
        checked: {}
    })

    const handleShowCompleteChange = (event: any) => {
        setShowComplete(event.target.checked); // Update showComplete state with the checked property of the event target
        //  getTasksList();
    };

    const handleHidePrivacyChange = (event: any) => {
        setHidePrivate(event.target.checked); // Update showComplete state with the checked property of the event target
        // getTasksList();
    };

    React.useMemo(() => {
        getTasksList();

    }, []);
    //sortBy, hidePrivate, isCompletedTask, assignTo
    // React.useEffect(() => {

    //     getTasksList();

    // }, [sortBy, assignTo, hidePrivate, showComplete]);

    // React.useEffect(() => {

    //     if (1 == 1) {
    //         getTaskDetails(selecttaskId);

    //     }

    // }, []);



    return (
        <div className="kidsDetailBox">


            <Grid className='mb-4' container spacing={5}>


                <Grid item xs={12} md={8} className='h-100'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: '300px',
                                borderRadius: 16,
                                marginTop: "40px",
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: 16, // Adjust the border radius for the outline as well
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.87)', // Change border color on hover if desired

                                },
                            }} />
                        <PlusButton className='mt-5' onClick={toggleDrawer(true, "CreateUpdate")}>
                            <AddIcon className="d-flex" />
                        </PlusButton>
                    </div>
                    {tasks == undefined || tasks.length == 0 &&
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
                        {tasks != undefined && tasks.length > 0 &&
                            <>
                                {(tasks || []).slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((item: TaskListModel, index: any) => {
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
                                                        <IconButton className='headerIcon' onClick={(event: any) => { getTaskDetails(event, item.id ?? "") }}>
                                                            <Icon>  <ChevronRightIcon className='text-body-tertiary iconHeight' /></Icon>
                                                        </IconButton>
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

                        {/* {taskList == undefined || taskList.length == 0 &&
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
                                                    } */}

                    </Box>

                </Grid>
                <Grid item xs={12} md={4} className='h-100'>
                    <div className="mt-4">
                        <AlertHeading className='mt-4 pt-2'>
                            Filter Tasks
                        </AlertHeading>
                    </div>
                    <FormControl variant="standard" fullWidth className="mt-4">
                        <InputLabel id="demo-simple-select-standard-label">Sort By</InputLabel>
                        <Select
                            value={sortBy}
                            onChange={(event: any) => { setSortBy(event.target.value); }}
                            sx={{
                                borderRadius: "30px",
                                width: "200px",
                                marginRight: "20px"
                            }}
                        >

                            <MenuItem value={"DLH"}>Due Date - Ascending</MenuItem>
                            <MenuItem value={"DHL"}>Due Date - Decending</MenuItem>
                            <MenuItem value={"CLH"}>Created Date - Ascending</MenuItem>
                            <MenuItem value={"CHL"}>Created Date - Decending</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" fullWidth className="mb-2 mt-4">
                        <InputLabel id="demo-simple-select-standard-label">Assigned To</InputLabel>
                        <Select
                            value={assignTo}
                            onChange={(event: any) => { setAssignTo(event.target.value); }}
                            sx={{
                                borderRadius: "30px",
                                width: "200px",
                                marginRight: "20px"
                            }}
                        >

                            <MenuItem value={"All"}>All</MenuItem>
                            {(users || []).map((item: SelectList, index: any) => {
                                return (
                                    <MenuItem key={"user" + item.key + index + 3} value={item.key}>{item.value}</MenuItem>

                                );
                            })}
                        </Select>
                    </FormControl>


                    {/* <div >
        <Checkbox label='Show text' 
                  labelStyle={{color: 'black'}}
                  iconStyle={{fill: 'red'}}
                  inputStyle={{color:'red' }}
                  style={{color:'black', }}
                  
                  onChange={handleShowCompleteChange} />
                  
      </div> */}
                    {/* <div>
                        <FormControlLabel
                            className='fontsize-11'
                            control={<Checkbox onChange={handleShowCompleteChange} checked={showComplete}/>}
                            label="Show Completed Tasks"
                        />
                    </div> */}

                    <div>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showComplete}
                                    onChange={handleShowCompleteChange}
                                    iconStyle={{ fill: 'red' }}
                                    inputStyle={{ color: 'red' }}
                                    style={{ color: 'green' }}
                                />
                            }
                            label="Show Completed Tasks"
                            labelPlacement="end" // You can adjust label placement as needed
                            labelStyle={{ color: 'green' }}
                        />
                    </div>


                    <div>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={hidePrivate}
                                    onChange={handleHidePrivacyChange}
                                    iconStyle={{ fill: 'red' }}
                                    inputStyle={{ color: 'red' }}
                                    style={{ color: 'green' }}
                                />
                            }
                            label="Hide Private Tasks"
                            labelPlacement="end" // You can adjust label placement as needed
                            labelStyle={{ color: 'green' }}
                        />
                    </div>







                </Grid>

            </Grid>

            <div>
                <Drawer className="Mui-Drawe-w" anchor="right" open={openTaskDetailsEdit} onClose={toggleDrawerClose(false)}>
                    <Box>
                        <DrawerHeadingParent>
                            <DrawerHeading> Task</DrawerHeading>
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
                                            {taskDetailsViewModel?.title !== "" ? taskDetailsViewModel?.title ?? "".charAt(0).toUpperCase() + taskDetailsViewModel?.title ?? "".charAt(0).toUpperCase() : "A"}
                                        </ImgParentDiv>
                                        <TitleCard>
                                            {taskDetailsViewModel?.title}
                                            <br />
                                            <SubtitleCard>
                                                {taskDetailsViewModel?.title}
                                            </SubtitleCard>
                                        </TitleCard>

                                    </DisplayStart>
                                </div>

                                <Box style={{ display: 'flex', flexDirection: 'column', gap: "2px" }}>

                                    <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                            Description:
                                        </Typography>
                                        <Typography variant="body1">{taskDetailsViewModel?.description}</Typography>
                                    </Box>
                                    <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                            Assigned to:
                                        </Typography>
                                        <Typography variant="body1">{taskDetailsViewModel?.assignUser}</Typography>
                                    </Box>
                                    <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                            Due date:
                                        </Typography>
                                        <Typography variant="body1">{moment(taskDetailsViewModel?.dueDate ?? new Date()).format('YYYY-MM-DDTHH:mm:ss')}</Typography>
                                    </Box>
                                    <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                            Repeats:
                                        </Typography>
                                        <Typography variant="body1">{taskDetailsViewModel?.repeat}</Typography>
                                    </Box>
                                    <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                            Completed at:
                                        </Typography>
                                        <Typography variant="body1">
                                            {taskDetailsViewModel?.completedAt && moment(taskDetailsViewModel.completedAt).isValid()
                                            ? moment(taskDetailsViewModel.completedAt).format('YYYY-MM-DDTHH:mm:ss')
                                            : 'Not completed'}
                                        </Typography>
                                    </Box>

                                    <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                            Date Created:
                                        </Typography>
                                        <Typography variant="body1">{moment(taskDetailsViewModel?.createdAt ?? new Date()).format('YYYY-MM-DDTHH:mm:ss')}</Typography>
                                    </Box>
                                    <Box key="viewfn" style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography style={{ width: '40%', fontWeight: 'bold' }} variant="body1">
                                            Created by:
                                        </Typography>
                                        <Typography variant="body1">{taskDetailsViewModel?.createdBy}</Typography>
                                    </Box>

                                </Box>



                            </div>
                            <div className="d-flex align-items-center justify-content-between" style={{
                                padding: "2.5rem", width: "100%",
                            }}>
                                <Button variant="text" color="inherit" onClick={toggleDrawerClose(false)}>
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
                <Drawer className="Mui-Drawe-w" anchor="right" open={openView} onClose={toggleDrawer(false, "View")}>
                    <Box>

                        <DrawerBody>
                            <div style={{
                                padding: "2.5rem", width: "100%"

                            }}>

                                <DrawerHeadingParent className='px-0'>
                                    <DrawerHeading>Fill Out Risk Assessments</DrawerHeading>
                                </DrawerHeadingParent>
                                <hr></hr>
                                <DisplayStart className='mb-4'>
                                    <ImgParentDiv>
                                        N U
                                    </ImgParentDiv>
                                    <TitleCard>
                                        Fill Out Risk Assessments
                                        <br></br>
                                        <SubtitleCard>
                                            No User
                                        </SubtitleCard>
                                    </TitleCard>

                                </DisplayStart>

                                <Table>
                                    <TableHead>
                                        <TableRow sx={{
                                            borderBottom: 'none', // Remove bottom border
                                        }}>
                                            <TableCell sx={{
                                                fontSize: "13px", borderBottom: 'none'
                                            }} className='fst-normal fw-bold w-50' align="left">Description:</TableCell>
                                            <TableCell sx={{
                                                fontSize: "13px", borderBottom: 'none'
                                            }} className='fst-normal w-50' align="left">Desc here...</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow sx={{
                                            borderBottom: 'none', // Remove bottom border
                                        }}>
                                            <TableCell sx={{
                                                fontSize: "13px", borderBottom: 'none'
                                            }} className='fst-normal fw-bold w-50' align="left">Assigned to:</TableCell>
                                            <TableCell sx={{
                                                fontSize: "13px", borderBottom: 'none'
                                            }} className='fst-normal w-50' align="left">No User</TableCell>

                                        </TableRow>
                                        <TableRow sx={{
                                            borderBottom: 'none', // Remove bottom border
                                        }}>
                                            <TableCell sx={{
                                                fontSize: "13px", borderBottom: 'none'
                                            }} className='fst-normal fw-bold w-50' align="left">Due Date:</TableCell>
                                            <TableCell sx={{
                                                fontSize: "13px", borderBottom: 'none'
                                            }} className='fst-normal w-50' align="left">No date</TableCell>

                                        </TableRow>
                                        <TableRow sx={{
                                            borderBottom: 'none', // Remove bottom border
                                        }}>
                                            <TableCell sx={{
                                                fontSize: "13px", borderBottom: 'none'
                                            }} className='fst-normal fw-bold w-50' align="left">Repeats:</TableCell>
                                            <TableCell sx={{
                                                fontSize: "13px", borderBottom: 'none'
                                            }} className='fst-normal w-50' align="left">No repeat</TableCell>

                                        </TableRow>
                                        <TableRow sx={{
                                            borderBottom: 'none', // Remove bottom border
                                        }}>
                                            <TableCell sx={{
                                                fontSize: "13px", borderBottom: 'none'
                                            }} className='fst-normal fw-bold w-50' align="left">Complete by:</TableCell>
                                            <TableCell sx={{
                                                fontSize: "13px", borderBottom: 'none'
                                            }} className='fst-normal w-50' align="left">No user</TableCell>

                                        </TableRow>
                                        <TableRow sx={{
                                            borderBottom: 'none', // Remove bottom border
                                        }}>
                                            <TableCell sx={{
                                                fontSize: "13px", borderBottom: 'none'
                                            }} className='fst-normal fw-bold w-50' align="left">Completed to:</TableCell>
                                            <TableCell sx={{
                                                fontSize: "13px", borderBottom: 'none'
                                            }} className='fst-normal w-50' align="left">No date</TableCell>

                                        </TableRow>
                                        <TableRow sx={{
                                            borderBottom: 'none', // Remove bottom border
                                        }}>
                                            <TableCell sx={{
                                                fontSize: "13px", borderBottom: 'none'
                                            }} className='fst-normal fw-bold w-50' align="left">Date Created:</TableCell>
                                            <TableCell sx={{
                                                fontSize: "13px", borderBottom: 'none'
                                            }} className='fst-normal w-50' align="left">14/09/2023</TableCell>

                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="d-flex align-items-center justify-content-between" style={{
                                padding: "2.5rem", width: "100%"
                            }}>
                                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "View")}>
                                    Cancel
                                </Button>
                                <Button variant="text" color="inherit" onClick={onhandlePrint}>
                                    Print
                                </Button>
                                <AppButton type="submit" className='btnLogin' >
                                    MARK AS COMPLETE
                                </AppButton>

                            </div>
                        </DrawerBody>
                    </Box>
                    <Box>

                    </Box>
                </Drawer>
                <Drawer className="Mui-Drawe-w" anchor="right" open={openCreateEdit} onClose={toggleDrawer(false, "CreateUpdate")}>
                    <AppForm onSubmit={handleCreateEditTaskSubmit}>
                        <Box>
                            <DrawerHeadingParent>
                                <DrawerHeading> {type} Task</DrawerHeading>
                            </DrawerHeadingParent>
                            <DrawerBody>
                                <div style={{
                                    padding: "2.5rem", width: "100%"

                                }}>
                                    <TextField id="standard-basic1" className="mb-4" fullWidth label="Title:*"
                                        variant="standard"
                                        {...createRegister("title", { required: true })}
                                        error={!!createError.title}
                                        helperText={createError.title?.message}
                                    />
                                    <TextField id="standard-basic-des" className="mb-4" fullWidth label="Description:*"
                                        variant="standard"
                                        {...createRegister("description", { required: true })}
                                        error={!!createError.description}
                                        helperText={createError.description?.message}
                                    />
                                    <InputLabel id="kidRecordingDate" >Due Date:*</InputLabel>
                                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                                        <DateTimePicker
                                            onChange={(event: any) => { createSetValue("dueDate", event) }}
                                            format="MM/dd/yyyy HH:mm"
                                            value={createWatch("dueDate")}
                                            clearIcon={null}
                                            required
                                        />
                                        <FormHelperText style={{ color: "Red" }} >
                                            {createError.dueDate?.message}
                                        </FormHelperText>
                                    </div>

                                    <FormControl variant="standard" fullWidth className="mb-5">
                                        <InputLabel id="kidIncidentLabel">Kid:*</InputLabel>
                                        <Select
                                            labelId="kidIncidentLabel"
                                            id="kidIncidentLabelKidselect"
                                            value={createWatch("kidId")}
                                            {...createRegister('kidId', { required: { value: true, message: "Required" } })}
                                            error={!!createError.kidId}
                                        >

                                            {(kidList || []).map((item: KidListModel, index: any) => {
                                                return (
                                                    <MenuItem key={"kid_incident" + item.id + index + 3} value={item.id}>{item.name}</MenuItem>

                                                );
                                            })}

                                        </Select>
                                        <FormHelperText style={{ color: "Red" }}>
                                            {createError.kidId?.message}
                                        </FormHelperText>
                                    </FormControl>
                                    <FormControl variant="standard" fullWidth className="mb-5">
                                        <InputLabel id="kidUserLabel">Assign to:*</InputLabel>
                                        <Select
                                            labelId="kidUserLabel"
                                            id="kidAssigneduserselect"
                                            value={createWatch("assignUserId")}
                                            {...createRegister("assignUserId", { required: { value: true, message: "Required" } })}
                                            error={!!createError.assignUserId}

                                        >

                                            {(users || []).map((item: SelectList, index: any) => {
                                                return (
                                                    <MenuItem key={"kid_incident" + item.key + index + 3} value={item.key}>{item.value}</MenuItem>

                                                );
                                            })}

                                        </Select>
                                        <FormHelperText style={{ color: "Red" }}>
                                            {createError.assignUserId?.message}
                                        </FormHelperText>
                                        <FormHelperText>  If left empty, all users in this homes will be assigned.

                                        </FormHelperText>


                                    </FormControl>
                                    <FormControl variant="standard" fullWidth className="mb-5">
                                        <InputLabel id="kidRepeatLabel">Repeat:*</InputLabel>
                                        <Select
                                            labelId="kidRepeatLabel"
                                            id="kidAssigneduserselect"
                                            label="Repeat:*"
                                            value={createWatch("repeat")}
                                            {...createRegister("repeat", { required: { value: true, message: "Required" } })}
                                            error={!!createError.repeat}
                                        >
                                            <MenuItem key={"kid_incident" + 1} value="NONE">None</MenuItem>
                                            <MenuItem key={"kid_incident" + 2} value="DAILY">Daily</MenuItem>
                                            <MenuItem key={"kid_incident" + 4} value="WEEKLY">Weekly</MenuItem>
                                            <MenuItem key={"kid_incident" + 18} value="MONTHLY">Monthly</MenuItem>
                                            <MenuItem key={"kid_incident" + 20} value="YEARLY">Yearly</MenuItem>

                                            {/* {(repeatOptions || []).map((item: any, index: any) => {
                      return (
                        <MenuItem key={"kid_incident" + item.code + index + 3} value={item.code}>{item.value}</MenuItem>

                      );
                    })} */}

                                        </Select>
                                        <FormHelperText style={{ color: "Red" }}>
                                            {createError.repeat?.message}
                                        </FormHelperText>


                                    </FormControl>

                                    <InputLabel id="kidRecordingDate" >Repeat End Date:*</InputLabel>
                                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                                        <DateTimePicker
                                            onChange={(event: any) => { createSetValue("repeatEndDate", event) }}
                                            format="MM/dd/yyyy HH:mm"
                                            value={createWatch("repeatEndDate")}
                                            clearIcon={null}
                                            required
                                        />
                                        <FormHelperText style={{ color: "Red" }} >
                                            {createError.repeatEndDate?.message}
                                        </FormHelperText>
                                    </div>
                                    <FormControl variant="standard" fullWidth className="mb-5">
                                        <InputLabel id="kidUserLabel">Only Admin:*</InputLabel>
                                        <Select
                                            labelId="kidUserLabel"
                                            id="kidAssigneduserselect"
                                            value={createWatch("onlyAdmin")}
                                            {...createRegister("onlyAdmin", { required: { value: true, message: "Required" } })}
                                            error={!!createError.onlyAdmin}
                                        >


                                            <MenuItem key="adminyes" value="Yes">Yes</MenuItem>
                                            <MenuItem key="adminyes" value="No">No</MenuItem>

                                        </Select>
                                        <FormHelperText style={{ color: "Red" }}>
                                            {createError.onlyAdmin?.message}
                                        </FormHelperText>


                                    </FormControl>
                                </div>
                                <div className="d-flex align-items-center justify-content-between" style={{
                                    padding: "2.5rem", width: "100%"
                                }}>
                                    <Button variant="text" color="inherit" onClick={toggleDrawer(false, "CreateUpdate")}>
                                        Cancel
                                    </Button>
                                    <Button variant="text" color="inherit" onClick={onhandlePrint}>
                                        Print
                                    </Button>
                                    <AppButton type="submit" className='btnLogin' disabled={!createIsValid}  >
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




        </div>
    );
}




