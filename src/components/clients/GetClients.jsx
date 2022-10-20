import React, { useState } from 'react';
import { search } from '../integration/mbn-service';
import Table from "./Table";
import schema from "./schemaClient.json"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { usePromiseTracker } from "react-promise-tracker";
import { trackPromise } from 'react-promise-tracker';
import Spinner from 'react-bootstrap/Spinner';
import AlertDismissible from './AlertDismissible';

export default function GetClients() {

    const [clients, setClients] = useState(null);
    const [filterText, setFilterText] = useState(null);

    const { promiseInProgress } = usePromiseTracker();

    const [alert, setAlert] = useState({
        alert: false,
        color: "",
        message: ""
    })

    const searchClient = () => {
        trackPromise(search(filterText, "", "clients", "").then(response => {
            if (response && response.status === 200) {
                setClients(response.data)
                setAlert({
                    alert: false
                })
            }else if(response.status === 500){
                   setAlert({
                    alert: true,
                    color: "danger",
                    message: "Nu au fost gasite informatiile cerute"
                })
            }
        }))
    }

    const handleKeyPress = e => {
        if (e.key === "Enter") {
            searchClient();
        }
    }

    return <div style={{ marginLeft: "2%", marginRight: "2%" }}>
        {alert.alert && <AlertDismissible alert={alert.alert} color={alert.color} message={alert.message}></AlertDismissible>}

        <br />
        <br />

        <Form.Label style={{ color: "red", fontSize: "12px" }}>
            *Cauta dupa Nume sau CNP
        </Form.Label>
        <InputGroup className="mb-3" >

            <Form.Control
                onKeyPress={handleKeyPress}
                id="myInput"
                placeholder="Cauta"
                aria-label="Cauta"
                aria-describedby="basic-addon2"
                onChange={(e) => setFilterText(e.target.value)}
            />
            <Button variant="outline-secondary" id="myBtn" className="searchBtn" onClick={searchClient}>
                Cauta
            </Button>
        </InputGroup>

        <br />

        {promiseInProgress &&
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Button disabled style={{ backgroundColor: "#66B2B9" }}
                >
                    <Spinner
                        as="span"
                        animation="border"
                        role="status"
                        aria-hidden="true"
                    />
                    <span className="visually-hidden">Loading...</span>
                </Button>
            </div>
        }
                <br />

        {clients &&
            <Table headers={Object.keys(schema)} rows={clients} tableName="client" />
        }
    </div>

}