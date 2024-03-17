import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import TextInputField from "../../components/TextInputField";
import Form from "../../components/Form";
import AlertBar from "../../components/AlertBar";
import { BASE_URL } from "../../constants";
import { reportErrors } from "../../helpers";
import SelectInputField from "../../components/SelectInputField";
import RadioInputField from "../../components/RadioInputField";

export default function Register(props) {
  const form = useRef();
  const alert = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const fullNameInput = useRef();
  const genderInput = useRef();
  const educationLevelInput = useRef();
  const phoneInput = useRef();
  const confirmPasswordInput = useRef();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [fullName, setFullName] = useState();
  const [gender, setGender] = useState();
  const [educationLevel, setEducationLevel] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [hasSignedIn, setHasSignedIn] = useState(false);

  const [selectedValue, setSelectedValue] = React.useState("Student");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  useEffect(() => {
    localStorage.clear();
  }, []);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const submit = () => {
    let data = {
      name: fullName,
      gender,
      phone,

      level: educationLevel,
      email,
      password,
      scheme: selectedValue,
    };
    if (!isSubmitting && form.current.validate()) {
      if (confirmPassword !== password) {
        alert.current && alert.current.showError("Password does not match.");
        return;
      }
      setIsSubmitting(true);
      alert.current.showProgress("");
      window.axios
        .post(`${BASE_URL}api/authentication/create-account`, data)
        .then((response) => {
          alert.current.hide();
          setIsSubmitting(false);
          alert.current.showSuccess("Created Successfully");
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
    <Navigate to={{ pathname: "/private" }} />
  ) : (
    <Grid item xs={12} container justifyContent="center" alignItems="center">
      <Box
        sx={{
          maxWidth: { xs: 400, lg: 475 },
          margin: { xs: 2.5, md: 3 },
          "& > *": {
            flexGrow: 1,
            flexBasis: "50%",
          },
        }}
      >
        <Box>
          <Grid item>
            <Grid container spacing={0.5}>
              <Grid item xs={12}>
                <Stack sx={{ mb: { xs: -0.5, sm: 0.5 } }} alignItems={"left"}>
                  <Typography variant="h4">Sign up</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <AlertBar ref={alert} />
                <Form ref={form}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Stack direction={"row"}>
                        {/* <RadioInputField
                          label={"Student"}
                          value={"Student"}
                          checked={selectedValue === "Student"}
                          onChange={handleChange}
                        /> */}
                        <RadioInputField
                          label={"Teacher"}
                          value={"Teacher"}
                          checked={selectedValue === "Teacher"}
                          onChange={handleChange}
                        />
                        <RadioInputField
                          label={"School"}
                          value={"School"}
                          checked={selectedValue === "School"}
                          onChange={handleChange}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <TextInputField
                        ref={fullNameInput}
                        required={true}
                        label={
                          selectedValue === "School"
                            ? "School Name"
                            : "Full Name"
                        }
                        onChange={(value) => setFullName(value)}
                      />
                    </Grid>
                    {selectedValue !== "School" && (
                      <Grid item xs={12}>
                        <SelectInputField
                          ref={genderInput}
                          label={"Gender"}
                          required={true}
                          options={[
                            { label: "Male", value: "Male" },
                            { label: "Female", value: "Female" },
                          ]}
                          onChange={(value) => setGender(value)}
                        />
                      </Grid>
                    )}
                    {selectedValue === "Student" && (
                      <Grid item xs={12}>
                        <SelectInputField
                          ref={educationLevelInput}
                          label={"Education Level"}
                          required={true}
                          options={[
                            { label: "Nursery", value: "Nursery" },
                            { label: "Primary", value: "Primary" },
                            { label: "Secondary", value: "Secondary" },
                            { label: "A Level", value: "Advanced" },
                            { label: "Collage / University", value: "Collage" },
                          ]}
                          onChange={(value) => setEducationLevel(value)}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <TextInputField
                        ref={phoneInput}
                        required={true}
                        label={
                          selectedValue === "School" ? "Contact Phone" : "Phone"
                        }
                        onChange={(value) => setPhone(value)}
                      />
                    </Grid>
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
                      <TextInputField
                        ref={confirmPasswordInput}
                        required={true}
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm password"
                        onChange={(value) => setConfirmPassword(value)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowConfirmPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              size="large"
                            >
                              {showConfirmPassword ? (
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
                        Sign up
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider>
                        <Typography variant="caption"> Register </Typography>
                      </Divider>
                    </Grid>
                  </Grid>
                </Form>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Grid>
  );
}
