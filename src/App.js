import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { CREATE_REGISTRATION_URL_PATH, GET_CLIENTS_URL_PATH, GET_CLIENT_URL_PATH, INTRO_PAGE_URL_PATH, VIEW_REGISTRATION_URL_PATH } from './components/paths';
import IntroPage from "./components/IntroPage/IntroPage.jsx"
import GetClients from './components/clients/GetClients';
import GetClient from './components/clients/getClient';
import CreateRegistration from './components/registrations/CreateRegistration';
import ExportPdfComponent from './components/registrations/ExportPdfComponent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={INTRO_PAGE_URL_PATH} element={<IntroPage />} />
        <Route path={GET_CLIENTS_URL_PATH} element={<GetClients />} />
        <Route path={GET_CLIENT_URL_PATH} element={<GetClient />} />
        <Route path={CREATE_REGISTRATION_URL_PATH} element={<CreateRegistration />} />
        <Route path={VIEW_REGISTRATION_URL_PATH} element={<ExportPdfComponent />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
