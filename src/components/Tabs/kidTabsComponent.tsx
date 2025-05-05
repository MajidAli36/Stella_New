import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Grid, Typography } from "@mui/material";
import styled from "styled-components";
// import { DashboardCard, DisplayStart,DisplayBetween, ImgParentDivSmall, GreyBoxHeading, GreyBox, TitleCard, SmallTitleCard, GreenTextLabel, PlusButton, GreyBoxParent, GreyBoxHeadingParent, AlertHeading, GreyBoxDesc } from '../../views/Kids';
import { AppBar, Toolbar, Icon, IconButton } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import React, { useState } from 'react';
import { DrawerHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
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

export const DashboardCard = styled.div`
width: 100%;
cursor: pointer;
padding: 1.5rem 1.5rem;
flex-grow: 1;
flex-shrink: 0;
border-radius: 8px;
box-shadow: 0px 8px 24px -8px rgba(0,0,0,0.25);
&:hover{
    opacity: 0.75;

}
`
export const DashboardCardBgGreen = styled.div`
width: 100%;
box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
padding: 2.5rem;    
border-radius: 8px;
position: relative;
transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
box-sizing: border-box;
background-color: #E6F7F0;
`
export const DashboardCardBgGreenChildDiv = styled.div`
display: flex;
gap: 2.5rem;
justify-content: flex-start;
`
export const DashboardCardBgGreenChildDivCol = styled.div`
display: flex;
gap: 1.5rem;
flex-direction: column;
`
export const DashboardCardBgGreenChildDivCol2 = styled.div`
display: flex;
gap: 0.5rem;
flex-direction: column;
`
export const GreenTextLabel = styled.div`
font-size: 1rem;
color: #0AB472;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: bold;
line-height: 1.167;
letter-spacing: 0em;
`
export const GreenTextLabelSmall = styled.div`
color: rgb(34, 187, 128);
opacity: 0.5;
font-size: 0.75rem;
`
export const Greenbtndiv = styled.div`
top: 2rem;
right: 2rem;
position: absolute; 
   color: #0AB472;
   flex: 0 0 auto;
   color: rgba(0, 0, 0, 0.54);
   padding: 12px;
   overflow: visible;
   font-size: 1.5rem;
   text-align: center;
   transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
   border-radius: 50%;
   color: inherit;
   border: 0;
   cursor: pointer;
   margin: 0;
   display: inline-flex;
   outline: 0;
   padding: 0;
   align-items: center;
   user-select: none;
   border-radius: 0;
   vertical-align: middle;
   -moz-appearance: none;
   justify-content: center;
   text-decoration: none;
   background-color: transparent;
   -webkit-appearance: none;
   -webkit-tap-highlight-color: transparent;
`
export const DashboardCardpurple = styled.div`
width: 100%;
cursor: pointer;
padding: 1.5rem 1.5rem;
flex-grow: 1;
flex-shrink: 0;
border-radius: 8px;
box-shadow: 0px 8px 24px -8px rgba(0,0,0,0.25);
background: linear-gradient(90deg, rgb(116, 32, 216) 3.75rem, rgb(255 255 255) 3.75rem);
&:hover{
    opacity: 0.75;

}
`

export const DisplayBetween = styled.div`
display:flex;
align-items:center;
justify-content: space-between;
`

export const DisplayStart = styled.div`
display:flex;
align-items:center;
column-gap: 1rem;
justify-content: flex-start;`
export const IconBox = styled.div`
background-color: rgb(241, 232, 251);
padding: 3px;
font-size: 1.125rem;
text-align: center;
transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
border-radius: 50%;
`
export const SmallTitleCard = styled.div`
color: rgba(0, 0, 0, 0.54);
    font-size: 0.75rem;
    font-family:  "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1.43;
    letter-spacing: 0.01071em; 
   padding-left: 11px;
    padding-top: 5px;
`
export const TitleCard = styled.div`
overflow: hidden;
white-space: nowrap;
padding-left: 0.75rem;
padding-right: 0.75rem;
text-overflow: ellipsis;
font-size: 1rem;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: bold;
line-height: 1.167;
letter-spacing: 0em;
`
export const AlertHeading = styled.div`
font-size: 1rem;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: bold;
line-height: 1.167;
letter-spacing: 0em;
color: #111111;

`
export const GreyBoxParent = styled.div`
width: 100%;
height: 500px;
display: flex;
flex-direction: column;
justify-content: space-between;
`
export const GreyBox = styled.div`
background: rgb(250, 250, 250);
flex: 1 1 0%;
width: 100%;
margin-top: 30px;
display: flex;
padding: 2rem;
min-height: inherit;
align-items: center;
row-gap: 1rem;
flex-direction: column;
justify-content: center;
`
export const GreyBoxHeading = styled.div`
color: rgba(0, 0, 0, 0.54);
font-size: 1.25rem;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: 500;
line-height: 1.6;
letter-spacing: 0.0075em;
`
export const GreyBoxDesc = styled.div`
color: rgba(0, 0, 0, 0.54);
font-size: 0.875rem;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: 400;
line-height: 1.5;
letter-spacing: 0.00938em;
`

export const GreyBoxHeadingParent = styled.div`
display: flex;
gap: 0.25rem;
max-width: 20rem;
text-align: center;
flex-direction: column;
`
export const PageHeading = styled.div`
font-size: 2rem;
font-family: League Spartan, sans-serif;
font-weight: bold;
line-height: 1.167;
letter-spacing: -0.01562em;
    color: #111111;
    margin-bottom:15px;


`
export const PageHeadingSmall = styled.div`
font-size: 0.875rem;
font-family: League Spartan, sans-serif;
font-weight: 400;
line-height: 1.5;
letter-spacing: 0.00938em;
color: rgba(0, 0, 0, 0.54);
margin-bottom:25px;


`
export const PlusButton = styled.div`
color: #fafafa;
padding: 8px;
font-size: 27px;
box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
aspect-ratio: 1 / 1;   
background-color: rgb(10, 180, 114);
text-align: center;
transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
border-radius: 50%;
width:40px;
height:40px;
cursor:pointer;
&:hover{
    opacity:0.9;
}


`
export const ImgParentDivSmall = styled.div`
background-color: rgb(189, 189, 189);
color: rgb(250, 250, 250);
width: 3rem;
height: 3rem;
display: flex;
overflow: hidden;
position: relative;
font-size: 1.25rem;
align-items: center;
flex-shrink: 0;
font-family:  "Helvetica", "Arial", sans-serif;
line-height: 1;
user-select: none;
border-radius: 50%;
justify-content: center;
`
export const ImgParentDiv = styled.div`
background-color: rgb(189, 189, 189);
color: rgb(250, 250, 250);
width: 5rem;
height: 5rem;
display: flex;
overflow: hidden;
position: relative;
font-size: 1.25rem;
align-items: center;
flex-shrink: 0;
font-family:  "Helvetica", "Arial", sans-serif;
line-height: 1;
user-select: none;
border-radius: 50%;
justify-content: center;
`
export const ImgParentDivLg = styled.div`
background-color: rgb(189, 189, 189);
color: rgb(250, 250, 250);
width: 12rem;
height: 12rem;
display: flex;
overflow: hidden;
position: relative;
font-size: 1.25rem;
align-items: center;
flex-shrink: 0;
font-family:  "Helvetica", "Arial", sans-serif;
line-height: 1;
user-select: none;
border: 8   px solid white;
border-radius: 50%;
justify-content: center;
`
export const DisplayNumber = styled.div`
color: rgba(0, 0, 0, 0.54);
font-size: 0.75rem;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: 400;
line-height: 1.66;
letter-spacing: 0.03333em;
`
export const MoveInDiv = styled.div`
cursor: pointer;
padding: 1rem 1rem;
min-width: min-content;
flex-shrink: 0;
padding-left: 1.5rem;
border-radius: 8px;
background-color: #f5f5f5;
color: #111111;
transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`
export const FlexBetween = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`
export const MoveInlbl = styled.div`
    padding-right: 0.75rem;
    font-size: 1rem;
    font-family:  "Helvetica", "Arial", sans-serif;
    font-weight: bold;
    line-height: 1.167;
    letter-spacing: 0em;
`


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const theme = createTheme({
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#000', // Change this to your desired border color
          },
        },
      },
    },
  },
});
export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  
  const [selectedValue1, setSelectedValue1] = useState('option2'); // Set the default value here
  const [selectedValue2, setSelectedValue2] = useState(1); // Set the default value here

const handleChange1 = (event:any) => {
  setSelectedValue1(event.target.value);
};
const handleChange2 = (event:any) => {
  setSelectedValue2(event.target.value);
};


  return (
    <div className="kidsDetailBox">
      <Box>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="TASK" {...a11yProps(0)} />
          <Tab label="DETAILS" {...a11yProps(1)} />
          <Tab label="ACTIVITY" {...a11yProps(2)} />
          <Tab label="FILES" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>

        <DashboardCard className="mb-1 w-50 p-5">
          <DisplayStart className='p-4'>
            <GreenTextLabel className='me-3'>
              0%
            </GreenTextLabel>
            <div>
              <TitleCard>
                Pre-Move in process

              </TitleCard>
              <SmallTitleCard>
                0 / 8 tasks completed.

              </SmallTitleCard>
              <GreenTextLabel className='ms-4 mt-3'>
                <ChevronRightIcon />
              </GreenTextLabel>
            </div>
          </DisplayStart>

        </DashboardCard>
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
              <PlusButton className='mt-5'>
                <AddIcon className="d-flex" />
              </PlusButton>
            </div>
            <GreyBoxParent className=''>
              <div className="d-flex align-items-center justify-content-between  mt-4">
                <AlertHeading>
                  User's Tasks
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
                      No Alerts
                    </GreyBoxHeading>
                    <GreyBoxDesc>
                      If there should be an alert, try creating one. Otherwise, kick back and relax.
                    </GreyBoxDesc>
                  </GreyBoxHeadingParent>
                </Box>

              </GreyBox>
            </GreyBoxParent>
            <div className="d-flex align-items-center justify-content-end">
              <Icon style={{ height: "unset" }}>  <ChevronLeftIcon className='text-body-tertiary iconHeight' /></Icon>
              <Icon></Icon>
              <Icon style={{ height: "unset" }}>  <ChevronRightIcon className='text-body-tertiary iconHeight' /></Icon>
            </div>


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
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Age"
              >
                <MenuItem value={10}>Due Date - Ascending</MenuItem>
                <MenuItem value={20}>Due Date - Decending</MenuItem>
                <MenuItem value={30}>Created Date - Ascending</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="standard" fullWidth className="mb-2 mt-4">
              <InputLabel id="demo-simple-select-standard-label">Assigned To</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Age"
              >
                <MenuItem value={10}>All</MenuItem>
                <MenuItem value={20}>Due Date - Decending</MenuItem>
                <MenuItem value={30}>Created Date - Ascending</MenuItem>
              </Select>
            </FormControl>
            <div>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Show Completed Tasks" className='fontsize-11' />
            </div>
            <div>
              <FormControlLabel control={<Checkbox />} label="Hide Private Tasks" className='fontsize-11' />
            </div>


          </Grid>

        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Grid className='mb-4' container spacing={5}>
          <Grid item xs={12} md={6}>
            <DashboardCard className="mb-1">
                <div className='mb-3 px-1'>
              <DisplayBetween>
                  <TitleCard>
                    Basic Information
                  </TitleCard>
                  <IconButton size="small" sx={{
                    Color:"rgb(8, 153, 96)",
                    boxShadow:"0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                    backgroundColor:"#E6F7F0",
                  }}>
                        <ModeIcon  className='text-success'/>
                  </IconButton>
              </DisplayBetween>
                </div>
              <Box className='px-3'>
                <div className='mb-3'>
                  <p>
                    User Test
                  </p>
                  <h6>
                    Name
                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    User Test
                  </p>
                  <h6>
                    Preferred Name
                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    Fenmale
                  </p>
                  <h6>
                    Gender
                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    testuser@yopmail.com
                  </p>
                  <h6>
                    Email
                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    +821385234
                  </p>
                  <h6>
                    Contact No
                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    15/12/1978
                  </p>
                  <h6>
                    Date of Birth
                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                    Ethnicity
                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                    Religion
                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                    Spoken Language

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                    When im missing I normally go


                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                    Appearance

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
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
                <TitleCard>
                  Legal Details
                  </TitleCard>
                  <IconButton size="small" sx={{
                    Color:"rgb(8, 153, 96)",
                    boxShadow:"0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                    backgroundColor:"#E6F7F0",
                  }}>
                        <ModeIcon  className='text-success'/>
                  </IconButton>
              </DisplayBetween>
                
                </div>
              <Box className='px-3'>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  Local Authority

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                  Unknown
                  </p>
                  <h6>
                  Legal Status

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  NHS Number


                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  Registered GP Details

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  Registered Dentist Details

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  Registered Optician Details

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  Social Worker Details

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
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
                  <TitleCard>
                  Medical Conditions

                  </TitleCard>
                  <IconButton size="small" sx={{
                    Color:"rgb(8, 153, 96)",
                    boxShadow:"0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                    backgroundColor:"#E6F7F0",
                  }}>
                        <AddIcon  className='text-success'/>
                  </IconButton>
              </DisplayBetween>
                
                </div>
              <GreyBox>
                <Box>
                  <GreyBoxHeadingParent>
                  <div className='svgWidth'>
                      <svg id="b21613c9-2bf0-4d37-bef0-3b193d34fc5d" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="647.63626" height="632.17383" viewBox="0 0 647.63626 632.17383"><path d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z" transform="translate(-276.18187 -133.91309)" fill="#f2f2f2"></path><path d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="190.15351" cy="24.95465" r="20" fill="#0AB472"></circle><circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff"></circle><path d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z" transform="translate(-276.18187 -133.91309)" fill="#e6e6e6"></path><path d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="433.63626" cy="105.17383" r="20" fill="#0AB472"></circle><circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff"></circle></svg>
                    </div>
                    <GreyBoxHeading>
                      No Details Recorded

                    </GreyBoxHeading>
                    <GreyBoxDesc>
                      No recorded details exist of the type "Contacts".

                    </GreyBoxDesc>
                  </GreyBoxHeadingParent>
                </Box>

              </GreyBox>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardCard className="mb-1">
                <div className='mb-3 px-1'>

              <DisplayBetween>
                  <TitleCard>
                  About Me
                  </TitleCard>
                  <IconButton size="small" sx={{
                    Color:"rgb(8, 153, 96)",
                    boxShadow:"0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                    backgroundColor:"#E6F7F0",
                  }}>
                        <ModeIcon  className='text-success'/>
                  </IconButton>
              </DisplayBetween>
                </div>
              <Box className='px-3'>

                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                    My Triggers

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                    Improves My Mood

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                    Support Needed

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                    Likes
                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
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
                  <TitleCard>
                  Contacts
                  </TitleCard>
                  <IconButton size="small" sx={{
                    Color:"rgb(8, 153, 96)",
                    boxShadow:"0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                    backgroundColor:"#E6F7F0",
                    Padding: "3px",
                    fontSize: "1.125rem"
                  }}>
                       <AddIcon  className='text-success'/>
                  </IconButton>
              </DisplayBetween>
                </div>
              <GreyBox>
                <Box>
                  <GreyBoxHeadingParent>
                  <div className='svgWidth'>
                      <svg id="b21613c9-2bf0-4d37-bef0-3b193d34fc5d" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="647.63626" height="632.17383" viewBox="0 0 647.63626 632.17383"><path d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z" transform="translate(-276.18187 -133.91309)" fill="#f2f2f2"></path><path d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="190.15351" cy="24.95465" r="20" fill="#0AB472"></circle><circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff"></circle><path d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z" transform="translate(-276.18187 -133.91309)" fill="#e6e6e6"></path><path d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="433.63626" cy="105.17383" r="20" fill="#0AB472"></circle><circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff"></circle></svg>
                    </div>
                    <GreyBoxHeading>
                      No Details Recorded

                    </GreyBoxHeading>
                    <GreyBoxDesc>
                      No recorded details exist of the type "Contacts".

                    </GreyBoxDesc>
                  </GreyBoxHeadingParent>
                </Box>

              </GreyBox>
            </DashboardCard>
            <DashboardCard className="mb-1 mt-5">
                <div className='mb-3 px-1'>
                <DisplayBetween>
                <TitleCard>
                  Risk Assessment
                  </TitleCard>
                  <IconButton size="small" sx={{
                    Color:"rgb(8, 153, 96)",
                    boxShadow:"0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                    backgroundColor:"#E6F7F0",
                  }}>
                        <ModeIcon  className='text-success'/>
                  </IconButton>
              </DisplayBetween>
                  
                </div>
              <Box className='px-3'>
                <div className='mb-3'>
                  <p>
                  -
                  </p>
                  <h6>
                  Note
                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                  -
                  </p>
                  <h6>
                  Risk of suicide or deliberate self harm

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  Risk of aggressive behaviour/violence

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                   -
                  </p>
                  <h6>
                  Risk of suicide or deliberate self harm

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  Risk of self neglect or accidental self harm

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                   -
                  </p>
                  <h6>
                  Risk of non-compliance with professional medical advice/treatment

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  Risk due to mental ill health

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  Risk due to alcohol or substance misuse

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  Risk of abuse by others


                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  Risk due to physical/medical condition



                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  Risk to the health of others (for example hygiene risk)


                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  Risk due to environmental factors

                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  A risk towards Young adults


                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  A risk towards Older people


                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  A risk towards Children


                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  A risk towards Women


                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  A risk towards Men


                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  A risk towards Family members


                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  A risk towards Religious groups


                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  A risk towards Any ethnic or racial groups (please specify in notes section)


                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  A risk towards Lesbian, gay or bisexual people


                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  A risk towards Transgendered people


                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  A risk towards People with disabilities



                  </h6>
                </div>
                <div className='mb-3'>
                  <p>
                    -
                  </p>
                  <h6>
                  A risk towards Staff



                  </h6>
                </div>
              </Box>

            </DashboardCard>
          </Grid>
          
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
      <Box className='d-flex align-items-center justify-content-between'>
           <div>
           <FormControl variant="outlined" className='' size="small">
            <Select
          value={selectedValue1}
          onChange={handleChange1}
          sx={{
            borderRadius:"30px",
            width:"250px",
            marginRight:"20px"
          }}
        >
           <MenuItem value="option1">Show: All Time</MenuItem>
          <MenuItem value="option2">Two</MenuItem>
          <MenuItem value="option3">Three</MenuItem>
        </Select>
    </FormControl>
    <FormControl variant="outlined" className='' size="small">
    <Select
          value={selectedValue2}
          onChange={handleChange2}
          sx={{
            borderRadius:"30px",
            width:"250px",
          }}
        >
          <MenuItem value="1">Type: All</MenuItem>
          <MenuItem value="2">Two</MenuItem>
          <MenuItem value="3">Three</MenuItem>
        </Select>
    </FormControl>
           </div>
    <GreenTextLabel>
      View Full Log
    </GreenTextLabel>
    </Box>
              <GreyBox>
                <Box>
                  <GreyBoxHeadingParent>
                    <div className='svgWidth'>
                      <svg id="b21613c9-2bf0-4d37-bef0-3b193d34fc5d" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="647.63626" height="632.17383" viewBox="0 0 647.63626 632.17383"><path d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z" transform="translate(-276.18187 -133.91309)" fill="#f2f2f2"></path><path d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="190.15351" cy="24.95465" r="20" fill="#0AB472"></circle><circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff"></circle><path d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z" transform="translate(-276.18187 -133.91309)" fill="#e6e6e6"></path><path d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z" transform="translate(-276.18187 -133.91309)" fill="#3f3d56"></path><path d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z" transform="translate(-276.18187 -133.91309)" fill="#0AB472"></path><circle cx="433.63626" cy="105.17383" r="20" fill="#0AB472"></circle><circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff"></circle></svg>
                    </div>
                    <GreyBoxHeading>
                    No Activities Logged
                    </GreyBoxHeading>
                    <GreyBoxDesc>
                    Try adding an activity and coming back later.
                    </GreyBoxDesc>
                  </GreyBoxHeadingParent>
                </Box>

              </GreyBox>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        Item Four
      </CustomTabPanel>
    </div>
  );
}
