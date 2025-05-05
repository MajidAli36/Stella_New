import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function SelectCommon() {
    return ( 
        <>
        <FormControl variant="standard" fullWidth>
<InputLabel id="demo-simple-select-standard-label">Age</InputLabel>
<Select
  labelId="demo-simple-select-standard-label"
  id="demo-simple-select-standard"
  label="Age"
>
  <MenuItem value="">
    <em>None</em>
  </MenuItem>
  <MenuItem value={10}>Ten</MenuItem>
  <MenuItem value={20}>Twenty</MenuItem>
  <MenuItem value={30}>Thirty</MenuItem>
</Select>
</FormControl>
        </>
     );
}

export default SelectCommon;
