
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import React, { useState, useEffect, SyntheticEvent } from 'react';
import { DashboardCard, DisplayBetween, DisplayNumber, GreyBox, GreyBoxDesc, SubtitleCard, DisplayStart, GreenTextLabel, GreenTextLabelSmall, GreyBoxParent, GreyBoxHeading, GreyBoxHeadingParent, AlertHeading, PlusButton, ImgParentDiv, ImgParentDivLg, ImgParentDivSmall, DashboardCardBgGreen, DashboardCardBgGreenChildDiv, DashboardCardBgGreenChildDivCol, DashboardCardBgGreenChildDivCol2, DashboardCardpurple, TitleCard, SmallTitleCard, PageHeading, PageHeadingSmall } from "../Kids/KidScreenStyle";
import { useNavigate, useParams } from 'react-router-dom';
import constants, { coachingSessionCategories } from '../../service/Constants';
import usePagination from "../../components/CustomPagination";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
interface Iprops {
    kidListHouse: KidListModel[]
}
export default function KidsTab(props: Iprops) {
    const [picture, setPicture] = useState('http://waqarsts-001-site1.ktempurl.com/dummy.jpg');
    const PAGE_SIZE = 5; // Number of items per page
    const navigate = useNavigate();
    const { currentPage, handlePaginate, pageCount, setCount, setCurrentPage, } = usePagination({ take: PAGE_SIZE, count: 0 });
    React.useEffect(() => {
        setCount(props.kidListHouse.length);
         setCurrentPage(1);
    }, []);
    
    // Function to handle page change

    return (
        <div className="kidsDetailBox">
            <Box className='d-flex align-items-center justify-content-between'>
                <div>

                </div>

            </Box>
            {(props.kidListHouse || []).slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((item: KidListModel, index: any) => {
                return (
                    <Grid item xs={12} md={4} key={(currentPage - 1) * 2 + index + 1}>
                        <DashboardCard className="mb-1" onClick={() => { navigate("/kids/" + item.id) }}>

                            <DisplayStart>
                                <ImgParentDiv>
                                    <img src={item.avatar != '' ? constants.Kid_Avatar + item?.avatar : picture} alt="" className="userLogoKids"
                                    />
                                </ImgParentDiv>
                                <TitleCard>

                                    {item.name}
                                    <br></br>
                                    <SubtitleCard>
                                        {item.houseName}
                                    </SubtitleCard>
                                </TitleCard>

                            </DisplayStart>
                        </DashboardCard>
                    </Grid>

                );
            })}
            <div className="d-flex align-items-center w-100 justify-content-between">
                <Stack spacing={2}>

                    <Pagination count={pageCount} page={currentPage} onChange={(event: any, page: number) => { setCurrentPage(page) }} />

                </Stack>
                <div>
                    <DisplayNumber>
                        Displaying {(currentPage * PAGE_SIZE)}-{(currentPage - 1) * PAGE_SIZE} of {pageCount} Kids
                    </DisplayNumber>
                </div>
            </div>

        </div>
    );
}




