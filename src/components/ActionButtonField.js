import Button from '@mui/material/Button';
import {Box} from "@mui/material";

export default function ActionButtonField(props) {
    return (
        <Box sx={{p: 1}}>
            <Button
                sx={{p: 1, textTransform: "none" }}
                startIcon={props?.startIcon}
                endIcon={props?.endIcon}
                color={props?.color || "primary"}
                variant={"contained"}
                fullWidth size={"small"}
                disabled={props?.disabled || false}
                onClick={() => {
                    if (typeof props?.onClick === "function") {
                        props.onClick()
                    }
                }}
            >
                {props.label}
            </Button>
        </Box>
    );
}