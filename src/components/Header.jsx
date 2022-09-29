import React from "react";
import logo from "../assets/cropped-Logo-300x90.png"
import "./Header.css"
export default function Header({ children, addRaport }) {

    return <div>
        <nav className="navbar navbar-light bg-light">
            <a className="navbar-brand" href="#">
                <img src={logo} height="50" className="d-inline-block align-top" alt=""></img>
            </a>
            {addRaport ? <div style={{ marginRight: "5%" }}>
                <hr></hr>
                <h1 style={{ color: "#66B2B9" }}>RAPORT MEDICAL</h1>

            </div> : <div></div>}
        </nav>
        <div className='children'>
            {children}
        </div>
    </div>
}