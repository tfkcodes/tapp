import {Box, Grid, Stack, Typography} from "@mui/material";
import ActionButtonField from "../components/ActionButtonField";
import {useState} from "react";
import SelectInputField from "../components/SelectInputField";

export default function WorkingLocation(props) {
    const [schoolId, setSchoolId] = useState();
    return (
        <Box sx={{border: 1, borderColor: "divider", marginBottom: 1, background: "#f4f4f4"}}>
            <Grid container>
                <Grid item xs={10}>
                    <Stack direction={"row"}>
                        <Typography align={"center"} sx={{p: 1.5}} variant={"h6"}>School Name:</Typography>
                        {schoolId ? <Typography sx={{p: 2, flexGrow: 1}} variant={"h7"}>School Name</Typography> :
                            <SelectInputField options={[]}/>}
                    </Stack>
                </Grid>
                <Grid item xs={1}>
                    <ActionButtonField label={"Change"}/>
                </Grid>
                <Grid item xs={1}>
                    <ActionButtonField label={"Add"} color={"secondary"}/>
                </Grid>
            </Grid>
        </Box>
    );
}