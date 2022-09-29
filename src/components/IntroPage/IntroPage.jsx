import React, { useState, useEffect } from 'react';
import Header from "../Header.jsx"
import firstImage from "../../assets/firstImage.png"
import secondImage from "../../assets/secondImage.png"
import thirdImage from "../../assets/thirdImage.png"
import "./IntroPage.css"
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Carousel from 'react-bootstrap/Carousel';
import { createClient } from '../integration/mbn-service.js';
import { GET_CLIENTS_URL_PATH } from '../paths.jsx';
import GetClients from '../clients/GetClients.jsx';

export default function IntroPage() {

    const navigate = useNavigate();


    const [showAddClient, setShowAddClient] = useState(false);
    const [showSearchClient, setShowSearchClient] = useState(false);

    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [address, setAddress] = useState(null);
    const [cnp, setCnp] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [dateOfBirthDay, setDateOfBirthDay] = useState(null);
    const [dateOfBirthWeek, setDateOfBirthWeek] = useState(null);
    const [dateOfBirthYear, setDateOfBirthYear] = useState(null);
    const [phone, setPhone] = useState(null);
    const [id, setId] = useState("");
    const handleCloseAddClient = () => setShowAddClient(false);
    const handleCloseSearchClient = () => setShowSearchClient(false);

    const handleShowAddClient = () => setShowAddClient(true);
    const handleShowSearchClient = () => setShowSearchClient(true);



    useEffect(() => {
        
        setDateOfBirth(dateOfBirthYear + "-" + dateOfBirthWeek + "-" + dateOfBirthDay)
        console.log(dateOfBirth);
    }, [dateOfBirthYear, dateOfBirthWeek, dateOfBirthDay])
    
    const processCreateClient = async () => {

        let response = await createClient(firstName, lastName, address, cnp, dateOfBirth, phone);
        if (response.status === 200) {
            console.log("saveeeed")
            handleCloseAddClient();
        } else {
            console.log("nu mergeee")
        }
    }

    return <Header>
        <div>

            <Carousel fade>
                <Carousel.Item>
                    <img src={firstImage} width="100%" alt=""></img>

                </Carousel.Item>
                <Carousel.Item>
                    <img src={secondImage} width="100%" alt=""></img>

                </Carousel.Item>
                <Carousel.Item>
                    <img src={thirdImage} width="100%" alt=""></img>

                </Carousel.Item>
            </Carousel>

            <div style={{ display: "flex", placeContent: "center", marginTop: "2%" }}>


                <Button onClick={handleShowAddClient} variant="outline-light">

                    <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="40%" fill="#66B2B9" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                    </svg>
                    <h3 style={{ color: "#66B2B9" }}> ADAUGA CLIENT </h3>
                </Button>


                <Button onClick={handleShowSearchClient} variant="outline-light">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="40%" fill="#66B2B9" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                    </svg>

                    <h3 style={{ color: "#66B2B9" }}> CAUTA CLIENT </h3>
                </Button>

            </div>

            <Modal id={id} show={showSearchClient} onHide={handleCloseSearchClient} size="lg">
                <Modal.Header>
                    <Modal.Title>Search Client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GetClients></GetClients>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSearchClient}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>

            <Modal show={showAddClient} onHide={handleCloseAddClient} size="lg">
                <Modal.Header>
                    <Modal.Title>Adauga client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                            CNP:
                        </Form.Label>
                        <Col sm="10" >
                            <Form.Control type="text" placeholder="CNP" value={cnp} onChange={(e) => setCnp(e.target.value)} />
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

                    <Form.Group as={Row} className="mb-1" >
                        <Form.Label column >
                            Data de nastere:
                        </Form.Label>

                        <Col sm="3"  >
                            <Form.Control type="text" placeholder="Zi" value={dateOfBirthDay} onChange={(e) => setDateOfBirthDay(e.target.value)} />
                        </Col>
                        <Col sm="3"  >
                            <Form.Control type="text" placeholder="Luna" value={dateOfBirthWeek} onChange={(e) => setDateOfBirthWeek(e.target.value)} />
                        </Col>
                        <Col sm="4"  >
                            <Form.Control type="text" placeholder="An" value={dateOfBirthYear} onChange={(e) => setDateOfBirthYear(e.target.value)} />
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

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddClient}>
                        Close
                    </Button>
                    <Button variant="light" className="searchBtn" onClick={processCreateClient}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </Header >
}
