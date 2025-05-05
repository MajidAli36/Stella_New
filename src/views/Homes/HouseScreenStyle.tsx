import styled from "styled-components";
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
font-size: 1rem;
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
font-size: 18px;
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
background-color: #2a0560;
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
background-color: ${(props: { color?: string }) => props.color != "" ? props.color : "rgb(189, 189, 189)"};
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
export const SubtitleCard = styled.div`
overflow: hidden;
white-space: nowrap;
font-size: 0.8rem; 
font-weight: normal; 
color: #888; 
margin-top:10px;

`;