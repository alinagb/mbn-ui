import React, { useState, useEffect } from 'react';
import Header from "../Header.jsx"
import firstImage from "../../assets/firstImage.png"
import secondImage from "../../assets/secondImage.png"
import thirdImage from "../../assets/thirdImage.png"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Carousel from 'react-bootstrap/Carousel';
import { createClient } from '../integration/mbn-service.js';
import GetClients from '../clients/GetClients.jsx';
import isFuture from 'date-fns/isFuture'
import { parse, isValid } from 'date-fns';
import { appServiceBaseUrl } from '../integration/envConfig.js';
import { saveAs } from "file-saver";
import "./IntroPage.css"

export default function IntroPage() {

    const [showAddClient, setShowAddClient] = useState(false);
    const [showSearchClient, setShowSearchClient] = useState(false);

    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [address, setAddress] = useState(null);
    const [cnp, setCnp] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [dateOfBirthDay, setDateOfBirthDay] = useState(null);
    const [dateOfBirthMonth, setDateOfBirthMonth] = useState(null);
    const [dateOfBirthYear, setDateOfBirthYear] = useState(null);
    const [phone, setPhone] = useState(null);
    const [id, setId] = useState("");
    const [form, setForm] = useState({})
    const [errors, setErrors] = useState({})

    const handleCloseAddClient = () => setShowAddClient(false);
    const handleCloseSearchClient = () => setShowSearchClient(false);

    const handleShowAddClient = () => setShowAddClient(true);
    const handleShowSearchClient = () => setShowSearchClient(true);

    useEffect(() => {
        setDateOfBirth(dateOfBirthYear + "-" + dateOfBirthMonth + "-" + dateOfBirthDay)

    }, [dateOfBirthDay, dateOfBirthMonth, dateOfBirthYear])

    const processCreateClient = async () => {
        const newErrors = findFormErrors()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            await createClient(firstName, lastName, address, cnp, dateOfBirth, phone).then(response => {
                if (response.status === 200) {
                    handleCloseAddClient();
                } else if (response.status === 400) {
                    newErrors.cnp = 'CNP-ul este deja existent in baza de date'
                    setErrors(newErrors)
                }
            })

        }
    }

    const setField = (field, value) => {

        setForm({
            ...form,
            [field]: value
        })
        if (!!errors[field]) setErrors({
            ...errors,
            [field]: null
        })
    }

    const findFormErrors = () => {
        const { firstName, lastName, cnp, dateOfBirthDay, dateOfBirthMonth, dateOfBirthYear } = form
        const newErrors = {}
        const validDate = parse(`${dateOfBirthDay}.${dateOfBirthMonth}.${dateOfBirthYear}`, "dd.MM.yyyy", new Date());
        if (!firstName || firstName === '') newErrors.firstName = 'Introduceti prenume pacient'
        else if (firstName.length > 30) newErrors.firstName = 'Prenume pacient prea lung'
        if (!lastName || lastName === '') newErrors.lastName = 'Introduceti nume pacient'
        else if (lastName.length > 30) newErrors.lastName = 'Nume pacient prea lung'
        if (!cnp || cnp === '') newErrors.cnp = 'Introduceti CNP pacient'
        else if (cnp.length !== 13) newErrors.cnp = 'CNP invalid'
        if (!dateOfBirthDay || dateOfBirthDay === '') newErrors.dateOfBirthDay = 'Introduceti zi nastere pacient'
        else if (dateOfBirthDay <= 1 && dateOfBirthDay >= 31) newErrors.dateOfBirthDay = 'Zi nastere invalida'
        if (!dateOfBirthMonth || dateOfBirthMonth === '') newErrors.dateOfBirthMonth = 'Introduceti luna nastere pacient'
        else if (dateOfBirthMonth <= 1 && dateOfBirthMonth >= 12) newErrors.dateOfBirthMonth = 'Luna nastere invalida'
        if (!dateOfBirthYear || dateOfBirthYear === '') newErrors.dateOfBirthYear = 'Introduceti an nastere pacient'
        else if (!isValid(validDate) || isFuture(validDate)) newErrors.dateOfBirthYear = 'Introduceti data nastere pacient valida'
        return newErrors
    }

    const saveFile = () => {
        saveAs(
            `${appServiceBaseUrl}+/file/printing/pdf`,
            "GDPR.pdf"
        );
    };
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


            <div style={{ padding: "0 10% 0 10%" }}>
                <div style={{ float: "right" }}>
                    <Button className="searchBtn" onClick={saveFile} >Descarca GDPR</Button>
                </div>
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
                            *Nume:
                        </Form.Label>
                        <Col sm="10" >
                            <Form.Control
                                type="text"
                                placeholder="Nume"
                                value={lastName}
                                onChange={(e) => {
                                    setField('lastName', e.target.value);
                                    setLastName(e.target.value)
                                }
                                }
                                isInvalid={!!errors.lastName}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.lastName}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column >
                            *Prenume:
                        </Form.Label>
                        <Col sm="10" >
                            <Form.Control
                                type="text"
                                placeholder="Prenume"
                                value={firstName}
                                onChange={(e) => {
                                    setField('firstName', e.target.value);
                                    setFirstName(e.target.value)
                                }
                                }
                                isInvalid={!!errors.firstName}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.firstName}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column >
                            *CNP:
                        </Form.Label>
                        <Col sm="10" >
                            <Form.Control
                                type="number"
                                placeholder="CNP"
                                value={cnp}
                                onChange={(e) => {
                                    setField('cnp', e.target.value);
                                    setCnp(e.target.value)
                                }}
                                isInvalid={!!errors.cnp}

                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.cnp}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>


                    <Form.Group as={Row} className="mb-1" >
                        <Form.Label column >
                            *Data de nastere:
                        </Form.Label>
                        <Col sm="3"  >
                            <Form.Control

                                type="number"
                                placeholder="Zi"
                                value={dateOfBirthDay}
                                onChange={(e) => {
                                    setField('dateOfBirthDay', e.target.value);
                                    setDateOfBirthDay(e.target.value)
                                }}
                                isInvalid={!!errors.dateOfBirthDay}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.dateOfBirthDay}
                            </Form.Control.Feedback>
                        </Col>

                        <Col sm="3"  >
                            <Form.Control
                                type="number"
                                placeholder="Luna"
                                value={dateOfBirthMonth}
                                onChange={(e) => {
                                    setField('dateOfBirthMonth', e.target.value);
                                    setDateOfBirthMonth(e.target.value)
                                }}
                                isInvalid={!!errors.dateOfBirthMonth}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.dateOfBirthMonth}
                            </Form.Control.Feedback>
                        </Col>
                        <Col sm="4"  >
                            <Form.Control
                                type="number"
                                placeholder="An"
                                value={dateOfBirthYear}
                                onChange={(e) => {
                                    setField('dateOfBirthYear', e.target.value);
                                    setDateOfBirthYear(e.target.value)
                                }}
                                isInvalid={!!errors.dateOfBirthYear}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.dateOfBirthYear}
                            </Form.Control.Feedback>
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
