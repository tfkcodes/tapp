import {Route, Routes} from "react-router-dom";
import AssessmentCourse from "./AssessmentCourse";
import Topic from "../setup/Topic";

export default function AssessmentCourseRoute(props) {
    return (
        <Routes>
            <Route exact={true} path={"/course"} element={<AssessmentCourse/>}/>
            <Route exact={true} path={"/course/:courseId"} element={<Topic/>}/>
        </Routes>
    )
}