import {Route, Routes} from "react-router-dom";
import Topic from "./Topic";
import Course from "./Course";

export default function CourseRoute(props) {
    return (
        <Routes>
            <Route exact={true} path={"/courses"} element={<Course/>}/>
            <Route exact={true} path={"/courses/:courseId"} element={<Topic/>}/>
        </Routes>
    )
}