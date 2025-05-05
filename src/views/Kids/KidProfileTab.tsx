import { Box, Grid, Typography, CircularProgress, makeStyles, Tab, Tabs, ThemeProvider, Checkbox } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import ModeIcon from '@mui/icons-material/Mode';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { GetAxios } from '../../service/AxiosHelper';
import React, { SyntheticEvent, useCallback, useState, useEffect } from 'react';
// import { DashboardCard, DisplayStart,DisplayBetween, ImgParentDivSmall, GreyBoxHeading, GreyBox, TitleCard, SmallTitleCard, GreenTextLabel, PlusButton, GreyBoxParent, GreyBoxHeadingParent, AlertHeading, GreyBoxDesc } from '../../views/Kids';
import { AppBar, Toolbar, Icon, IconButton } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { DashboardCard, DisplayBetween, DisplayNumber, GreyBox, GreyBoxDesc, AccordianttxtSmall, Accordianttxtheader, AccordianttxtsmallHeading, DisplayStart, GreenTextLabel, GreenTextLabelSmall, GreyBoxParent, GreyBoxHeading, GreyBoxHeadingParent, AlertHeading, PlusButton, ImgParentDiv, ImgParentDivLg, ImgParentDivSmall, DashboardCardBgGreen, DashboardCardBgGreenChildDiv, DashboardCardBgGreenChildDivCol, DashboardCardBgGreenChildDivCol2, DashboardCardpurple, TitleCard, SmallTitleCard, PageHeading, PageHeadingSmall } from "./KidTabScreenStyles";
import SelectCommon from "../../components/FormComponents";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AppButton } from "../../components";
import AddIcon from '@mui/icons-material/Add';
import FormHelperText from '@mui/material/FormHelperText';
import { radioStyleLabel, radioStyleWrapper } from "./KidScreenStyle";
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { parseJwt } from "../../hooks";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { yupResolver } from "@hookform/resolvers/yup";
import constants, { coachingSessionCategories } from '../../service/Constants';
import { useNavigate, useParams } from 'react-router-dom';
import { AppForm } from '../../components';
import { DrawerHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
import { useForm, useFieldArray, FieldErrors, Controller } from "react-hook-form";
import { basicKidschema, aboutKidschema, kidLegalSchema,  kidriskassessmentSchema } from '../../service/ValidationSchema';
import { legalStatuses } from "./legalStatus";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
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

    chooseMessage: (message: string) => void;
}

