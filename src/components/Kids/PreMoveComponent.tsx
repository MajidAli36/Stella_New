import { Box, Grid, Typography, CircularProgress, Button, IconButton } from "@mui/material";
import { Row, Col, Container } from "react-bootstrap";
import styled from "styled-components";
import '../../index.css';
import React, { useState } from 'react';
import { DrawerHeading, DrawerHeadingParent, DrawerBody, DrawerFooter } from "../../components/Drawer/DrawerRight";
import Drawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AppButton } from "../../components";
import RefreshIcon from '@mui/icons-material/Refresh';
export const PremoveCard = styled.div`
display: flex;
padding: 2rem;
align-items: center;
border-color: #eeeeee;
border-style: solid;
border-width: 1px;
border-radius: 8px;
border: 1px solid rgba(0, 0, 0, 0.12);
color: #111111;
transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
background-color: #fff;
&:hover{
    cursor: pointer;
    background-color: #fafafa;
}
`

export const PremoveCardHeading = styled.div`
font-size: 1rem;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: 400;
line-height: 1.75;
letter-spacing: 0.00938em;
`

export const PremoveCardHeadingMuted = styled.div`
color: #9e9e9e;
font-size: 0.75rem;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: 400;
line-height: 1.66;
letter-spacing: 0.03333em;
`
interface Iprops {
}
function Premoveprocess(props: Iprops) {
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = (open: any) => (event: any) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setOpen(open);
    };
    return (
        <>
           <div>
           <Container fluid-sm>
          <div className='d-flex align-items-center justify-content-between'>
          <Button variant="text" color="inherit" className="mb-3" >
                <ChevronLeftIcon /> PRE-MOVE IN
                                        </Button>
                                        <IconButton>
                                       <RefreshIcon/>
                                    </IconButton>
          </div>
                <Grid className='mb-4' container spacing={5}>
               
                    <Grid item xs={12} md={4}>
                      <PremoveCard onClick={toggleDrawer(true)}>
                      <svg className="svgPlusIcon" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                      <div>
                        <PremoveCardHeading>
                            Upload Name
                        </PremoveCardHeading>
                        <PremoveCardHeadingMuted>
                            File Upload
                        </PremoveCardHeadingMuted>
                      </div>
                      </PremoveCard>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <PremoveCard onClick={toggleDrawer(true)}>
                      <svg className="svgPlusIcon" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                      <div>
                        <PremoveCardHeading>
                            Upload Name
                        </PremoveCardHeading>
                        <PremoveCardHeadingMuted>
                            File Upload
                        </PremoveCardHeadingMuted>
                      </div>
                      </PremoveCard>
                    </Grid>
                 
                    <Grid item xs={12} md={4}>
                      <PremoveCard onClick={toggleDrawer(true)}>
                      <svg className="svgPlusIcon" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                      <div>
                        <PremoveCardHeading>
                            Upload Name
                        </PremoveCardHeading>
                        <PremoveCardHeadingMuted>
                            File Upload
                        </PremoveCardHeadingMuted>
                      </div>
                      </PremoveCard>
                    </Grid>
                  
                </Grid >
                
            </Container>
            <div>
                        <div onClick={toggleDrawer(true)} data-attr='drawer'></div>
                        <Drawer className="Mui-Drawe-w" anchor="right" open={open} onClose={toggleDrawer(false)}>
                            <Box>
                            <DrawerHeadingParent>
                                        <DrawerHeading>Upload CRF</DrawerHeading>
                                    </DrawerHeadingParent>
                                <DrawerBody>
                                    <div style={{
                                        padding: "2.5rem", width: "100%"

                                    }}>
                                            <TextField id="" className="mb-4" fullWidth label="Name: *" variant="standard"/>

                                            <TextField id="" className="mb-4" fullWidth label="Preferd Name: *" variant="standard"/>

                                            <TextField id="" className="mb-4" fullWidth label="Preferd Name: *" variant="standard"/>

                                            <TextField id="" className="mb-4" fullWidth label="Email: *" variant="standard"/>

                                            <TextField id="" className="mb-4" type="date" fullWidth label="Date of Birth: *" variant="standard" InputLabelProps={{
                                                shrink: true,
                                            }}/>

                                            <TextField id="" className="mb-4" fullWidth label="Most Recent Address: *" variant="standard"/>

                                            <TextField id="" className="mb-4" fullWidth label="Apppearance: *" variant="standard"/>
                                            <TextField id="" className="mb-4" fullWidth label="Ethnicity: *" variant="standard"/>
                                            <TextField id="" className="mb-4" fullWidth label="Religion: *" variant="standard"/>
                                            <TextField id="" className="mb-4" fullWidth label="Spoken Language: *" variant="standard"/>
                                            <TextField id="" className="mb-4" fullWidth label="Where I go when I am missing: *" variant="standard"/>
                                            
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between" style={{
                                        padding: "2.5rem", width: "100%"
                                    }}>
                                        <Button variant="text" color="inherit" onClick={toggleDrawer(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="text" color="inherit">
                                            Print
                                        </Button>
                                        <AppButton variant="text" color="inherit"  className='btnLogin'>
                                           Submit
                                        </AppButton>

                                    </div>
                                </DrawerBody>
                            </Box>
                            <Box>

                            </Box>
                        </Drawer>
                    </div>
           </div>
        </>
    );
}

export default Premoveprocess;
