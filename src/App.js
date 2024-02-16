import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material";
import ErrorBoundary from "./pages/ErrorBoundary";
import Private from "./pages/home/Private";
import Home from "./pages/home/Home";

function App() {
    const theme = createTheme({
        palette: {
            black: {
                main: "#000"
            }
        },
        typography: {
            fontSize: 13
        }
    });
    return (
        <ThemeProvider theme={theme}>
            <ErrorBoundary>
                <Router>
                    <Routes>
                        <Route exact={true} path={"/*"} element={<Home/>}/>
                        {/*<Route exact={true} path={"/"} element={<Authentication/>}/>*/}
                        {/*<Route exact={true} path={"/private/*"} element={<Protected/>}/>*/}
                        <Route exact={true} path={"/private/*"} element={<Private/>}/>
                    </Routes>
                </Router>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
