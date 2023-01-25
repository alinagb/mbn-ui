import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Header from '../Header';
import { deleteFile, getClientById, getRegistrationById } from '../integration/mbn-service';
import "./ViewRegistration.css"
import { FaArrowCircleLeft } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import { appServiceBaseUrl } from '../integration/envConfig';
import { Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { Worker } from '@react-pdf-viewer/core';
import { saveAs } from "file-saver";
import AlertDismissible from '../clients/AlertDismissible';
import { MdDeleteForever } from 'react-icons/md';


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
    const [reg, setReg]= useState(null);
    
    const [alert, setAlert] = useState({
        alert: false,
        color: "",
        message: ""
    })
    const saveFile = (photo) => {
        saveAs(
            appServiceBaseUrl + "/file/image/pdf/" + client?.codPatient + "/" + photo.fileId,
            "GDPR.pdf"
        );
    };

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
    useEffect(() => {

        console.log("a", alert)
        if (clientId !== null) {
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
        console.log("investigation", investigation)
        setTimeout(() => setAlert({
            alert: false
        }), 3000)
    }, [clientId, registrationId, alert.alert])

    return clientId && registrationId && (<div ref={ref}>
        <div className="page-header">
            <Header addRaport={true} >
                <div></div>
            </Header>
        </div>

        <div className="page-footer footer">
            <p>Contact: <br></br> Email - mbn_clinik@yahoo.com <br></br> Tel - 0732 041 404 | 0353 401 254</p>
        </div>

        <table style={{ width: "100%" }}>
            <thead>
                <tr>
                    <td>
                        <div className="page-header-space"></div>
                    </td>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>
                        <div className="body" style={{ margin: "4%" }} >

                            <div className="hideWhenPrinting">
                                <Button onClick={() => navigate("/clients/" + clientId)} variant="outline-light" className="searchBtn">
                                    <FaArrowCircleLeft style={{ marginRight: "10px" }}> </FaArrowCircleLeft>Inapoi</Button>
                            </div>
                            {alert.alert && <AlertDismissible alert={alert.alert} color={alert.color} message={alert.message}></AlertDismissible>}

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

                                <div style={{ display: "flex", flexFlow: "wrap" }}>
                                    {files?.map(photo => {
                                        var ext = photo?.name.substr(photo?.name.lastIndexOf('.') + 1);
                                        if (ext !== "pdf") {
                                            return <div style={{ width: "20%", padding: "1%" }}>

                                                <a href={appServiceBaseUrl + "/file/image/" + client?.codPatient + "/" + photo.fileId} target="_blank" rel="noreferrer">
                                                    <div style={{ overflow: "auto", height: "200px" }}>
                                                        <img style={{ width: "90%", padding: "5%", border: '1px solid rgba(0, 0, 0, 0.3)' }} src={appServiceBaseUrl + "/file/image/" + client?.codPatient + "/" + photo.fileId} alt=""></img>
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

                                <div style={{ display: "flex" }}>

                                    {files?.map(photo => {
                                        var ext = photo?.name.substr(photo?.name.lastIndexOf('.') + 1);
                                        if (ext === "pdf") {
                                            return <div style={{ width: "20%", padding: "1%" }}>
                                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
                                                    <a href='javascript:void(0)' onClick={() => saveFile(photo)}>
                                                        <div
                                                            style={{
                                                                border: '1px solid rgba(0, 0, 0, 0.3)',
                                                                height: '200px',
                                                            }}
                                                        >
                                                            <Viewer style={{ width: "100%" }} initialPage={1} fileUrl={appServiceBaseUrl + "/file/image/pdf/" + client?.codPatient + "/" + photo.fileId} defaultScale={SpecialZoomLevel.PageWidth}></Viewer>
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
                                                <MdDeleteForever  style={{ marginRight: "10px", marginTop: "25px", verticalAlign: "top", backgroundColor: "white", borderStyle: "solid", cursor: "pointer" }}  size={25}  color="red" onClick={() => removeImage(photo?.fileId)}> </MdDeleteForever>

                                            </div>

                                        }
                                    })}

                                </div>

                            </div>

                            <hr></hr>

                            <div className="dateRegistrare">

                                <div
                                    style={{
                                        minHeight: "100%",
                                        padding: 12,
                                        width: "100%",
                                        border: "1px solid rgba(0, 0, 0, 0.175)",
                                        borderRadius: "0.375rem",
                                        marginBottom: "5px",
                                        whiteSpace: "pre-wrap"
                                    }}
                                >
                                    <p><strong>Diagnostic:</strong></p>
                                    <hr></hr>
                                    {diagnostic}
                                </div>
                                <div
                                    style={{
                                        minHeight: "100%",
                                        padding: 12,
                                        width: "100%",
                                        border: "1px solid rgba(0, 0, 0, 0.175)",
                                        borderRadius: "0.375rem",
                                        marginBottom: "5px",
                                        whiteSpace: "pre-wrap"

                                    }}
                                >
                                    <p><strong>Investigatii: </strong></p>
                                    <hr></hr>
                                    {/* <div class="multiline"> */}
                                    {investigation}
                                        {/* </div> */}
                                </div>
                                <div
                                    style={{
                                        minHeight: "100%",
                                        padding: 12,
                                        width: "100%",
                                        border: "1px solid rgba(0, 0, 0, 0.175)",
                                        borderRadius: "0.375rem",
                                        marginBottom: "5px",
                                        whiteSpace: "pre-wrap"

                                    }}
                                >
                                    <p><strong>Tratament:</strong></p>
                                    <hr></hr>
                                    {treatment}
                                </div>
                                <div
                                    style={{
                                        minHeight: "100%",
                                        padding: 12,
                                        width: "100%",
                                        border: "1px solid rgba(0, 0, 0, 0.175)",
                                        borderRadius: "0.375rem",
                                        marginBottom: "5px",
                                        whiteSpace: "pre-wrap"

                                    }}
                                >
                                    <p><strong>Recomandari:</strong></p>
                                    <hr></hr>
                                    {recommendation}
                                </div>
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
                        <div className="page-footer-space"></div>
                    </td>
                </tr>
            </tfoot>

        </table>
    </div >
    )
})

export default ViewRegistration;