import React from 'react';
import {
    Box,
    Button,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';


type AddAnotherButtonProps = {
    disabled?: boolean;
    onClick: () => void;
};

const AddAnotherButton: React.FC<AddAnotherButtonProps> = (props) => {

    return (
        <Box style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: 10
        }}>
            <Button
                 color="inherit"
                startIcon={<PersonAddIcon />}
                onClick={props.onClick}
                disabled={props.disabled}
            >
                Add Another
            </Button>
        </Box>
    );
};

export default AddAnotherButton;
