import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { Row, Col, Container } from "react-bootstrap";
import styled from "styled-components";
import * as yup from "yup";
import { AppBar, Toolbar, Icon, IconButton } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import React, { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { DrawerHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
import SelectCommon from "../../components/FormComponents";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Pagination from '@mui/material/Pagination';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import constants from '../../service/Constants';
import { AppButton, AppLink, AppIconButton, AppAlert, AppForm } from '../../components';
import { GetAxios } from '../../service/AxiosHelper';
import HouseIcon from '@mui/icons-material/House';
import usePagination from "../../components/CustomPagination";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';


function Policy() {
    const PAGE_SIZE = 12; // Number of items per page
    
    useEffect(() => {

        

    }, );

    return (
        <>
            <Container fluid-sm>
               <label>Policy</label>
            </Container>
        </>
    );
}

export default Policy;
