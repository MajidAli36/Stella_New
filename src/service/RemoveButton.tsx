import React from 'react';
import {
    Box,
    Button,
} from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';


type RemoveButtonProps = {
    disabled?: boolean;
    onClick: () => void;
};

const RemoveButton: React.FC<RemoveButtonProps> = (props) => {

    return (
        <Box style={{
            display: 'flex',
            alignItems: 'flex-end',
            marginBottom: 10
        }}>
            <Button
                 color="inherit"
                startIcon={<PersonRemoveIcon />}
                onClick={props.onClick}
                disabled={props.disabled}
            >
                Remove
            </Button>
        </Box>
    );
};

export default RemoveButton;
