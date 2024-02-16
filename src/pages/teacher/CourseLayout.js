import {Box, Grid} from "@mui/material";
import HeaderDisplay from "../../components/HeaderDisplay";

export default function CourseLayout(props) {
    return (
        <Box>
            <HeaderDisplay
                title={"Course Details"}
                actionButton={false}
            />
            <Grid container spacing={1} sx={{padding: 2}}>
                <Grid item xs={3}>Name</Grid>
                <Grid item xs={3}>Name</Grid>
                <Grid item xs={3}>Name</Grid>
                <Grid item xs={3}>Name</Grid>
            </Grid>
            <Box>
                {props.children}
            </Box>
        </Box>
    );
}