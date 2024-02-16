import {Stack, Typography} from "@mui/material";

export default function Description(props) {
    return (
        <Stack direction={"row"} spacing={1} sx={{border: 1, borderColor: "divider", padding: 0}}>
            <Typography sx={{
                borderRight: 1,
                borderColor: "divider",
                padding: 1,
                background: "#edf4fb"
            }}>{props?.label}</Typography>
            <Typography sx={{padding: 1}}>{props?.value}</Typography>
        </Stack>
    );
}