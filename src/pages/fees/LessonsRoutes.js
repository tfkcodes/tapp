import {Route, Routes} from "react-router-dom";
import AssessmentTopics from "./AssessmentTopics";
import AssessmentTopicDetails from "./AssessmentTopicDetails";

export default function LessonsRoutes(props) {
    return (
        <Routes>
            <Route exact={true} path={"/topics"} element={<AssessmentTopics/>}/>
            <Route exact={true} path={"/topics/:topicId"} element={<AssessmentTopicDetails/>}/>
        </Routes>
    )
}