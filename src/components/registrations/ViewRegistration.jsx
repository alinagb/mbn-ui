import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Header from '../Header';
import { getClientById, getDoctors, getRegistrationById } from '../integration/mbn-service';
import "./ViewRegistration.css"
import { FaArrowCircleLeft } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const ViewRegistration = React.forwardRef((props, ref) => {

    const [client, setClient] = useState(null);
    const params = useParams();
    const clientId = params.clientId;
    const registrationId = params.registrationId;

    const navigate = useNavigate();
    const [dateOfConsultation, setDateOfConsultation] = useState(null);
    const [files, setFiles] = useState([]);
    const [diagnostic, setDiagnostic] = useState(null);
    const [investigation, setInvestigation] = useState(null);
    const [treatment, setTreatment] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [recommendedDoctor, setRecommendedDoctor] = useState(null);
    const [consultedDoctor, setConsultedDoctor] = useState(null);
    const [ageAtConsultation, setAgeAtConsultation] = useState(null);

    useEffect(() => {

        if (clientId != null) {
            getClientById(clientId).then((response) => {
                if (response && response.status === 200) {
                    setClient(response.data)
                }
            })
        }
        getRegistrationById(registrationId).then(responseRegistration => {

            setDiagnostic(responseRegistration.data.diagnostic)
            setInvestigation(responseRegistration.data.investigation)
            setTreatment(responseRegistration.data.treatment)
            setRecommendation(responseRegistration.data.recommendation)
            setDateOfConsultation(responseRegistration.data.dateOfConsultation)
            setFiles(responseRegistration.data.fileSet)
            setRecommendedDoctor(responseRegistration.data.recommendedDoctor)
            setConsultedDoctor(responseRegistration.data.consultedDoctor)
            setAgeAtConsultation(responseRegistration.data.ageAtConsultation)

        })

    }, [clientId, registrationId])

    return clientId && registrationId && (<div ref={ref}>
        <div class="page-header">
            <Header addRaport={true} >
                <div></div>
            </Header>
        </div>

        <div class="page-footer footer">
            <p>Contact: <br></br> Email - mbn_clinik@yahoo.com <br></br> Tel - 0732 041 404 | 0353 401 254</p>
        </div>

        <table style={{ width: "100%" }}>
            <thead>
                <tr>
                    <td>
                        <div class="page-header-space"></div>
                    </td>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>
                        {/* <Header addRaport={true} className="hideFromScreen"> */}
                        <div className="body" style={{ margin: "4%" }} >

                            <div className="hideWhenPrinting">
                                <Button onClick={() => navigate("/clients/" + clientId)} variant="outline-light" className="searchBtn">
                                    <FaArrowCircleLeft style={{ marginRight: "10px" }}> </FaArrowCircleLeft>Back</Button>
                            </div>

                            <hr></hr>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div className="datePacient">
                                    <h5><strong>Nume pacient:</strong> {client?.firstName} {client?.lastName}</h5>
                                    <h5><strong>Varsta la consult:</strong> {ageAtConsultation} ani</h5>
                                    <h5><strong>CNP:</strong> {client?.cnp}</h5>
                                    <h5><strong>Cod Pacient:</strong> {client?.codPatient}</h5>
                                    <h5><strong>Adresa Pacient:</strong> {client?.address}</h5>
                                </div>
                                <div className="dateRegistrare">
                                    <h5><strong>Numar Registru:</strong> {registrationId}  </h5>
                                    <h5><strong>Recomandat de:</strong> {recommendedDoctor}  </h5>
                                    <h5><strong>Consultat de:</strong> {consultedDoctor}  </h5>
                                    <h5><strong>Data:</strong>{dateOfConsultation}  </h5>
                                </div>

                            </div>
                            <div className="hideWhenPrinting" >
                                <hr></hr>
                                <h5><strong>Documente atasate: </strong></h5>
                                {files?.map(photo => (
                                    <img style={{ width: "30%", margin: "20px" }} src={"http://localhost:8090/file/image/" + client?.codPatient + "/" + photo.fileId}></img>

                                ))}
                            </div>

                            <hr></hr>

                            <div className="dateRegistrare">

                                <div
                                    style={{
                                        // backgroundColor: 'grey',
                                        borderRadius: 4,
                                        // color: '#eee',
                                        minHeight: "100%",
                                        padding: 12,
                                        width: "100%",
                                        border: "1px solid rgba(0, 0, 0, 0.175)",
                                        borderRadius: "0.375rem",
                                        marginBottom: "5px"
                                    }}
                                >
                                    <p><strong>Diagnostic:</strong></p>
                                    <hr></hr>
                                    {diagnostic}
                                </div>
                                <div
                                    style={{
                                        borderRadius: 4,
                                        // color: '#eee',
                                        minHeight: "100%",
                                        padding: 12,
                                        width: "100%",
                                        border: "1px solid rgba(0, 0, 0, 0.175)",
                                        borderRadius: "0.375rem",
                                        marginBottom: "5px"

                                    }}
                                >
                                    <p><strong>Investigatii: </strong></p>
                                    <hr></hr>
                                    {investigation}
                                </div>
                                <div
                                    style={{
                                        borderRadius: 4,
                                        minHeight: "100%",
                                        padding: 12,
                                        width: "100%",
                                        border: "1px solid rgba(0, 0, 0, 0.175)",
                                        borderRadius: "0.375rem",
                                        marginBottom: "5px"

                                    }}
                                >
                                    <p><strong>Tratament:</strong></p>
                                    <hr></hr>
                                    {treatment}
                                </div>
                                <div
                                    style={{
                                        borderRadius: 4,
                                        minHeight: "100%",
                                        padding: 12,
                                        width: "100%",
                                        border: "1px solid rgba(0, 0, 0, 0.175)",
                                        borderRadius: "0.375rem",
                                        marginBottom: "5px"

                                    }}
                                >
                                    <p><strong>Recomandari:</strong></p>
                                    <hr></hr>
                                    {recommendation}
                                </div>

                                {/* <Card >
                                    <Card.Header>Diagnostic</Card.Header>
                                    <Card.Body> {diagnostic} </Card.Body>
                                </Card>
                                <Card >
                                    <Card.Header>Investigatii</Card.Header>
                                    <Card.Body>{investigation}</Card.Body>
                                </Card>
                                <Card >
                                    <Card.Header>Tratament</Card.Header>
                                    <Card.Body>{treatment}</Card.Body>
                                </Card>
                                <Card >
                                    <Card.Header>Recomandari</Card.Header>
                                    <Card.Body>{recommendation}</Card.Body>
                                </Card> */}
                            </div>

                            <hr></hr>
                            <h5><strong>Semnatura: </strong></h5> <hr></hr>
                            <br />
                            <br />
                        </div >
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>
                        <div class="page-footer-space"></div>
                    </td>
                </tr>
            </tfoot>

        </table>
    </div>
    )
})

export default ViewRegistration;