import React, {Component} from "react";
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import {Card, Divider, IconButton, Stack} from "@mui/material";
import {Close} from "@mui/icons-material";
import Box from "@mui/material/Box";

const style = {
    position: 'absolute',
    top: "50%",
    left: "50%",
    transform: 'translate(-50%, -50%)',
    width: "60%",
    bgcolor: 'background.paper',
    border: '1px solid #d4d4d4',
    boxShadow: 24,
    p: 1,
};

export default class ModalPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shown: false,
            pageYOffset: 0,
            title: "",
            component: null,
            size: "modal",
            style: {
                position: 'absolute',
                top: "40%",
                left: "50%",
                transform: 'translate(-50%, -50%)',
                width: "60%",
                bgcolor: 'background.paper',
                border: '1px solid #d4d4d4',
                boxShadow: 24,
                overflow: "visible",
                p: 1,
            }
        };
    }

    show(title, component, size, pageYOffset) {
        this.setState({
            shown: true,
            title,
            component,
            pageYOffset,
            style: {...this.state.style, width: size ? size : "80%"}
        });
    }

    hide() {
        this.setState({
            shown: false
        });
    }

    render() {
        if (!this.state.shown) return null;
        return (
            <Box>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={this.state.shown}
                    closeAfterTransition
                    slots={{backdrop: Backdrop}}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={this.state.shown}>
                        <Box sx={{p: 1}}>
                            <Card elevated={0} sx={this.state.style}>
                                <Stack spacing={0}>
                                    <Stack
                                        sx={{background: "#f4f4f4", border: 1, borderColor: "divider", p: 1}}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="baseline">
                                        <Typography variant="h6">{this.state.title}</Typography>
                                        <IconButton aria-label="close" onClick={() => this.hide()}>
                                            <Close/>
                                        </IconButton>
                                    </Stack>
                                    <Divider/>
                                    <Box sx={{
                                        border: 1,
                                        borderColor: "divider",
                                        p: 2,
                                    }}>{this.state.component}</Box>
                                </Stack>
                            </Card>
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        );
    }
}