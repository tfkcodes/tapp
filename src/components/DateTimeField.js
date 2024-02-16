import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import "./css/date-picker.scss";
import {Box, Stack, Typography} from "@mui/material";

export default class DateTimeField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFocused: false,
            value: props.value,
            error: undefined,
        };

        this.input = React.createRef();
    }

    _getContainerClassName() {
        let className = "input-group";

        if (this.state.isFocused) {
            className += " is-focused";
        }

        if (this.props.block) {
            className += " block";
        }

        if (this.props.direction === "horizontal") {
            className += " horizontal";
        }

        if (this.state.error) {
            className += " has-error";
        }

        if (this.props.className) {
            className += ` ${this.props.className}`;
        }

        return className;
    }

    _onChange(value, validate = true) {
        if (this.props.onChange && typeof this.props.onChange === "function") {
            this.props.onChange(value);
        }

        this.setState({value}, () => {
            if (validate) {
                this.validate();
            }
        });
    }

    validate() {
        let rules = this.props.rules || [],
            i = 0;
        for (; i < rules.length; i++) {
            let validate = rules[i](this.state.value);
            if (validate !== true) {
                this.setState({error: validate});
                return false;
            } else {
                this.setState({error: undefined});
            }
        }

        return true;
    }

    getInput() {
        return this.input;
    }

    setValue(value, validate = false) {
        this.setState({value}, () => {
            this.input.setState({value});
            this._onChange(value, validate);
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.value !== this.props.value) {
            this.setValue(this.props.value);
        }
    }

    render() {
        return (
            <Stack direction={this.props.direction} spacing={0}
                   sx={{p: this.props.label ? 0.25: 1}}>
                {this.props.label &&
                    <Typography
                        sx={{p: (this.props.direction === "row" ? 1 : 0.5)}}
                        variant={"subtitle1"}
                        component={"h2"}
                    >
                        {this.props.label}
                        {this.props?.required ? <sup style={{color: "red"}}>*</sup> : null}
                    </Typography>}
                <Box sx={{flexGrow: 1}}>
                    <ReactDatePicker
                        popperProps={{positionFixed: true }}
                        ref={(ref) => (this.input = ref)}
                        isClearable={this.props.clearable}
                        disabled={this.props.disabled}
                        placeholderText={this.props.placeholder}
                        dateFormat={this.props.dateFormat || "yyyy-MM-dd"}
                        timeFormat={this.props.timeFormat || "HH:mm"}
                        showTimeSelect={this.props.showTimeSelect}
                        showTimeSelectOnly={this.props.showTimeSelectOnly}
                        timeIntervals={this.props.timeIntervals || 1}
                        selected={this.state.value}
                        showMonthDropdown
                        showYearDropdown
                        showYearPicker={this.props.showYearPicker}
                        showMonthYearPicker={this.props.showMonthYearPicker}
                        maxTime={this.props.maxTime}
                        minTime={this.props.minTime}
                        filterTime={this.props.filterTime}
                        filterDate={this.props.filterDate}
                        onFocus={() => this.setState({isFocused: true})}
                        onBlur={() => this.setState({isFocused: false})}
                        onChange={(value) => this._onChange(value)}
                    />
                </Box>
                {/*{this.props.renderEndIcon ? this.props.renderEndIcon() : null}*/}
            </Stack>
        );
    }
}