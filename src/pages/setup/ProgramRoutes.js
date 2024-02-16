import {Route, Routes} from "react-router-dom";
import Programs from "./Programs";
import ProgramCourses from "./ProgramCourses";

export default function ProgramRoutes(props) {
    return (
        <Routes>
            <Route exact={true} path={"/programs"} element={<Programs/>}/>
            <Route exact={true} path={"/programs/:programId"} element={<ProgramCourses/>}/>
        </Routes>
    )
}