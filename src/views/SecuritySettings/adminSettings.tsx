import { Card, Grid, Typography } from '@mui/material';
import {
  DataGrid,
  GridRowModel,
  GridColDef,
  GridRowId,
  GridRowsProp,
} from '@mui/x-data-grid';
import styled from "styled-components";
import { GetAxios } from '../../service/AxiosHelper';
//import constants from '  service/Constants';
import constants from '../../service/Constants';
import React, { useEffect, useState } from 'react';
import { async } from 'validate.js';
import { debug } from 'console';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment';
//import YoungPersonLocationStatusTable from './YoungPersonLocationStatusTable';

export const TitleCard = styled.div`
overflow: hidden;
white-space: nowrap;
padding-left: 0.75rem;
padding-right: 0.75rem;
text-overflow: ellipsis;
font-size: 18px;
font-family:  "Helvetica", "Arial", sans-serif;
font-weight: bold;
line-height: 1.167;
letter-spacing: 0em;
`
export type adminSettings = {};
interface Iprops {
}

function AdminOrgSettingsScreen(props: Iprops) {
    // const [open, setOpen] = React.useState(false);
    // const [selectedValue1, setSelectedValue1] = useState('option2'); // Set the default value here
    // const [selectedValue2, setSelectedValue2] = useState(1); // Set the default value here

    // const handleChange1 = (event: any) => {
    //     setSelectedValue1(event.target.value);
    // };
    // const handleChange2 = (event: any) => {
    //     setSelectedValue2(event.target.value);
    // };
    // const toggleDrawer = (open: any) => (event: any) => {
    //     if (
    //         event.type === 'keydown' &&
    //         (event.key === 'Tab' || event.key === 'Shift')
    //     ) {
    //         return;
    //     }

    //     setOpen(open);
    // };

    // const fetchData = async () => {
    //     try {
    //       const response = await fetch('your-api-endpoint');
    //       const data = await response.json();
    //       return data;
    //     } catch (error) {
    //       console.error('Error fetching data:', error);
    //       throw error;
    //     }
    //   };

    const [gridData, setGridData] = useState([]);

    const fetchData = async () => {
        try {
          const response = await fetch(constants.Api_Url +'Setting/GetWhereaboutStatuses');
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
      };


      
        useEffect(() => {
          const fetchDataAndSetGridData = async () => {
            try {
              const data = await fetchData() as any; // Assuming fetchData is a function that fetches data from the API
              setGridData(data.list);
            } catch (error) {
              // Handle error
            }
          };
      
          fetchDataAndSetGridData();
        }, []); // Empty dependency array means useEffect runs once, similar to componentDidMount




    const columns = [
        { field: 'title', headerName: 'Title', width: 200, editable: true },
        { field: 'type', headerName: 'Type', width: 200 },
        { field: 'priority', headerName: 'Priority', width: 200, editable: true },
        // Add more columns as needed
      ];


      const processRowUpdate = React.useCallback(
        async (newRow: GridRowModel) => {
          // Make the HTTP request to save in the backend
          //const response = await mutateRow(newRow);

          const response = newRow as any;

         
            const formData = new FormData();
            
            formData.append('id', response?.id);
            formData.append('title', response?.title);
            formData.append('type', response?.type);
            formData.append("priority", response.priority);
    
            GetAxios().post(constants.Api_Url + 'Setting/UpdateWhereaboutStatus', formData).then(res => {
                if (res.data.success) {
                }
            })
        
            try {
              const data = await fetchData() as any; // Assuming fetchData is a function that fetches data from the API
              setGridData(data.list);
            } catch (error) {
              // Handle error
            }

           
        },
        [],
      );

      const handleProcessRowUpdateError = React.useCallback((error: Error) => {
        console.log(error);
      }, []);


   


    function renderYoungLocationAsyncFunction()
    {
        const requestOptions = {
            method: 'GET',
            //headers: '',
        };
    
    
       const dataList =  fetch(constants.Api_Url +'Setting/GetWhereaboutStatuses', requestOptions)
            .then((response) => {
    
                if (response.status == 401) {
                    return false;
                }
                else if (!response.ok) {
                  //  alert(response.text);
                    return false;
                }
                else
                    return response.json();
            })
            .then(
    
                data => {
                    if (data.count  > 0) {
                     
                      return data.list;
                    } else {
                      return data.list;
                    }
    
                }).catch(
                    data => {
                        
                        
                    }
                );
    }

    // const rows: GridRowsProp =  renderYoungLocationAsyncFunction() as any;
    //   debugger;
    

    //   const columns: GridColDef[] = [
    //     { field: 'title', headerName: 'Title', width: 150 },
    //     { field: 'type', headerName: 'Type', width: 150 },
    //     { field: 'priority', headerName: 'Priority', width: 150 },
    //   ];


    return (
        <>
          <Grid md container>
			<Grid item sm={6}  >
				<Grid
					direction="column"
					justifyContent="space-between"
					style={{ padding: 8 }}
				>
				 <TitleCard className='ps-0'>Whereabout Statuses</TitleCard>
				</Grid>
				<Card title="Whereabout Statuses">
					 <div style={{ height: 300, width: '100%' }}>
                          <DataGrid rows={gridData} columns={columns} processRowUpdate={processRowUpdate}
                           onProcessRowUpdateError={handleProcessRowUpdateError}/>
                    </div>
                    
				</Card>
			</Grid>
		</Grid>
        </>
    );
}

export default AdminOrgSettingsScreen;

