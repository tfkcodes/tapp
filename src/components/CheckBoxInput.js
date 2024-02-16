import {Checkbox} from "@mui/material";

export default function CheckBoxInput(props) {
    return (
        <Checkbox
            sx={{padding: 0}}
            checked={props?.checked}
            onChange={(event) => props?.handleChange(event)}
            inputProps={{'aria-label': 'controlled'}}
        />
    );
}