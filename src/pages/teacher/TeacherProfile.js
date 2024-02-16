import {Box} from "@mui/material";
import HeaderDisplay from "../../components/HeaderDisplay";

export default function TeacherProfile(props) {
    return (
        <Box>
            <HeaderDisplay
                title={"Profile"}
                actionButton={false}
            />
        </Box>);
}