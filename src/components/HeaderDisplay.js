import {Box, Typography} from "@mui/material";
import {AddOutlined} from "@mui/icons-material";
import ActionButtonField from "./ActionButtonField";

export default function HeaderDisplay(props) {
    return (
        <Box sx={{display: "flex", borderBottom: 1, borderColor: "divider"}}>
            <Typography variant={"h6"} sx={{padding: 1, flexGrow: 1}}>{props?.title}</Typography>
            {props.actionButton && <ActionButtonField
                startIcon={props?.startIcon || <AddOutlined/>}
                color={"primary"}
                label={props?.label}
                onClick={() => {
                    if (props.onClick && typeof props.onClick === "function") {
                        props.onClick();
                    }
                }}
            />}
        </Box>
    );
}