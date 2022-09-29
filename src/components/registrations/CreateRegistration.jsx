import React, { useState, useEffect } from 'react';
import { FormLabel } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from "react-router-dom";
import Header from '../Header';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import ImageUploading from 'react-images-uploading';
import { createRegistration, getClientById, getDoctors } from '../integration/mbn-service';

const CreateRegistration = React.forwardRef((props, ref) => {

    const [client, setClient] = useState(null);
    const params = useParams();
    const clientId = params.clientId;
    const navigate = useNavigate();
    const [dateOfConsultation, setDateOfConsultation] = useState(null);
    const [dateOfConsultationDay, setDateOfConsultationDay] = useState(null);
    const [dateOfConsultationWeek, setDateOfConsultationWeek] = useState(null);
    const [dateOfConsultationYear, setDateOfConsultationYear] = useState(null);
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const maxNumber = 69;
    const [doctors, setDoctors] = useState([]);
    const [diagnostic, setDiagnostic] = useState(null);
    const [investigation, setInvestigation] = useState(null);
    const [treatment, setTreatment] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [recommendedDoctor, setRecommendedDoctor] = useState(null);
    const [consultedDoctor, setConsultedDoctor] = useState(null);

    useEffect(() => {

        if (clientId != null) {
            getClientById(clientId).then((response) => {
                if (response && response.status === 200) {
                    console.log("client", response.data)
                    setClient(response.data)
                }
            })
        }

        getDoctors().then(response => {
            if (response && response.status === 200) {
                console.log("doctors", response.data)
                setDoctors(response.data)
            }
        })
        if (dateOfConsultationYear && dateOfConsultationWeek && dateOfConsultationDay) {
            setDateOfConsultation(dateOfConsultationYear + "-" + dateOfConsultationWeek + "-" + dateOfConsultationDay)

        }
    }, [dateOfConsultation, dateOfConsultationYear, dateOfConsultationWeek, dateOfConsultationDay])

    const onChange = (imageList, addUpdateIndex) => {
        // data for submits
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
        imageList.map(i => {
            setFiles([...files, i.file]);

        })
    };

    const createRegistrationInDb = async () => {
        setDateOfConsultation(dateOfConsultationYear + "-" + dateOfConsultationWeek + "-" + dateOfConsultationDay)

        await createRegistration(files, clientId, recommendedDoctor, consultedDoctor, dateOfConsultation, diagnostic, investigation, treatment, recommendation).then(response => {
            if (response.status === 201 && response) {
                if (response.data.hasOwnProperty("idRegistration")) {
                    navigate("/client/" + clientId + "/registration/" + response.data.idRegistration)
                }
            }
        })
    }

    return (<Header>
        <div style={{ margin: "2%" }} >
            <h3>  Creare inregistrare pentru {client?.firstName} {client?.lastName}</h3>
            <br />


            <Form>
                <Form.Group as={Row} className="mb-3" controlId="recommandedBy">

                    <Form.Label column sm="2">
                        Recomandat de:
                    </Form.Label>
                    <Form.Select aria-label="Default select example" sm="5" style={{ width: "30%" }} value={recommendedDoctor} onChange={(e) => setRecommendedDoctor(e.target.value)}>
                        {
                            doctors.map(doctor => {
                                return <option value={doctor.idDoctor}>{doctor.fullName}</option>
                            })
                        }

                    </Form.Select>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="ConsultedBy">
                    <Form.Label column sm="2">
                        Consultat de:
                    </Form.Label>

                    <Form.Select aria-label="Default select example" sm="5" style={{ width: "30%" }} value={consultedDoctor} onChange={(e) => setConsultedDoctor(e.target.value)}>
                        {
                            doctors.map(doctor => {
                                return <option value={doctor.idDoctor}>{doctor.fullName}</option>
                            })
                        }
                    </Form.Select>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="dateOfConsultation">
                    <Form.Label column lg={2}>
                        Data consultatiei:
                    </Form.Label>

                    <Col sm="1" style={{ paddingLeft: "0" }}>
                        <Form.Control type="text" placeholder="Zi" value={dateOfConsultationDay} onChange={(e) => setDateOfConsultationDay(e.target.value)} />
                    </Col>
                    <Col sm="1" style={{ paddingLeft: "0" }} >
                        <Form.Control type="text" placeholder="Luna" value={dateOfConsultationWeek} onChange={(e) => setDateOfConsultationWeek(e.target.value)} />
                    </Col>
                    <Col sm="2" style={{ paddingLeft: "0" }} >
                        <Form.Control type="text" placeholder="An" value={dateOfConsultationYear} onChange={(e) => setDateOfConsultationYear(e.target.value)} />
                    </Col>

                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="ConsultedBy">

                    <Form.Label column sm="2">
                        Incarca documente:
                    </Form.Label>
                </Form.Group>

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
                <Form.Group as={Row} className="mb-3" controlId="dateOfConsultation">
                    <Form.Label column lg={2}>
                        Diagnostic:
                    </Form.Label>
                    <FloatingLabel controlId="floatingTextarea2">
                        <Form.Control
                            as="textarea"
                            placeholder="Leave a comment here"
                            style={{ height: '100px' }}
                            value={diagnostic}
                            onChange={(e) => setDiagnostic(e.target.value)}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="dateOfConsultation">
                    <Form.Label column lg={2}>
                        Investigatii:
                    </Form.Label>
                    <FloatingLabel controlId="floatingTextarea2" >
                        <Form.Control
                            as="textarea"
                            placeholder="Leave a comment here"
                            style={{ height: '100px' }}
                            value={investigation}
                            onChange={(e) => setInvestigation(e.target.value)}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="dateOfConsultation">
                    <Form.Label column lg={2}>
                        Tratament:
                    </Form.Label>
                    <FloatingLabel controlId="floatingTextarea2" >
                        <Form.Control
                            as="textarea"
                            placeholder="Leave a comment here"
                            style={{ height: '100px' }}
                            value={treatment}
                            onChange={(e) => setTreatment(e.target.value)}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="dateOfConsultation">
                    <Form.Label column lg={2}>
                        Recomandari:
                    </Form.Label>
                    <FloatingLabel controlId="floatingTextarea2" >
                        <Form.Control
                            as="textarea"
                            placeholder="Leave a comment here"
                            style={{ height: '100px' }}
                            value={recommendation}
                            onChange={(e) => setRecommendation(e.target.value)}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Button variant="light" className="searchBtn" onClick={() => {
                    createRegistrationInDb();
                }}>
                    Salveaza
                </Button>
            </Form>

            <br />
        </div>
    </Header>
    )
})

export default CreateRegistration;