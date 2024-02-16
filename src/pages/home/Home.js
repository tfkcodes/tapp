import HomeLayout from "./HomeLayout";
import {Route, Routes} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import LandingPage from "./LandingPage";

export default function Home(props) {
    return (
        <HomeLayout>
            <Routes>
                <Route exact={true} path={"/"} element={<LandingPage/>}/>
                <Route exact={true} path={"/login"} element={<Login/>}/>
                <Route exact={true} path={"/signup"} element={<Register/>}/>
            </Routes>
        </HomeLayout>
    );
}