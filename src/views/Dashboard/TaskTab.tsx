
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Grid, Typography, CircularProgress, Menu } from "@mui/material";
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
// import { DashboardCard, DisplayStart,DisplayBetween, ImgParentDivSmall, GreyBoxHeading, GreyBox, TitleCard, SmallTitleCard, GreenTextLabel, PlusButton, GreyBoxParent, GreyBoxHeadingParent, AlertHeading, GreyBoxDesc } from '../../views/Kids';
import { AppBar, Toolbar, Icon, IconButton } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { DashboardCard, PageHeading, PageHeadingSmall, GreyBox, SubtitleCard, AlertHeading, IconBox, ImgParentDiv, ImgParentDivLg, ImgParentDivSmall, GreyBoxParent, GreyBoxDesc, GreyBoxHeading, GreyBoxHeadingParent, TitleCard, SmallTitleCard, GreenTextLabel, GreenTextLabelSmall, Greenbtndiv, DashboardCardBgGreen, DashboardCardBgGreenChildDiv, DashboardCardBgGreenChildDivCol, DashboardCardBgGreenChildDivCol2, DashboardCardpurple, DisplayBetween, DisplayNumber, DisplayStart, MoveInDiv, MoveInlbl, FlexBetween, PlusButton } from "../Homes/HouseScreenStyle";
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
import { useForm, useFieldArray, FieldErrors, Controller } from "react-hook-form";
import { createTaskSchema } from '../../service/ValidationSchema';
import { useSelector } from 'react-redux';
import { parseJwt } from "../../hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { GetAxios } from '../../service/AxiosHelper';
import constants, { repeatOptions } from '../../service/Constants';
import { AppForm } from '../../components';
import React, { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { DrawerHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
import FormHelperText from '@mui/material/FormHelperText';
import usePagination from "../../components/CustomPagination";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
import MoreVertIcon from "@mui/icons-material/MoreVert";


interface Iprops {

}
export default function DashboardTaskTab(props: Iprops) {
  const [openCreateEdit, setOpenCreateEdit] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [users, setUsers] = React.useState<SelectList[]>();
  const [tasks, setTasks] = React.useState<TaskListModel[]>();
  const userToken = useSelector((state: AppStore) => state.auth.accessToken);
  const parsedClaims = parseJwt(userToken?.token || '');
  const userId = parsedClaims.id;
  const PAGE_SIZE = 5; // Number of items per page
  const { currentPage, handlePaginate, pageCount, setCount, setCurrentPage, } = usePagination({ take: PAGE_SIZE, count: 0 });
  const [type, setType] = React.useState<string>();
  const [isCompletedTask, setCompletedTask] = React.useState<boolean>(false);
  const [searchName, setSearchName] = useState("");
  const [assignTo, setAssignTo] = useState("All"); // Set the default value here
  const [kidList, setKidList] = useState<KidListModel[]>();
  const [showComplete, setShowComplete] = useState(false); // Set the default value here
  const [hidePrivate, setHidePrivate] = useState(false); // Set the default value here
  const [sortBy, setSortBy] = useState("DLH"); // Set the default value here
  const [taskDetailsViewModel, setTaskDetailsViewModel] = useState<NewTaskViewEditModel>();
  const [openTaskDetailsEdit, setOpenTaskDetailsEdit] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const createform = useForm<NewTaskFormModel>({
    defaultValues: {
      taskId: "",
      title: "",
      description: "",
      loggedInUserId: userId,
      dueDate: new Date(),
      houseId: "",
      kidId: "",
      assignUserId: "",
      repeat: "",
      repeatEndDate: new Date(),
      onlyAdmin: ""

    },
    resolver: yupResolver(createTaskSchema),
    mode: "all"
  });
  const { register: createRegister, handleSubmit: handleCreateSubmit, formState: { errors: createError, isValid: createIsValid, isSubmitting: createSubmitting }, reset: createReset, watch: createWatch, getValues: createGetValues, setValue: basicSetValue } = createform;
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
  const getKidList = () => {

    const obj = {} as any;
    obj.Status = " ";
    obj.Search = searchName;
    GetAxios().post(constants.Api_Url + 'Kid/GetKids', obj).then(res => {
      if (res.data.success) {
        console.log(res)
        setKidList(res.data.list);

      }
    })
  };

  const handleMarkAsComplete = (taskId: string, userId: string) => (event: any) => {
    
    const formData = new FormData();
    formData.append('taskId', taskId ?? "");
    formData.append('userId', userId ?? "");

    GetAxios().post(constants.Api_Url + 'Task/MarkComplete', formData).then(res => {
      if (res.data.success) {
        enqueueSnackbar("Set mark as completed successfully.", {
          variant: 'success', style: { backgroundColor: '#5f22d8' },
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });

        toggleDrawer(false, "CreateUpdate")(event);
        getTasksList();
        setOpenTaskDetailsEdit(false);
      }
    })
  };


  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


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
          getTasksList();
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



  const handleShowCompleteChange = (event: any) => {
    setShowComplete(event.target.checked); // Update showComplete state with the checked property of the event target
  };

  const handleHidePrivacyChange = (event: any) => {
    setHidePrivate(event.target.checked); // Update showComplete state with the checked property of the event target
  };


  React.useEffect(() => {
    GetAxios().get(constants.Api_Url + 'User/GetAdminUsers').then(res => {
      if (res.data.success) {
        setUsers(res.data.list);
      }
    })
    getKidList();
  }, []);
  const getTasksList = () => {
    const formData = new FormData();
    formData.append('sortBy', sortBy);
    formData.append('assignedTo', assignTo);
    formData.append("isPrivate", JSON.stringify(hidePrivate));
    formData.append("isCompleted", JSON.stringify(showComplete));
    setCurrentPage(1);

    GetAxios().post(constants.Api_Url + 'Task/GetTasks', formData).then(res => {
      if (res.data.success) {
        setTasks(res.data.list);
        //getTaskDetails(selecttaskId);
        //setOpenTaskDetailsEdit(true);
        // console.log(res.data.list);
        setCount(res.data.list.length);
      }
    })
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

  const getTaskDetailView = (taskId: string) => {
    GetAxios().get(constants.Api_Url + 'Task/GetTaskView?taskId=' + taskId).then(res => {
      if (res.data.success) {
        // createform.reset(res.data.data);
        // createform.setValue("repeatEndDate", res.data.data.repeatDate);
        // createform.setValue("loggedInUserId", userId); createform.setValue("dueDate", res.data.data.dueDate);
        setTaskDetailsViewModel(res.data.data);
        setOpenTaskDetailsEdit(true);
      }
    })
  };


  React.useEffect(() => {
    getTasksList();

  }, [sortBy, hidePrivate, isCompletedTask, assignTo]);


  return (
    <>


      <Grid item xs={12} md={6} className='h-100'>

        {tasks != undefined && tasks.length == 0 &&
          <GreyBoxParent className=''>
            <div className="d-flex align-items-center justify-content-between  mt-4">
              <AlertHeading>
                Tasks
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

        <AlertHeading>
          Tasks
        </AlertHeading>
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
                        {item.dueDate ? moment(item.dueDate).format('YYYY-MM-DDTHH:mm:ss') : 'Not completed'}
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
                        {/* <Link to="">
                          <IconButton className='headerIcon' onClick={() => { getTaskDetail(item.id ?? "") }}>
                            <Icon>  <ChevronRightIcon className='text-body-tertiary iconHeight' /></Icon>
                          </IconButton>
                        </Link>
                         */}

                        <Link to="">
                          <IconButton className='headerIcon' onClick={() => { getTaskDetailView(item.id ?? "") }}>
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


        </Box>

      </Grid>

      <Drawer className="Mui-Drawe-w" anchor="right" open={openCreateEdit} onClose={toggleDrawer(false, "CreateUpdate")}>
        <AppForm onSubmit={handleCreateEditTaskSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading style={{ color: "#2a0560" }}> Create/Edit Task</DrawerHeading>
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
                    onChange={(event: any) => { basicSetValue("dueDate", event) }}
                    format="MM/dd/yyyy HH:mm"
                    value={createWatch("dueDate")}
                    clearIcon={null}
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



                  </Select>
                  <FormHelperText style={{ color: "Red" }}>
                    {createError.repeat?.message}
                  </FormHelperText>


                </FormControl>
                <InputLabel id="kidRecordingDate" >Repeat End Date:*</InputLabel>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                  <DateTimePicker
                    onChange={(event: any) => { basicSetValue("repeatEndDate", event) }}
                    format="MM/dd/yyyy HH:mm"
                    value={createWatch("repeatEndDate")}
                    clearIcon={null}
                    
                  />
                  <FormHelperText style={{ color: "Red" }} >
                    {createError.repeatEndDate?.message}
                  </FormHelperText>
                </div>
{/* 
                <div style={{ display: 'flex', flexDirection: 'column', }}>
                                                <DateTimePicker
                                                    onChange={(event: any) => { alertSetValue("date", event) }}
                                                    format="MM/dd/yyyy HH:mm"
                                                    value={alertWatch("date")}
                                                    clearIcon={null}
                                                    required
                                                />
                                                <FormHelperText style={{ color: "Red" }}>
                                                    {alertError.date?.message}
                                                </FormHelperText>
                                            </div> */}


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

      <Drawer className="Mui-Drawe-w" anchor="right" open={openTaskDetailsEdit} onClose={toggleDrawerClose(false)}>
        <Box>
          <DrawerHeadingParent>
            <DrawerHeading>View Task</DrawerHeading>
          </DrawerHeadingParent>


          {/* <DrawerHeadingParent>
            <DrawerHeading style={{ color: "#2a0560" }}>View Team Member</DrawerHeading>
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

                <MenuItem key="Edit" onClick={() => { getTaskDetail(taskDetailsViewModel?.taskId ?? "")}}>
                  Edit
                </MenuItem>

              </Menu>
            </>
          </DrawerHeadingParent> */}




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
                    {taskDetailsViewModel?.completedAt
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

              <AppButton type="submit" className='btnLogin' onClick={handleMarkAsComplete(taskDetailsViewModel?.taskId ?? "", userId)}>
                                    MARK AS COMPLETE
                                </AppButton>

            </div>
          </DrawerBody>
        </Box>
      </Drawer>



    </>
  );
}




