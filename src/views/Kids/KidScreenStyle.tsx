import styled from "styled-components";
import { Theme, useTheme } from '@mui/material/styles';
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
export function getStyles(name: string, personName: string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    };
}

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


export const SubtitleCard = styled.div`
overflow: hidden;
white-space: nowrap;
font-size: 0.8rem; 
font-weight: normal; 
color: #888; 
margin-top:10px;

`;

export const radioStyleWrapper = {

    marginBottom: "2px",
    textAlign: 'left',
    width: '100%',
};

export const radioStyleLabel = {
    position: 'relative',
    transform: 'scale(0.75) !important',
    textAlign: 'left',
    marginBottom: '8px',
    fontSize:"14px"
};
  
export enum RiskAssessmentID {
	RISK_SUICIDE = 'RISK_SUICIDE',
	RISK_AGGRESSIVE = 'RISK_AGGRESSIVE',
	RISK_ARSON = 'RISK_ARSON',
	RISK_SELF_NEGLECT = 'RISK_SELF_NEGLECT',
	RISK_IGNORE_MEDICAL = 'RISK_IGNORE_MEDICAL',
	RISK_MENTAL_HEALTH = 'RISK_MENTAL_HEALTH',
	RISK_SUBSTANCE = 'RISK_SUBSTANCE',
	RISK_ABUSE = 'RISK_ABUSE',
	RISK_PHYSICAL = 'RISK_PHYSICAL',
	RISK_BEHAVIOR = 'RISK_BEHAVIOR',
	RISK_HYGIENE = 'RISK_HYGIENE',
	RISK_ENVIRONMENTAL = 'RISK_ENVIRONMENTAL',
	RISK_YOUNG_PERSON = 'RISK_YOUNG_PERSON',
	RISK_OLDER_PERSON = 'RISK_OLDER_PERSON',
	RISK_CHILDREN = 'RISK_CHILDREN',
	RISK_WOMEN = 'RISK_WOMEN',
	RISK_MEN = 'RISK_MEN',
	RISK_FAMILY = 'RISK_FAMILY',
	RISK_REGIONS = 'RISK_REGIONS',
	RISK_RACE = 'RISK_RACE',
	RISK_LGB = 'RISK_LGB',
	RISK_TRANSGENDER = 'RISK_TRANSGENDER',
	RISK_DISABILITIES = 'RISK_DISABILITIES',
	RISK_STAFF = 'RISK_STAFF',
}

export type Question = {
	id: RiskAssessmentID;
	question: string;
	step: number;
};

export const RiskAssessmentQuestions: Question[] = [
	{
		id: RiskAssessmentID.RISK_SUICIDE,
		question: 'Risk of suicide or deliberate self harm',
		step: 1,
	},
	{
		id: RiskAssessmentID.RISK_AGGRESSIVE,
		question: 'Risk of aggressive behaviour/violence',
		step: 1,
	},
	{
		id: RiskAssessmentID.RISK_ARSON,
		question: 'Risk of suicide or deliberate self harm arson',
		step: 1,
	},
	{
		id: RiskAssessmentID.RISK_SELF_NEGLECT,
		question: 'Risk of self neglect or accidental self harm',
		step: 1,
	},
	{
		id: RiskAssessmentID.RISK_IGNORE_MEDICAL,
		question:
			'Risk of non-compliance with professional medical advice/treatment',
		step: 1,
	},
	{
		id: RiskAssessmentID.RISK_MENTAL_HEALTH,
		question: 'Risk due to mental ill health',
		step: 1,
	},
	{
		id: RiskAssessmentID.RISK_SUBSTANCE,
		question: 'Risk due to alcohol or substance misuse',
		step: 1,
	},
	{
		id: RiskAssessmentID.RISK_ABUSE,
		question: 'Risk of abuse by others',
		step: 1,
	},
	{
		id: RiskAssessmentID.RISK_PHYSICAL,
		question: 'Risk due to physical/medical condition',
		step: 1,
	},
	{
		id: RiskAssessmentID.RISK_HYGIENE,
		question: 'Risk to the health of others (for example hygiene risk)',
		step: 1,
	},
	{
		id: RiskAssessmentID.RISK_ENVIRONMENTAL,
		question: 'Risk due to environmental factors',
		step: 1,
	},
	{
		id: RiskAssessmentID.RISK_YOUNG_PERSON,
		question: 'A risk towards Young adults',
		step: 2,
	},
	{
		id: RiskAssessmentID.RISK_OLDER_PERSON,
		question: 'A risk towards Older people',
		step: 2,
	},
	{
		id: RiskAssessmentID.RISK_CHILDREN,
		question: 'A risk towards Children',
		step: 2,
	},
	{
		id: RiskAssessmentID.RISK_WOMEN,
		question: 'A risk towards Women',
		step: 2,
	},
	{
		id: RiskAssessmentID.RISK_MEN,
		question: 'A risk towards Men',
		step: 2,
	},
	{
		id: RiskAssessmentID.RISK_FAMILY,
		question: 'A risk towards Family members',
		step: 2,
	},
	{
		id: RiskAssessmentID.RISK_REGIONS,
		question: 'A risk towards Religious groups',
		step: 2,
	},
	{
		id: RiskAssessmentID.RISK_RACE,
		question:
			'A risk towards Any ethnic or racial groups (please specify in notes section)',
		step: 2,
	},
	{
		id: RiskAssessmentID.RISK_LGB,
		question: 'A risk towards Lesbian, gay or bisexual people',
		step: 2,
	},
	{
		id: RiskAssessmentID.RISK_TRANSGENDER,
		question: 'A risk towards Transgendered people',
		step: 2,
	},
	{
		id: RiskAssessmentID.RISK_DISABILITIES,
		question: 'A risk towards People with disabilities',
		step: 2,
	},
	{
		id: RiskAssessmentID.RISK_STAFF,
		question: 'A risk towards Staff',
		step: 2,
	},
];
