import {Route, Routes} from "react-router-dom";
import QuizConfiguration from "./QuizConfiguration";
import Questions from "./Questions";

export default function QuizAssessmentRoute(props) {
    return (
        <Routes>
            <Route exact={true} path={"/test-quiz"} element={<QuizConfiguration/>}/>
            <Route exact={true} path={"/test-quiz/:quizId"} element={<Questions/>}/>
        </Routes>
    )
}