import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {Person2Outlined, SearchOutlined} from "@mui/icons-material";
import TextInputField from "../components/TextInputField";

export default function Header(props) {
    return (<AppBar
        position={"fixed"}
        sx={{
            background: "#ffffff",
            borderBottom: "divider"
        }}
    >
        <Container maxWidth={"xl"}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    aria-label="menu"
                    sx={{mr: 2}}
                >
                    <MenuIcon/>
                </IconButton>
                <Box sx={{flexGrow: 1}}>
                    <TextInputField
                        placeholder={"Search...."}
                        endAdornment={<SearchOutlined/>}
                    />
                </Box>
                <Box sx={{display: "flex"}}>
                    <IconButton
                        size="large"
                        edge="start"
                        aria-label="menu"
                        sx={{ml: 2}}
                    >
                        <Person2Outlined/>
                    </IconButton>
                </Box>
            </Toolbar>
        </Container>
    </AppBar>);
}