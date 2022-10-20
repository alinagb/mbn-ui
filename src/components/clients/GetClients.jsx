import React, { useState, useEffect } from 'react';
import { search } from '../integration/mbn-service';
import Table from "./Table";
import schema from "./schemaClient.json"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function GetClients() {

    const [clients, setClients] = useState(null);
    const [filterText, setFilterText] = useState(null);

    const searchClient = () => {
        search(filterText, "", "clients", "").then(response => {
            if (response && response.status === 200) {
                setClients(response.data)
            }

        })
    }

    const handleKeyPress = e => {
        if (e.key === "Enter") {
            searchClient();
        }
    }

    return <div style={{ marginLeft: "2%", marginRight: "2%" }}>

        <br />
        <br />
        <Form.Label style={{color:"red", fontSize:"12px"}}>
            *Cauta dupa Nume sau CNP
        </Form.Label>
        <InputGroup className="mb-3" >

            <Form.Control
                onKeyPress={handleKeyPress}
                id="myInput"
                placeholder="Search"
                aria-label="Search"

                aria-describedby="basic-addon2"
                onChange={(e) => setFilterText(e.target.value)}
            />
            <Button variant="outline-secondary" id="myBtn" className="searchBtn" onClick={searchClient}>
                Cauta
            </Button>
        </InputGroup>

        <br />

        {clients &&
            <Table headers={Object.keys(schema)} rows={clients} tableName="client" />
        }
    </div>
}