import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from "react-router-dom";
import Header from '../Header';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import { createRegistration, getClientById } from '../integration/mbn-service';
import { parse, isValid } from 'date-fns';
import SpinnerApp from '../SpinnerApp';
import { usePromiseTracker } from "react-promise-tracker";
import { trackPromise } from 'react-promise-tracker';
import ErrorPage from '../error/ErrorPage';
import AlertDismissible from '../clients/AlertDismissible';
import { FaArrowCircleLeft } from 'react-icons/fa';

const CreateRegistration = React.forwardRef((props, ref) => {

    const [client, setClient] = useState(null);
    const params = useParams();
    const clientId = params.clientId;
    const { promiseInProgress } = usePromiseTracker();

    const navigate = useNavigate();
    const [dateOfConsultationDay, setDateOfConsultationDay] = useState(null);
    const [dateOfConsultationWeek, setDateOfConsultationWeek] = useState(null);
    const [dateOfConsultationYear, setDateOfConsultationYear] = useState(null);
    const [files, setFiles] = useState([]);
    const [diagnostic, setDiagnostic] = useState(null);
    const [investigation, setInvestigation] = useState(null);
    const [treatment, setTreatment] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [recommendedDoctor, setRecommendedDoctor] = useState(null);
    const [consultedDoctor, setConsultedDoctor] = useState(null);
    const [form, setForm] = useState({})
    const [errors, setErrors] = useState({})
    const [errorPage, setErrorPgae] = useState(false);
    const [alert, setAlert] = useState({
        alert: false,
        color: "",
        message: ""
    })

    useEffect(() => {
        if (clientId !== null) {
            trackPromise(getClientById(clientId).then((response) => {
                if (response && response.status === 200) {
                    setClient(response.data)
                } else {
                    setErrorPgae(true)
                }
            }).catch(() => {
                setErrorPgae(true)
            }))
        }

        setTimeout(() => setAlert({
            alert: false
        }), 3000)

    }, [clientId, alert.alert])

    const onChange = (imageList) => {
        setFiles(imageList);
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

    const createRegistrationInDb = () => {
        const newErrors = findFormErrors()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            var date = dateOfConsultationYear + "-" + dateOfConsultationWeek + "-" + dateOfConsultationDay
            trackPromise(createRegistration(files, clientId, recommendedDoctor, consultedDoctor, date, diagnostic, investigation, treatment, recommendation).then(response => {
                if (response.status === 201 && response) {
                    if (response.data.hasOwnProperty("idRegistration")) {
                        navigate("/client/" + clientId + "/registration/" + response.data.idRegistration)
                    }
                } else {
                    setAlert({
                        alert: true,
                        color: "danger",
                        message: "Din pacate datele nu au putut fi actualizate"
                    })
                }
            }).catch(() => {
                setAlert({
                    alert: true,
                    color: "danger",
                    message: "Din pacate datele nu au putut fi actualizate"
                })
            }))
        }
    }
    if (promiseInProgress) {
        return <Header>
            <SpinnerApp></SpinnerApp>
        </Header>
    }
    else if (errorPage) {
        return <ErrorPage></ErrorPage>
    } else {
        return (<Header>
            <div style={{ margin: "2%" }} >

                <div >
                    <Button onClick={() => navigate("/clients/" + clientId)} variant="outline-light" className="searchBtn">
                        <FaArrowCircleLeft style={{ marginRight: "10px" }}> </FaArrowCircleLeft>Inapoi</Button>
                </div>
                <br></br>
                <h3>  Creare inregistrare pentru {client?.firstName} {client?.lastName}</h3>
                <br />
                {alert.alert && <AlertDismissible alert={alert.alert} color={alert.color} message={alert.message}></AlertDismissible>}
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
                    <Form.Group controlId="formFileMultiple" className="mb-3">
                        <Form.Control type="file" multiple
                            onChange={(e) => onChange(e.target.files)} />
                    </Form.Group>

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
    }
})

export default CreateRegistration;