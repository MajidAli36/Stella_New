
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Box, Grid, Typography, CircularProgress, createStyles,
  Paper,
  Theme
} from "@mui/material";
import { TitleCard, SmallTitleCard, GreenTextLabel, GreenTextLabelSmall, Greenbtndiv, DashboardCardBgGreen, DashboardCardBgGreenChildDiv, DashboardCardBgGreenChildDivCol, DashboardCardBgGreenChildDivCol2, DashboardCardpurple, DisplayBetween, DisplayNumber, DisplayStart, MoveInDiv, MoveInlbl, FlexBetween, PlusButton } from "../Homes/HouseScreenStyle";
import { AppBar, Toolbar, Icon, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import PreMoveInTaskGroupViewTab from './PreMoveInTaskGroupView';
import MoveInTaskGroupViewTab from './MoveInTaskGroupView';
import { GetAxios } from '../../service/AxiosHelper';
import TaskTab from './TaskTab';
import "../../index.css";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
import constants, { coachingSessionCategories, FileType, sentanceCase } from '../../service/Constants';
interface Iprops {
  kidId: string | undefined, houseId: string | undefined, title: string
  status: string
}
export default function KidTaskTab(props: Iprops) {

  const [preMoveInProccessTab, setPreMoveInProccessTab] = useState(false);
  const [moveInProccessTab, setMoveInProccessTab] = useState(false);
  const [preMoveInprogress, setPreMoveInProgress] = useState<PreMoveInModel>();
  const [moveInprogress, setMoveInProgress] = useState<MoveInModel>();
  const [progress,setProgress]= useState(true);
  useEffect(() => {
    GetAxios().get(constants.Api_Url + 'Task/GetPreMoveInTaskTotal?kidId=' + props.kidId).then(res => {
      if (res.data.success) {
        setPreMoveInProgress(res.data.data);
        console.log(res.data.data)
      }
    })
    GetAxios().get(constants.Api_Url + 'Task/GetMoveInTaskTotal?kidId=' + props.kidId).then(res => {
      if (res.data.success) {
        setMoveInProgress(res.data.data);
        console.log(res.data.data)
      }
    })
  }, []);
  return (
    <>


      <div className="kidsDetailBox">
        <Grid container spacing={5} className='mb-4'>
          {
            (preMoveInProccessTab == false && progress==true) &&
            <Grid
              item
              xs={12}
              md={12}
              lg={6}
              wrap="nowrap"
              className="cardWrapper"
            >
              <Paper variant="outlined" className="cardRoot">
                <Box id="chart" display="flex" alignItems="center">
                  <Box position="relative" display="inline-flex" marginRight={'24px'}>
                    <CircularProgress
                      size={120}
                      thickness={2}
                      variant="determinate"
                      style={{ color: "#0AB472" }}
                      value={preMoveInprogress?.progress}
                    />
                    <Box
                      top={0}
                      left={0}
                      bottom={0}
                      right={0}
                      position="absolute"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        variant="h6"
                        component="span"
                        style={{ color: "#0AB472" }}
                      >{`${Math.round(preMoveInprogress?.progress ?? 0)}%`}</Typography>
                    </Box>
                  </Box>
                  <Box className="boxContainer">
                    <TitleCard>
                      Pre-Move in process
                    </TitleCard>
                    <SmallTitleCard>
                      {preMoveInprogress?.completedtasks ?? 0} / 8 tasks completed.
                    </SmallTitleCard>
                    <Box paddingTop="0.5rem">
                      <IconButton
                        onClick={() => { setPreMoveInProccessTab(true); setMoveInProccessTab(false); setProgress(false);}}
                        style={{ color: "#0AB472" }}
                        aria-label="go to tasks"
                        size="small"
                      >
                        <ChevronRightIcon />
                      </IconButton>

                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          }
          {
            (moveInProccessTab == false && props.status?.trim() == "IN_HOME" && progress==true) &&
            <Grid
              item
              xs={12}
              md={12}
              lg={6}
              wrap="nowrap"
              className="cardWrapper"
            >
              <Paper variant="outlined" className="cardRoot">
                <Box id="chart" display="flex" alignItems="center">
                  <Box position="relative" display="inline-flex" marginRight={'24px'}>
                    <CircularProgress
                      size={120}
                      thickness={2}
                      variant="determinate"
                      style={{ color: "#0AB472" }}
                      value={moveInprogress?.progress}
                    />
                    <Box
                      top={0}
                      left={0}
                      bottom={0}
                      right={0}
                      position="absolute"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        variant="h6"
                        component="span"
                        style={{ color: "#0AB472" }}
                      >{`${Math.round(moveInprogress?.progress ?? 0)}%`}</Typography>
                    </Box>
                  </Box>
                  <Box className="boxContainer">
                    <TitleCard>
                      Move in process
                    </TitleCard>
                    <SmallTitleCard>
                      {moveInprogress?.completedtasks ?? 0} / 9 tasks completed.
                    </SmallTitleCard>
                    <Box paddingTop="0.5rem">
                      <IconButton
                        onClick={() => { setMoveInProccessTab(true); setPreMoveInProccessTab(false); setProgress(false); }}
                        style={{ color: "#0AB472" }}
                        aria-label="go to tasks"
                        size="small"
                      >
                        <ChevronRightIcon />
                      </IconButton>

                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          }
        </Grid>
        {

          (preMoveInProccessTab == false && moveInProccessTab == false) &&
          <TaskTab />}
        {
          preMoveInProccessTab == true &&
          <PreMoveInTaskGroupViewTab setProcessTab={setProgress} setPreMoveInProcessTab={setPreMoveInProccessTab} setMoveInProcessTab={setMoveInProccessTab} houseId={props.houseId ?? ""} />
        }
        {
          moveInProccessTab == true &&
          <MoveInTaskGroupViewTab  setProcessTab={setProgress} setPreMoveInProcessTab={setPreMoveInProccessTab} setMoveInProcessTab={setMoveInProccessTab} houseId={props.houseId ?? ""} />
        }

      </div>
    </>
  );
}




