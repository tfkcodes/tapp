import React from "react";
import {FormHelperText, OutlinedInput, Stack, Typography} from "@mui/material";

export default class TextInputField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: undefined,
            inValid: false
        }
        this.input = React.createRef();
    }

    componentDidMount() {
        this.setState({value: this.props.defaultValue || this.props.value});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.defaultValue !== this.props.defaultValue) {
            this.setState({value: this.props.defaultValue});
        }
    }

    getInput() {
        return this.input;
    }

    getValue() {
        return this.state.value;
    }

    _onChange(input, validate = true) {
        if (this.props.onChange) {
            this.props.onChange(input.value);
        }

        this.setState({value: input.value}, () => {
            if (validate && !input.value) {
                this.setState({inValid: true});
            } else {
                this.setState({inValid: false});
            }
        });
    }

    validate() {
        if (!this.state.value) {
            this.setState({inValid: true});
            return false;
        } else {
            this.setState({inValid: false});
            return true;
        }
    }

    render() {
        return (
            <Stack direction={this.props.direction} spacing={0}
                   sx={{p: this.props.label ? 0.25 : 1}}
                   justifyContent={this.props.direction ? "space-between" : null}
                   alignItems={this.props.direction ? "center" : "flex-start"}
            >
                {this.props.label &&
                    <Typography
                        sx={{p: (this.props.direction === "row" ? 1 : 0.5)}}
                        variant={"subtitle1"}
                        component={"h2"}
                    >
                        {this.props.label}{this.props?.required ? <sup style={{color: "red"}}>*</sup> : null}
                    </Typography>}
                <OutlinedInput
                    sx={{flexGrow: 1}}
                    disabled={this.props.disabled}
                    error={(this.state.inValid && this.props.required) ? true : false}
                    ref={ref => this.input = ref}
                    required={this.props.required}
                    type={this.props.type || "text"}
                    placeholder={this.props.placeholder}
                    value={this.state.value}
                    onChange={(event) => {
                        this._onChange(event.target);
                    }}
                    size="small"
                    endAdornment={this.props.endAdornment}
                    fullWidth={this.props.direction ? this.props.fullWidth : true}
                    multiline={this.props.multiline}
                />
                {this.state.inValid && this.props.required && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                        {this.props.errorMessage || "This field is required"}
                    </FormHelperText>
                )}
            </Stack>
        );
    }
}