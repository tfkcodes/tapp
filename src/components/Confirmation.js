import * as React from 'react';
import Button from '@mui/material/Button';
import {Grid, Box, Stack, Typography} from "@mui/material";

export default function Confirmation(props) {
    return (
        <Box>
            <Stack justifyContent="center" alignContent="center">
                <Typography variant="subtitle1" sx={{p: 2}}>{props.message}</Typography>
                <Stack alignItems={"center"} alignContent={"center"} sx={{flexGrow: 1}}>
                    <Stack direction={"row"} spacing={1}>
                        <Button
                            color={"error"}
                            variant="outlined"
                            onClick={() => {
                                if (props?.handleClose && typeof props?.handleClose === "function") {
                                    props.handleClose()
                                }
                            }}>
                            Cancel
                        </Button>
                        <Button
                            variant="outlined"
                            color={"success"}
                            onClick={() => {
                                if (props?.handleOk && typeof props?.handleOk === "function") {
                                    props.handleOk()
                                }
                            }}>
                            ok
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
}