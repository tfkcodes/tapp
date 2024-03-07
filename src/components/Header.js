import * as React from "react";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Box, Container } from "@mui/material";
import TextInputField from "./TextInputField";
import { useNavigate } from "react-router-dom";
import brand from "../assets/img/250 X 150.png";

function Header(props) {
  const { sections, title } = props;
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ background: "#ffffff", borderBottom: 1, borderColor: "divider" }}
      >
        <Container maxWidth={"xl"}>
          <Toolbar>
            <img src={brand} width={"80"} />
            <Box sx={{ flex: 1 }}>
              <TextInputField
                placeholder={"Search...."}
                endAdornment={<SearchIcon />}
              />
            </Box>
            <Button
              size="small"
              variant={"text"}
              color={"black"}
              onClick={() => navigate("/")}
              nowrap="true"
              sx={{ mr: 1, textTransform: "none" }}
            >
              Home
            </Button>
            <Button
              variant="text"
              size="small"
              color={"success"}
              sx={{ mr: 1 }}
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
      {/*<Toolbar*/}
      {/*    component="nav"*/}
      {/*    variant="dense"*/}
      {/*    sx={{overflowX: 'auto', justifyContent: "center"}}*/}
      {/*>*/}
      {/*    {sections.map((section) => (*/}
      {/*        <Button*/}
      {/*            key={section.title}*/}
      {/*            variant={"h6"}*/}
      {/*            onClick={() => navigate(section.url)} nowrap>*/}
      {/*            {section.title}*/}
      {/*        </Button>*/}
      {/*    ))}*/}
      {/*</Toolbar>*/}
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;
