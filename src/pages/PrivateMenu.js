import {Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {drawerWidth} from "../constants";

export default function PrivateMenu(props) {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <Drawer
            sx={{
                zIndex: 0,
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    position: "relative",
                    minHeight: "90vh",
                    background: "inherit"
                },
                position: "relative",
                width: drawerWidth,
                minHeight: "90vh"
            }}
            variant="permanent"
            anchor="left"
        >
            <List>
                {props?.menu?.map((e) => (
                    <ListItem
                        selected={location.pathname.indexOf(e.route) !== -1}
                        key={e.title} disablePadding
                        onClick={() => navigate(e.route)}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                {e.icon}
                            </ListItemIcon>
                            <ListItemText primary={e.title}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}