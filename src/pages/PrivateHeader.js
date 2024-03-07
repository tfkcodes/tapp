import {
  AppBar,
  Container,
  Divider,
  IconButton,
  Menu,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import brand from "../assets/img/250 X 150.png";
import Badge from "@mui/material/Badge";
import { AccountCircle, NotificationsOutlined } from "@mui/icons-material";
import { capitalize } from "../helpers";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PrivateHeader(props) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    navigate("/");
  };

  return (
    <>
      <AppBar
        position="fixed"
        color={"default"}
        elevation={0}
        sx={{ background: "#ffffff", borderBottom: 1, borderColor: "divider" }}
      >
        <Container maxWidth={"xl"}>
          <Toolbar>
            <img src={brand} width={"80"} />
            <Typography
              variant="h7"
              nowrap="true"
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={8} color={"error"}>
                <NotificationsOutlined />
              </Badge>
            </IconButton>
            <Stack
              direction={"row"}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Typography sx={{ p: 1, fontWeight: "bold" }}>
                {capitalize(props?.user?.school?.name || "")}
              </Typography>
              <Typography sx={{ p: 1 }}>
                {capitalize(props?.user?.name || "")}
              </Typography>
            </Stack>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogOut}>Log out</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </>
  );
}
