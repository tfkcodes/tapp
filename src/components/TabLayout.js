import * as React from 'react';
import {useEffect} from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {useLocation, useNavigate} from "react-router-dom";

function CustomTabPanel(props) {
    const {children, value, index, ...other} = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TabLayout(props) {
    const [value, setValue] = React.useState();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (props.component) {
            console.log(location)
            console.log(props.component)
            const index = props.component.findIndex(e => location.pathname.indexOf(e.path) !== -1);
            console.log(index)
            if (index > 0) {
                setValue(index);
            }
        }
    }, [props.component, location]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const pathNavigate = (item) => {
        if (!props.route) {
            navigate(item?.path);
        }
    }

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{
                padding: 0,
                borderBottom: 1,
                borderTop: 1,
                borderLeft: 1,
                borderRight: 1,
                borderColor: 'divider',
                background: "#f5f5f5"
            }}>
                <Tabs
                    value={value}
                    textColor={"inherit"}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    sx={{
                        padding: 0,
                        ".MuiTabs-indicator": {
                            background: "#fff !important",
                        },
                        "& button": {
                            padding: 2,
                            textTransform: 'none',
                        },
                        "& button[aria-selected='true']": {
                            position: "relative",
                            fontWeight: "bold",
                            background: '#fbfcfd',

                            "&:before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 0,
                            },

                            "& > *": {zIndex: 0},
                            "& > .MuiTab-wrapper": {
                                background: "#fff",
                                height: "100%"
                            }
                        }
                    }}
                >
                    {
                        props?.component.map((e, index) => (
                            <Tab key={index} label={`${e.label}`} {...a11yProps(index)}
                                 sx={{borderRight: 1, borderColor: 'divider'}} onClick={() => pathNavigate(e)}/>
                        ))
                    }
                </Tabs>
            </Box>
            <Box sx={{border: 1, borderColor: 'divider', padding: 0}}>
                {
                    props?.component.map((e, index) => (
                        <CustomTabPanel key={index} value={value} index={index} sx={{padding: 0}}>
                            {e.component}
                        </CustomTabPanel>
                    ))
                }
            </Box>
        </Box>
    );
}