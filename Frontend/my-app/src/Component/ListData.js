import React from "react";
import { Button } from "react-bootstrap";

const ListData = (eventHandler, data) => {
    return {
        id: data.id,
        fullname: data.fullname,
        address: data.address,
        countryid: data.countryname,
        pincode: data.pincode,
        action: (
            <React.Fragment>
                <Button
                    className="btn btn-icon btn-rounded "
                    onClick={() => eventHandler({ id: data.id }, "view")}
                >
                    View <i className="feather icon-eye" />
                </Button>

                <Button
                    onClick={() => eventHandler({ id: data.id }, "edit")}
                    className="btn btn-icon btn-rounded mx-1"
                >
                    Edit <i className="feather icon-edit" />
                </Button>

                <Button
                    onClick={() => eventHandler({ id: data.id }, "delete")}
                    className="btn btn-icon btn-rounded danger-button"
                >
                    Delete <i className="feather icon-trash-2" />
                </Button>
            </React.Fragment>
        ),
    };
};

export default function GetData(eventHandler, data, ...lens) {
    const makeDataLevel = (depth = 0) => {
        return data.map((result) => {
            return {
                ...ListData(eventHandler, result),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
            };
        });
    };

    return makeDataLevel();
}
