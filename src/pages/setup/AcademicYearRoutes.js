import {Route, Routes} from "react-router-dom";
import AcademicYear from "./AcademicYear";
import AcademicTerm from "./AcademicTerm";

export default function AcademicYearRoutes(props) {
    return (
        <Routes>
            <Route exact={true} path={"/academic-year"} element={<AcademicYear/>}/>
            <Route exact={true} path={"/academic-year/:id"} element={<AcademicTerm/>}/>
        </Routes>
    )
}