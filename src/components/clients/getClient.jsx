import React, { useState, useEffect } from 'react';
import { getClientById, search, updateClientImagesInDb, updateClientInDb } from '../integration/mbn-service';
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
import ImageUploading from 'react-images-uploading';
import AlertDismissible from './AlertDismissible';
import "./client.css"
import { appServiceBaseUrl } from "./../integration/envConfig";
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
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([])
    const [gdprCompleted, setGdprCompleted] = useState(null);
    const maxNumber = 69;
    const [alert, setAlert] = useState({
        alert: false,
        color: "",
        message: ""
    })
    const [filterText, setFilterText] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState("idRegistration");

    useEffect(() => {
        if (clientId !== null) {
            getClientById(clientId).then((response) => {
                if (response && response.status === 200) {
                    setExistingFiles(response.data.fileSet)
                    setClient(response.data)
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setPhone(response.data.phone)
                    setAddress(response.data.address)
                    setRegistrations(response.data.registrations)
                    setGdprCompleted(response.data.gdprCompleted)
                }
            })

        }
        setTimeout(() => setAlert({
            alert: false
        }), 3000)

    }, [existingFiles.length, alert.alert])

    const updateClient = async () => {
        await updateClientInDb(client.codPatient, firstName, lastName, address, phone, gdprCompleted).then(response => {
            if (response && response.status === 200) {
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

    const updateClientImages = async () => {
        await updateClientImagesInDb(client.codPatient, files).then(response => {
            if (response && response.status === 200) {
                setImages([])
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

    const onChange = (imageList, addUpdateIndex) => {
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
        imageList.map(i => {
            setFiles([...files, i.file]);

        })
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

    return client && (
        <Header>
            <br />

            <div style={{ marginLeft: "2%", marginRight: "2%" }}>
                {alert.alert && <AlertDismissible alert={alert.alert} color={alert.color} message={alert.message}></AlertDismissible>}

                <div>
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
                <h5><strong>DOCUMENTE ATASATE</strong> </h5>

                <ImageUploading
                    multiple
                    value={images}
                    onChange={onChange}
                    maxNumber={maxNumber}
                    dataURLKey="data_url"
                >
                    {({
                        imageList,
                        onImageUpload,
                        onImageRemoveAll,
                        onImageRemove,
                        isDragging,
                        dragProps,
                    }) => (
                        // write your building UI
                        <div className="upload__image-wrapper">
                            <Button variant="light" className="searchBtn"
                                style={isDragging ? { color: 'red' } : undefined}
                                onClick={onImageUpload}
                                {...dragProps}
                            >
                                Click to upload
                            </Button>
                            &nbsp;
                            {images.length != 0 && <Button cvariant="light" className="searchBtn" onClick={onImageRemoveAll}>Remove all images</Button>}
                            <div style={{ display: "flex", marginTop: 10 }}>
                                {imageList.map((image, index) => (
                                    <div key={index} className="image-item">
                                        &nbsp;
                                        <img src={image['data_url']} alt="" width="100" />
                                        <div className="image-item__btn-wrapper" style={{ marginRight: 20 }}>
                                            &nbsp;
                                            <button onClick={() => onImageRemove(index)}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </ImageUploading>
                <div>
                    {existingFiles?.map(photo => (
                        <img style={{ width: "30%", margin: "20px" }} src={appServiceBaseUrl + "/file/image/" + client?.codPatient + "/" + photo.fileId}></img>
                    ))}

                </div>

                <Button onClick={() => { updateClientImages() }} variant="outline-secondary" className="searchBtn btn-client" disabled={files.length === 0}>
                    ATASEAZA DOCUMENTE
                </Button>

                <hr></hr>
                <h5><strong>RAPOARTE PACIENT</strong> </h5>

                <div style={{ display: "flex", justifyContent: "space-between", width: "60%" }}>
                    <div>

                        <Button onClick={() => navigate("/client/" + clientId + "/registration")} variant="outline-secondary" className="searchBtn">
                            ADAUGA REGISTRARE
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
                                placeholder="Search"
                                aria-label="Search"
                                aria-describedby="basic-addon2"
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                            <Button variant="outline-secondary" id="myBtn" className="searchBtn" onClick={searchRegistration}>
                                Search
                            </Button>
                        </InputGroup>
                    </Form.Group>


                </div>
                <br />
                <br />
                <div style={{ width: "50%" }}>
                    {registrations.length !== 0 && <Table headers={Object.keys(schema)} rows={registrations} tableName="registration" clientId={clientId} />}

                </div>
            </div>

        </Header>
    );
}