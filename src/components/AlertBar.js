import React from "react";
import {Alert, CircularProgress, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";

export default class AlertBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            shown: false,
            message: "",
            classes: "",
        };

        this.timeOut = React.createRef();
        this.element = React.createRef();
    }

    _show(message, classes) {
        if (!this._isValidMessage(message)) {
            message = "Something went wrong.";
        }

        this.setState({
            shown: true,
            message,
            classes
        }, () => {
            if (classes !== "progress") {
                this.timeOut = window.setTimeout(() => {
                    this.hide();
                }, 10000);
            }
        });
    }

    showProgress(message) {
        message = message || "Loading...";
        this._show(message, "progress");
    }

    showWarning(message) {
        this._show(message, "warning");
    }

    showError(message) {
        this._show(message, "error");
    }

    showSuccess(message) {
        this._show(message, "success");
    }

    hide() {
        this.setState({
            shown: false,
            classes: "",
        });
    }

    _isValidMessage(message) {
        if (typeof message === "object") {
            if (Array.isArray(message)) {
                return !!message.find(e => e.type !== undefined);
            }
            return message.hasOwnProperty("type");
        }
        return true;
    }

    componentWillUnmount() {
        if (this.timeOut) {
            window.clearTimeout(this.timeOut);
        }
    }

    render() {
        if (!this.state.shown) return null;
        return (
            <Box sx={{p: 1}} ref={ref => this.element = ref}>
                {this.state.classes !== "progress" ?
                    <Alert severity={this.state.classes} onClose={() => this.hide()}>
                        <Typography>{this.state.message}</Typography>
                    </Alert> :
                    <Alert severity={"info"} icon={false} onClose={() => this.hide()}>
                        <Stack direction={"row"}>
                            <CircularProgress/>
                            <Typography sx={{flexGrow: 1, p: 1}}>{this.state.message}</Typography>
                        </Stack>
                    </Alert>
                }
            </Box>
        );
    }
}