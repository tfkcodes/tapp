import {Box, Grid} from "@mui/material";
import MainFeatureDisplay from "../../components/MainFeatureDisplay";
import Main from "./Main";
import Sidebar from "./Sidebar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import * as React from "react";

const mainFeaturedPost = {
    title: 'Title of a longer featured blog post',
    description:
        "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
    image: 'https://source.unsplash.com/random?wallpapers',
    imageText: 'main image description',
    linkText: 'Continue reading…',
};

const sidebar = {
    title: 'About',
    description:
        'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
    Contacts: [
        {title: 'March 2020', url: '#'},
        {title: 'February 2020', url: '#'},
        {title: 'January 2020', url: '#'},
        {title: 'November 1999', url: '#'},
    ],
    social: [
        {name: 'GitHub', icon: "GitHubIcon"},
        {name: 'Facebook', icon: "FacebookIcon"},
    ],
};

export default function LandingPage(props) {
    return (<Box>
        <MainFeatureDisplay post={mainFeaturedPost}/>
        <Grid container spacing={5}>
            <Grid item xs={12} md={10}>
                <Paper elevation={0} sx={{p: 2, bgcolor: '#ffff'}}>
                    <Typography variant="h6" sx={{borderBottom: 1, borderColor: "divider"}} gutterBottom>
                        About
                    </Typography>
                    <Typography>
                        Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet
                        fermentum. Aenean lacinia bibendum nulla sed consectetur.
                        Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet
                        fermentum. Aenean lacinia bibendum nulla sed consectetur.
                        Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet
                        fermentum. Aenean lacinia bibendum nulla sed consectetur.
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
    </Box>);
}