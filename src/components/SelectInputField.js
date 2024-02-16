import React from "react";
import {
    Box,
    FormHelperText,
    IconButton,
    InputAdornment,
    ListSubheader,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {Clear, Search} from "@mui/icons-material";

export default class SelectInputField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: "",
            searchText: "",
            options: [],
            inValid: false
        }
        this.input = React.createRef();
    }

    componentDidMount() {
        this.setState({value: this.props.value || "", options: this.props.options});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.searchText !== this.state.searchText) {
            this.filterSelectOption(this.state.searchText);
        }

        if (prevProps.value !== this.props.value) {
            this.setState({value: this.props.value});
        }
    }

    getInput() {
        return this.input;
    }

    getValue() {
        return this.state.value;
    }

    clearValue() {
        this.setState({value: ""}, () => this.props.onChange(null));
    }

    _onChange(input, validate = true) {
        if (this.props.onChange) {
            this.props.onChange(input?.value);
        }

        this.setState({value: input?.value}, () => {
            if (validate && !input?.value) {
                this.setState({inValid: true});
            } else {
                this.setState({inValid: false});
            }
        });
    }

    _onKeyDown(input) {
        if (this.props.onKeyDown) {
            this.props.onKeyDown(input.target.value);
        }
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

    setSearchLabel(value) {
        this.setState({searchText: value});
        if (this.props.onKeyDown) {
            this.props.onKeyDown(value);
        }
    }

    containsText = (text, searchText) => text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

    filterSelectOption(searchText) {
        const data = this.props.options;
        let options = data.filter((e) => this.containsText(e.label, searchText));
        this.setState({options: options.length ? options : this.props.options});
    }

    render() {
        return (
            <Stack direction={this.props.direction} spacing={0} sx={{p: this.props.label ? 0.25 : 1}}>
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
                    <Select
                        size="small"
                        error={(this.state.inValid && this.props.required) ? true : false}
                        ref={ref => this.input = ref}
                        required={this.props.required}
                        value={this.state.value}
                        fullWidth={true}
                        onChange={(event) => {
                            this._onChange(event.target);
                        }}
                        sx={{
                            "&.Mui-focused .MuiIconButton-root": {color: 'divider'},
                            "& .MuiSelect-iconOutlined": {display: this.state.value ? 'none' : ""},
                            '& .MuiSelect-select .notranslate::after': this.props.placeholder
                                ? {
                                    content: `"${this.props.placeholder}"`,
                                    opacity: 0.42,
                                }
                                : {},
                        }}
                        endAdornment={<IconButton sx={{display: this.state.value ? "" : "none"}}
                                                  onClick={() => this.clearValue()}><Clear/></IconButton>}
                    >
                        <ListSubheader>
                            <TextField
                                size="small"
                                autoFocus
                                placeholder="Search..."
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search/>
                                        </InputAdornment>
                                    )
                                }}
                                onChange={(e) => this.setSearchLabel(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key !== "Escape") {
                                        e.stopPropagation();
                                    }

                                    if (this.props.onKeyDown && typeof this.props.onKeyDown === "function") {
                                        this._onKeyDown(e);
                                    }
                                }}
                            />
                        </ListSubheader>
                        <MenuItem value={""}></MenuItem>
                        {this.state.options.length ? this.state.options?.map((e, i) => (
                            <MenuItem key={i} value={e.value}>
                                {e.label}
                            </MenuItem>
                        )) : this.props.options?.map((e, i) => (
                            <MenuItem key={i} value={e.value}>
                                {e.label}
                            </MenuItem>
                        ))}
                    </Select>
                    {this.state.inValid && this.props.required && (
                        <FormHelperText error id="standard-weight-helper-text-password-login">
                            {this.props.errorMessage || "This field is required"}
                        </FormHelperText>
                    )}
                </Box>
            </Stack>
        );
    }
}