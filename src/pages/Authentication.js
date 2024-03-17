import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import TextInputField from "../components/TextInputField";
import Form from "../components/Form";
import AlertBar from "../components/AlertBar";
import { BASE_URL } from "../constants";
import { reportErrors } from "../helpers";
import logo from "../assets/img/TAP LOGO.svg";

export default function Authentication(props) {
  const form = useRef();
  const alert = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [hasSignedIn, setHasSignedIn] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const submit = () => {
    let data = {
      email,
      password,
    };
    if (!isSubmitting && form.current.validate()) {
      setIsSubmitting(true);
      alert.current.showProgress("");
      window.axios
        .post(`${BASE_URL}api/auth/sign-in`, data)
        .then((response) => {
          alert.current.hide();
          setIsSubmitting(false);
          alert.current.showSuccess("Login Successfully");
          localStorage.clear();
          const user = response.data;
          localStorage.setItem("system_token", user.access_token);

          setTimeout(() => {
            setHasSignedIn(true);
          }, 2000);
        })
        .catch((error) => {
          setIsSubmitting(false);
          reportErrors(alert.current, error);
        });
    }
  };

  return hasSignedIn ? (
    <Navigate to={{ pathname: "/private/students" }} />
  ) : (
    <Box
      sx={{ minHeight: "100vh" }}
      style={{
        background: "#f4f7ff",
        backgroundSize: "cover",
      }}
    >
      <Grid
        item
        xs={12}
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: { xs: "calc(100vh - 134px)", md: "calc(100vh - 112px)" },
        }}
      >
        <Card
          elevation={1}
          sx={{
            maxWidth: { xs: 400, lg: 475 },
            margin: { xs: 2.5, md: 3 },
            "& > *": {
              flexGrow: 1,
              flexBasis: "50%",
            },
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Stack alignItems={"center"}>
                    <Avatar src={logo} sx={{ width: 120, height: 120 }} />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <AlertBar ref={alert} />
                  <Form ref={form}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextInputField
                          ref={emailRef}
                          required={true}
                          type="email"
                          label="Email Address"
                          onChange={(value) => setEmail(value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextInputField
                          ref={passwordRef}
                          required={true}
                          type={showPassword ? "text" : "password"}
                          label="Enter password"
                          onChange={(value) => setPassword(value)}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                size="large"
                              >
                                {showPassword ? (
                                  <VisibilityOffIcon />
                                ) : (
                                  <RemoveRedEyeIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          disableElevation
                          disabled={isSubmitting}
                          fullWidth
                          size="large"
                          variant="contained"
                          color="primary"
                          onClick={() => submit()}
                        >
                          Sign in
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider>
                          <Typography variant="caption"> Login </Typography>
                        </Divider>
                      </Grid>
                    </Grid>
                  </Form>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Grid>
    </Box>
  );
}
