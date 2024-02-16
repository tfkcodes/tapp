import {
    Box,
    Container, Typography,
} from "@mui/material";
import * as React from "react";
import {
    DoubleArrowOutlined,
} from "@mui/icons-material";
import PrivateHeader from "./PrivateHeader";
import PrivateMenu from "./PrivateMenu";

export default function OtherLayout(props) {
    const menu = [
        ...(props.user?.scheme === "School" ? [
            {
                title: "Students",
                icon: <DoubleArrowOutlined/>,
                route: "/private/students"
            },
            {
                title: "Fees",
                icon: <DoubleArrowOutlined/>,
                route: "/private/fees"
            },
            {
                title: "Notification",
                icon: <DoubleArrowOutlined/>,
                route: "/private/notification"
            },
            {
                title: "Assessment",
                icon: <DoubleArrowOutlined/>,
                route: "/private/assessment"
            },
            {
                title: "Employee",
                icon: <DoubleArrowOutlined/>,
                route: "/private/employee"
            },
            {
                title: "Settings",
                icon: <DoubleArrowOutlined/>,
                route: "/private/configuration"
            },
        ] : [
            {
                title: "Courses",
                icon: <DoubleArrowOutlined/>,
                route: "/private/courses"
            },
            {
                title: "Payments",
                icon: <DoubleArrowOutlined/>,
                route: "/private/payments"
            },
            {
                title: "Profile",
                icon: <DoubleArrowOutlined/>,
                route: "/private/settings"
            },
        ]),
    ];

    return (
        <Box sx={{background: "#f6f7f7"}}>
            <Container maxWidth={"xl"}>
                <PrivateHeader user={props?.user}/>
                <Box sx={{display: "flex"}}>
                    <PrivateMenu menu={menu}/>
                    <Box sx={{flexGrow: 1, padding: 1}}>
                        {props?.children}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}