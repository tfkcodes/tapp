import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useState} from "react";
import TablePagination from "@mui/material/TablePagination";
import useFetch from "../hooks/useFetch";
import MessageDisplay from "./MessageDisplay";

export default function MessageModal(props) {
    const [expanded, setExpanded] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [loading, setLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [columns, setColumns] = useState([
        {id: 'sn', label: 'SN', minWidth: 10}, ...(props?.columns || [])]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const {data: data} = useFetch(
        props?.url,
        {page: (page + 1), limit: rowsPerPage, ...props?.params},
        true,
        {data: [], page_total: 0, total: 0},
        (response) => {
            setLoading(true)
            let data = response.data.data.map((e, index) => {
                return {sn: (index + 1 + (page * rowsPerPage)), ...e};
            });
            setLoading(false)
            return {data, page_total: response.data?.page_total, total: response.data?.total}
        }
    );


    return (
        <div>
            {data?.data?.map((rows, index) => (
                <MessageDisplay key={index} data={rows}/>
            ))}
            <TablePagination
                rowsPerPageOptions={[25, 100]}
                component="div"
                count={data?.page_total}
                rowsPerPage={data?.total}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}