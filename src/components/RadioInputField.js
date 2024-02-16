import {Radio, Stack, Typography} from "@mui/material";
import React from "react";

export default function RadioInputField(props) {
    return (
        <Stack direction={"row"}>
            <Radio
                checked={props.checked || false}
                onChange={props.onChange}
                value={props?.value}
                name="radio-buttons"
                inputProps={{'aria-label': 'A'}}
            />
            <Typography sx={{p: 1}}>{props?.label}</Typography>
        </Stack>
    );
}