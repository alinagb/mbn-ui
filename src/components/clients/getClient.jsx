import React, { useState, useEffect } from 'react';
import { getClientById, updateClientInDb } from '../integration/mbn-service';
import Header from '../Header';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Table from './Table';
import schema from "./schemaRegistration.json"
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FaArrowCircleLeft } from 'react-icons/fa';

export default function GetClient() {

    const [client, setClient] = useState(null);
    const params = useParams();
    const clientId = params.clientId;
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState(null);

    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [address, setAddress] = useState(null);
    const [phone, setPhone] = useState(null);

    useEffect(() => {
        if (clientId != null) {
            getClientById(clientId).then((response) => {
                if (response && response.status === 200) {
                    setClient(response.data)
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setPhone(response.data.phone)
                    setAddress(response.data.address)
                    setRegistrations(response.data.registrations)
                }
            })

        }
    }, [])
    console.log("client", client)

    const updateClient = async () => {
        console.log("ss")
        await updateClientInDb(client.codPatient, firstName, lastName, address, phone).then(response => {
            if (response && response.status === 200) {
                console.log("update")
            }
        })

    }

    return client && (
        <Header>
            <br />

            <div style={{ marginLeft: "2%", marginRight: "2%" }}>

                <div className="hideWhenPrinting">
                    <Button onClick={() => navigate("/")} variant="outline-light" className="searchBtn">
                        <FaArrowCircleLeft style={{ marginRight: "10px" }}> </FaArrowCircleLeft>Back</Button>
                </div>

                <br />

                <h5><strong>Profil pacient:</strong> {client?.firstName} {client?.lastName}</h5>
                <hr></hr>
                <h5><strong>DATE PACIENT</strong> </h5>
                <h6><strong>Cod Pacient: </strong>{client.codPatient} </h6>

                <hr></hr>
                <div style={{ width: "60%" }}>

                    <h5><strong>DATE PERSONALE</strong> </h5>

                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column>
                            CNP:
                        </Form.Label>
                        <Col sm="10" >
                            <Form.Control type="text" placeholder="Nume" value={client?.cnp} readOnly />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column>
                            Data de nastere:
                        </Form.Label>
                        <Col sm="10" >
                            <Form.Control type="text" placeholder="Data de nastere" value={client?.dateOfBirth} readOnly />
                        </Col>
                    </Form.Group>


                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column>
                            Nume:
                        </Form.Label>
                        <Col sm="10" >
                            <Form.Control type="text" placeholder="Nume" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column >
                            Prenume:
                        </Form.Label>
                        <Col sm="10" >
                            <Form.Control type="text" placeholder="Prenume" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column >
                            Telefon:
                        </Form.Label>
                        <Col sm="10" >
                            <Form.Control type="text" placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column >
                            Adresa:
                        </Form.Label>
                        <Col sm="10"  >
                            <Form.Control type="text" placeholder="Adresa" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </Col>
                    </Form.Group>

                    <Button onClick={updateClient} variant="outline-secondary" className="searchBtn">
                        ACTUALIZEAZA DATE PERSONALE
                    </Button>

                </div>
                <hr></hr>
                <h5><strong>DOCUMENTE ATASATE</strong> </h5>
                <Button onClick={() => navigate("/client/" + clientId + "/registration")} variant="outline-secondary" className="searchBtn">
                    ATASEAZA DOCUMENTE
                </Button>
                <hr></hr>
                <h5><strong>RAPOARTE PACIENT</strong> </h5>

                <Button onClick={() => navigate("/client/" + clientId + "/registration")} variant="outline-secondary" className="searchBtn">
                    ADAUGA REGISTRARE
                </Button>

                <br />
                <br />
                <div style={{ width: "50%" }}>
                    <Table headers={Object.keys(schema)} rows={registrations} tableName="registration" clientId={clientId} />

                </div>
            </div>

        </Header>
    );
}