import * as React from 'react';
import {useState} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {LinearProgress, Typography} from "@mui/material";
import useFetch from "../hooks/useFetch";

export default function Tables(props) {
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
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <Typography variant={"h6"} sx={{flexGrow: 1, padding: 1,}}>{props?.title}</Typography>
            <TableContainer sx={{maxHeight: 550}}>
                <Table stickyHeader aria-label="sticky table" size={"small"}
                       sx={{border: 1, borderColor: "divider", zIndex: "0"}}>
                    <TableHead>
                        <TableRow>
                            {columns?.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column?.align}
                                    style={{minWidth: column?.minWidth || 170}}
                                    sx={{
                                        borderRight: 1,
                                        borderColor: "divider",
                                        background: "#f4f4f4"
                                    }}
                                >
                                    {column?.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading &&
                            <TableRow><TableCell colSpan={columns.length}><LinearProgress/></TableCell></TableRow>}
                        {data.data.map((row, index) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                    {columns.map((column) => {
                                        const value = column?.customRender ? column.valueGetter(row) : row[column.id];
                                        return (
                                            <TableCell
                                                key={column.id}
                                                align={column?.align}
                                                sx={{
                                                    borderRight: 1,
                                                    borderColor: "divider",
                                                    cursor: (props?.onRawClick && typeof props?.onRawClick === "function") ? "pointer" : ""
                                                }}
                                                onClick={() => {
                                                    if (!column?.disabled && props?.onRawClick && typeof props?.onRawClick === "function") {
                                                        props.onRawClick(row);
                                                    }
                                                }}
                                            >
                                                {column.format && typeof value === 'number'
                                                    ? column.format(value)
                                                    : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[25, 100]}
                component="div"
                count={data?.page_total}
                rowsPerPage={data?.total}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}