import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Header from '../Header';
import { getClientById, getDoctors, getRegistrationById } from '../integration/mbn-service';
import "./ViewRegistration.css"
import { FaArrowCircleLeft } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';

const ViewRegistration = React.forwardRef((props, ref) => {

    const [client, setClient] = useState(null);
    const params = useParams();
    const clientId = params.clientId;
    const registrationId = params.registrationId;

    const navigate = useNavigate();
    const [dateOfConsultation, setDateOfConsultation] = useState(null);
    const [age, setAge] = useState(null);
    const [files, setFiles] = useState([]);
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
                    var currentDate = new Date();
                    var currentYear = currentDate.getFullYear();
                    var age = currentYear - new Date(response.data.dateOfBirth).getFullYear();
                    setAge(age)
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
            getDoctors().then(responseDoctors => {
                if (responseDoctors && responseDoctors.status === 200) {
                    setRecommendedDoctor(responseDoctors.data.filter(doctor => doctor.idDoctor === responseRegistration.data.recommendedDoctor)[0].fullName)
                    setConsultedDoctor(responseDoctors.data.filter(doctor => doctor.idDoctor === responseRegistration.data.consultedDoctor)[0].fullName)
                }
            })

        })

    }, [clientId, registrationId])

    return clientId && registrationId && (<div ref={ref}>
        <Header addRaport={true}>
            <div style={{ margin: "2%" }} >

                <div className="hideWhenPrinting">
                    <Button onClick={() => navigate("/clients/" + clientId)} variant="outline-light" className="searchBtn">
                        <FaArrowCircleLeft style={{ marginRight: "10px" }}> </FaArrowCircleLeft>Back</Button>
                </div>
                
                <hr></hr>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="datePacient">
                        <h5><strong>Nume pacient:</strong> {client?.firstName} {client?.lastName}</h5>
                        <h5><strong>Varsta la consult:</strong> {age} ani</h5>
                        <h5><strong>CNP:</strong> {client?.cnp}</h5>
                        <h5><strong>Cod Pacient:</strong> {client?.codPatient}</h5>
                        <h5><strong>Adresa Pacient:</strong> {client?.address}</h5>
                    </div>
                    <div className="dateRegistrare">
                        <h5><strong>Numar Registru:</strong> {registrationId}</h5>
                        <h5><strong>Recomandat de:</strong> {recommendedDoctor}</h5>
                        <h5><strong>Consultat de:</strong> {consultedDoctor}</h5>
                        <h5><strong>Data:</strong> {dateOfConsultation}</h5>
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
                <div className="dateRegistrare grid-container" style={{ display: "grid" }}>
                    <h5 class="grid-item column-name"><strong>Diagnostic:</strong></h5>
                    <div class="grid-item details" >{diagnostic}</div>

                    <h5 class="grid-item column-name"><strong>Investigatii:</strong></h5>
                    <div class="grid-item details" >{investigation}</div>

                    <h5 class="grid-item column-name"><strong>Tratament:</strong></h5>
                    <div class="grid-item details" >{treatment}</div>

                    <h5 class="grid-item column-name"><strong>Recomandari:</strong></h5>
                    <div class="grid-item details" >{recommendation}</div>

                </div>
                <hr></hr>
                <h5><strong>Semnatura: </strong></h5> <hr></hr>
                <br />

                <br />
            </div >
        </Header >
    </div>
    )
})

export default ViewRegistration;