import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import * as React from "react";
import {convertISODateToDate, convertISODateToDateTime} from "../helpers";
import {colors} from "@mui/material";

export default function MessageDisplay(props) {
    const [expanded, setExpanded] = React.useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    return (
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{bgcolor: colors.grey[100], borderBottom: 1, borderColor: "divider"}}
            >
                <Typography sx={{width: '33%', flexShrink: 0}}>
                    {props.data?.title}
                </Typography>
                <Typography
                    sx={{color: 'text.secondary'}}>{convertISODateToDateTime(props.data?.createdAt)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    <div dangerouslySetInnerHTML={{__html: props.data?.message}}/>
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
}