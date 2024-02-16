import TabLayout from "../../components/TabLayout";
import {TeachingCourseRoutes} from "../../routes/TeachingCourseRoutes";
import HeaderDisplay from "../../components/HeaderDisplay";
import {Box, Grid} from "@mui/material";
import Description from "../../components/Description";
import ActionButtonField from "../../components/ActionButtonField";
import {useParams} from "react-router-dom";

export default function TeachingCourseDetails(props) {
    const {courseId} = useParams();
    
    return (
        <Box>
            <HeaderDisplay
                title={"Course Details"}
                actionButton={false}
            />
            <Grid container spacing={1} sx={{padding: 2}}>
                <Grid item xs={3}><Description label={"Title"} value={""}/></Grid>
                <Grid item xs={9}><Description label={"Description"} value={""}/></Grid>
                <Grid item xs={3}><Description label={"Level"} value={""}/></Grid>
                <Grid item xs={3}><Description label={"Subject"} value={""}/></Grid>
                <Grid item xs={3}><Description label={"Price"} value={""}/></Grid>
                <Grid item xs={1}/>
                <Grid item xs={2}><ActionButtonField label={"Update"}/></Grid>
            </Grid>
            <Box>
                <TabLayout component={TeachingCourseRoutes} route={true}/>
            </Box>
        </Box>
    );
}