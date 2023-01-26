import React, { useState, useEffect } from 'react';
import { deleteFile, getClientById, search, updateClientImagesInDb, updateClientInDb } from '../integration/mbn-service';
import Header from '../Header';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Button, InputGroup } from 'react-bootstrap';
import Table from './Table';
import schema from "./schemaRegistration.json"
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import AlertDismissible from './AlertDismissible';
import "./client.css"
import { appServiceBaseUrl } from "./../integration/envConfig";
import ErrorPage from '../error/ErrorPage';
import { Viewer, SpecialZoomLevel, ScrollMode } from '@react-pdf-viewer/core';
import { Worker } from '@react-pdf-viewer/core';
import { saveAs } from "file-saver";
import { MdDeleteForever } from 'react-icons/md';
import '@react-pdf-viewer/core/lib/styles/index.css';

export default function GetClient() {


    const [client, setClient] = useState(null);
    const params = useParams();
    const clientId = params.clientId;
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState(null);
    const [cnp, setCnp] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [address, setAddress] = useState(null);
    const [phone, setPhone] = useState(null);
    const [files, setFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([])
    const [gdprCompleted, setGdprCompleted] = useState(null);
    const [alert, setAlert] = useState({
        alert: false,
        color: "",
        message: ""
    })
    const [filterText, setFilterText] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState("idRegistration");
    const [errorPage, setErrorPgae] = useState(false);

    const saveFile = (photo) => {
        saveAs(
            appServiceBaseUrl + "/file/image/pdf/" + client?.codPatient + "/" + photo.fileId,
            "pdf.pdf"
        );
    };
    const fetchData = () => {

        getClientById(clientId).then((response) => {

            if (response && response.status === 200) {


                setExistingFiles(response.data.fileSet)
                setClient(response.data)
                setCnp(response.data.cnp)
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setPhone(response.data.phone)
                setAddress(response.data.address)
                setRegistrations(response.data.registrations)
                setGdprCompleted(response.data.gdprCompleted)
            } else {
                setErrorPgae(true)
            }
        }).catch(() => {
            setErrorPgae(true)

        })
    }

    useEffect(() => {
        if (clientId !== null) {
            fetchData();
        }
        setTimeout(() => setAlert({
            alert: false
        }), 3000)

    }, [alert.alert, clientId])

    const updateClient = async () => {
        await updateClientInDb(client.codPatient, cnp, firstName, lastName, address, phone, gdprCompleted).then(response => {
            if (response && response.status === 200) {
                setAlert({
                    alert: true,
                    color: "success",
                    message: "Date personale actualizate cu success."
                })
            } else {
                setAlert({
                    alert: true,
                    color: "danger",
                    message: "Din pacate datele nu au putut fi actualizate. " + response.data?.errorMessage
                })

            }
        })

    }

    const updateClientImages = () => {
        updateClientImagesInDb(client.codPatient, files).then(response => {
            if (response && response.status === 200) {

                setExistingFiles(response.data.fileSet)
                setFiles([]);
                setAlert({
                    alert: true,
                    color: "success",
                    message: "Date personale actualizate cu success"
                })

            } else {
                setAlert({
                    alert: true,
                    color: "danger",
                    message: "Din pacate datele nu au putut fi actualizate"
                })

            }
        })
    }

    const removeImage = (fileId) => {

        deleteFile(client?.codPatient, fileId).then(response => {
            if (response.status === 200) {
                setAlert({
                    alert: true,
                    color: "success",
                    message: "Date personale actualizate cu success."
                })
            } else {
                setAlert({
                    alert: true,
                    color: "danger",
                    message: "Din pacate datele nu au putut fi actualizate"
                })
            }

        })
    }

    const onChange = (imageList) => {
        setFiles(imageList);
    };

    const onSwitchAction = () => {
        setGdprCompleted(!gdprCompleted);
    };

    const handleKeyPress = e => {
        if (e.key === "Enter") {
            searchRegistration();
        }
    }
    const searchRegistration = () => {
        search(filterText, filterCriteria, "registrations", clientId).then(response => {
            if (response && response.status === 200) {
                setRegistrations(response.data)
            }

        })
    }

    if (errorPage) {
        return <ErrorPage></ErrorPage>
    } else {
        return client && (
            <Header>
                <br />

                <div style={{ marginLeft: "2%", marginRight: "2%" }}>
                    {alert.alert && <AlertDismissible alert={alert.alert} color={alert.color} message={alert.message}></AlertDismissible>}

                    <div>
                        <Button onClick={() => navigate("/")} variant="outline-light" className="searchBtn">
                            <FaArrowCircleLeft style={{ marginRight: "10px" }}> </FaArrowCircleLeft>Inapoi</Button>
                    </div>

                    <br />

                    <h5><strong>Nume pacient:</strong> {client?.firstName} {client?.lastName}</h5>
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
                                <Form.Control type="text" placeholder="CNP" value={cnp} onChange={(e) => setCnp(e.target.value)} />
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
                        <Form>
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label="GDPR completat"
                                checked={gdprCompleted}
                                onChange={onSwitchAction}
                            />
                        </Form>

                        <Button onClick={updateClient} variant="outline-secondary" className="searchBtn btn-client">
                            ACTUALIZEAZA DATE PERSONALE
                        </Button>

                    </div>
                    <hr></hr>
                    <div>

                        <h5><strong>DOCUMENTE ATASATE</strong> </h5>

                        <Form.Group controlId="formFileMultiple" className="mb-3" lang="zn">
                            <Form.Control type="file" multiple lang="zn"
                                onChange={(e) => onChange(e.target.files)} />
                        </Form.Group>

                        <Button style={{ marginTop: "10px" }} onClick={() => { updateClientImages() }} variant="outline-secondary" className="searchBtn btn-client" disabled={files.length === 0}>
                            ADAUGA DOCUMENTE
                        </Button>

                        <div style={{ display: "flex", flexFlow: "wrap" }}>
                            {existingFiles?.map(photo => {
                                var ext = photo?.name.substr(photo?.name.lastIndexOf('.') + 1);
                                if (ext !== "pdf") {
                                    return <div style={{ width: "20%", padding: "1%", margin: "2%", borderStyle: "ridge" }}>

                                        <a href={appServiceBaseUrl + "/file/image/" + client?.codPatient + "/" + photo.fileId} target="_blank" rel="noreferrer">
                                            <div style={{ overflow: "auto", height: "200px" }}>
                                                <img style={{ width: "90%", padding: "5%", border: '1px solid rgba(0, 0, 0, 0.3)' }} src={appServiceBaseUrl + "/file/image/" + client?.codPatient + "/" + photo.fileId} alt="">

                                                </img>

                                            </div>

                                            <label
                                                style={{
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                    width: "180px",
                                                    height: "1.2em",
                                                    whiteSpace: "nowrap"
                                                }} >
                                                {photo.name}
                                            </label>
                                        </a>
                                        <MdDeleteForever  style={{ marginRight: "10px", verticalAlign: "top", backgroundColor: "white", borderStyle: "solid", cursor: "pointer" }}  size={25}  color="red" onClick={() => removeImage(photo?.fileId)}> </MdDeleteForever>

                                    </div>

                                }

                            })}
                        </div>

                        <div style={{ display: "flex", flexFlow: "wrap" }}>

                            {existingFiles?.map(photo => {
                                var ext = photo?.name.substr(photo?.name.lastIndexOf('.') + 1);
                                if (ext === "pdf") {
                                    return <div style={{ width: "20%", padding: "1%",  margin: "2%", borderStyle: "ridge" }}>
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
                                            <a href='javascript:void(0)' onClick={() => saveFile(photo)}>
                                                <div
                                                    style={{
                                                        border: '1px solid rgba(0, 0, 0, 0.3)',
                                                        height: '200px',
                                                    }}
                                                >
                                                    <Viewer style={{ width: "100%" }} initialPage={1} fileUrl={appServiceBaseUrl + "/file/image/pdf/" + client?.codPatient + "/" + photo.fileId} defaultScale={SpecialZoomLevel.PageFit}></Viewer>
                                                    <label
                                                        style={{
                                                            textOverflow: "ellipsis",
                                                            overflow: "hidden",
                                                            width: "180px",
                                                            height: "1.2em",
                                                            whiteSpace: "nowrap"
                                                        }} >
                                                        {photo.name}
                                                    </label>
                                                </div>
                                            </a>
                                        </Worker>
                                        <MdDeleteForever  style={{ marginRight: "10px", marginTop: "25px" , verticalAlign: "top", backgroundColor: "white", borderStyle: "solid", cursor: "pointer" }}  size={25}  color="red" onClick={() => removeImage(photo?.fileId)}> </MdDeleteForever>

                                    </div>

                                }
                            })}

                        </div>


                    </div>
                    <hr></hr>
                    <div>

                        <h5><strong>RAPOARTE PACIENT</strong> </h5>

                        <div style={{ display: "flex", justifyContent: "space-between", width: "60%" }}>
                            <div>

                                <Button onClick={() => navigate("/client/" + clientId + "/registration")} variant="outline-secondary" className="searchBtn">
                                    ADAUGA INREGISTRARE
                                </Button>

                            </div>

                            <Form.Group as={Row} style={{ width: "65%" }}>
                                <Form.Label style={{ padding: 0, width: "15%" }}>
                                    Filtrare:
                                </Form.Label>
                                <Form.Select
                                    size="sm"
                                    aria-label="Default select example"
                                    className="searchBtn"
                                    onChange={e => setFilterCriteria(e.target.value)}
                                    style={{ width: "40%", marginBottom: "5px" }}
                                >

                                    <option value="idRegistration" >ID</option>
                                    <option value="dateOfConsultation">Data consultare</option>

                                </Form.Select>
                                <InputGroup className="mb-3" style={{ padding: 0 }} >
                                    <Form.Control
                                        onKeyPress={handleKeyPress}
                                        type={filterCriteria === "dateOfConsultation" ? "date" : "number"}
                                        id="myInput"
                                        placeholder="Cauta"
                                        aria-label="Cauta"
                                        aria-describedby="basic-addon2"
                                        onChange={(e) => setFilterText(e.target.value)}
                                    />
                                    &nbsp;
                                    <Button variant="outline-secondary" id="myBtn" className="searchBtn" onClick={searchRegistration}>
                                        Cauta
                                    </Button>
                                    &nbsp; &nbsp;
                                    <Button variant="outline-secondary" className="searchBtn" onClick={fetchData}>
                                        <HiX icon="fa-solid fa-xmark" />
                                    </Button>
                                </InputGroup>
                            </Form.Group>


                        </div>
                    </div>
                    <br />
                    <br />
                    <div style={{ width: "50%" }}>
                        {registrations.length !== 0 ?
                            <Table headers={Object.keys(schema)} rows={registrations} tableName="registration" clientId={clientId} />
                            :
                            <div>
                                <h2>Nicio valoare gasita</h2>
                                <br></br>
                            </div>
                        }

                    </div>
                    <hr></hr>

                </div>

            </Header >
        );

    }
}