import React from "react";
import {Box, Typography} from "@mui/material";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    componentDidMount() {
        window.onerror = () => {
            this.setState({hasError: true});
        };
    }

    static getDerivedStateFromError(error) {
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box>
                    <Typography>Something went wrong.</Typography>
                </Box>
            );
        }

        return this.props.children;
    }
}