export default function KidProfileTab({ chooseMessage, ...props }: Iprops) {
   // Assuming MedialFormModel and NextOfKinModel have an 'id' field with a specific type
   let msg = 'RiskManagement';
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


    const { kidId } = useParams();
    const [basicDetail, setBasicDetail] = useState<UpdateBasicDetailModel>();
    const [aboutDetail, setAboutDetail] = useState<AboutMeFormModel>();
    const [legalDetail, setLegalDetail] = useState<LegalDetailModel>();
    const [kinDetails, setKinDetails] = useState<NextOfKinModel[]>();
    const [medicalDetails, setMedicalDetails] = useState<MedialFormModel[]>();
    const [riskDetail, setRiskDetail] = useState<RiskAssessmentViewModel>();
    const [openBasic, setOpenBasic] = React.useState(false);
    const [openAbout, setOpenAbout] = React.useState(false);
    const [openLegal, setOpenLegal] = React.useState(false);
    const [openMedical, setOpenMedical] = React.useState(false);
    const [openContact, setOpenContact] = React.useState(false);
    const [medicalId, setMedicalId] = React.useState<string>("");
    const [contactId, setContactId] = React.useState<string>("");
    const [openRisk, setOpenRisk] = React.useState(false);
    const [riskstep, setRiskStep] = useState(1);
    const basicform = useForm<UpdateBasicDetailModel>({
        defaultValues: {
            id: "", userId: userId, gender: "", appearance: "",
            dateOfBirth: new Date(), ethnicity: "",
            email: "", name: "", preferredName: "",
            spokenLanguage: "", safePlace: "", mostRecentAddress: "",

        },
        resolver: yupResolver(basicKidschema),
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
        // resolver: yupResolver(kidriskassessmentSchema),
        // resolver: yupResolver(kidriskassessmentSchema),
        mode: "all"
    });
    const { register: basicRegister, handleSubmit: handleBasicSubmit, formState: { errors: basicError, isValid: basicIsValid, isSubmitting: basicSubmitting }, reset: basicReset, watch: basicWatch, getValues: basicGetValues, setValue: basicSetValue } = basicform;
    const { register: aboutRegister, handleSubmit: handleAboutSubmit, formState: { errors: aboutError, isValid: aboutIsValid, isSubmitting: aboutSubmitting }, reset: aboutReset, watch: aboutWatch, getValues: aboutGetValues, setValue: aboutSetValue } = aboutmeform;
    const { register: legalRegister, handleSubmit: handleLegalSubmit, formState: { errors: legalError, isValid: legalIsValid, isSubmitting: legalSubmitting }, reset: legalReset, watch: legalWatch, getValues: legalGetValues, setValue: legalSetValue } = legalform;
    const { register: medicalRegister, handleSubmit: handleMedicalSubmit, formState: { errors: medicalError, isValid: medicalIsValid, isSubmitting: medicalSubmitting }, reset: medicalReset, watch: medicalWatch, getValues: medicalGetValues, setValue: medicalSetValue } = medicalform;
    const { register: nextofkinRegister, handleSubmit: handleNextOfKinSubmit, formState: { errors: nextOfKinError, isValid: nextOfKinIsValid, isSubmitting: nextOfKinSubmitting }, reset: nextOfKinReset, watch: nextOfKinWatch, getValues: nextOfKinGetValues, control: nextofKinControl, setValue: nextOfKinSetValue } = nextOfKinform;
    const { register: riskRegister, handleSubmit: handleRiskSubmit, formState: { errors: riskError, isValid: riskIsValid, isSubmitting: riskSubmitting }, reset: riskReset, watch: riskWatch, getValues: riskGetValues, control: riskControl, setValue: riskSetValue } = riskform;
    const [openMedicalDialog, setMedicalDialog] = React.useState(false);
    const [openContactDialog, setContactDialog] = React.useState(false);
    const getMedicalDetail = (item: MedialFormModel) => {
        medicalform.setValue("adminDetails", item.adminDetails);
        medicalform.setValue("inEmergency", item.inEmergency);
        medicalform.setValue("id", item.id);
        medicalform.setValue("kidId", kidId ?? "");
        medicalform.setValue("medication", item.medication);
        medicalform.setValue("symptoms", item.symptoms);
        medicalform.setValue("title", item.title);
        medicalform.setValue("triggers", item.triggers);
        medicalform.setValue("userId", userId);
        console.log(medicalform.getValues());
        setOpenMedical(true); setOpenLegal(false); setOpenBasic(false); setOpenAbout(false); setOpenRisk(false);
        setOpenContact(false);
    };
    const handleClickMedicalDialog = (id:string) => {
        setMedicalId(id);
        setMedicalDialog(true);
    };
    const handleCloseMedicalDialog = () => {
        setMedicalId("");
        setMedicalDialog(false);
    };
    const handleClickContactDialog = (id:string) => {
        setContactId(id);
        setContactDialog(true);
    };
    const handleCloseContactDialog = () => {
        setContactId("");
        setContactDialog(false);
    };
    const getContactDetail = (item: NextOfKinModel) => {
        console.log(nextOfKinGetValues())
         
        nextOfKinform.setValue("contactable", item.contactable);
        nextOfKinform.setValue("id", item.id);
        nextOfKinform.setValue("visitable", item.visitable);
        nextOfKinform.setValue("kidId", kidId ?? "");
        nextOfKinform.setValue("name", item.name);
        nextOfKinform.setValue("relationship", item.relationship);
        nextOfKinform.setValue("phone", item.phone);
        nextOfKinform.setValue("note", item.note);
        nextOfKinform.setValue("userId", userId);
        console.log(nextOfKinform.getValues());
        setOpenMedical(false); setOpenLegal(false); setOpenBasic(false); setOpenAbout(false); setOpenRisk(false);
        setOpenContact(true);
    };
    const handleKidBasicSubmit = (event: SyntheticEvent) => {
        event.preventDefault();

        console.log(basicGetValues())
        const formData = new FormData();
        formData.append('id', basicGetValues("id") ?? "");
        formData.append('userId', userId ?? "");
        formData.append('name', basicGetValues("name"));
        formData.append('preferredName', basicGetValues("preferredName"));
        formData.append('phone', basicGetValues("phone"));
        formData.append('email', basicGetValues("email"));
        formData.append('gender', basicGetValues("gender"));
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
                        variant: 'success',  style: { backgroundColor: '#5f22d8'},
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawer(false, "Basic")(event);
                    basicReset();

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
                        variant: 'success',  style: { backgroundColor: '#5f22d8'},
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawer(false, "About")(event);
                    aboutReset();

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
                        variant: 'success',  style: { backgroundColor: '#5f22d8'},
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawer(false, "Legal")(event);
                    legalReset();

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
    const handleKidMedicalSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        console.log(medicalGetValues())
        const formData = new FormData();
        formData.append('id', medicalGetValues("id")??"");
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
                        variant: 'success',  style: { backgroundColor: '#5f22d8'},
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });
                    getMedicalDetails();
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
                        variant: 'success',  style: { backgroundColor: '#5f22d8'},
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });
                    getKinDetails();
                    toggleDrawer(false, "Contact")(event);
                    nextOfKinReset();

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
                        variant: 'success',  style: { backgroundColor: '#5f22d8'},
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });

                    toggleDrawer(false, "Risk")(event);
                    riskReset();
                    getRiskDetail();

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
    const { enqueueSnackbar } = useSnackbar();
    const getBasicDetail = () => {
        GetAxios().get(constants.Api_Url + 'KidDetail/GetBasicDetail?kidId=' + kidId).then(res => {
            if (res.data.success) {
                setBasicDetail(res.data.data);
                basicform.reset(res.data.data);
                basicform.setValue("userId", userId); basicform.setValue("dateOfBirth", res.data.data.dateOfBirth);
            }
        })
    };
    const getAboutDetail = () => {
        GetAxios().get(constants.Api_Url + 'KidDetail/GetAboutDetail?kidId=' + kidId).then(res => {
            if (res.data.success) {
                setAboutDetail(res.data.data);
                aboutmeform.reset(res.data.data);
                aboutmeform.setValue("userId", userId);

            }
        })
    };
    const getLegalDetail = () => {
        GetAxios().get(constants.Api_Url + 'KidDetail/GetLegalDetail?kidId=' + kidId).then(res => {
            if (res.data.success) {
             
                setLegalDetail(res.data.data);
                legalform.reset(res.data.data);
                legalform.setValue("userId", userId);
                legalform.setValue("legalStatus", res.data.data.legalStatus.trim());
                console.log(legalGetValues())
            }
        })
    };
    const getKinDetails = () => {
        GetAxios().get(constants.Api_Url + 'KidDetail/GetContactDetails?kidId=' + kidId).then(res => {
            if (res.data.success) {
                setKinDetails(res.data.list);
            }
        })
    };
    const getMedicalDetails = () => {
      
        GetAxios().get(constants.Api_Url + 'KidDetail/GetMedicalDetails?kidId=' + kidId).then(res => {
            if (res.data.success) {
                
                setMedicalDetails(res.data.list);
            }
        })
    };
    const DeleteMedical = (event: SyntheticEvent) => {
        GetAxios().get(constants.Api_Url + 'KidDetail/DeleteMedicalDetail?id=' +  medicalId?? "").then(res => {
            if (res.data.success) {
                setMedicalDialog(false);
                setMedicalId("");
                getMedicalDetails();
                enqueueSnackbar("Medical Condition Deleted Successfully", {
                    variant: 'success',  style: { backgroundColor: '#5f22d8'},
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });

            }
        })
    }
    const DeleteContact= (event: SyntheticEvent) => {
        GetAxios().get(constants.Api_Url + 'KidDetail/DeleteContactDetail?id=' +  contactId?? "").then(res => {
            if (res.data.success) {
                setContactDialog(false);
                setContactId("");
                getKinDetails();
                enqueueSnackbar("Contact Deleted Successfully", {
                    variant: 'success',  style: { backgroundColor: '#5f22d8'},
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });

            }
        })
    }
    const getRiskDetail = () => {
        GetAxios().get(constants.Api_Url + 'KidDetail/GetRiskAssessment?kidId=' + kidId).then(res => {
            if (res.data.success) {
                setRiskDetail(res.data.data);
                console.log(res.data.data)
               riskform.reset(res.data.data);
               riskform.setValue("userId", userId);
               
               riskform.setValue("youngPerson", res.data.data.youngPerson);
               console.log(riskGetValues())
            }
        })
    };

    const showRiskAssessmentsOnGrid = () => {
        alert("majid child");

        //handleChangeTaskIndex(1);
    }

    useEffect(() => {
        getBasicDetail(); getLegalDetail(); getKinDetails(); getMedicalDetails();
        getAboutDetail(); getRiskDetail();

    }, []);
    const toggleDrawer = (open: any, type: string) => (event: any) => {

        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
       
        if (type == "Basic") {
            //get basic detail 
            getBasicDetail();
            setOpenLegal(false); setOpenBasic(open); setOpenAbout(false); setOpenRisk(false);
            setOpenContact(false); setOpenMedical(false);
        }
        else if (type == "About") {
            //get basic detail 
            getAboutDetail();
            setOpenLegal(false); setOpenBasic(false); setOpenAbout(open); setOpenRisk(false);
            setOpenContact(false); setOpenMedical(false);
        }
        else if (type == "Legal") {
            getLegalDetail();
            setOpenLegal(open); setOpenBasic(false); setOpenAbout(false); setOpenRisk(false);
            setOpenContact(false); setOpenMedical(false);
        }
        else if (type == "Medical") {

            setOpenMedical(open); setOpenLegal(false); setOpenBasic(false); setOpenAbout(false); setOpenRisk(false);
            setOpenContact(false);
            if(open==false){ medicalReset(); medicalform.setValue("kidId", kidId??"")}
        }
        else if (type == "Contact") {

            setOpenContact(open); setOpenLegal(false); setOpenBasic(false); setOpenAbout(false); setOpenRisk(false);
            setOpenMedical(false); if(open==false){ nextOfKinReset(); nextOfKinform.setValue("kidId",kidId??"")}
        }
        else if (type == "Risk") {
            setRiskStep(1);
            setOpenLegal(open); setOpenBasic(false); setOpenAbout(false);
            setOpenContact(false); setOpenMedical(false);
            setOpenRisk(open);
        }

    }

    const onhandlePrint = (event: any) => {

        window?.print();
    }

    return (
        <div className="">
            <Grid className='mb-4' container spacing={5}>
                <Grid item xs={12} md={6}>
                    <DashboardCard className="mb-1">
                        <div className='mb-3 px-1'>
                            <DisplayBetween>
                                <TitleCard style={{color: "#2a0560"}}>
                                    Basic Information
                                </TitleCard>
                                <IconButton style={{color: "white"}} onClick={toggleDrawer(true, "Basic")} size="small" sx={{
                                    Color: "#2a0560",
                                    boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                                    backgroundColor: "#2a0560",
                                }}>
                                    <ModeIcon sx={{color: "white"}} className='' />
                                </IconButton>
                            </DisplayBetween>
                        </div>
                        <Box className='px-3'>
                            <div className='mb-3'>
                                <p>
                                    {basicDetail?.name}
                                </p>
                                <h6>
                                    Name
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {basicDetail?.preferredName ?? ""}
                                </p>
                                <h6>
                                    Preferred Name
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {basicDetail?.gender ?? ""}
                                </p>
                                <h6>
                                    Gender
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {basicDetail?.email ?? ""}
                                </p>
                                <h6>
                                    Email
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {basicDetail?.phone ?? "Unknown Phone"}
                                </p>
                                <h6>
                                    Contact No
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {moment(basicDetail?.dateOfBirth?? new Date()).format('YYYY-MM-DDTHH:mm:ss')}
                                </p>
                                <h6>
                                    Date of Birth
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {basicDetail?.ethnicity ?? "-"}
                                </p>
                                <h6>
                                    Ethnicity
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {basicDetail?.religion ?? "-"}
                                </p>
                                <h6>
                                    Religion
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {basicDetail?.spokenLanguage ?? "-"}
                                </p>
                                <h6>
                                    Spoken Language

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {basicDetail?.safePlace ?? "-"}
                                </p>
                                <h6>
                                    When im missing I normally go


                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {basicDetail?.appearance ?? "-"}
                                </p>
                                <h6>
                                    Appearance

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {basicDetail?.mostRecentAddress ?? "-"}
                                </p>
                                <h6>
                                    Most Recent Address
                                </h6>
                            </div>
                        </Box>

                    </DashboardCard>
                    <DashboardCard className="mb-1 mt-5">
                        <div className='mb-3 px-1'>
                            <DisplayBetween>
                                <TitleCard style={{color: "#2a0560"}}>
                                    Legal Details
                                </TitleCard>
                                <IconButton onClick={toggleDrawer(true, "Legal")} size="small" sx={{
                                    Color: "#2a0560",
                                    boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                                    backgroundColor: "#2a0560",
                                }}>
                                    <ModeIcon sx={{color: "white"}} className='' />
                                </IconButton>
                            </DisplayBetween>

                        </div>
                        <Box className='px-3'>
                            <div className='mb-3'>
                                <p>
                                    {legalDetail?.localAuthority}
                                </p>
                                <h6>
                                    Local Authority

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {legalStatuses.find(x=>x.code==legalDetail?.legalStatus)?.value ?? "Unknown"}
                                </p>
                                <h6>
                                    Legal Status

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {legalDetail?.nhsNumber ?? "-"}
                                </p>
                                <h6>
                                    NHS Number


                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {legalDetail?.registeredGP ?? "-"}
                                </p>
                                <h6>
                                    Registered GP Details

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {legalDetail?.registeredDentist ?? "-"}
                                </p>
                                <h6>
                                    Registered Dentist Details

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {legalDetail?.registeredOptician ?? "-"}
                                </p>
                                <h6>
                                    Registered Optician Details

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {legalDetail?.socialWorker ?? "-"}
                                </p>
                                <h6>
                                    Social Worker Details

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {legalDetail?.ypAdvisor ?? "-"}
                                </p>
                                <h6>
                                    Young Person Advisor Details

                                </h6>
                            </div>

                        </Box>

                    </DashboardCard>
                    <DashboardCard className='mt-5'>
                        <div className='mb-3 px-1'>
                            <DisplayBetween>
                                <TitleCard style={{color: "#2a0560"}}>
                                    Medical Conditions

                                </TitleCard>
                                <IconButton size="small" onClick={toggleDrawer(true, "Medical")} sx={{
                                    Color: "#2a0560",
                                    boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                                    backgroundColor: "#2a0560",
                                }}>
                                    <AddIcon sx={{color: "white"}} className=''  />
                                </IconButton>
                            </DisplayBetween>

                        </div>
                        <div>
                                        <Dialog
                                            open={openMedicalDialog}
                                            onClose={handleCloseMedicalDialog}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">
                                                Are you sure?
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    Are you sure you want to delete this Medical Condition
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button variant="text" color="inherit" onClick={handleCloseMedicalDialog}>
                                                    CANCEL
                                                </Button>
                                                <AppButton type="button" className='btnLogin' onClick={(event: SyntheticEvent) => { DeleteMedical(event) }} autoFocus>
                                                    DELETE
                                                </AppButton>

                                            </DialogActions>
                                        </Dialog>
                                    </div>
                        {(medicalDetails || []).map((item: MedialFormModel, index: any) => {
                            return (
                                <>
                                   
                                    <Accordion sx={{
                                        boxShadow: "none"
                                    }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel-content"
                                            id="panel-header"

                                        >
                                            <Accordianttxtheader>{item.title}</Accordianttxtheader>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className="d-flex align-items-start justify-content-between">
                                                <div>
                                                    <div className='mb-1'>
                                                        <div>

                                                            <AccordianttxtsmallHeading>Symptoms:</AccordianttxtsmallHeading>
                                                        </div>
                                                        <AccordianttxtSmall>{item.symptoms}</AccordianttxtSmall>
                                                    </div>

                                                    <div className='mb-1'>
                                                        <div>
                                                            <AccordianttxtsmallHeading>Triggers:</AccordianttxtsmallHeading>
                                                        </div>
                                                        <AccordianttxtSmall>{item.triggers}</AccordianttxtSmall>
                                                    </div>
                                                    <div className='mb-1'>
                                                        <div>

                                                            <AccordianttxtsmallHeading>Medication:</AccordianttxtsmallHeading>
                                                        </div>
                                                        <AccordianttxtSmall>{item.medication}</AccordianttxtSmall>
                                                    </div>
                                                    <div className='mb-1'>
                                                        <div>

                                                            <AccordianttxtsmallHeading>Administration Details:</AccordianttxtsmallHeading>
                                                        </div>
                                                        <AccordianttxtSmall>{item.adminDetails}</AccordianttxtSmall>
                                                    </div>
                                                    <div className='mb-1'>
                                                        <div>

                                                            <AccordianttxtsmallHeading>Incase of Emergency:</AccordianttxtsmallHeading>
                                                        </div>
                                                        <AccordianttxtSmall>{item.inEmergency}</AccordianttxtSmall>
                                                    </div>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <IconButton size="small" onClick={()=>{getMedicalDetail(item)}}
                                                     sx={{
                                                        Color: "rgb(8, 153, 96)",
                                                        boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                                                        backgroundColor: "#E6F7F0",
                                                        marginRight: "10px"
                                                    }}>
                                                        <EditIcon className='text-success' />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => handleClickMedicalDialog(item.id??"")} sx={{
                                                        Color: "rgb(8, 153, 96)",
                                                        boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                                                        backgroundColor: "#E6F7F0",
                                                        marginRight: "30px"
                                                    }}>
                                                        <DeleteIcon className='text-success' />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                </>
                            );
                        })}
                        {medicalDetails == null || medicalDetails?.length == 0 || medicalDetails==undefined &&

                            <GreyBox className="d-none">
                                <Box>
                                    <GreyBoxHeadingParent>
                                        <div className='svgWidth'>
                                            <svg id="b21613c9-2bf0-4d37-bef0-3b193d34fc5d" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="647.63626" height="632.17383" viewBox="0 0 647.63626 632.17383"><path d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z" transform="translate(-276.18187 -133.91309)" fill="#f2f2f2"></path><path d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="190.15351" cy="24.95465" r="20" fill="#0AB472"></circle><circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff"></circle><path d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z" transform="translate(-276.18187 -133.91309)" fill="#e6e6e6"></path><path d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="433.63626" cy="105.17383" r="20" fill="#0AB472"></circle><circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff"></circle></svg>
                                        </div>
                                        <GreyBoxHeading>
                                            No Details Recorded

                                        </GreyBoxHeading>
                                        <GreyBoxDesc>
                                            No recorded details exist of the type "Medial Condition".

                                        </GreyBoxDesc>
                                    </GreyBoxHeadingParent>
                                </Box>

                            </GreyBox>}


                    </DashboardCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <DashboardCard className="mb-1">
                        <div className='mb-3 px-1'>

                            <DisplayBetween>
                                <TitleCard style={{color: "#2a0560"}}>
                                    About Me
                                </TitleCard>
                                <IconButton style={{color: "white"}} onClick={toggleDrawer(true, "About")} size="small" sx={{
                                    Color: "#2a0560",
                                    boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                                    backgroundColor: "#2a0560",
                                }}>
                                    <ModeIcon sx={{color: "white"}} className='' />
                                </IconButton>
                            </DisplayBetween>
                        </div>
                        <Box className='px-3'>

                            <div className='mb-3'>
                                <p>
                                    {aboutDetail?.triggers ?? "-"}
                                </p>
                                <h6>
                                    My Triggers

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {aboutDetail?.improveMood ?? "-"}
                                </p>
                                <h6>
                                    Improves My Mood

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {aboutDetail?.needSupportWith ?? "-"}
                                </p>
                                <h6>
                                    Support Needed

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {aboutDetail?.likes ?? "-"}
                                </p>
                                <h6>
                                    Likes
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {aboutDetail?.disLikes ?? "-"}
                                </p>
                                <h6>
                                    Dislikes
                                </h6>
                            </div>

                        </Box>

                    </DashboardCard>

                    <DashboardCard className='mt-5'>
                        <div className='mb-3 px-1'>
                            <DisplayBetween>
                                <TitleCard style={{color: "#2a0560"}}>
                                    Contacts
                                </TitleCard>
                                <IconButton size="small" onClick={toggleDrawer(true, "Contact")} sx={{
                                    Color: "#2a0560",
                                    boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                                    backgroundColor: "#2a0560",
                                    Padding: "3px",
                                    fontSize: "1.125rem"
                                }}>
                                    <AddIcon sx={{color: "white"}} className='' />
                                </IconButton>
                            </DisplayBetween>
                        </div>
                        <div>
                                        <Dialog
                                            open={openContactDialog}
                                            onClose={handleCloseContactDialog}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">
                                                Are you sure?
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                Are you sure you want to delete this Next of Kin
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button variant="text" color="inherit" onClick={handleCloseContactDialog}>
                                                    CANCEL
                                                </Button>
                                                <AppButton type="button" className='btnLogin' onClick={(event: SyntheticEvent) => { DeleteContact(event) }} autoFocus>
                                                    DELETE
                                                </AppButton>

                                            </DialogActions>
                                        </Dialog>
                                    </div>
                        {(kinDetails || []).map((item: NextOfKinModel, index: any) => {
                            return (
                                <Accordion sx={{
                                    boxShadow: "none"
                                }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel-content"
                                        id="panel-header"

                                    >
                                        <Accordianttxtheader>{item.name}</Accordianttxtheader>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className="d-flex align-items-start justify-content-between">
                                            <div>
                                                <div className='mb-1'>
                                                    <div>

                                                        <AccordianttxtsmallHeading>Relation:</AccordianttxtsmallHeading>
                                                    </div>
                                                    <AccordianttxtSmall>{item.relationship}</AccordianttxtSmall>
                                                </div>

                                                <div className='mb-1'>
                                                    <div>
                                                        <AccordianttxtsmallHeading>Phone:</AccordianttxtsmallHeading>
                                                    </div>
                                                    <AccordianttxtSmall>{item.phone}</AccordianttxtSmall>
                                                </div>
                                                <div className='mb-1'>
                                                    <div>

                                                        <AccordianttxtsmallHeading>Allowed to Contact:</AccordianttxtsmallHeading>
                                                    </div>
                                                    <AccordianttxtSmall>{item.contactable ? "Yes" : "No"}</AccordianttxtSmall>
                                                </div>
                                                <div className='mb-1'>
                                                    <div>

                                                        <AccordianttxtsmallHeading>Allowed to Visit:</AccordianttxtsmallHeading>
                                                    </div>
                                                    <AccordianttxtSmall>{item.visitable ? "Yes" : "No"}</AccordianttxtSmall>
                                                </div>
                                                <div className='mb-1'>
                                                    <div>

                                                        <AccordianttxtsmallHeading>Note:</AccordianttxtsmallHeading>
                                                    </div>
                                                    <AccordianttxtSmall>{item.note}</AccordianttxtSmall>
                                                </div>
                                            </div>
                                            <div className='d-flex align-items-center'>
                                                <IconButton size="small"
                                                    onClick={() => getContactDetail(item)}
                                                    sx={{
                                                        Color: "rgb(8, 153, 96)",
                                                        boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                                                        backgroundColor: "#E6F7F0",
                                                        marginRight: "10px"
                                                    }}>
                                                    <EditIcon className='text-success' />
                                                </IconButton>
                                                <IconButton onClick={() => handleClickContactDialog(item.id??"")} size="small" sx={{
                                                    Color: "rgb(8, 153, 96)",
                                                    boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                                                    backgroundColor: "#E6F7F0",
                                                    marginRight: "30px"
                                                }}>
                                                    <DeleteIcon className='text-success' />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                    </DashboardCard>
                    <DashboardCard className="mb-1 mt-5">
                        <div className='mb-3 px-1'>
                            <DisplayBetween>
                                <TitleCard style={{color: "#2a0560"}}>
                                    Risk Assessment
                                </TitleCard>

                                <TitleCard style={{color: "#2a0560"}} onClick={() => chooseMessage(msg)}>
                                  See previous assessments
                                </TitleCard>

                                <IconButton size="small" onClick={toggleDrawer(true, "Risk")} sx={{
                                    Color: "#2a0560",
                                    boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                                    backgroundColor: "#2a0560",
                                }}>
                                    <ModeIcon sx={{color: "white"}} className='' />
                                </IconButton>
                            </DisplayBetween>

                        </div>
                        <Box className='px-3'>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.note ??"-"}
                                </p>
                                <h6>
                                    Note
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.suicide  ??"-"}
                                </p>
                                <h6>
                                    Risk of suicide or deliberate self harm

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.aggressive  ??"-"}
                                </p>
                                <h6>
                                    Risk of aggressive behaviour/violence

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.arson  ??"-"}

                                </p>
                                <h6>
                                    Risk of suicide or deliberate self harm(arson)

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.selfNeglect  ??"-"}

                                </p>
                                <h6>
                                    Risk of self neglect or accidental self harm

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.ignoreMedical  ??"-"}

                                </p>
                                <h6>
                                    Risk of non-compliance with professional medical advice/treatment
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.mentalHealth  ??"-"}
                                </p>
                                <h6>
                                    Risk due to mental ill health
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.substance  ??"-"}

                                </p>
                                <h6>
                                    Risk due to alcohol or substance misuse
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.abuse  ??"-"}

                                </p>
                                <h6>
                                    Risk of abuse by others
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.physical  ??"-"}

                                </p>
                                <h6>
                                    Risk due to physical/medical condition
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.hygiene  ??"-"}

                                </p>
                                <h6>
                                    Risk to the health of others (for example hygiene risk)
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.environmental  ??"-"}

                                </p>
                                <h6>
                                    Risk due to environmental factors

                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.youngPerson  ??"-"}

                                </p>
                                <h6>
                                    A risk towards Young adults
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.olderPerson  ??"-"}

                                </p>
                                <h6>
                                    A risk towards Older people
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.childern  ??"-"}

                                </p>
                                <h6>
                                    A risk towards Children
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.women  ??"-"}
                                </p>
                                <h6>
                                    A risk towards Women
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.men  ??"-"}
                                </p>
                                <h6>
                                    A risk towards Men
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.family  ??"-"}

                                </p>
                                <h6>
                                    A risk towards Family members
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.region  ??"-"}

                                </p>
                                <h6>
                                    A risk towards Religious groups
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.race  ??"-"}

                                </p>
                                <h6>
                                    A risk towards Any ethnic or racial groups (please specify in notes section)
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.lgb  ??"-"}

                                </p>
                                <h6>
                                    A risk towards Lesbian, gay or bisexual people


                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.transgender  ??"-"}
                                </p>
                                <h6>
                                    A risk towards Transgendered people
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.disability  ??"-"}

                                </p>
                                <h6>
                                    A risk towards People with disabilities
                                </h6>
                            </div>
                            <div className='mb-3'>
                                <p>
                                    {riskDetail?.staff  ??"-"}

                                </p>
                                <h6>
                                    A risk towards Staff
                                </h6>
                            </div>
                        </Box>

                    </DashboardCard>
                </Grid>

                <Drawer className="Mui-Drawe-w" anchor="right" open={openBasic} onClose={toggleDrawer(false, "Basic")}>
                    <AppForm onSubmit={handleKidBasicSubmit}>
                        <Box>
                            <DrawerHeadingParent>
                                <DrawerHeading style={{color: "#2a0560"}}> Update Basic Details</DrawerHeading>
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
                                            error={!!basicError.gender}  value={basicWatch("gender")}
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
                                                    onChange={(event: any) => { basicSetValue("dateOfBirth",event)   }}
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
                <Drawer className="Mui-Drawe-w" anchor="right" open={openLegal} onClose={toggleDrawer(false, "Legal")}>
                    <AppForm onSubmit={handleKidLegalSubmit}>
                        <Box>
                            <DrawerHeadingParent>
                                <DrawerHeading style={{color: "#2a0560"}}> Update Legal Details</DrawerHeading>
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
                <Drawer className="Mui-Drawe-w" anchor="right" open={openMedical} onClose={toggleDrawer(false, "Medical")}>
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
                <Drawer className="Mui-Drawe-w" anchor="right" open={openContact} onClose={toggleDrawer(false, "Contact")}>
                    <AppForm onSubmit={handleKidNextOfKinSubmit}>
                        <Box>
                            <DrawerHeadingParent>
                                <DrawerHeading style={{color: "#2a0560"}}> Contacts</DrawerHeading>
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
                                                render={({ field }) => <Checkbox {...field} checked={nextOfKinGetValues("visitable")}  />}
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
                                <DrawerHeading style={{color: "#2a0560"}}>  Risk Assessment</DrawerHeading>
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
                                        riskstep === 2 &&<AppButton className='btnLogin'
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
            </Grid>

        </div >
    );
}

