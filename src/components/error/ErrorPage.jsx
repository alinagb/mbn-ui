import React from "react";
import Header from "../Header";
import "./style.css"
export default function ErrorPage() {
    return <Header>
        <div id="notfound">
            <div class="notfound">
                <div class="notfound-404">
                    <div></div>
                    <h1>EROARE</h1>
                </div>
                {/* <h2></h2> */}
                <p>Pagina nu poate fi incarcata sau este temporar indisponibila.</p>
                <a href="/">Acasa</a>
            </div>
        </div>
    </Header>
}