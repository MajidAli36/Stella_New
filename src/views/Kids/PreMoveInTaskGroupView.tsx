
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
import { basicKidschema, aboutKidschema, kidLegalSchema, kidriskassessmentSchema } from '../../service/ValidationSchema';
import { legalStatuses } from "./legalStatus";
import { useNavigate, useParams } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { CloudDownload, InsertDriveFile, Done, ErrorOutline } from '@mui/icons-material';
import {
  ToggleButton, ToggleButtonGroup,
  ToggleButtonProps,
  ToggleButtonGroupProps,
} from '@mui/material';
import * as yup from "yup";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
interface Iprops {
  setPreMoveInProcessTab: (value: boolean) => void;
  setMoveInProcessTab: (value: boolean) => void;
  setProcessTab: (value: boolean) => void;
  houseId: string;
}
export enum UploadState {
  IDLE,
  LOADING,
  ERROR,
  SUCCESS,
}
export default function PreMoveInTaskGroupViewTab(props: Iprops) {
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
  const kidnextofkinSchema = yup.object().shape({
    id: yup.string().nullable().notRequired(),
    kidId: yup.string().required('Required'),
    userId: yup.string().required('Required'),
    name: yup.string().required('Required'),
    relationship: yup.string().required('Required'),
    phone: yup.string().required('Required'),
    contactable: yup.boolean().required('Required'),
    visitable: yup.boolean().required('Required'),
    note: yup.string().required('Required'),
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


  const [openBasic, setOpenBasic] = React.useState(false);
  const [openLegal, setOpenLegal] = React.useState(false);
  const [openContact, setOpenContact] = React.useState(false);
  const [openRisk, setOpenRisk] = React.useState(false);
  const [openCRF, setOpenCRF] = React.useState(false);
  const [openInitial, setOpenInitial] = React.useState(false);
  const [openChecklist, setOpenChecklist] = React.useState(false);
  const [openOutcome, setOpenOutcome] = React.useState(false);
  const [riskstep, setRiskStep] = useState(1);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [progress, setProgress] = useState<PreMoveInModel>();
  const { kidId } = useParams();
  const [uploadState, setUploadState] = useState(UploadState.IDLE);
  const [uploadProgress, setUploadProgress] = useState(0);
  const GetProgress = () => {
    GetAxios().get(constants.Api_Url + 'Task/GetPreMoveInTaskProgress?kidId=' + kidId).then(res => {
      if (res.data.success) {
        setProgress(res.data.data);
        console.log(res.data.data)

      }
    })

  };

  const fileform = useForm<CreateFileModel>({
    defaultValues: {
      fileType: "CRF",
      userId: userId,
      kidId: kidId ?? "",
      houseId: props.houseId ?? ""
    },
    mode: "all"
  });
  const basicform = useForm<UpdateBasicDetailModel>({
    defaultValues: {
      id: "", userId: userId, gender: "Male", appearance: "",
      dateOfBirth: new Date(), ethnicity: "",
      email: "", name: "", preferredName: "",
      spokenLanguage: "", safePlace: "", mostRecentAddress: "",

    },
    resolver: yupResolver(basicKidschema),
    mode: "all"
  });

  const legalform = useForm<LegalDetailModel>({
    defaultValues: {
      userId: userId,
      legalStatus: "",
      localAuthority: "",
      niNumber: "",
      nhsNumber: "",
      registeredGP: "",
      registeredDentist: "",
      socialWorker: "",
      ypAdvisor: "",
      registeredOptician: "",
      kidId: kidId,
    },
    resolver: yupResolver(kidLegalSchema),
    mode: "all"
  });

  const nextOfKinform = useForm<NextOfKinModel>({
    defaultValues: {
      userId: userId,
      name: "",
      relationship: "",
      phone: "",
      contactable: false,
      visitable: false,
      note: "",
      kidId: kidId,
    },
    resolver: yupResolver(kidnextofkinSchema),
    mode: "all"
  });

  const riskform = useForm<KidRiskAssessmentFormModel>({
    defaultValues: {
      userId: userId,
      note: "",
      kidId: kidId,
    },
    mode: "all"
  });
  const { register: basicRegister, handleSubmit: handleBasicSubmit, formState: { errors: basicError, isValid: basicIsValid, isSubmitting: basicSubmitting }, reset: basicReset, watch: basicWatch, getValues: basicGetValues, setValue: basicSetValue } = basicform;
  const { register: legalRegister, handleSubmit: handleLegalSubmit, formState: { errors: legalError, isValid: legalIsValid, isSubmitting: legalSubmitting }, reset: legalReset, watch: legalWatch, getValues: legalGetValues, setValue: legalSetValue } = legalform;
  const { register: nextofkinRegister, handleSubmit: handleNextOfKinSubmit, formState: { errors: nextOfKinError, isValid: nextOfKinIsValid, isSubmitting: nextOfKinSubmitting }, reset: nextOfKinReset, watch: nextOfKinWatch, getValues: nextOfKinGetValues, control: nextofKinControl, setValue: nextOfKinSetValue } = nextOfKinform;
  const { register: riskRegister, handleSubmit: handleRiskSubmit, formState: { errors: riskError, isValid: riskIsValid, isSubmitting: riskSubmitting }, reset: riskReset, watch: riskWatch, getValues: riskGetValues, control: riskControl, setValue: riskSetValue } = riskform;
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
  const handleKidBasicSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    console.log(basicGetValues())
    const formData = new FormData();
    formData.append('id', basicGetValues("id") ?? "");
    formData.append('userId', userId ?? "");
    formData.append('name', basicGetValues("name"));
    formData.append('preferredName', basicGetValues("preferredName"));
    formData.append('phone', basicGetValues("phone"));
    formData.append('gender', basicGetValues("gender"));
    formData.append('email', basicGetValues("email"));
    formData.append('dateOfBirth', moment(basicGetValues("dateOfBirth")).format('YYYY-MM-DDTHH:mm:ss'));
    formData.append('mostRecentAddress', basicGetValues("mostRecentAddress"));
    formData.append('appearance', basicGetValues("appearance"));
    formData.append("religion", basicGetValues("religion"));
    formData.append('ethnicity', basicGetValues("ethnicity"));
    formData.append('spokenLanguage', basicGetValues("spokenLanguage"));
    formData.append('safePlace', basicGetValues("safePlace"));
    GetAxios().post(constants.Api_Url + 'KidDetail/UpdateBasicDetail', formData)
      .then(res => {

        if (res.data.success) {
          enqueueSnackbar("Form was successfully submitted.", {
            variant: 'success', style: { backgroundColor: '#5f22d8' },
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          });

          toggleDrawer(false, "Basic")(event);
          basicReset();
          GetProgress();

        } else {
          console.warn(res);
          enqueueSnackbar("Unable to update basic detail.", {
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
  const handleKidLegalSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    console.log(legalGetValues())
    const formData = new FormData();
    formData.append('kidId', legalGetValues("kidId"));
    formData.append('userId', userId ?? "");
    formData.append('legalStatus', legalGetValues("legalStatus"));
    formData.append('localAuthority', legalGetValues("localAuthority"));
    formData.append('nhsNumber', legalGetValues("nhsNumber"));
    formData.append('niNumber', legalGetValues("niNumber"));
    formData.append('registeredDentist', legalGetValues("registeredDentist"));
    formData.append('registeredGP', legalGetValues("registeredGP"));
    formData.append('registeredOptician', legalGetValues("registeredOptician"));
    formData.append('socialWorker', legalGetValues("socialWorker"));
    formData.append('ypAdvisor', legalGetValues("ypAdvisor"));

    GetAxios().post(constants.Api_Url + 'KidDetail/CreateUpdateLegalDetail', formData)
      .then(res => {

        if (res.data.success) {
          enqueueSnackbar("Form was successfully submitted.", {
            variant: 'success', style: { backgroundColor: '#5f22d8' },
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          });

          toggleDrawer(false, "Legal")(event);
          legalReset(); GetProgress();

        } else {
          console.warn(res);
          enqueueSnackbar("Unable to save legal detail.", {
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

  const handleKidNextOfKinSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    console.log(basicGetValues())
    const formData = new FormData();
    formData.append('id', nextOfKinGetValues("id") ?? "");
    formData.append('kidId', nextOfKinGetValues("kidId") ?? "");
    formData.append('userId', userId ?? "");
    formData.append('name', nextOfKinGetValues("name"));
    formData.append('relationship', nextOfKinGetValues("relationship"));
    formData.append('contactable', String(nextOfKinGetValues("contactable")));
    formData.append('visitable', String(nextOfKinGetValues("visitable")));
    formData.append('phone', nextOfKinGetValues("phone"));
    formData.append('note', nextOfKinGetValues("note"));
    GetAxios().post(constants.Api_Url + 'KidDetail/CreateUpdateContactDetail', formData)
      .then(res => {

        if (res.data.success) {
          enqueueSnackbar("Form was successfully submitted.", {
            variant: 'success', style: { backgroundColor: '#5f22d8' },
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          });
          //set tick
          toggleDrawer(false, "Contact")(event);
          nextOfKinReset(); GetProgress();

        } else {
          console.warn(res);
          enqueueSnackbar("Unable to save next of kin detail.", {
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
  const handleKidRiskSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    console.log(riskGetValues())
    const formData = new FormData();
    formData.append('kidId', riskGetValues("kidId"));
    formData.append('logId', riskGetValues("logId") ?? "");
    formData.append('userId', userId ?? "");
    formData.append('note', riskGetValues("note"));
    formData.append('suicide', riskGetValues("suicide"));
    formData.append('aggressive', riskGetValues("aggressive"));
    formData.append('arson', riskGetValues("arson"));
    formData.append('selfNeglect', riskGetValues("selfNeglect"));
    formData.append('ignoreMedical', riskGetValues("ignoreMedical"));
    formData.append('mentalHealth', riskGetValues("mentalHealth"));
    formData.append('substance', riskGetValues("substance"));
    formData.append('abuse', riskGetValues("abuse"));
    formData.append('physical', riskGetValues("physical"));
    formData.append('hygiene', riskGetValues("hygiene"));
    formData.append('environmental', riskGetValues("environmental"));
    formData.append('youngPerson', riskGetValues("youngPerson"));
    formData.append('olderPerson', riskGetValues("olderPerson"));
    formData.append('childern', riskGetValues("childern"));
    formData.append('women', riskGetValues("women"));
    formData.append('men', riskGetValues("men"));
    formData.append('family', riskGetValues("family"));
    formData.append('region', riskGetValues("region"));
    formData.append('race', riskGetValues("race"));
    formData.append('lgb', riskGetValues("lgb"));
    formData.append('transgender', riskGetValues("transgender"));
    formData.append('disability', riskGetValues("disability"));
    formData.append('staff', riskGetValues("staff"));
    GetAxios().post(constants.Api_Url + 'Dashboard/CreateUpdateRiskAssessment', formData)
      .then(res => {

        if (res.data.success) {
          enqueueSnackbar("Form was successfully submitted.", {
            variant: 'success', style: { backgroundColor: '#5f22d8' },
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          });

          toggleDrawer(false, "Risk")(event);
          riskReset();
          GetProgress();

        } else {
          console.warn(res);
          enqueueSnackbar("Unable to save risk assessment.", {
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

        toggleDrawer(false, "CRF")(event);
        toggleDrawer(false, "INITIAL_ASSESSMENT")(event);
        toggleDrawer(false, "CHECKLIST")(event);
        toggleDrawer(false, "ASSESSMENT_OUTCOME")(event);
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
  const getBasicDetail = () => {
    GetAxios().get(constants.Api_Url + 'KidDetail/GetBasicDetail?kidId=' + kidId).then(res => {
      if (res.data.success) {
        console.log(res.data.data);
        basicform.reset(res.data.data);
        basicform.setValue("userId", userId); basicform.setValue("dateOfBirth", res.data.data.dateOfBirth);

      }
    })
  };

  const getLegalDetail = () => {
    GetAxios().get(constants.Api_Url + 'KidDetail/GetLegalDetail?kidId=' + kidId).then(res => {
      if (res.data.success) {


        legalform.reset(res.data.data);
        legalform.setValue("userId", userId);
        legalform.setValue("legalStatus", res.data.data.legalStatus.trim());
        console.log(legalGetValues())
      }
    })
  };
  const getRiskDetail = () => {
    GetAxios().get(constants.Api_Url + 'KidDetail/GetRiskAssessment?kidId=' + kidId).then(res => {
      if (res.data.success) {

        console.log(res.data.data)
        riskform.reset(res.data.data);
        riskform.setValue("userId", userId);

        riskform.setValue("youngPerson", res.data.data.youngPerson);
        console.log(riskGetValues())
      }
    })
  };

  const toggleDrawer = (open: any, type: string) => (event: any) => {

    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    if (type == "Basic") {
      getBasicDetail();
      setOpenLegal(false); setOpenBasic(open); setOpenRisk(false); setOpenInitial(false);
      setOpenChecklist(false); setOpenOutcome(false); setOpenCRF(false); setOpenContact(false);
      setOpenContact(false);
    } else if (type == "CRF") {
      setOpenLegal(false); setOpenBasic(false); setOpenRisk(false); setOpenInitial(false);
      setOpenChecklist(false); setOpenOutcome(false); setOpenCRF(open); setOpenContact(false);
      fileform.reset(); setSelectedFile(""); setFileName("");
      setUploadProgress(0); setUploadState(UploadState.IDLE);
    }
    else if (type == "INITIAL_ASSESSMENT") {
      setOpenLegal(false); setOpenBasic(false); setOpenRisk(false); setOpenInitial(open);
      setOpenChecklist(false); setOpenOutcome(false); setOpenCRF(false); setOpenContact(false);
      fileform.reset(); setSelectedFile(""); setFileName(""); setUploadProgress(0); setUploadState(UploadState.IDLE);
    }
    else if (type == "CHECKLIST") {
      setOpenLegal(false); setOpenBasic(false); setOpenRisk(false); setOpenInitial(false);
      setOpenChecklist(open); setOpenOutcome(false); setOpenCRF(false); setOpenContact(false);
      fileform.reset(); setSelectedFile(""); setFileName(""); setUploadProgress(0); setUploadState(UploadState.IDLE);
    }
    else if (type == "ASSESSMENT_OUTCOME") {
      setOpenLegal(false); setOpenBasic(false); setOpenRisk(false); setOpenInitial(false);
      setOpenChecklist(false); setOpenOutcome(open); setOpenCRF(false); setOpenContact(false);
      fileform.reset(); setSelectedFile(""); setFileName(""); setUploadProgress(0); setUploadState(UploadState.IDLE);
    }

    else if (type == "Legal") {
      getLegalDetail();
      setOpenLegal(open); setOpenBasic(false); setOpenRisk(false); setOpenInitial(false);
      setOpenChecklist(false); setOpenOutcome(false); setOpenCRF(false); setOpenContact(false);

    }

    else if (type == "Contact") {

      setOpenLegal(false); setOpenBasic(false); setOpenRisk(false); setOpenInitial(false);
      setOpenChecklist(false); setOpenOutcome(false); setOpenCRF(false); setOpenContact(open);
      nextOfKinReset(); nextOfKinform.setValue("kidId", kidId ?? "")
    }
    else if (type == "Risk") {
      setRiskStep(1); getRiskDetail();
      setOpenLegal(false); setOpenBasic(false); setOpenRisk(open); setOpenInitial(false);
      setOpenChecklist(false); setOpenOutcome(false); setOpenCRF(false);
    }
    fileform.setValue("kidId", kidId ?? ""); fileform.setValue("userId", userId);
    fileform.setValue("fileType", type);

  }

  const onhandlePrint = (event: any) => {

    window?.print();
  }
  useEffect(() => {
    GetProgress(); getBasicDetail(); getLegalDetail(); getRiskDetail();
  }, []);

  return (
    <>
      <Container fluid-sm>
        <div className='d-flex align-items-center justify-content-between'>
          <Button variant="text" color="inherit" className="mb-3" onClick={() => { props.setPreMoveInProcessTab(false); props.setMoveInProcessTab(false); props.setProcessTab(true) }}>
            <ChevronLeftIcon /> PRE-MOVE IN
          </Button>

          <IconButton>
            <RefreshIcon />
          </IconButton>
        </div>
        <Grid className='mb-4' container spacing={5}>

          <Grid item xs={12} md={4}>
            <PremoveCard >

              {progress?.crf == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "CRF")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}

              <div>
                <PremoveCardHeading>
                  Upload CRF
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  File Upload
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <PremoveCard >
              {progress?.initial == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "INITIAL_ASSESSMENT")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}
              <div>
                <PremoveCardHeading>
                  Upload Initial Assessment
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  File Upload
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <PremoveCard >
              {progress?.risk == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "Risk")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}
              <div>
                <PremoveCardHeading>
                  Fill out Risk Assessment
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  Form
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <PremoveCard >
              {progress?.checklist == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "CHECKLIST")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}
              <div>
                <PremoveCardHeading>
                  Upload Checklist
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  File Upload
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid> <Grid item xs={12} md={4}>
            <PremoveCard >
              {progress?.outcome == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "ASSESSMENT_OUTCOME")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}
              <div>
                <PremoveCardHeading>
                  Assessment Outcomes
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  File Upload
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <PremoveCard >

              {progress?.basic == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (

                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "Basic")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}
              <div>
                <PremoveCardHeading>
                  Fill out Basic details
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  Form
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid> <Grid item xs={12} md={4}>
            <PremoveCard >
              {progress?.legal == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "Legal")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}
              <div>
                <PremoveCardHeading>
                  Fill out Legal details
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  Form
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <PremoveCard >
              {progress?.contact == true ? (
                <CheckCircle style={{ marginRight: "2px", color: "#04B873", fontSize: "13px" }}

                />
              ) : (
                <svg className="svgPlusIcon" focusable="false" onClick={toggleDrawer(true, "Contact")} viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>

              )}
              <div>
                <PremoveCardHeading>
                  Fill out Next of kin details
                </PremoveCardHeading>
                <PremoveCardHeadingMuted>
                  Form
                </PremoveCardHeadingMuted>
              </div>
            </PremoveCard>
          </Grid>

        </Grid >
      </Container>
      <Drawer className="Mui-Drawe-w" anchor="right" open={openCRF} onClose={toggleDrawer(false, "CRF")}>
        <AppForm onSubmit={handleUploadFileFormSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Upload CRF</DrawerHeading>
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
                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "CRF")}>
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
      <Drawer className="Mui-Drawe-w" anchor="right" open={openInitial} onClose={toggleDrawer(false, "INITIAL_ASSESSMENT")}>
        <AppForm onSubmit={handleUploadFileFormSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Upload Initial Assessment</DrawerHeading>
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
                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "INITIAL_ASSESSMENT")}>
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
      <Drawer className="Mui-Drawe-w" anchor="right" open={openChecklist} onClose={toggleDrawer(false, "CHECKLIST")}>
        <AppForm onSubmit={handleUploadFileFormSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Upload Checklist</DrawerHeading>
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
                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "CHECKLIST")}>
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
      <Drawer className="Mui-Drawe-w" anchor="right" open={openOutcome} onClose={toggleDrawer(false, "ASSESSMENT_OUTCOME")}>
        <AppForm onSubmit={handleUploadFileFormSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Upload Assessment Outcome</DrawerHeading>
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
                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "CHECKLIST")}>
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
      <Drawer className="Mui-Drawe-w" anchor="right" open={openBasic} onClose={toggleDrawer(false, "Basic")}>
        <AppForm onSubmit={handleKidBasicSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Update Basic Details</DrawerHeading>
            </DrawerHeadingParent>
            <DrawerBody>
              <div style={{
                padding: "2.5rem", width: "100%"

              }}>
                <TextField id="standard-basic1" className="mb-4" fullWidth label="Name:*"
                  variant="standard"
                  {...basicRegister("name", { required: true })}
                  error={!!basicError.name}
                  helperText={basicError.name?.message}
                />
                <TextField id="standard-basic2" className="mb-4" fullWidth label="Preferred Name:*" variant="standard"
                  {...basicRegister("preferredName", { required: true })}
                  error={!!basicError.preferredName}
                  helperText={basicError.preferredName?.message} />
                <FormControl variant="standard" fullWidth className="mb-4">
                  <InputLabel id="kidGenderLabel">Gender:*</InputLabel>

                  <Select
                    labelId="kidGenderLabel"
                    id="kidAlertKidselect"
                    placeholder="Gender:*"
                    error={!!basicError.gender}
                    value={basicWatch("gender")}
                    {...basicRegister("gender", { required: true })}
                    label="Gender:*"
                  >
                    <MenuItem key={"kid_male"} value="Male">Male</MenuItem>
                    <MenuItem key={"kid_female"} value="Female">Female</MenuItem>
                  </Select>

                  <FormHelperText style={{ color: "Red" }}>
                    {basicError.gender?.message}
                  </FormHelperText>
                </FormControl>

                <TextField id="standard-basic4" className="mb-4" fullWidth label="Email:*" variant="standard"
                  {...basicRegister("email", { required: true })} error={!!basicError.email}
                  helperText={basicError.email?.message} />
                <TextField id="standard-basic5" className="mb-4" fullWidth label="Phone:*" variant="standard"
                  {...basicRegister("phone", { required: true })} error={!!basicError.phone}
                  helperText={basicError.phone?.message} />
                <InputLabel id="kidRecordingDate" >Date Of Birth:*</InputLabel>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: "5px" }}>
                  <DateTimePicker
                    onChange={(event: any) => { basicSetValue("dateOfBirth", event) }}
                   disableClock
                  format="MM/dd/yyyy HH:mm"
                    value={basicWatch("dateOfBirth")}
                    clearIcon={null}

                    required
                  />
                  <FormHelperText style={{ color: "Red" }} >
                    {basicError.dateOfBirth?.message}
                  </FormHelperText>
                </div>

                <TextField id="standard-basic7" {...basicRegister("mostRecentAddress", { required: true })} className="mb-4" fullWidth label="Most Recent Address:*" multiline
                  rows={4}
                  variant="standard"
                  error={!!basicError.mostRecentAddress}
                  helperText={basicError.mostRecentAddress?.message} />
                <TextField id="standard-basic8" {...basicRegister("appearance", { required: true })} className="mb-4" fullWidth label="Appearance:*" multiline
                  rows={4}
                  variant="standard"
                  error={!!basicError.appearance}
                  helperText={basicError.appearance?.message} />
                <TextField id="standard-basic9" className="mb-4" fullWidth label="Ethnicity:*" variant="standard"
                  {...basicRegister("ethnicity", { required: true })} error={!!basicError.ethnicity}
                  helperText={basicError.ethnicity?.message} />
                <TextField id="standard-basicreligion" className="mb-4" fullWidth label="Religion:*" variant="standard"
                  {...basicRegister("religion", { required: true })} error={!!basicError.religion}
                  helperText={basicError.religion?.message} />
                <TextField id="standard-basicrspokenLanguage" className="mb-4" fullWidth label="Spoken Language:*" variant="standard"
                  {...basicRegister("spokenLanguage", { required: true })} error={!!basicError.spokenLanguage}
                  helperText={basicError.spokenLanguage?.message} />
                <TextField id="standard-basicsafePlace" {...basicRegister("safePlace", { required: true })} className="mb-4" fullWidth label="Where I go when I am missing:*" multiline
                  rows={4}
                  variant="standard"
                  error={!!basicError.safePlace}
                  helperText={basicError.safePlace?.message} />
              </div>
              <div className="d-flex align-items-center justify-content-between" style={{
                padding: "2.5rem", width: "100%"
              }}>
                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Basic")}>
                  Cancel
                </Button>
                <Button variant="text" color="inherit" onClick={onhandlePrint}>
                  Print
                </Button>
                <AppButton type="submit" className='btnLogin' disabled={!basicIsValid}  >
                  {!basicSubmitting ?
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

      <Drawer className="Mui-Drawe-w" anchor="right" open={openLegal} onClose={toggleDrawer(false, "Legal")}>
        <AppForm onSubmit={handleKidLegalSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Update Legal Details</DrawerHeading>
            </DrawerHeadingParent>
            <DrawerBody>
              <div style={{
                padding: "2.5rem", width: "100%"

              }}>
                <FormControl variant="standard" fullWidth className="mb-4">
                  <InputLabel id="kidLegalLabel">Legal Status:*</InputLabel>

                  <Select
                    labelId="kidLegalLabel"
                    id="kidLegalSKidselect"
                    placeholder="Legal Status:*"
                    value={legalWatch("legalStatus")}
                    error={!!legalError.legalStatus}
                    {...legalRegister("legalStatus", { required: true })}
                    label="Legal Status:*"
                  >
                    {(legalStatuses || []).map((item: Status, index: any) => {
                      return (
                        <MenuItem key={"kid_" + item.value + index + 3} value={item.code}>{item.value}</MenuItem>

                      );
                    })}


                  </Select>

                  <FormHelperText style={{ color: "Red" }}>
                    {legalError.legalStatus?.message}
                  </FormHelperText>
                </FormControl>
                <TextField id="standard-basic1" className="mb-4" fullWidth label="Local Authority*"
                  variant="standard"
                  {...legalRegister("localAuthority", { required: true })}
                  error={!!legalError.localAuthority}
                  helperText={legalError.localAuthority?.message}
                />
                <TextField id="standard-basic2" className="mb-4" fullWidth label="National Insurance Number:*" variant="standard"
                  {...legalRegister("niNumber", { required: true })}
                  error={!!legalError.niNumber}
                  helperText={legalError.niNumber?.message} />


                <TextField id="standard-basic4" className="mb-4" fullWidth label="NHS Number:*" variant="standard"
                  {...legalRegister("nhsNumber", { required: true })} error={!!legalError.nhsNumber}
                  helperText={legalError.nhsNumber?.message} />
                <TextField id="standard-basic5" className="mb-4" fullWidth label="Registered GP Details:*" variant="standard" rows={4} multiline
                  {...legalRegister("registeredGP", { required: true })} error={!!legalError.registeredGP}
                  helperText={legalError.registeredGP?.message} />
                <TextField id="standard-basic6"  {...legalRegister("registeredDentist", { required: true })} className="mb-4" rows={4} multiline fullWidth label="Registered Dentist Details:*" variant="standard" InputLabelProps={{
                  shrink: true,
                }} error={!!legalError.registeredDentist}
                  helperText={legalError.registeredDentist?.message} />

                <TextField id="standard-basic5" className="mb-4" fullWidth label="Registered Optician Details:*" variant="standard" rows={4} multiline
                  {...legalRegister("registeredOptician", { required: true })} error={!!legalError.registeredOptician}
                  helperText={legalError.registeredOptician?.message} />
                <TextField id="standard-basic6"  {...legalRegister("socialWorker", { required: true })} className="mb-4" rows={4} multiline fullWidth label="Social Worker Details:*" variant="standard" InputLabelProps={{
                  shrink: true,
                }} error={!!legalError.socialWorker}
                  helperText={legalError.socialWorker?.message} />
                <TextField id="standard-basic6"  {...legalRegister("ypAdvisor", { required: true })} className="mb-4" rows={4} multiline fullWidth label="Young Person Advisor Details:*" variant="standard" InputLabelProps={{
                  shrink: true,
                }} error={!!legalError.ypAdvisor}
                  helperText={legalError.ypAdvisor?.message} />
              </div>
              <div className="d-flex align-items-center justify-content-between" style={{
                padding: "2.5rem", width: "100%"
              }}>
                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Legal")}>
                  Cancel
                </Button>
                <Button variant="text" color="inherit" onClick={onhandlePrint}>
                  Print
                </Button>
                <AppButton type="submit" className='btnLogin' disabled={!legalIsValid}  >
                  {!legalSubmitting ?
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

      <Drawer className="Mui-Drawe-w" anchor="right" open={openContact} onClose={toggleDrawer(false, "Contact")}>
        <AppForm onSubmit={handleKidNextOfKinSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Contacts</DrawerHeading>
            </DrawerHeadingParent>
            <DrawerBody>
              <div style={{
                padding: "2.5rem", width: "100%"

              }}>
                <TextField id="triggers" {...nextofkinRegister("name", { required: true })} className="mb-4" fullWidth label="Name: *"
                  variant="standard"
                  error={!!nextOfKinError.name}
                  helperText={nextOfKinError.name?.message} />
                <TextField id="triggers" {...nextofkinRegister("relationship", { required: true })} className="mb-4" fullWidth label="Relationship: *"
                  variant="standard"
                  error={!!nextOfKinError.relationship}
                  helperText={nextOfKinError.relationship?.message} />
                <TextField id="triggers" {...nextofkinRegister("phone", { required: true })} className="mb-4" fullWidth label="Phone: *"
                  variant="standard"
                  error={!!nextOfKinError.phone}
                  helperText={nextOfKinError.phone?.message} />


                <FormControlLabel
                  control={
                    <Controller
                      name="contactable"
                      control={nextofKinControl}

                      render={({ field }) => <Checkbox {...field} checked={nextOfKinGetValues("contactable")} />}
                    />
                  }
                  label="Allowed to Contact"
                />
                <FormHelperText style={{ color: "Red" }}>
                  {nextOfKinError.contactable?.message}
                </FormHelperText>
                <br />
                <FormControlLabel
                  control={
                    <Controller
                      name="visitable"

                      control={nextofKinControl}
                      render={({ field }) => <Checkbox {...field} checked={nextOfKinGetValues("visitable")} />}
                    />
                  }
                  label="Allowed to Visit"
                />
                <FormHelperText style={{ color: "Red" }}>
                  {nextOfKinError.visitable?.message}
                </FormHelperText>
                <TextField id="simproveMood" {...nextofkinRegister("note", { required: true })} className="mb-4" fullWidth label="Note: *" multiline
                  rows={4}
                  variant="standard"
                  error={!!nextOfKinError.note}
                  helperText={nextOfKinError.note?.message} />
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
                <AppButton type="submit" className='btnLogin' disabled={!nextOfKinIsValid}  >
                  {!nextOfKinSubmitting ?
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
      <Drawer className="Mui-Drawe-w" anchor="right" open={openRisk} onClose={toggleDrawer(false, "Risk")}>
        <AppForm onSubmit={handleKidRiskSubmit}>
          <Box>
            <DrawerHeadingParent>
              <DrawerHeading> Risk Assessment</DrawerHeading>
            </DrawerHeadingParent>
            <DrawerBody>
              <div style={{
                padding: "2.5rem", width: "100%"

              }}>

                {
                  riskstep == 1 &&
                  <>
                    <Controller
                      name="suicide"
                      control={riskControl}
                      render={() => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.suicide}

                        >
                          <InputLabel style={radioStyleLabel as any}>Risk of suicide or deliberate self harm</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("suicide")}
                            onChange={(event: any) => { riskSetValue("suicide", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.suicide?.message}</FormHelperText>

                        </FormControl>
                      )} />
                    <Controller
                      name="aggressive"
                      control={riskControl}
                      render={() => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.aggressive}

                        >
                          <InputLabel style={radioStyleLabel as any}>Risk of aggressive behaviour/violence</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("aggressive")}
                            onChange={(event: any) => { riskSetValue("aggressive", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.aggressive?.message}</FormHelperText>

                        </FormControl>
                      )} />
                    <Controller
                      name="arson"
                      control={riskControl}
                      render={() => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.arson}

                        >
                          <InputLabel style={radioStyleLabel as any}>Risk of suicide or deliberate self harm(arson)</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("arson")}
                            onChange={(event: any) => { riskSetValue("arson", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.arson?.message}</FormHelperText>

                        </FormControl>
                      )} />
                    <Controller
                      name="selfNeglect"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.selfNeglect}

                        >
                          <InputLabel style={radioStyleLabel as any}>Risk of self neglect or accidental self harm</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("selfNeglect")}
                            onChange={(event: any) => { riskSetValue("selfNeglect", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.selfNeglect?.message}</FormHelperText>

                        </FormControl>
                      )} />
                    <Controller
                      name="ignoreMedical"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.ignoreMedical}

                        >
                          <InputLabel style={radioStyleLabel as any}>Risk of non-compliance with professional medical advice/treatment</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("ignoreMedical")}
                            onChange={(event: any) => { riskSetValue("ignoreMedical", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.ignoreMedical?.message}</FormHelperText>

                        </FormControl>
                      )} />
                    <Controller
                      name="mentalHealth"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.mentalHealth}

                        >
                          <InputLabel style={radioStyleLabel as any}>Risk due to mental ill health</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("mentalHealth")}
                            onChange={(event: any) => { riskSetValue("mentalHealth", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.mentalHealth?.message}</FormHelperText>

                        </FormControl>
                      )} />
                    <Controller
                      name="substance"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.substance}

                        >
                          <InputLabel style={radioStyleLabel as any}>Risk due to alcohol or substance misuse</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("substance")}
                            onChange={(event: any) => { riskSetValue("substance", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.substance?.message}</FormHelperText>

                        </FormControl>
                      )} />
                    <Controller
                      name="abuse"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.abuse}

                        >
                          <InputLabel style={radioStyleLabel as any}>Risk of abuse by others</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("abuse")}
                            onChange={(event: any) => { riskSetValue("abuse", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.abuse?.message}</FormHelperText>

                        </FormControl>
                      )} />
                    <Controller
                      name="physical"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.physical}

                        >
                          <InputLabel style={radioStyleLabel as any}>Risk due to physical/medical condition</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("physical")}
                            onChange={(event: any) => { riskSetValue("physical", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.physical?.message}</FormHelperText>

                        </FormControl>
                      )} />
                    <Controller
                      name="hygiene"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.hygiene}

                        >
                          <InputLabel style={radioStyleLabel as any}>Risk to the health of others (for example hygiene risk)</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("hygiene")}
                            onChange={(event: any) => { riskSetValue("hygiene", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.hygiene?.message}</FormHelperText>

                        </FormControl>
                      )} />
                    <Controller
                      name="environmental"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.environmental}

                        >
                          <InputLabel style={radioStyleLabel as any}>Risk due to environmental factors</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("environmental")}
                            onChange={(event: any) => { riskSetValue("environmental", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.environmental?.message}</FormHelperText>

                        </FormControl>
                      )} />
                  </>
                }{
                  riskstep == 2 &&
                  <>
                    <Controller
                      name="youngPerson"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.youngPerson}

                        >
                          <InputLabel style={radioStyleLabel as any}>A risk towards Young adults</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("youngPerson")}
                            onChange={(event: any) => { riskSetValue("youngPerson", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.youngPerson?.message}</FormHelperText>

                        </FormControl>
                      )} />
                    <Controller
                      name="olderPerson"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.olderPerson}

                        >
                          <InputLabel style={radioStyleLabel as any}>A risk towards Older people</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("olderPerson")}
                            onChange={(event: any) => { riskSetValue("olderPerson", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.olderPerson?.message}</FormHelperText>

                        </FormControl>
                      )} />
                    <Controller
                      name="childern"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.childern}

                        >
                          <InputLabel style={radioStyleLabel as any}>A risk towards Children</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("childern")}
                            onChange={(event: any) => { riskSetValue("childern", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.childern?.message}</FormHelperText>

                        </FormControl>
                      )} />  <Controller
                      name="women"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.women}

                        >
                          <InputLabel style={radioStyleLabel as any}>A risk towards Women</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("women")}
                            onChange={(event: any) => { riskSetValue("women", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.women?.message}</FormHelperText>

                        </FormControl>
                      )} />  <Controller
                      name="men"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.men}

                        >
                          <InputLabel style={radioStyleLabel as any}>A risk towards Men</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("men")}
                            onChange={(event: any) => { riskSetValue("men", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.men?.message}</FormHelperText>

                        </FormControl>
                      )} />  <Controller
                      name="family"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.family}

                        >
                          <InputLabel style={radioStyleLabel as any}>A risk towards Family members</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("family")}
                            onChange={(event: any) => { riskSetValue("family", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.family?.message}</FormHelperText>

                        </FormControl>
                      )} />  <Controller
                      name="region"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.region}

                        >
                          <InputLabel style={radioStyleLabel as any}>A risk towards Religious groups</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("region")}
                            onChange={(event: any) => { riskSetValue("region", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.region?.message}</FormHelperText>

                        </FormControl>
                      )} />  <Controller
                      name="race"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.race}

                        >
                          <InputLabel style={radioStyleLabel as any}>A risk towards Any ethnic or racial groups (please specify in notes section)</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("race")}
                            onChange={(event: any) => { riskSetValue("race", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.race?.message}</FormHelperText>

                        </FormControl>
                      )} />  <Controller
                      name="lgb"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.lgb}

                        >
                          <InputLabel style={radioStyleLabel as any}>A risk towards Lesbian, gay or bisexual people</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("lgb")}
                            onChange={(event: any) => { riskSetValue("lgb", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.lgb?.message}</FormHelperText>

                        </FormControl>
                      )} />  <Controller
                      name="transgender"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.transgender}

                        >
                          <InputLabel style={radioStyleLabel as any}>A risk towards Transgendered people</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("transgender")}
                            onChange={(event: any) => { riskSetValue("transgender", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.transgender?.message}</FormHelperText>

                        </FormControl>
                      )} />  <Controller
                      name="disability"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.disability}

                        >
                          <InputLabel style={radioStyleLabel as any}>A risk towards People with disabilities</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("disability")}
                            onChange={(event: any) => { riskSetValue("disability", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.disability?.message}</FormHelperText>

                        </FormControl>
                      )} />  <Controller
                      name="staff"
                      control={riskControl}
                      render={({ field: formField }) => (
                        <FormControl style={radioStyleWrapper as any}
                          variant="standard"
                          error={!!riskError.staff}

                        >
                          <InputLabel style={radioStyleLabel as any}>A risk towards Staff</InputLabel>
                          <ToggleButtonGroup
                            style={{ marginTop: "10px" }}
                            exclusive
                            size="small"
                            value={riskGetValues("staff")}
                            onChange={(event: any) => { riskSetValue("staff", event.target.value) }}

                          >
                            <ToggleButton value='LOW'>
                              LOW
                            </ToggleButton>
                            <ToggleButton value='MEDIUM'>
                              MEDIUM
                            </ToggleButton>  <ToggleButton value='HIGH'>
                              HIGH
                            </ToggleButton>

                          </ToggleButtonGroup>
                          <FormHelperText style={{ color: "red" }}>{riskError.staff?.message}</FormHelperText>

                        </FormControl>
                      )} />
                  </>
                }{
                  riskstep == 3 &&
                  <TextField id="noterisk" {...riskRegister("note", { required: true })} className="mb-4" fullWidth label="Note: *" multiline
                    rows={4}
                    variant="standard"
                    error={!!riskError.note}
                    helperText={riskError.note?.message} />
                }


              </div>
              <div className="d-flex align-items-center justify-content-between" style={{
                padding: "2.5rem", width: "100%"
              }}>
                <Button variant="text" color="inherit" onClick={toggleDrawer(false, "Risk")}>
                  Cancel
                </Button>
                <Button variant="text" color="inherit" onClick={onhandlePrint}>
                  Print
                </Button>{
                  riskstep === 1 &&
                  <AppButton className='btnLogin'
                    type="button"
                    variant="contained"
                    onClick={(event) => { setRiskStep(riskstep + 1) }}>
                    Next
                  </AppButton>}
                {
                  riskstep === 2 && <AppButton className='btnLogin'
                    type="button"
                    variant="contained"
                    onClick={(event) => { setRiskStep(riskstep + 1) }}>
                    Next
                  </AppButton>}{riskstep === 3 &&
                    <AppButton type="submit" className='btnLogin' disabled={!riskIsValid}  >
                      {!riskSubmitting ?
                        'Submit'
                        : (
                          <CircularProgress size={24} />
                        )}
                    </AppButton>}

              </div>
            </DrawerBody>
          </Box>
        </AppForm>
      </Drawer>
    </>
  );

}



