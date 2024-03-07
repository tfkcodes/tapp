import {
  AppBar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  AddBoxOutlined,
  CalendarMonthOutlined,
  MoneyOutlined,
  PeopleOutlined,
  Person,
  QuizOutlined,
  SettingsOutlined,
  TimelapseOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { capitalize } from "../helpers";

const drawerWidth = 240;

export default function Layout({ children, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const menu = [
    {
      title: "Admission",
      icon: <AddBoxOutlined color={"secondary"} />,
      route: "/private/admission",
    },
    {
      title: "Students",
      icon: <Person color={"secondary"} />,
      route: "/private/students",
    },
    {
      title: "Time Table",
      icon: <CalendarMonthOutlined color={"secondary"} />,
      route: "/private/time-table",
    },
    {
      title: "Attendance",
      icon: <TimelapseOutlined color={"secondary"} />,
      route: "/private/attendance",
    },
    {
      title: "Fees",
      icon: <MoneyOutlined color={"secondary"} />,
      route: "/private/fees",
    },
    {
      title: "Assessment",
      icon: <QuizOutlined color={"secondary"} />,
      route: "/private/assessment",
    },

    {
      title: "Employee",
      icon: <PeopleOutlined color={"secondary"} />,
      route: "/private/employee",
    },
    {
      title: "Library Management",
      icon: <PeopleOutlined color={"secondary"} />,
      route: "/private/library",
    },
    {
      title: "Configuration",
      icon: <SettingsOutlined color={"secondary"} />,
      route: "/private/configuration",
    },
  ];
  return (
    <Box sx={{ display: "flex", background: "#f9f9f9" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          background: "secondary",
        }}
        elevation={0}
      >
        <Toolbar>
          <Typography
            variant="h7"
            nowrap="true"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <Typography variant="h7" nowrap="true" component="div">
            {capitalize(user?.name || "")}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Typography variant={"h5"} align={"center"} sx={{ padding: "16px" }}>
          {user?.company}
        </Typography>
        <Divider />
        <List>
          {menu.map((e) => (
            <ListItem
              selected={location.pathname.indexOf(e.route) !== -1}
              key={e.title}
              disablePadding
              onClick={() => navigate(e.route)}
            >
              <ListItemButton>
                <ListItemIcon>{e.icon}</ListItemIcon>
                <ListItemText primary={e.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 2 }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
