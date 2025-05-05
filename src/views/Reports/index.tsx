import * as React from 'react';
import { Box, Grid,Typography } from "@mui/material";
import { Row, Col, Container } from "react-bootstrap";
import styled from "styled-components";
import ReportsCustomTabPanel from  "../../components/Tabs/reporttabsComponents";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
const PageHeading = styled.div`
font-size: 2rem;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: bold;
line-height: 1.167;
letter-spacing: -0.01562em;
    color: #111111;
    margin-bottom:15px;


`
interface Iprops {
}

function Reports(props: Iprops) {
return(
<>
<h1>
<Container fluid-sm>
                <PageHeading>
                   Reports
                </PageHeading>
              <ReportsCustomTabPanel/>
            </Container>
</h1>
</>


)

}
export default Reports;