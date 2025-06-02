import Upload from '@mui/icons-material/Upload';
import {
    Box, Grid, Typography, CircularProgress, createStyles, Paper, Theme
} from "@mui/material";
import Drawer from '@mui/material/Drawer';
import { CloudDownload, InsertDriveFile, Done, ErrorOutline } from '@mui/icons-material';
import React, { useState, useEffect, SyntheticEvent } from 'react';
import { DashboardCard, DisplayBetween, DisplayNumber, GreyBox, GreyBoxDesc, SubtitleCard, ImgParentDiv, DisplayStart, GreenTextLabel, GreenTextLabelSmall, GreyBoxParent, GreyBoxHeading, GreyBoxHeadingParent, AlertHeading, PlusButton, ImgParentDivLg, ImgParentDivSmall, DashboardCardBgGreen, DashboardCardBgGreenChildDiv, DashboardCardBgGreenChildDivCol, DashboardCardBgGreenChildDivCol2, DashboardCardpurple, TitleCard, SmallTitleCard, PageHeading, PageHeadingSmall } from "../Kids/KidScreenStyle";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AppButton } from "../../components";
import AddIcon from '@mui/icons-material/Add';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useNavigate, useParams } from 'react-router-dom';
import FormHelperText from '@mui/material/FormHelperText';
import { GetAxios } from '../../service/AxiosHelper';
import constants, { coachingSessionCategories, FileType, sentanceCase } from '../../service/Constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from 'notistack';
import { DrawerHeading, DrawerStepHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
import { AppForm } from '../../components';
import { parseJwt } from "../../hooks";
import { useSelector, useDispatch } from 'react-redux';
import usePagination from "../../components/CustomPagination";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

import moment from 'moment';
interface Iprops {
    kidList: KidListModel[], houseId: string | undefined
}
export enum UploadState {
    IDLE,
    LOADING,
    ERROR,
    SUCCESS,
}
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
export default function FileTab(props: Iprops) {
    const PAGE_SIZE = 12; // Number of items per page
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userToken = useSelector((state: AppStore) => state.auth.accessToken);
    const parsedClaims = parseJwt(userToken?.token || '');
    const userId = parsedClaims.id;
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = React.useState(false);
    const [fileName, setFileName] = useState("");
    const [housekidFile, setSelectedFile] = useState("");
    let myref: any = null;
    const fileform = useForm<CreateFileModel>({
        defaultValues: {
            fileType: "",
            userId: "",
            kidId: "",
            houseId: props.houseId ?? ""
        },
        // resolver: yupResolver(roomschema),
        mode: "all"
    });
    const { register: fileFormRegister, formState: { errors: fileFormError, isValid: fileFormIsValid, isSubmitting: fileFormSubmitting }, reset: fileFormReset, watch: fileFormWatch, getValues: fileFormGetValues, setValue: fileFormSetValue } = fileform;

    const [fileList, setFileList] = useState([]);
    const [uploadState, setUploadState] = useState(UploadState.IDLE);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [openActionDrawer, setOpenActionDrawer] = useState(false);
    const [selectedFileForAction, setSelectedFileForAction] = useState<FileListModel | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleFileCardClick = (file: FileListModel) => {
        setSelectedFileForAction(file);
        setOpenActionDrawer(true);
    };

    const handleCloseActionDrawer = () => {
        setOpenActionDrawer(false);
        setSelectedFileForAction(null);
    };

    const handleEditFile = (updatedName: string) => {
        // Call your update API here
        // After success:
        getFileList();
        handleCloseActionDrawer();
    };

    const handleDeleteFile = () => {
        // Call your delete API here
        // After success:
        getFileList();
        handleCloseActionDrawer();
    };

    const handleEditDrawerOpen = (file: FileListModel, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevents triggering download
        setSelectedFileForAction(file);
        setOpenActionDrawer(true);
    };
    
    const handleEditDrawerClose = () => {
        setOpenActionDrawer(false);
        setSelectedFileForAction(null);
    };


    const toggleDrawer = (open: any) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        fileFormReset();
        setFileName("");
        setSelectedFile("");
        setUploadProgress(0);
        setUploadState(UploadState.IDLE);
        setOpen(open);
    };
    const handleBrowse = function (e: any) {
        e.preventDefault();
        myref.click();

    };
    const { currentPage, handlePaginate, pageCount, setCount, setCurrentPage, } = usePagination({ take: PAGE_SIZE, count: 0 });

    const fileTypes = [
        "application/pdf",
        ".doc",
        ".docx",
        "application/msword",
        ".pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/html",
        ".xls",
        "video/mp4"
    ];
    const handleUploadFileFormSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        setUploadState(UploadState.LOADING);

        const formData = new FormData();
        formData.append('kidId', fileFormGetValues("kidId") ?? "");
        formData.append('userId', userId);
        formData.append('houseId', fileFormGetValues("houseId") ?? "");
        formData.append('fileType', fileFormGetValues("fileType") ?? "");
        formData.append('uploadedFile', fileFormGetValues("uploadedFile"));
        formData.append('fileName', fileFormGetValues("fileName") ?? fileName ?? " ");
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

                setUploadState(UploadState.SUCCESS);
                toggleDrawer(false)(event);
                getFileList();

            } else {
                console.warn(res);
                enqueueSnackbar("Unable to upload file.", {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
                setUploadState(UploadState.ERROR);
            }
        })
            .catch(err => {
                setUploadState(UploadState.ERROR);
                enqueueSnackbar("Something went wrong.", {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            });

    };


    const handleEditUploadFileFormSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        setUploadState(UploadState.LOADING);

        const formData = new FormData();
        formData.append('fileId', selectedFileForAction?.fileId ?? "");
        formData.append('fileName', selectedFileForAction?.fileName ?? "");
        formData.append('fileType', selectedFileForAction?.fileType ?? "");
        
        GetAxios().post(constants.Api_Url + 'File/EditUpdateFile', formData)
        .then(res => {
            if (res.data.success) {
                enqueueSnackbar("File details updated successfully.", {
                    variant: 'success', 
                    style: { backgroundColor: '#5f22d8' },
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });

                setUploadState(UploadState.SUCCESS);
                handleCloseActionDrawer();
                getFileList();
            } else {
                console.warn(res);
                enqueueSnackbar("Unable to update file details.", {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
                setUploadState(UploadState.ERROR);
            }
        })
        .catch(err => {
            setUploadState(UploadState.ERROR);
            enqueueSnackbar("Something went wrong.", {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
        });
    };


    const onFileSelected = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            if (validFileType(e.target.files[0])) {

                setSelectedFile(e.target.files[0])
                setFileName(e.target.files[0].name);
                fileFormSetValue("uploadedFile", e.target.files[0]);

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

    const downloadFile = (filename: string, filePath: string) => {

        const path = "https://localhost:7155/HouseFile/537228d2-62c2-4a27-9cb2-c69d1af7e5c5.txt";
    }

    const onhandlePrint = (event: any) => {
        window?.print();
    };

    const getFileList = () => {
        if (props.houseId != null && props.houseId != undefined) {
            setCurrentPage(1);
            GetAxios().get(constants.Api_Url + 'File/GetHouseFiles?houseId=' + props.houseId).then(res => {
                if (res.data.success) {
                    setFileList(res.data.list);
                    console.log(res.data.list)
                    setCount(res.data.list.length);
                }
            })
        }
    }
    React.useEffect(() => {
        getFileList();

    }, []);



    // ... inside your component ...
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
    setAnchorEl(null);
    };

    const handleEdit = () => {
    handleMenuClose();
    // Add your edit logic here
    };

    const handleDelete = () => {
        handleMenuClose();
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedFileForAction) return;
        
        setUploadState(UploadState.LOADING);
        GetAxios().get(constants.Api_Url + 'File/DeleteFile?fileId=' + selectedFileForAction.fileId)
        .then(res => {
            if (res.data.success) {
                enqueueSnackbar("File deleted successfully.", {
                    variant: 'success',
                    style: { backgroundColor: '#5f22d8' },
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
                setUploadState(UploadState.SUCCESS);
                handleCloseActionDrawer();
                getFileList();
            } else {
                console.warn(res);
                enqueueSnackbar("Unable to delete file.", {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
                setUploadState(UploadState.ERROR);
            }
        })
        .catch(err => {
            setUploadState(UploadState.ERROR);
            enqueueSnackbar("Something went wrong.", {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
        })
        .finally(() => {
            setOpenDeleteDialog(false);
        });
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
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

    return (
        <div className="kidsDetailBox">
            <GreyBoxParent className=''>
                <div className="d-flex align-items-center justify-content-between  mt-4">
                    <AlertHeading>

                    </AlertHeading>
                    <PlusButton onClick={toggleDrawer(true)}>
                        <AddIcon className="d-flex" />
                    </PlusButton>
                </div>
                {fileList?.length == 0 || fileList == undefined || fileList == null &&
                    <GreyBox>
                        <Box>
                            <GreyBoxHeadingParent>
                                <div className='svgWidth'>
                                    <svg style={{ maxWidth: "14rem", maxHeight: "14rem" }} id="b21613c9-2bf0-4d37-bef0-3b193d34fc5d" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="647.63626" height="632.17383" viewBox="0 0 647.63626 632.17383"><path d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z" transform="translate(-276.18187 -133.91309)" fill="#f2f2f2"></path><path d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="190.15351" cy="24.95465" r="20" fill="#0AB472"></circle><circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff"></circle><path d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z" transform="translate(-276.18187 -133.91309)" fill="#e6e6e6"></path><path d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="433.63626" cy="105.17383" r="20" fill="#0AB472"></circle><circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff"></circle></svg>
                                </div>
                                <GreyBoxHeading>
                                    No Files

                                </GreyBoxHeading>
                                <GreyBoxDesc>
                                    Try importing a file click the '+' icon.
                                </GreyBoxDesc>
                            </GreyBoxHeadingParent>
                        </Box>

                    </GreyBox>}
                {fileList != undefined && fileList?.length > 0 &&
                    <>
                        <Grid className='mb-4' container spacing={5}>
                            {(fileList || []).slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((item: FileListModel, index: any) => {
                                return (
                                    <Grid item xs={12} md={4} key={(currentPage - 1) * 2 + index + 1}>
                                        <DashboardCard className="mb-1" onClick={() => downloadFile(item.fileName, item.filePath)}>
                                            <DisplayStart>
                                                <ImgParentDiv>
                                                    {item.fileType !== "" ? item.fileType.charAt(0).toUpperCase() : "A"}
                                                </ImgParentDiv>
                                                <TitleCard>
                                                    {/* Show file type or formatted type name */}
                                                    {item.fileType == "OTHER" ? item.fileName : item.fileType.replaceAll("_", " ").toLowerCase()}
                                                    <br />
                                                    {/* Show the actual file name below the type */}
                                                    <span style={{ fontWeight: 'bold', fontSize: '0.95em' }}>{item.fileName}</span>
                                                    <br />
                                                    <a
                                                        href={constants.House_Files + item.filePath}
                                                        download
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ color: "black", textDecoration: "none" }}
                                                    >
                                                        <CloudDownload />
                                                    </a>
                                                    <IconButton size="small" onClick={e => handleEditDrawerOpen(item, e)}>
                                                        <ArrowForwardIosIcon fontSize="small" />
                                                    </IconButton>
                                                </TitleCard>
                                            </DisplayStart>
                                        </DashboardCard>
                                </Grid>
                                );
                            })}

                        </Grid >
                        <div className="d-flex align-items-center w-100 justify-content-between">
                            <Stack spacing={2}>

                                <Pagination count={pageCount} page={currentPage} onChange={(event: any, page: number) => { setCurrentPage(page) }} />

                            </Stack>
                            <div>
                                <DisplayNumber>
                                    Displaying {(currentPage * PAGE_SIZE)}-{(currentPage - 1) * PAGE_SIZE} of {fileList?.length} Rooms
                                </DisplayNumber>
                            </div>
                        </div>
                    </>
                }

            </GreyBoxParent>



            <div>
                <Drawer className="Mui-Drawe-w" anchor="right" open={open} onClose={toggleDrawer(false)}>
                    <AppForm onSubmit={handleUploadFileFormSubmit}>
                        <Box>
                            <DrawerHeadingParent>
                                <DrawerHeading> Upload File</DrawerHeading>
                            </DrawerHeadingParent>
                            <DrawerBody>
                                <div style={{
                                    padding: "2.5rem", width: "100%"

                                }}>
                                    <DownloadFileComponent style={{ marginBottom: "10px" }}

                                        disabled={!fileFormWatch("fileType") || fileFormWatch("fileType") === "OTHER"}
                                    />
                                    <input
                                        className="hidden d-none" accept=".pdf, .doc, .docx, .xls"
                                        id='file-input' ref={(r) => { myref = r }} type='file' onChange={onFileSelected}
                                    />
                                    {/* <input ref={(r:any) => { myref = r }}
                                        style={{ display: "none" }}
                                        id="file"
                                        {...fileFormRegister('uploadedFile')}
                                        type="file"
                                        onChange={onFileSelected}
                                        accept=".pdf, .doc, .docx, .xls"
                                    /> */}
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
                                            {housekidFile == ""
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
                                    <FormControl variant="standard" fullWidth className="mb-5">
                                        <InputLabel id="kidRoomLabel">Kid:*</InputLabel>

                                        <Select
                                            labelId="kidRoomLabel"
                                            id="kidRoomselect"
                                            {...fileFormRegister('kidId', { required: true })}
                                            value={fileFormWatch("kidId")}
                                            label="Kid:*"
                                        >
                                            {(props.kidList || []).map((item: KidListModel, index: any) => {
                                                return (
                                                    <MenuItem key={"kid_files" + item.id + index + 3} value={item.id}>{item.name}</MenuItem>

                                                );
                                            })}

                                        </Select>

                                        <FormHelperText style={{ color: "Red" }}>
                                            {fileFormError.kidId?.message}
                                        </FormHelperText>
                                    </FormControl>
                                    <FormControl variant="standard" fullWidth className="mb-5">
                                        <InputLabel id="fileTypeLabel">Select a File Type:*</InputLabel>

                                        <Select
                                            labelId="fileTypeLabel"
                                            id="kidRoomselect"
                                            {...fileFormRegister('fileType', { required: true })}
                                            value={fileFormWatch("fileType")}
                                            label="Select a File Type:*"
                                        >

                                            {FileType.map((item: any, index: any) => {
                                                return <MenuItem value={item.value}>{sentanceCase(item.copy)}</MenuItem>;
                                            })}
                                        </Select>

                                        <FormHelperText style={{ color: "Red" }}>
                                            {fileFormError.fileType?.message}
                                        </FormHelperText>
                                    </FormControl>
                                    {/* If the user selects other give them the option to add a file name */}
                                    {fileFormWatch("fileType") === "OTHER" ? (
                                        <TextField id="file-upload-type" className="mb-4" fullWidth label="Enter the File's name: *" variant="standard"
                                            {...fileFormRegister('fileName')}
                                            placeholder="Enter the File's name: *"
                                            error={!!fileFormError.fileName}
                                            helperText={fileFormError.fileName?.message}
                                        />

                                    ) : null}





                                </div>
                                <div className="d-flex align-items-center justify-content-between" style={{
                                    padding: "2.5rem", width: "100%"
                                }}>
                                    <Button variant="text" color="inherit" onClick={toggleDrawer(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="text" color="inherit" onClick={onhandlePrint}>
                                        Print
                                    </Button>
                                    <AppButton type="submit" className='btnLogin' disabled={!fileFormIsValid}  >
                                        {!fileFormSubmitting ?
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
               

                <Drawer className="Mui-Drawe-w" anchor="right" open={openActionDrawer} onClose={handleCloseActionDrawer}>
                    <AppForm onSubmit={handleEditUploadFileFormSubmit}>
                        <Box>
                        <DrawerHeadingParent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <DrawerHeading>Assessment Updates</DrawerHeading>
                        <IconButton
                            aria-label="more"
                            aria-controls={menuOpen ? 'file-actions-menu' : undefined}
                            aria-haspopup="true"
                            onClick={handleMenuClick}
                            size="small"
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="file-actions-menu"
                            anchorEl={anchorEl}
                            open={menuOpen}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <MenuItem onClick={handleDelete}>Delete</MenuItem>
                        </Menu>
                        </DrawerHeadingParent>
                            <DrawerBody>
                                <div style={{
                                    padding: "2.5rem", width: "100%"

                                }}>
                                    {selectedFileForAction && (
                                        <>
                                            <FormControl variant="standard" fullWidth className="mb-5">
                                                <TextField
                                                    id="file-name"
                                                    label="File Name"
                                                    variant="standard"
                                                    fullWidth
                                                    defaultValue={selectedFileForAction.fileName}
                                                    onChange={(e) => setSelectedFileForAction({
                                                        ...selectedFileForAction,
                                                        fileName: e.target.value
                                                    })}
                                                />
                                            </FormControl>
                                            <FormControl variant="standard" fullWidth className="mb-5">
                                                <InputLabel id="fileTypeLabel">File Type</InputLabel>
                                                <Select
                                                    labelId="fileTypeLabel"
                                                    value={selectedFileForAction.fileType}
                                                    onChange={(e) => setSelectedFileForAction({
                                                        ...selectedFileForAction,
                                                        fileType: e.target.value
                                                    })}
                                                >
                                                    {FileType.map((item: any) => (
                                                        <MenuItem key={item.value} value={item.value}>
                                                            {sentanceCase(item.copy)}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </>
                                    )}
                                </div>
                                <div className="d-flex align-items-center justify-content-between" style={{
                                    padding: "2.5rem", width: "100%"
                                }}>
                                    <Button variant="text" color="inherit" onClick={handleCloseActionDrawer}>
                                        Cancel
                                    </Button>
                                    <Button variant="text" color="inherit" onClick={onhandlePrint}>
                                        Print
                                    </Button>
                                    <AppButton type="submit" className='btnLogin'>
                                        {!fileFormSubmitting ?
                                            'Save Changes'
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

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Delete"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this file? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        color="error" 
                        variant="contained"
                        disabled={uploadState === UploadState.LOADING}
                    >
                        {uploadState === UploadState.LOADING ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}




