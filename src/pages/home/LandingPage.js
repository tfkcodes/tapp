import { Box, Grid } from "@mui/material";
import MainFeatureDisplay from "../../components/MainFeatureDisplay";
import Main from "./Main";
import Sidebar from "./Sidebar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import * as React from "react";

const mainFeaturedPost = {
  title: "Welcome to Our School!",
  description:
    "Explore everything our school has to offer. From academics to extracurricular activities, we have it all!",
  image: "https://source.unsplash.com/random?school",
  imageText: "school building",
  linkText: "Discover More",
};

const sidebar = {
  title: "About Us",
  description:
    "Learn more about our school and its rich history of academic excellence and community involvement.",
  Contacts: [
    { title: "Admissions", url: "#" },
    { title: "Academics", url: "#" },
    { title: "Events", url: "#" },
    { title: "Contact Us", url: "#" },
  ],
  social: [
    { name: "Facebook", icon: "FacebookIcon" },
    { name: "Twitter", icon: "TwitterIcon" },
  ],
};

export default function LandingPage(props) {
  return (
    <Box>
      <MainFeatureDisplay post={mainFeaturedPost} />
      <Grid container spacing={5}>
        <Grid item xs={12} md={10}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: "#ffff" }}>
            <Typography
              variant="h6"
              sx={{ borderBottom: 1, borderColor: "divider" }}
              gutterBottom
            >
              Welcome to Our School!
            </Typography>
            <Typography>
              Our school is dedicated to providing students with a comprehensive
              education that fosters intellectual growth, creativity, and social
              responsibility. Explore our website to learn more about our
              academic programs, extracurricular activities, and the vibrant
              community that makes our school special.
            </Typography>
          </Paper>
        </Grid>
        <Sidebar
          title={sidebar.title}
          description={sidebar.description}
          Contacts={sidebar.Contacts}
          social={sidebar.social}
        />
      </Grid>
    </Box>
  );
}
