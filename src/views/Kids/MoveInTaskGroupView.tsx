
import { AppForm } from '../../components';
import { AppBar, Toolbar, Icon, IconButton, Paper, } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { PremoveCard, PremoveCardHeading, PremoveCardHeadingMuted } from "./KidTabScreenStyles";
import Upload from '@mui/icons-material/Upload';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Add, CheckCircle } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AppButton } from "../../components";
import { useForm, useFieldArray, FieldErrors, Controller } from "react-hook-form";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Row, Col, Container } from "react-bootstrap";
import '../../index.css';
import { DrawerHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Grid, Typography, CircularProgress, makeStyles, Tab, Tabs, ThemeProvider, Checkbox } from "@mui/material";
import { GetAxios } from '../../service/AxiosHelper';
import React, { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import { radioStyleLabel, radioStyleWrapper } from "./KidScreenStyle";
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { parseJwt } from "../../hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import constants, { coachingSessionCategories, FileType, sentanceCase } from '../../service/Constants';
import { aboutKidschema, } from '../../service/ValidationSchema';
import { legalStatuses } from "./legalStatus";
import { useNavigate, useParams } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { CloudDownload, InsertDriveFile, Done, ErrorOutline } from '@mui/icons-material';
import {
  ToggleButton, ToggleButtonGroup,
  ToggleButtonProps,
  ToggleButtonGroupProps,
} from '@mui/material';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
import * as yup from "yup";
interface Iprops {
  setPreMoveInProcessTab: (value: boolean) => void;
  setMoveInProcessTab:(value:boolean)=> void
  setProcessTab:(value:boolean)=> void
  houseId: string;
}
export enum UploadState {
  IDLE,
  LOADING,
  ERROR,
  SUCCESS,
}
export default function MoveInTaskGroupViewTab(props: Iprops) {
  const DownloadFileComponent = (props: any) => {

    const onDownloadTemplate = () => {
      if (props.disabled) return;
      const path = constants.Template_Files + "sample.doc";
      fetch(path)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          const fileURL = window.URL.createObjectURL(blob);
          let alink = document.createElement('a');
          alink.href = fileURL;
          alink.download = "Template";
          alink.click();
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });


    }


    return (
      <Paper style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        width: '100%',
        marginBottom: "10px",
        cursor: 'pointer',
        transition: 'background 0.3s',
        backgroundColor: "#d3d3d3",
      }}
        className={`${props.disabled ? "" : ''
          }`}
        elevation={0}

      >
        <Typography variant="body1" color="textSecondary">
          {props.downloadCopy ?? 'Download template'}
        </Typography>
        <a
          href={constants.Template_Files + "sample.doc"}
          download="Example-PDF-document"
          target="_blank"
          rel="noreferrer"
          style={{ color: "black" }}
        >
          <CloudDownload />
        </a>

      </Paper>
    );
  };
  const kidmedicalSchema = yup.object().shape({
    id: yup.string().nullable().notRequired(),
    kidId: yup.string().required('Required'),
    userId: yup.string().required('Required'),
    title: yup.string().required('Required'),
    symptoms: yup.string().required('Required'),
    triggers: yup.string().required('Required'),
    medication: yup.string().required('Required'),
    adminDetails: yup.string().required('Required'),
    inEmergency: yup.string().required('Required'),
  });
  const userToken = useSelector((state: AppStore) => state.auth.accessToken);
  const parsedClaims = parseJwt(userToken?.token || '');
  const userId = parsedClaims.id;
  type Status = {
    value: string;
    code: string;
  };
  const fileTypes = ["application/pdf", ".doc", ".docx", "application/msword", ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain",
    "text/html", ".xls",
  ];


  const [openAbout, setOpenAbout] = React.useState(false);
  const [openMedicalDetail, setOpenMedicalDetail] = React.useState(false);
  const [openSharing, setOpenSharing] = React.useState(false);
  const [openPhoto, setOpenPhoto] = React.useState(false);
  const [openKey, setOpenKey] = React.useState(false);
  const [openLicense, setOpenLicense] = React.useState(false);
  const [openAgreement, setOpenAgreement] = React.useState(false);
  const [openSafety, setOpenSafety] = React.useState(false);
  const [openMedicalForm, setOpenMedicalForm] = React.useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [progress, setProgress] = useState<MoveInModel>();
  const { kidId } = useParams();
  const [uploadState, setUploadState] = useState(UploadState.IDLE);
  const [uploadProgress, setUploadProgress] = useState(0);
  const GetProgress = () => {
    GetAxios().get(constants.Api_Url + 'Task/GetMoveInTaskProgress?kidId=' + kidId).then(res => {
      if (res.data.success) {
        setProgress(res.data.data);
        console.log(res.data.data)

      }
    })

  };

  const fileform = useForm<CreateFileModel>({
    defaultValues: {
      fileType: "LICENCE_AGREEMENT",
      userId: userId,
      kidId: kidId ?? "",
      houseId: props.houseId ?? ""
    },
    mode: "all"
  });
  const aboutmeform = useForm<AboutMeFormModel>({
    defaultValues: {
      userId: userId,
      likes: "",
      triggers: "",
      improveMood: "",
      needSupportWith: "",
      disLikes: "",
      kidId: kidId,
    },
    resolver: yupResolver(aboutKidschema),
    mode: "all"
  });

  const medicalform = useForm<MedialFormModel>({
    defaultValues: {
      userId: userId,
      title: "",
      symptoms: "",
      triggers: "",
      medication: "",
      adminDetails: "",
      inEmergency: "",
      kidId: kidId,
    },
    resolver: yupResolver(kidmedicalSchema),
    mode: "all"
  });

  const { register: aboutRegister, handleSubmit: handleAboutSubmit, formState: { errors: aboutError, isValid: aboutIsValid, isSubmitting: aboutSubmitting }, reset: aboutReset, watch: aboutWatch, getValues: aboutGetValues, setValue: aboutSetValue } = aboutmeform;
  const { register: medicalRegister, handleSubmit: handleMedicalSubmit, formState: { errors: medicalError, isValid: medicalIsValid, isSubmitting: medicalSubmitting }, reset: medicalReset, watch: medicalWatch, getValues: medicalGetValues, setValue: medicalSetValue } = medicalform;
  const { register: fileRegister, formState: { errors: fileError, isValid: fileIsValid, isSubmitting: fileSubmitting }, reset: fileReset, watch: fileWatch, getValues: fileGetValues, setValue: fileSetValue } = fileform;
  let myref: any = null;
  const handleBrowse = function (e: any) {
    e.preventDefault();
    myref.click();

  };
  const onFileSelected = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      if (validFileType(e.target.files[0])) {
        setSelectedFile(e.target.files[0])
        setFileName(e.target.files[0].name);
        fileform.setValue("uploadedFile", e.target.files[0]);
      }
      else {
        enqueueSnackbar("Invalid file type.", {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
      }
    }
  }
  function validFileType(file: any) {
    return fileTypes.includes(file.type);
  }
  const handleKidAboutSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    console.log(aboutGetValues())
    const formData = new FormData();
    formData.append('kidId', aboutGetValues("kidId") ?? "");
    formData.append('userId', userId ?? "");
    formData.append('triggers', aboutGetValues("triggers"));
    formData.append('improveMood', aboutGetValues("improveMood"));
    formData.append('likes', aboutGetValues("likes"));
    formData.append('disLikes', aboutGetValues("disLikes"));
    formData.append('needSupportWith', aboutGetValues("needSupportWith"));

    GetAxios().post(constants.Api_Url + 'KidDetail/CreateUpdateAboutDetail', formData)
      .then(res => {

        if (res.data.success) {
          enqueueSnackbar("Form was successfully submitted.", {
            variant: 'success', style: { backgroundColor: '#5f22d8' },
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          });

          toggleDrawer(false, "About")(event);
          aboutReset();
          GetProgress();
        } else {
          console.warn(res);
          enqueueSnackbar("Unable to save about me.", {
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
  const handleKidMedicalSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    console.log(medicalGetValues())
    const formData = new FormData();
    formData.append('id', medicalGetValues("id") ?? "");
    formData.append('kidId', medicalGetValues("kidId"));
    formData.append('userId', userId ?? "");
    formData.append('title', medicalGetValues("title"));
    formData.append('symptoms', medicalGetValues("symptoms"));
    formData.append('triggers', medicalGetValues("triggers"));
    formData.append('medication', medicalGetValues("medication"));
    formData.append('adminDetails', medicalGetValues("adminDetails"));
    formData.append('inEmergency', medicalGetValues("inEmergency"));

    GetAxios().post(constants.Api_Url + 'KidDetail/CreateUpdateMedicalDetail', formData)
      .then(res => {

        if (res.data.success) {
          enqueueSnackbar("Form was successfully submitted.", {
            variant: 'success', style: { backgroundColor: '#5f22d8' },
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          });
          GetProgress();
          toggleDrawer(false, "Medical")(event);
          medicalReset();

        } else {
          console.warn(res);
          enqueueSnackbar("Unable to save medical detail.", {
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


  let ProgressElement: React.ReactNode = null;
  switch (uploadState) {
    case UploadState.LOADING:
      ProgressElement = (
        <Typography variant="body2" style={{ color: "#54d5cb" }}>
          {uploadProgress}%
        </Typography>
      );
      break;
    case UploadState.SUCCESS:
      ProgressElement = <Done style={{ color: "#54d5cb" }} />;
      break;
    case UploadState.ERROR:
      ProgressElement = <ErrorOutline style={{ color: "#FF0000" }} />;
      break;
  }
  const handleUploadFileFormSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setUploadState(UploadState.LOADING);

    const formData = new FormData();
    formData.append('kidId', fileGetValues("kidId") ?? "");
    formData.append('userId', userId);
    formData.append('houseId', fileGetValues("houseId") ?? "");
    formData.append('fileType', fileGetValues("fileType") ?? "");
    formData.append('uploadedFile', fileGetValues("uploadedFile"));
    formData.append('fileName', fileGetValues("fileName") ?? fileName);

    GetAxios().post(constants.Api_Url + 'File/UploadFile', formData, {

      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
        // const progress = (progressEvent.loaded / progressEvent.total) * 50;
        // setProgress(progress);
      },

    }).then(res => {

      if (res.data.success) {
        enqueueSnackbar("Form was successfully submitted.", {
          variant: 'success', style: { backgroundColor: '#5f22d8' },
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });

        toggleDrawer(false, "SHARING_INFO_CONSENT_FORM")(event);
        toggleDrawer(false, "LICENCE_AGREEMENT")(event);
        toggleDrawer(false, "PHOTO_CONSENT_FORM")(event);
        toggleDrawer(false, "SAFETY_MOVE_IN")(event);
        toggleDrawer(false, "MEDICAL_FORM")(event);
        toggleDrawer(false, "WRITTEN_AGREEMENT")(event);
        toggleDrawer(false, "KEY_CONSENT_FORM")(event);
        fileform.reset(); GetProgress();

      } else {
        console.warn(res);
        enqueueSnackbar("Unable to upload file.", {
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

  const { enqueueSnackbar } = useSnackbar();
  const getAboutDetail = () => {
    GetAxios().get(constants.Api_Url + 'KidDetail/GetAboutDetail?kidId=' + kidId).then(res => {
      if (res.data.success) {
        console.log(res.data.data);
        aboutmeform.reset(res.data.data);
        aboutmeform.setValue("userId", userId);

      }
    })
  };



  const toggleDrawer = (open: any, type: string) => (event: any) => {

    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    if (type == "About") {
      getAboutDetail();
      setOpenAbout(open); setOpenMedicalDetail(false); setOpenMedicalForm(false);
      setOpenAgreement(false); setOpenLicense(false); setOpenPhoto(false);
      setOpenSharing(false); setOpenKey(false); setOpenSafety(false);
    } else if (type == "LICENCE_AGREEMENT") {
      setOpenAbout(false); setOpenMedicalDetail(false); setOpenMedicalForm(false);
      setOpenAgreement(false); setOpenLicense(open); setOpenPhoto(false);
      setOpenSharing(false); setOpenKey(false); setOpenSafety(false);
      fileform.reset(); setSelectedFile(""); setFileName("");
      setUploadProgress(0); setUploadState(UploadState.IDLE);
    }
    else if (type == "SHARING_INFO_CONSENT_FORM") {
      setOpenAbout(false); setOpenMedicalDetail(false); setOpenMedicalForm(false);
      setOpenAgreement(false); setOpenLicense(false); setOpenPhoto(false);
      setOpenSharing(open); setOpenKey(false); setOpenSafety(false);
      fileform.reset(); setSelectedFile(""); setFileName(""); setUploadProgress(0); setUploadState(UploadState.IDLE);
    }
    else if (type == "MEDICAL_FORM") {
      setOpenAbout(false); setOpenMedicalDetail(false); setOpenMedicalForm(open);
      setOpenAgreement(false); setOpenLicense(false); setOpenPhoto(false);
      setOpenSharing(false); setOpenKey(false); setOpenSafety(false);
      fileform.reset(); setSelectedFile(""); setFileName(""); setUploadProgress(0); setUploadState(UploadState.IDLE);
    }
    else if (type == "SAFETY_MOVE_IN") {
      setOpenAbout(false); setOpenMedicalDetail(false); setOpenMedicalForm(false);
      setOpenAgreement(false); setOpenLicense(false); setOpenPhoto(false);
      setOpenSharing(false); setOpenKey(false); setOpenSafety(open);
      fileform.reset(); setSelectedFile(""); setFileName(""); setUploadProgress(0); setUploadState(UploadState.IDLE);
    }

    else if (type == "WRITTEN_AGREEMENT") {
      setOpenAbout(false); setOpenMedicalDetail(false); setOpenMedicalForm(false);
      setOpenAgreement(open); setOpenLicense(false); setOpenPhoto(false);
      setOpenSharing(false); setOpenKey(false); setOpenSafety(false);
      fileform.reset(); setSelectedFile(""); setFileName(""); setUploadProgress(0); setUploadState(UploadState.IDLE);

    }
    else if (type == "PHOTO_CONSENT_FORM") {
      setOpenAbout(false); setOpenMedicalDetail(false); setOpenMedicalForm(false);
      setOpenAgreement(false); setOpenLicense(false); setOpenPhoto(open);
      setOpenSharing(false); setOpenKey(false); setOpenSafety(false);
      fileform.reset(); setSelectedFile(""); setFileName(""); setUploadProgress(0); setUploadState(UploadState.IDLE);

    }
    else if (type == "Medical") {

      setOpenAbout(false); setOpenMedicalDetail(open); setOpenMedicalForm(false);
      setOpenAgreement(false); setOpenLicense(false); setOpenPhoto(false);
      setOpenSharing(false); setOpenKey(false); setOpenSafety(false);
      medicalReset(); medicalform.setValue("kidId", kidId ?? "")
    }
    else if (type == "KEY_CONSENT_FORM") {
      setOpenAbout(false); setOpenMedicalDetail(false); setOpenMedicalForm(false);
      setOpenAgreement(false); setOpenLicense(false); setOpenPhoto(false);
      setOpenSharing(false); setOpenKey(open); setOpenSafety(false);
      fileform.reset(); setSelectedFile(""); setFileName(""); setUploadProgress(0); setUploadState(UploadState.IDLE);

    }
    fileform.setValue("kidId", kidId ?? ""); fileform.setValue("userId", userId);
    fileform.setValue("fileType", type);

  }

  const onhandlePrint = (event: any) => {

    window?.print();
  }
  useEffect(() => {
    GetProgress(); getAboutDetail();
  }, []);

  return (
    <>
      <Container fluid-sm>
        <div className='d-flex align-items-center justify-content-between'>
          <Button variant="text" color="inherit" className="mb-3" onClick={() =>{props.setPreMoveInProcessTab(false); props.setMoveInProcessTab(false); props.setProcessTab(true);}}>
            <ChevronLeftIcon /> MOVE IN
          </Button>

          <IconButton>
            <RefreshIcon />
          </IconButton>
        </div>
        <Grid className='mb-4' container spacing={5}>

          <Grid item xs={12} md={4}>
            <PremoveCard >

              {progress?.license == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "LICENCE_AGREEMENT")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}

              <div>
                <PremoveCardHeading>
                  Upload Licence Agreement
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  File Upload
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <PremoveCard >

              {progress?.sharing == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "SHARING_INFO_CONSENT_FORM")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}

              <div>
                <PremoveCardHeading>
                  Upload Sharing Info Consent Form
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  File Upload
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <PremoveCard >

              {progress?.photo == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "PHOTO_CONSENT_FORM")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}

              <div>
                <PremoveCardHeading>
                Upload Photo Consent Form
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  File Upload
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <PremoveCard >
              {progress?.safety == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "SAFETY_MOVE_IN")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}
              <div>
                <PremoveCardHeading>
                  Upload Fire Safety Move in
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  File Upload
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <PremoveCard >
              {progress?.key == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "KEY_CONSENT_FORM")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}
              <div>
                <PremoveCardHeading>
                  Upload Key Consent Form
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  File Upload
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <PremoveCard >
              {progress?.medical == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "MEDICAL_FORM")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}
              <div>
                <PremoveCardHeading>
                  Upload Medical Form
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  File Upload
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid> <Grid item xs={12} md={4}>
            <PremoveCard >
              {progress?.written == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "WRITTEN_AGREEMENT")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}
              <div>
                <PremoveCardHeading>
                  Upload Written Agreement
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  File Upload
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <PremoveCard >

              {progress?.medcon == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (

                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "Medical")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}
              <div>
                <PremoveCardHeading>
                  Fill out Medical Conditions
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  Form
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid> <Grid item xs={12} md={4}>
            <PremoveCard >
              {progress?.about == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "About")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}
              <div>
                <PremoveCardHeading>
                  Fill out About Me
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  Form
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid>


        </Grid >
      </Container>
      <Drawer className="Mui-Drawe-w" anchor="right" open={openLicense} onClose={toggleDrawer(false, "LICENCE_AGREEMENT")}>
        <AppForm onSubmit={handleUploadFileFormSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Upload Licence Agreement</DrawerHeading>
            </DrawerHeadingParent>
            <DrawerBody>
              <div style={{
                padding: "2.5rem", width: "100%"

              }}>
                <DownloadFileComponent style={{ marginBottom: "10px" }}

                  disabled={!fileWatch("fileType") || fileWatch("fileType") === "OTHER"}
                />
                <input
                  className="hidden d-none" accept=".pdf, .doc, .docx, .xls"
                  id='file-input' ref={(r) => { myref = r }} type='file' onChange={onFileSelected}
                />
                <Paper style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  borderStyle: 'dashed',
                  marginBottom: "4px",
                  padding: 10,
                  //padding: theme.spacing('md'),
                  width: '100%',
                  cursor: 'pointer',
                }}
                  variant="outlined"
                  onClick={handleBrowse}
                  elevation={0}
                >
                  <Upload style={{ fontSize: "32", marginBottom: "2" }} />


                  <Typography variant="body1" color="textSecondary">
                    {selectedFile == ""
                      ? 'Click here to upload file'
                      : ' File selected'}
                  </Typography>
                </Paper>
                <Box style={{ display: 'flex', marginBottom: "5px", flexDirection: 'column', width: '100%' }}>
                  <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>

                    {
                      fileName != "" &&
                      <Box style={{ display: 'flex', alignItems: 'center', gap: "4px" }}>
                        <InsertDriveFile fontSize="large" />{' '}
                        <Typography variant="body1">{fileName}</Typography>
                      </Box>
                    }


                    {ProgressElement}


                  </Box>
                  {uploadState === UploadState.LOADING ? (
                    <progress value={uploadProgress} max="100" style={{ height: '6px', width: '100%', backgroundColor: "#54d5cb" }} />

                  ) : null}
                </Box>
              </div>
              <div className="d-flex align-items-center justify-content-between" style={{
                padding: "2.5rem", width: "100%"
              }}>
                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "LICENCE_AGREEMENT")}>
                  Cancel
                </Button>
                <Button variant="text" color="inherit" onClick={onhandlePrint}>
                  Print
                </Button>
                <AppButton type="submit" className='btnLogin' disabled={!fileIsValid}  >
                  {!fileSubmitting ?
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
      <Drawer className="Mui-Drawe-w" anchor="right" open={openSharing} onClose={toggleDrawer(false, "SHARING_INFO_CONSENT_FORM")}>
        <AppForm onSubmit={handleUploadFileFormSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Upload Sharing Info Consent Form</DrawerHeading>
            </DrawerHeadingParent>
            <DrawerBody>
              <div style={{
                padding: "2.5rem", width: "100%"

              }}>
                <DownloadFileComponent style={{ marginBottom: "10px" }}

                  disabled={!fileWatch("fileType") || fileWatch("fileType") === "OTHER"}
                />
                <input
                  className="hidden d-none" accept=".pdf, .doc, .docx, .xls"
                  id='file-input' ref={(r) => { myref = r }} type='file' onChange={onFileSelected}
                />
                <Paper style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  borderStyle: 'dashed',
                  marginBottom: "4px",
                  padding: 10,
                  //padding: theme.spacing('md'),
                  width: '100%',
                  cursor: 'pointer',
                }}
                  variant="outlined"
                  onClick={handleBrowse}
                  elevation={0}
                >
                  <Upload style={{ fontSize: "32", marginBottom: "2" }} />


                  <Typography variant="body1" color="textSecondary">
                    {selectedFile == ""
                      ? 'Click here to upload file'
                      : ' File selected'}
                  </Typography>
                </Paper>
                <Box style={{ display: 'flex', marginBottom: "5px", flexDirection: 'column', width: '100%' }}>
                  <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>

                    {
                      fileName != "" &&
                      <Box style={{ display: 'flex', alignItems: 'center', gap: "4px" }}>
                        <InsertDriveFile fontSize="large" />{' '}
                        <Typography variant="body1">{fileName}</Typography>
                      </Box>
                    }


                    {ProgressElement}


                  </Box>

                  {uploadState === UploadState.LOADING ? (
                    <progress value={uploadProgress} max="100" style={{ height: '6px', width: '100%', backgroundColor: "#54d5cb" }} />

                    // <LinearProgress variant="determinate" value={uploadProgress} style={{ color: "#04b873" }} />
                  ) : null}
                </Box>
              </div>
              <div className="d-flex align-items-center justify-content-between" style={{
                padding: "2.5rem", width: "100%"
              }}>
                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "SHARING_INFO_CONSENT_FORM")}>
                  Cancel
                </Button>
                <Button variant="text" color="inherit" onClick={onhandlePrint}>
                  Print
                </Button>
                <AppButton type="submit" className='btnLogin' disabled={!fileIsValid}  >
                  {!fileSubmitting ?
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
      <Drawer className="Mui-Drawe-w" anchor="right" open={openPhoto} onClose={toggleDrawer(false, "PHOTO_CONSENT_FORM")}>
        <AppForm onSubmit={handleUploadFileFormSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Upload Photo Consent Form</DrawerHeading>
            </DrawerHeadingParent>
            <DrawerBody>
              <div style={{
                padding: "2.5rem", width: "100%"

              }}>
                <DownloadFileComponent style={{ marginBottom: "10px" }}

                  disabled={!fileWatch("fileType") || fileWatch("fileType") === "OTHER"}
                />
                <input
                  className="hidden d-none" accept=".pdf, .doc, .docx, .xls"
                  id='file-input' ref={(r) => { myref = r }} type='file' onChange={onFileSelected}
                />
                <Paper style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  borderStyle: 'dashed',
                  marginBottom: "4px",
                  padding: 10,
                  //padding: theme.spacing('md'),
                  width: '100%',
                  cursor: 'pointer',
                }}
                  variant="outlined"
                  onClick={handleBrowse}
                  elevation={0}
                >
                  <Upload style={{ fontSize: "32", marginBottom: "2" }} />


                  <Typography variant="body1" color="textSecondary">
                    {selectedFile == ""
                      ? 'Click here to upload file'
                      : ' File selected'}
                  </Typography>
                </Paper>
                <Box style={{ display: 'flex', marginBottom: "5px", flexDirection: 'column', width: '100%' }}>
                  <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>

                    {
                      fileName != "" &&
                      <Box style={{ display: 'flex', alignItems: 'center', gap: "4px" }}>
                        <InsertDriveFile fontSize="large" />{' '}
                        <Typography variant="body1">{fileName}</Typography>
                      </Box>
                    }


                    {ProgressElement}


                  </Box>
                  {uploadState === UploadState.LOADING ? (
                    <progress value={uploadProgress} max="100" style={{ height: '6px', width: '100%', backgroundColor: "#54d5cb" }} />

                  ) : null}
                </Box>
              </div>
              <div className="d-flex align-items-center justify-content-between" style={{
                padding: "2.5rem", width: "100%"
              }}>
                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "PHOTO_CONSENT_FORM")}>
                  Cancel
                </Button>
                <Button variant="text" color="inherit" onClick={onhandlePrint}>
                  Print
                </Button>
                <AppButton type="submit" className='btnLogin' disabled={!fileIsValid}  >
                  {!fileSubmitting ?
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
      <Drawer className="Mui-Drawe-w" anchor="right" open={openSafety} onClose={toggleDrawer(false, "SAFETY_MOVE_IN")}>
        <AppForm onSubmit={handleUploadFileFormSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Upload Fire Safety Move in</DrawerHeading>
            </DrawerHeadingParent>
            <DrawerBody>
              <div style={{
                padding: "2.5rem", width: "100%"

              }}>
                <DownloadFileComponent style={{ marginBottom: "10px" }}

                  disabled={!fileWatch("fileType") || fileWatch("fileType") === "OTHER"}
                />
                <input
                  className="hidden d-none" accept=".pdf, .doc, .docx, .xls"
                  id='file-input' ref={(r) => { myref = r }} type='file' onChange={onFileSelected}
                />
                <Paper style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  borderStyle: 'dashed',
                  marginBottom: "4px",
                  padding: 10,
                  //padding: theme.spacing('md'),
                  width: '100%',
                  cursor: 'pointer',
                }}
                  variant="outlined"
                  onClick={handleBrowse}
                  elevation={0}
                >
                  <Upload style={{ fontSize: "32", marginBottom: "2" }} />


                  <Typography variant="body1" color="textSecondary">
                    {selectedFile == ""
                      ? 'Click here to upload file'
                      : ' File selected'}
                  </Typography>
                </Paper>
                <Box style={{ display: 'flex', marginBottom: "5px", flexDirection: 'column', width: '100%' }}>
                  <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>

                    {
                      fileName != "" &&
                      <Box style={{ display: 'flex', alignItems: 'center', gap: "4px" }}>
                        <InsertDriveFile fontSize="large" />{' '}
                        <Typography variant="body1">{fileName}</Typography>
                      </Box>
                    }


                    {ProgressElement}


                  </Box>
                  {uploadState === UploadState.LOADING ? (
                    <progress value={uploadProgress} max="100" style={{ height: '6px', width: '100%', backgroundColor: "#54d5cb" }} />

                  ) : null}
                </Box>
              </div>
              <div className="d-flex align-items-center justify-content-between" style={{
                padding: "2.5rem", width: "100%"
              }}>
                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "SAFETY_MOVE_IN")}>
                  Cancel
                </Button>
                <Button variant="text" color="inherit" onClick={onhandlePrint}>
                  Print
                </Button>
                <AppButton type="submit" className='btnLogin' disabled={!fileIsValid}  >
                  {!fileSubmitting ?
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
      <Drawer className="Mui-Drawe-w" anchor="right" open={openKey} onClose={toggleDrawer(false, "KEY_CONSENT_FORM")}>
        <AppForm onSubmit={handleUploadFileFormSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Upload Key Consent Form</DrawerHeading>
            </DrawerHeadingParent>
            <DrawerBody>
              <div style={{
                padding: "2.5rem", width: "100%"

              }}>
                <DownloadFileComponent style={{ marginBottom: "10px" }}

                  disabled={!fileWatch("fileType") || fileWatch("fileType") === "OTHER"}
                />
                <input
                  className="hidden d-none" accept=".pdf, .doc, .docx, .xls"
                  id='file-input' ref={(r) => { myref = r }} type='file' onChange={onFileSelected}
                />
                <Paper style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  borderStyle: 'dashed',
                  marginBottom: "4px",
                  padding: 10,
                  //padding: theme.spacing('md'),
                  width: '100%',
                  cursor: 'pointer',
                }}
                  variant="outlined"
                  onClick={handleBrowse}
                  elevation={0}
                >
                  <Upload style={{ fontSize: "32", marginBottom: "2" }} />


                  <Typography variant="body1" color="textSecondary">
                    {selectedFile == ""
                      ? 'Click here to upload file'
                      : ' File selected'}
                  </Typography>
                </Paper>
                <Box style={{ display: 'flex', marginBottom: "5px", flexDirection: 'column', width: '100%' }}>
                  <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>

                    {
                      fileName != "" &&
                      <Box style={{ display: 'flex', alignItems: 'center', gap: "4px" }}>
                        <InsertDriveFile fontSize="large" />{' '}
                        <Typography variant="body1">{fileName}</Typography>
                      </Box>
                    }


                    {ProgressElement}


                  </Box>
                  {uploadState === UploadState.LOADING ? (
                    <progress value={uploadProgress} max="100" style={{ height: '6px', width: '100%', backgroundColor: "#54d5cb" }} />

                  ) : null}
                </Box>
              </div>
              <div className="d-flex align-items-center justify-content-between" style={{
                padding: "2.5rem", width: "100%"
              }}>
                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "KEY_CONSENT_FORM")}>
                  Cancel
                </Button>
                <Button variant="text" color="inherit" onClick={onhandlePrint}>
                  Print
                </Button>
                <AppButton type="submit" className='btnLogin' disabled={!fileIsValid}  >
                  {!fileSubmitting ?
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
      <Drawer className="Mui-Drawe-w" anchor="right" open={openMedicalForm} onClose={toggleDrawer(false, "MEDICAL_FORM")}>
        <AppForm onSubmit={handleUploadFileFormSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Upload Medical Form</DrawerHeading>
            </DrawerHeadingParent>
            <DrawerBody>
              <div style={{
                padding: "2.5rem", width: "100%"

              }}>
                <DownloadFileComponent style={{ marginBottom: "10px" }}

                  disabled={!fileWatch("fileType") || fileWatch("fileType") === "OTHER"}
                />
                <input
                  className="hidden d-none" accept=".pdf, .doc, .docx, .xls"
                  id='file-input' ref={(r) => { myref = r }} type='file' onChange={onFileSelected}
                />
                <Paper style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  borderStyle: 'dashed',
                  marginBottom: "4px",
                  padding: 10,
                  //padding: theme.spacing('md'),
                  width: '100%',
                  cursor: 'pointer',
                }}
                  variant="outlined"
                  onClick={handleBrowse}
                  elevation={0}
                >
                  <Upload style={{ fontSize: "32", marginBottom: "2" }} />


                  <Typography variant="body1" color="textSecondary">
                    {selectedFile == ""
                      ? 'Click here to upload file'
                      : ' File selected'}
                  </Typography>
                </Paper>
                <Box style={{ display: 'flex', marginBottom: "5px", flexDirection: 'column', width: '100%' }}>
                  <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>

                    {
                      fileName != "" &&
                      <Box style={{ display: 'flex', alignItems: 'center', gap: "4px" }}>
                        <InsertDriveFile fontSize="large" />{' '}
                        <Typography variant="body1">{fileName}</Typography>
                      </Box>
                    }


                    {ProgressElement}


                  </Box>
                  {uploadState === UploadState.LOADING ? (
                    <progress value={uploadProgress} max="100" style={{ height: '6px', width: '100%', backgroundColor: "#54d5cb" }} />

                  ) : null}
                </Box>
              </div>
              <div className="d-flex align-items-center justify-content-between" style={{
                padding: "2.5rem", width: "100%"
              }}>
                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "MEDICAL_FORM")}>
                  Cancel
                </Button>
                <Button variant="text" color="inherit" onClick={onhandlePrint}>
                  Print
                </Button>
                <AppButton type="submit" className='btnLogin' disabled={!fileIsValid}  >
                  {!fileSubmitting ?
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
      <Drawer className="Mui-Drawe-w" anchor="right" open={openAgreement} onClose={toggleDrawer(false, "WRITTEN_AGREEMENT")}>
        <AppForm onSubmit={handleUploadFileFormSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Upload Written Agreement</DrawerHeading>
            </DrawerHeadingParent>
            <DrawerBody>
              <div style={{
                padding: "2.5rem", width: "100%"

              }}>
                <DownloadFileComponent style={{ marginBottom: "10px" }}

                  disabled={!fileWatch("fileType") || fileWatch("fileType") === "OTHER"}
                />
                <input
                  className="hidden d-none" accept=".pdf, .doc, .docx, .xls"
                  id='file-input' ref={(r) => { myref = r }} type='file' onChange={onFileSelected}
                />
                <Paper style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  borderStyle: 'dashed',
                  marginBottom: "4px",
                  padding: 10,
                  //padding: theme.spacing('md'),
                  width: '100%',
                  cursor: 'pointer',
                }}
                  variant="outlined"
                  onClick={handleBrowse}
                  elevation={0}
                >
                  <Upload style={{ fontSize: "32", marginBottom: "2" }} />


                  <Typography variant="body1" color="textSecondary">
                    {selectedFile == ""
                      ? 'Click here to upload file'
                      : ' File selected'}
                  </Typography>
                </Paper>
                <Box style={{ display: 'flex', marginBottom: "5px", flexDirection: 'column', width: '100%' }}>
                  <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>

                    {
                      fileName != "" &&
                      <Box style={{ display: 'flex', alignItems: 'center', gap: "4px" }}>
                        <InsertDriveFile fontSize="large" />{' '}
                        <Typography variant="body1">{fileName}</Typography>
                      </Box>
                    }


                    {ProgressElement}


                  </Box>
                  {uploadState === UploadState.LOADING ? (
                    <progress value={uploadProgress} max="100" style={{ height: '6px', width: '100%', backgroundColor: "#54d5cb" }} />

                  ) : null}
                </Box>
              </div>
              <div className="d-flex align-items-center justify-content-between" style={{
                padding: "2.5rem", width: "100%"
              }}>
                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "WRITTEN_AGREEMENT")}>
                  Cancel
                </Button>
                <Button variant="text" color="inherit" onClick={onhandlePrint}>
                  Print
                </Button>
                <AppButton type="submit" className='btnLogin' disabled={!fileIsValid}  >
                  {!fileSubmitting ?
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
      <Drawer className="Mui-Drawe-w" anchor="right" open={openMedicalDetail} onClose={toggleDrawer(false, "Medical")}>
                    <AppForm onSubmit={handleKidMedicalSubmit}>
                        <Box>
                            <DrawerHeadingParent>
                                <DrawerHeading style={{color: "#2a0560"}}> Medical Conditions</DrawerHeading>
                            </DrawerHeadingParent>
                            <DrawerBody>
                                <div style={{
                                    padding: "2.5rem", width: "100%"

                                }}>

                                    <TextField id="standard-basic1" className="mb-4" fullWidth label="Condition Name*"
                                        variant="standard"
                                        {...medicalRegister("title", { required: true })}
                                        error={!!medicalError.title}
                                        helperText={medicalError.title?.message}
                                    />
                                    <TextField id="standard-basic2" className="mb-4" fullWidth label="Symptoms:*" variant="standard"
                                        {...medicalRegister("symptoms", { required: true })}
                                        error={!!medicalError.symptoms}
                                        helperText={medicalError.symptoms?.message} />

                                    <TextField id="standard-basic1" className="mb-4" fullWidth label="Triggers*"
                                        variant="standard"
                                        {...medicalRegister("triggers", { required: true })}
                                        error={!!medicalError.triggers}
                                        helperText={medicalError.triggers?.message}
                                    />
                                    <TextField id="standard-basic2" className="mb-4" fullWidth label="Medication:*" variant="standard"
                                        {...medicalRegister("medication", { required: true })}
                                        error={!!medicalError.medication}
                                        helperText={medicalError.medication?.message} />
                                    <TextField id="standard-basic1" className="mb-4" fullWidth label="Administration Details*"
                                        variant="standard"
                                        {...medicalRegister("adminDetails", { required: true })}
                                        error={!!medicalError.adminDetails}
                                        helperText={medicalError.adminDetails?.message}
                                    />
                                    <TextField id="standard-basic2" className="mb-4" fullWidth label="Incase of Emergency:*" variant="standard"
                                        {...medicalRegister("inEmergency", { required: true })}
                                        error={!!medicalError.inEmergency}
                                        helperText={medicalError.inEmergency?.message} />

                                </div>
                                <div className="d-flex align-items-center justify-content-between" style={{
                                    padding: "2.5rem", width: "100%"
                                }}>
                                    <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Medical")}>
                                        Cancel
                                    </Button>
                                    <Button variant="text" color="inherit" onClick={onhandlePrint}>
                                        Print
                                    </Button>
                                    <AppButton type="submit" className='btnLogin' disabled={!medicalIsValid}  >
                                        {!medicalSubmitting ?
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
             
                <Drawer className="Mui-Drawe-w" anchor="right" open={openAbout} onClose={toggleDrawer(false, "About")}>
                    <AppForm onSubmit={handleKidAboutSubmit}>
                        <Box>
                            <DrawerHeadingParent>
                                <DrawerHeading style={{color: "#2a0560"}}> About me</DrawerHeading>
                            </DrawerHeadingParent>
                            <DrawerBody>
                                <div style={{
                                    padding: "2.5rem", width: "100%"

                                }}>
                                    <TextField id="triggers" {...aboutRegister("triggers", { required: true })} className="mb-4" fullWidth label="Triggers: *" multiline
                                        rows={4}
                                        variant="standard"
                                        error={!!aboutError.triggers}
                                        helperText={aboutError.triggers?.message} />
                                    <TextField id="simproveMood" {...aboutRegister("improveMood", { required: true })} className="mb-4" fullWidth label="Improves my Mood: *" multiline
                                        rows={4}
                                        variant="standard"
                                        error={!!aboutError.improveMood}
                                        helperText={aboutError.improveMood?.message} />
                                    <TextField id="ssupport" {...aboutRegister("needSupportWith", { required: true })} className="mb-4" fullWidth label="Need Support With: *" multiline
                                        rows={4}
                                        variant="standard"
                                        error={!!aboutError.needSupportWith}
                                        helperText={aboutError.needSupportWith?.message} />
                                    <TextField id="likes" {...aboutRegister("likes", { required: true })} className="mb-4" fullWidth label="Likes: *" multiline
                                        rows={4}
                                        variant="standard"
                                        error={!!aboutError.likes}
                                        helperText={aboutError.likes?.message} />
                                    <TextField id="dislikes" {...aboutRegister("disLikes", { required: true })} className="mb-4" fullWidth label="Dislikes: *" multiline
                                        rows={4}
                                        variant="standard"
                                        error={!!aboutError.disLikes}
                                        helperText={aboutError.disLikes?.message} />

                                </div>
                                <div className="d-flex align-items-center justify-content-between" style={{
                                    padding: "2.5rem", width: "100%"
                                }}>
                                    <Button variant="text" color="inherit" onClick={toggleDrawer(false, "About")}>
                                        Cancel
                                    </Button>
                                    <Button variant="text" color="inherit" onClick={onhandlePrint}>
                                        Print
                                    </Button>
                                    <AppButton type="submit" className='btnLogin' disabled={!aboutIsValid}  >
                                        {!aboutSubmitting ?
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
    </>
  );

}



