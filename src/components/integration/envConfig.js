export const appServiceBaseUrl = process.env.REACT_APP_PS_APPLICATION_SERVICE_API_URL || "http://localhost:8090";

export const CREATE_CLIENT_ENDPOINT_URL = `${appServiceBaseUrl}/client/create`;

export const GET_CLIENT_BY_ID_ENDPOINT_URL = (clientId) => {
  let getClientByIdUrl =
    process.env.REACT_APP_PS_APPLICATION_SERVICE_API_URL || "http://localhost:8090";
  return `${getClientByIdUrl}/client/${clientId}`;
};

export const CREATE_REGISTRATION_ENDPOINT_URL = (clientId) => {
  let getClientByIdUrl =
    process.env.REACT_APP_PS_APPLICATION_SERVICE_API_URL || "http://localhost:8090";
  return `${getClientByIdUrl}/registration/${clientId}`;
};

export const GET_REGISTRATION_ENDPOINT_URL = (registrationId) => {
  let getClientByIdUrl =
    process.env.REACT_APP_PS_APPLICATION_SERVICE_API_URL || "http://localhost:8090";
  return `${getClientByIdUrl}/registration/${registrationId}`;
};
export const FILTER_CLIENTS = `${appServiceBaseUrl}/client/search`;

export const FILTER_REGISTRATIONS = (clientId) => {
  let getClientByIdUrl =
    process.env.REACT_APP_PS_APPLICATION_SERVICE_API_URL || "http://localhost:8090";
  return `${getClientByIdUrl}/registration/client/${clientId}/search`;
};

export const UPDATE_CLIENT_BY_ID_ENDPOINT_URL = (clientId) => {
  let getClientByIdUrl =
    process.env.REACT_APP_PS_APPLICATION_SERVICE_API_URL || "http://localhost:8090";
  return `${getClientByIdUrl}/client/update/${clientId}`;
};

export const UPDATE_CLIENT_IMAGES_ENDPOINT_URL = (clientId) => {
  let getClientByIdUrl =
    process.env.REACT_APP_PS_APPLICATION_SERVICE_API_URL || "http://localhost:8090";
  return `${getClientByIdUrl}/client/update/images/${clientId}`;
};

export const DELETE_FILE_BY_ID_ENDPOINT_URL = (clientId, fileId) => {
  let deleteFileById =
    process.env.REACT_APP_PS_APPLICATION_SERVICE_API_URL || "http://localhost:8090";
  return `${deleteFileById}/file/image/${clientId}/${fileId}`;
};
