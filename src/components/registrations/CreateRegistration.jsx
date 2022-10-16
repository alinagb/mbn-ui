import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from "react-router-dom";
import Header from '../Header';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import ImageUploading from 'react-images-uploading';
import { createRegistration, getClientById } from '../integration/mbn-service';
import { parse, isValid } from 'date-fns';

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
    const [diagnostic, setDiagnostic] = useState(null);
    const [investigation, setInvestigation] = useState(null);
    const [treatment, setTreatment] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [recommendedDoctor, setRecommendedDoctor] = useState(null);
    const [consultedDoctor, setConsultedDoctor] = useState(null);
    const [form, setForm] = useState({})
    const [errors, setErrors] = useState({})

    useEffect(() => {

        if (clientId === null) {
            getClientById(clientId).then((response) => {
                if (response && response.status === 200) {
                    setClient(response.data)
                }
            })
        }

        if (dateOfConsultationYear && dateOfConsultationWeek && dateOfConsultationDay) {
            setDateOfConsultation(dateOfConsultationYear + "-" + dateOfConsultationWeek + "-" + dateOfConsultationDay)

        }
    }, [dateOfConsultation, dateOfConsultationYear, dateOfConsultationWeek, dateOfConsultationDay])

    const onChange = (imageList, addUpdateIndex) => {
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
        imageList.map(i => {
            setFiles([...files, i.file]);

        })
    };

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
        const { dateOfConsultationDay, dateOfConsultationWeek, dateOfConsultationYear } = form
        const newErrors = {}
        const validDate = parse(`${dateOfConsultationDay}.${dateOfConsultationWeek}.${dateOfConsultationYear}`, "dd.MM.yyyy", new Date());

        if (!dateOfConsultationDay || dateOfConsultationDay === '') newErrors.dateOfConsultationDay = 'Introduceti zi consultatie'
        else if (dateOfConsultationDay <= 1 && dateOfConsultationDay >= 31) newErrors.dateOfConsultationDay = 'Zi consultatie invalida'
        if (!dateOfConsultationWeek || dateOfConsultationWeek === '') newErrors.dateOfConsultationWeek = 'Introduceti luna consultatie'
        else if (dateOfConsultationWeek <= 1 && dateOfConsultationWeek >= 12) newErrors.dateOfConsultationWeek = 'Luna consultatie invalida'
        if (!dateOfConsultationYear || dateOfConsultationYear === '') newErrors.dateOfConsultationYear = 'Introduceti an consultatie'
        else if (!isValid(validDate)) newErrors.dateOfConsultationYear = 'Introduceti data consultatie valida'
        return newErrors
    }

    const createRegistrationInDb = async () => {
        const newErrors = findFormErrors()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            setDateOfConsultation(dateOfConsultationYear + "-" + dateOfConsultationWeek + "-" + dateOfConsultationDay)

            await createRegistration(files, clientId, recommendedDoctor, consultedDoctor, dateOfConsultation, diagnostic, investigation, treatment, recommendation).then(response => {
                if (response.status === 201 && response) {
                    if (response.data.hasOwnProperty("idRegistration")) {
                        navigate("/client/" + clientId + "/registration/" + response.data.idRegistration)
                    }
                }
            })
        }
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
                    <Col sm="2" style={{ paddingLeft: "0" }}>
                        <Form.Control type="text" placeholder="Recomandat de" value={recommendedDoctor} onChange={(e) => setRecommendedDoctor(e.target.value)} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="ConsultedBy">
                    <Form.Label column sm="2">
                        Consultat de:
                    </Form.Label>

                    <Col sm="2" style={{ paddingLeft: "0" }}>
                        <Form.Control type="text" placeholder="Consultat de" value={consultedDoctor} onChange={(e) => setConsultedDoctor(e.target.value)} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="dateOfConsultation">
                    <Form.Label column lg={2}>
                        Data consultatiei:
                    </Form.Label>

                    <Col sm="1" style={{ paddingLeft: "0" }}>
                        <Form.Control
                            type="number"
                            placeholder="Zi"
                            value={dateOfConsultationDay}
                            onChange={(e) => {
                                setField('dateOfConsultationDay', e.target.value);
                                setDateOfConsultationDay(e.target.value)
                            }}
                            isInvalid={!!errors.dateOfConsultationDay}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {errors.dateOfConsultationDay}
                        </Form.Control.Feedback>

                    </Col>
                    <Col sm="1" style={{ paddingLeft: "0" }} >
                        <Form.Control
                            type="number"
                            placeholder="Luna"
                            value={dateOfConsultationWeek}
                            onChange={(e) => {
                                setField('dateOfConsultationWeek', e.target.value);
                                setDateOfConsultationWeek(e.target.value)
                            }}
                            isInvalid={!!errors.dateOfConsultationWeek}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {errors.dateOfConsultationWeek}
                        </Form.Control.Feedback>
                    </Col>
                    <Col sm="2" style={{ paddingLeft: "0" }} >
                        <Form.Control
                            type="number"
                            placeholder="An"
                            value={dateOfConsultationYear}
                            onChange={(e) => {
                                setField('dateOfConsultationYear', e.target.value);
                                setDateOfConsultationYear(e.target.value)
                            }}
                            isInvalid={!!errors.dateOfConsultationYear}

                        />
                        <Form.Control.Feedback type='invalid'>
                            {errors.dateOfConsultationYear}
                        </Form.Control.Feedback>
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
                            {images.length !== 0 && <Button cvariant="light" className="searchBtn" onClick={onImageRemoveAll}>Remove all images</Button>}
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