
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box
} from "@mui/material";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";

const API_URL = "http://localhost:3007/";

const AddBeneficiary = (props) => {

    const navigate = useNavigate()
    const location = useLocation();
    const {
        register,
        setValue,
        handleSubmit,
        control,
        formState: { errors },

    } = useForm();
    const [result, setResult] = useState([]);
    const [countryList, setCountryList] = useState([]);

    useEffect(() => {
        const { custId } = location?.state ?? ""
        fetchCountryList()
        if (custId) {
            fetchData(custId)
        }
    }, [])

    const fetchCountryList = async (custId) => {
        await axios
            .get(`${API_URL}api/countrylist`)
            .then((response) => {
                setCountryList(response.data);
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const fetchData = async (custId) => {
        await axios
            .get(`${API_URL}api/getBeneficiariesDetails/${custId}`)
            .then((response) => {
                setResult(response.data);
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    setValue("id", result[0]?.id ? result[0]?.id : "");
    setValue("fullname", result[0]?.fullname ? result[0]?.fullname : "");
    setValue("address", result[0]?.address ? result[0]?.address : "");
    setValue("pincode", result[0]?.pincode ? result[0]?.pincode : "");
    setValue("countryid", result[0]?.countryid ? result[0]?.countryid : "");


    function submitData(data) {
        console.log("res submitData", data);

        let postData = data;
        console.log(":postData", postData);
        if (postData.id) {
            console.log("edit");
            updateCustomer(postData);
        } else {
            console.log("add");
            insertCustomer(postData);
        }
    }


    const insertCustomer = async (postData) => {
        await axios
            .post(`${API_URL}api/beneficiaries`, postData)
            .then((response) => {
                if (response.status === 200) {
                    navigate("/")
                    console.log("response", response);
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const updateCustomer = async (postData) => {
        await axios
            .put(`${API_URL}api/beneficiaries/${postData.id}`, postData)
            .then((response) => {
                if (response.status === 200) {
                    navigate("/")
                    console.log("response", response);
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const redirectToHome = () => {
        navigate("/")
    }

    return (
        <div className="App add_form">
            <form onSubmit={handleSubmit(submitData)}>
                <Controller
                    name="fullname"
                    control={control}
                    rules={{
                        required: true
                    }}
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TextField
                                type="text"
                                placeholder="Full Name"
                                onChange={(e) => onChange(e.target.value)}
                                value={value}
                            />
                        </>
                    )}
                />
                <br />
                {errors.fullname && <span className="error-color">This field is required</span>}
                <br />
                <Controller
                    name="address"
                    control={control}
                    rules={{
                        required: true
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            type="text"
                            placeholder="Address"
                            onChange={(e) => onChange(e.target.value)}
                            value={value}
                        />
                    )}
                />
                <br />
                {errors.address && <span className="error-color">This field is required</span>}
                <br />
                <Controller
                    name="pincode"
                    control={control}
                    rules={{
                        required: true
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            type="text"
                            placeholder="Pin Code"
                            onChange={(e) => onChange(e.target.value)}
                            value={value}
                        />
                    )}
                />
                <br />
                {errors.pincode && <span className="error-color">This field is required</span>}
                <br />
                <Box sx={{ minWidth: 100 }}>
                    <Controller
                        name="countryid"
                        control={control}
                        rules={{
                            required: true
                        }}
                        render={({ field: { onChange, value } }) => (
                            <FormControl sx={{ minWidth: 220 }}>
                                <InputLabel id="demo-simple-select-label">Type of Account</InputLabel>
                                <Select
                                    onChange={(e) => onChange(e.target.value)}
                                    value={value}
                                >
                                    {countryList && countryList.length > 0 ?
                                        (
                                            countryList.map((item, index) => {

                                                return <MenuItem value={item.id}>{item.countryname}</MenuItem>
                                            })
                                        )
                                        : ""
                                    }
                                </Select>
                            </FormControl>
                        )}
                    />
                </Box>
                <Box>{errors.countryid && <span className="error-color">This field is required</span>}</Box>
                <Box>
                    <Button
                        onClick={() => redirectToHome()}
                        className="btn btn-icon btn-rounded danger-button"
                    >
                        Cancel <i className="feather icon-trash-2" />
                    </Button>
                    <Button
                        type="submit"
                        className=" m-10"
                    >
                        Submit
                    </Button>
                </Box>
            </form>
        </div>
    );
}


export default AddBeneficiary;