import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Theme, useTheme } from '@mui/material/styles';

const Constants = {

    HEADER_MAX_HEIGHT: 200,
    OTHER_THINGS: 'whatever',
    //7155 8082
    //


    Api_Url: "https://stellabackend.onrender.com/api/",
    Kid_Avatar:"https://stellabackend.onrender.com/KidAvatar/",
    House_Files: "https://stellabackend.onrender.com/HouseFile/",
    Template_Files: "https://stellabackend.onrender.com/Template/",


    // Api_Url: "https://localhost:44351/api/",
    // Kid_Avatar: "https://localhost:44351/KidAvatar/",
    // House_Files: "https://localhost:44351/HouseFile/", 
    // Template_Files: "https://localhost:44351/Template/",

   
}
export default Constants

function getStyles(name: string, personName: string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export const GetLogColor = (type: string) => {
    if (type == "Activity") {
        return "success";
    }
    else if (type == "Incident") {
        return "warning";
    }
    else if (type == "Coaching Session") {
        return "success";
    } else if (type == "Spin Session") {
        return "secondary";
    } else if (type == "Note") {
        return "success";
    } else if (type == "Risk Assessment") {
        return "error";
    }
    else {
        return "info";
    }
}
export const TrmText: React.FC<{ level: number }> = (props) => {
    let copy: string = '';

    if (props.level === 1) {
        copy = `FABRIC Kid may be demonstrating challenging behaviours and may have a poor sleep pattern. There may be issues around their relationships with their peers and others professionals. They may have a poor diet and irregular meal times. Work with FABRIC Kid to bring consistency and encourage them to spend more time caring for themselves. Promote importance of a stable home, routine, boundaries and engagement in support. Establish & use anchor points to promote this.`;
    } else if (props.level === 1.5) {
        copy = `FABRIC Kid has begun to make small changes around their presentation and are beginning to engage in some support. They have spoken about their intention to engage in support and have begun to talk about their behaviours. Kids will begin to talk with ‘change’ language and may talk about certain things such as the future if this wasn’t a barrier. They are getting ready and considering their lives without barriers, we need to spot this and encourage.`;
    } else if (props.level === 2) {
        copy = `FABRIC Kid has begun to engage more frequently in support around the house and is seems open to making relationships with 1 or 2 selected team members. Routines and sleep patterns may have improved a little and the FABRIC Kid may be smiling more. It is important that you maintain consistent boundaries to ensure a trusting relationship and so a stable secure base can be developed with adults. However still expect some outbursts & the need for ongoing support, particularly with peer relationships.`;
    } else if (props.level === 2.5) {
        copy = `FABRIC Kid is progressing well and there are more conversations around their trauma or early life. FABRIC Kids may begin to seek advice or information around other services that can support regarding trauma. They may begin to ask more specific questions or talk in more detail. Be prepared to do lots of listening. Don’t rush to ‘fix’ things or offer quick advice. Lean in, listen hard & empathise. Record verbatim what Fabric Kids share and consult with Home manager re any possible safeguarding referrals needed.`;
    } else if (props.level === 3 || props.level === 3.5) {
        copy = `FABRIC Kid engaging in support sessions in FABRIC Home. They may have or should consider external support with specialised bereavement or specialist therapeutic professionals.  FABRIC Kid begins to process past experiences and may choose to honour these; e.g. by marking key anniversaries. FABRIC Kid susceptible to drop down to lower levels post disclosure due to stress and being in new territory. This drop should never be considered a rejection or failed attempt at support; rather it should be seen and treated as a ‘blip’ or ‘hiccup’. Ensure if the Fabric Kid slips down to a previous level that all staff know and the support offered matches the new lower level. Things will probably improve again quickly.`;
    } else if (props.level === 4 || props.level === 4.5) {
        copy = `Increased insight into behaviours and ability to regulate emotions much improved. Conversations may refer back to how things used to be for them as a contrast to how they are now. Ability to participate in other types of support such as behaviour specific interventions (e.g. anger management and or consequential thinking) or things like restorative approaches or CBT.`;
    } else if (props.level === 5 || props.level === 5.5) {
        copy = `FABRIC Kid feels sense of achievement and begins to take part in structuring goals and things to do during free time. FABRIC Kid begins to look at employment, education and training opportunities and may need support to access these. Support begins to feel more as and when needed and is aimed at supporting decision making process. FABRIC Kid accepts their potential and abilities, but may need help if things go a bit wrong or they get wobbly due to a lack of confidence – remember: this is new territory! Notice and help Fabric Kids to identify and celebrate the small (or big!) wins they achieve.`;
    } else if (props.level === 6) {
        copy = `FABRIC Kid achieving their goals with confidence and with limited support while understanding that support will be there for times of need. Let them know how to ask for help or how to check back in with you if they need to. Emphasise that you want to know about their achievements as well as being available to call on if they need support.`;
    } else {
        copy =
            "The Trauma Recovery Model is a road map to help professionals care for and guide troubled people towards recovery. It's a composite model; combing theories of child development, attachment and neuroscience with hands on practitioner skills. It provides practical guidelines for knowing which interventions to use and when. This means practitioners understand the psychological needs that underpin behaviours and can identify the types of interventions that best address those needs. Working in the TRM way puts relationship building and therapeutic interaction first, mediating the impact of trauma. This paves the way for interventions that are tailored and sequenced in a way that really can make a difference. When selecting the TRM Level please refer to your training and the model itself. Remember the TRM is not a static or fixed model and levels will vary depending on what is occurring in a young persons life.";
    }

    return (
        <Box style={{ marginTop: '12px' }}>
            <Typography variant="h4" style={{ marginBottom: '8px' }}>
                TRM Level Description:{' '}
            </Typography>
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                {copy}
            </Typography>
        </Box>
    );
};

export const contactedOptions = [
    { value: 'On-call Member', copy: 'On-call Member' },
    { value: 'EDT', copy: 'EDT' },
    { value: 'NHS Direct', copy: 'NHS Direct' },
    { value: 'Social Worker or YPA', copy: 'Social Worker or YPA' },
    { value: '101', copy: '101 (Non-emergency police)' },
    { value: 'GP', copy: 'GP' },
    { value: 'Crisis team', copy: 'Crisis team' },
    { value: 'Other', copy: 'Other (Please state in Note)' },
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
export const incidentCategoryOption = [

    {
        value: 'Physical Aggression',
        copy: 'Physical Aggression',
    },
    {
        value: 'Medication/ Overdose',
        copy: 'Medication/ Overdose',
    },
    {
        value: 'Absconding',
        copy: 'Absconding',
    },
    {
        value: 'Safeguarding',
        copy: 'Safeguarding',
    },
    {
        value: 'Verbal Aggression',
        copy: 'Verbal Aggression',
    },
    {
        value: 'Property Damage',
        copy: 'Property Damage',
    },
    {
        value: 'Suicidal Thoughts',
        copy: 'Suicidal Thoughts',
    },
    {
        value: 'Self-harm',
        copy: 'Self-harm',
    },
    {
        value: 'Well-being concerns',
        copy: 'Well-being concerns',
    },
    {
        value: 'Accident / injury',
        copy: 'Accident / injury',
    },
    {
        value: 'Low mood',
        copy: 'Low mood',
    },
    {
        value: 'Friends/ family',
        copy: 'Friends/ family',
    },
    {
        value: 'Other',
        copy: 'Other (Please state in Note)',
    },

];
export const contactType = [

    {
        value: 'Email',
        copy: 'Email',
    },
    {
        value: 'Phone',
        copy: 'Phone',
    },
    {
        value: 'In Person Visit',
        copy: 'In Person Visit',
    },
    {
        value: 'Letter',
        copy: 'Letter',
    },
    {
        value: 'Text Message',
        copy: 'Text Message',
    },
    {
        value: 'Other',
        copy: 'Other (Please state in Note)',
    },

];
export const FileType = [
    {
        value: 'ASSESSMENT_OUTCOME',
        copy: 'Assessment Outcome',
    },
    {
        value: 'ASSESSMENT_UPDATES',
        copy: 'Assessment Updates',
    },
    {
        value: 'CHECKLIST',
        copy: 'Checklist',
    },
    {
        value: 'CRF',
        copy: 'Crf',
    },
    {
        value: 'INITIAL_ASSESSMENT',
        copy: 'Initial Assessment',
    },
    {
        value: 'KEY_CONSENT_FORM',
        copy: 'Key Consent Form',
    },
    {
        value: 'LICENCE_AGREEMENT',
        copy: 'License Agreement',
    },
    {
        value: 'MEDICAL_FORM',
        copy: 'Medical Form',
    },
    {
        value: 'OTHER',
        copy: 'Other',
    },
    {
        value: 'PHOTO_CONSENT_FORM',
        copy: 'Photo Consent Form',
    },
    {
        value: 'RISK_ASSESSMENT',
        copy: 'Risk Assessment',
    },
    {
        value: 'SAFETY_MOVE_IN',
        copy: 'Safety Move In',
    },
    {
        value: 'SHARING_INFO_CONSENT_FORM',
        copy: 'Sharing Info Consent form',
    },

    {
        value: 'WRITTEN_AGREEMENT',
        copy: 'Written Agreement',
    },

];

export enum TaskGroup {
    MoveIn = 'MOVE_IN',
    MoveOut = 'MOVE_OUT',
    PreMoveIn = 'PRE_MOVE_IN',
}

export enum YoungPersonStatus {
    Declined = 'DECLINED',
    InHome = 'IN_HOME',
    MovedOut = 'MOVED_OUT',
    MovingOut = 'MOVING_OUT',
    New = 'NEW',
}


export const coachingSessionCategories: CoachingSessionCategory[] = [
    {
        label: 'Travel Training',
        subCategories: [
            'Bus/Train timetables',
            'Getting on public transport',
            'Road safety',
            'Crossing the road',
            'Cycling',
            'Planning routes ',
        ],
    },
    {
        label: 'Appointments',
        subCategories: [
            'Booking appointments (Doctors, dentist, eyes, hair etc.)',
            'Planning how to get there',
            'Scripting what to say/role play',
            'Taking notes',
            'Keeping a diary',
        ],
    },
    {
        label: 'Domestic Living skills',
        subCategories: [
            'Washing clothing',
            'Drying clothing',
            'Changing plugs',
            'Changing lights',
            'Recycling',
            'Boiler, heating electrics',
            'Fridge hygiene',
            'Washing dishes',
            'Cooking & Food dates',
            'Defrosting freezer',
        ],
    },
    {
        label: 'Day to Day',
        subCategories: [
            'Paying bills',
            'Budgeting',
            'Setting up a bank account/ online',
            'Banking',
            'Sending/ receiving parcels',
            'Using PayPal',
            'Healthy Relationships',
            'Communication',
        ],
    },
    {
        label: 'Employability',
        subCategories: [
            'Interview skills',
            'Application forms',
            'Creating a CV/cover letter Job searching',
            'Time keeping',
            'Time sheets Understanding payslips',
            'Understanding a rota',
            'Careers wales',
        ],
    },
    {
        label: 'Health & Wellbeing',
        subCategories: [
            'Personal hygiene',
            'Medication',
            'Sexual health',
            'Nutrition/diet',
            'Sleeping',
            'Eating disorders',
            'Mental health',
            'Age perception',
            'About me files',
        ],
    },
    {
        label: 'Online Safety',
        subCategories: [
            'Information Safety',
            'Social media',
            'Images',
            'Secure passwords',
            'Blocking',
            'Meeting people',
            'Stranger danger',
        ],
    },
    {
        label: 'Driving theory',
        subCategories: [
            'Driving theory',
            'Revision',
            'Generic reading, writing and speaking',
            'Speech therapy',
            'Homework',
            'College/university applications',
            'Libraries',
        ],
    },
    {
        label: 'Other',
        subCategories: [],
    },
];

export function sentanceCase(text: string) {
    var sentence = text.toLowerCase().split(" ");
    for (var i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }

    return sentence;
}

export enum RepeatOption {
	Daily = 'DAILY',
	Monthly = 'MONTHLY',
	Quarterly = 'QUARTERLY',
	Weekly = 'WEEKLY',
	Yearly = 'YEARLY',
}

export const repeatOptions=[
    {
        value: "None",
        copy: 'None',
    },
    {
        value: RepeatOption.Daily,
        copy: 'Daily',
    },
    {
        value: RepeatOption.Weekly,
        copy: 'Weekly',
    },
    {
        value: RepeatOption.Monthly,
        copy: 'Monthly',
    },
    {
        value: RepeatOption.Yearly,
        copy: 'Yearly',
    },
];
//Move IN task //Move out Task ./Pre Move in