import React, { useState, useEffect } from "react";
import { Row, Col, Card, Pagination, Button, Modal } from "react-bootstrap";
import BTable from "react-bootstrap/Table";
import { useNavigate } from 'react-router-dom';
import {
    useTable,
    useSortBy,
    usePagination,
    useGlobalFilter,
} from "react-table";
import GetData from "./ListData";
import axios from "axios";

const API_URL = "http://localhost:3007/";

function Table({ columns, data, modalOpen }) {
    const navigate = useNavigate()

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        globalFilter,
        setGlobalFilter,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
        exportData,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
    );

    const redirectToAddBeneficiary = () => {
        navigate("/create-update-beneficiary")
    }


    return (
        <>
            <Row className="mb-3">
                <Col className="d-flex justify-content-end">
                    <Button
                        variant="success"
                        className="btn-sm btn-round has-ripple ml-2"
                        onClick={redirectToAddBeneficiary}
                    >
                        <i className="feather icon-plus" /> Add
                    </Button>
                </Col>
            </Row>
            <BTable striped bordered hover responsive {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr  {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Header")}
                                    <span>
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <span className="feather icon-arrow-down text-muted float-right" />
                                            ) : (
                                                <span className="feather icon-arrow-up text-muted float-right" />
                                            )
                                        ) : (
                                            ""
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </BTable>
            <Row className="justify-content-between">
                <Col>
                    <span className="d-flex align-items-center">
                        Page{" "}
                        <strong>
                            {" "}
                            {pageIndex + 1} of {pageOptions.length}{" "}
                        </strong>{" "}
                        | Go to page:{" "}
                        <input
                            type="number"
                            className="form-control ml-2"
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                gotoPage(page);
                            }}
                            style={{ width: "100px" }}
                        />
                    </span>
                </Col>
                <Col>
                    <Pagination className="justify-content-end">
                        <Pagination.First
                            onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage}
                        />
                        <Pagination.Prev
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                        />
                        <Pagination.Next
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                        />
                        <Pagination.Last
                            onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage}
                        />
                    </Pagination>
                </Col>
            </Row>
        </>
    );
}

const BeneficiaryTable = () => {
    const navigate = useNavigate()
    const columns = React.useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
            },
            {
                Header: "Full Name",
                accessor: "fullname",
            },
            {
                Header: "Address ",
                accessor: "address",
            },
            {
                Header: "Country Name",
                accessor: "countryid",
            },
            {
                Header: "Pin Code",
                accessor: "pincode",
            },
            {
                Header: "Action",
                accessor: "action",
            },

        ],
        []
    );



    const initData = {
        id: 0,
        fullname: "",
        address: "",
        countryid: "",
        pincode: "",
    };

    const [beneficiariesList, setBeneficiariesList] = useState([initData]);


    useEffect(() => {
        const fetchData = async () => {
            await axios
                .get(`${API_URL}api/beneficiaries`)
                .then((response) => {
                    if (response.data.length > 0) {
                        setBeneficiariesList(response.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        fetchData();
    }, [API_URL, setBeneficiariesList]);

    //Events to be send to the Child
    const eventHandler = async (eventData, eventType) => {
        if (eventType === "delete") deleteCustomer(eventData);
        console.log("eventData", eventData);
        if (eventType === "edit") {
            navigate('/create-update-beneficiary', {
                state: {
                    custId: eventData.id,
                    edit: true,
                }
            });
        }
        if (eventType === "view") {
            navigate('/create-update-beneficiary', {
                state: {
                    custId: eventData.id,
                    edit: false,
                }
            });
        }
    };

    const deleteCustomer = async (eventData) => {
        await axios
            .delete(`${API_URL}api/beneficiaries/${eventData.id}`, "")
            .then((response) => {
                if (response.status === 200) {
                    window.location.reload();
                    console.log("response", response);
                }
            })
            .catch((err) => {
                console.log("err", err);
            });

    }

    const data = React.useMemo(
        () => GetData(eventHandler, beneficiariesList, beneficiariesList.length),
        [beneficiariesList]
    );

    return (
        <React.Fragment>
            <Row className="btn-page">
                <Col sm={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Manage Beneficiaries</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Table
                                columns={columns}
                                data={data}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default BeneficiaryTable;
