import { CREATE_CLIENT_ENDPOINT_URL, CREATE_REGISTRATION_ENDPOINT_URL, DELETE_FILE_BY_ID_ENDPOINT_URL, FILTER_CLIENTS, FILTER_REGISTRATIONS, GET_CLIENT_BY_ID_ENDPOINT_URL, GET_REGISTRATION_ENDPOINT_URL, UPDATE_CLIENT_BY_ID_ENDPOINT_URL, UPDATE_CLIENT_IMAGES_ENDPOINT_URL } from "./envConfig";
import { getReasonPhrase } from "http-status-codes";


export async function createClient(firstName, lastName, address, cnp, dateOfBirth, phone) {

  let response = null;
  try {
    let resp = await fetch(CREATE_CLIENT_ENDPOINT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        address: address,
        cnp: cnp,
        dateOfBirth: dateOfBirth,
        phone: phone
      }),
    });
    if (resp.status !== 200) {
      response = {
        status: resp.status
      };
    } else {
      response = {
        status: resp.status
      };
    }

  } catch (err) {
    response = {
      status: 500
    };
  }


  return response;
}

export async function getClientById(codPatient) {
  let response = null;

  let resp = await fetch(GET_CLIENT_BY_ID_ENDPOINT_URL(codPatient), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (resp.status !== 200) {
    response = {
      status: resp.status,
      statusText: getReasonPhrase(resp.status),
    };
  } else {
    let data = await resp.json();
    response = {
      status: resp.status,
      data
    };
  }
  return response;
}

function jsonEscape(str) {
  if(str ===null){
    str = "";
  }
  return str.replace(/\"/g, "'");
}


export async function createRegistration(files, clientId, recommendedDoctor, consultedDoctor, dateOfConsultation, diagnostic, investigation, treatment, recommendation) {

  let data = new FormData();

  for (const file of files) {
    data.append('files', file)
  }

  let registration = '{"recommendedDoctor": "' + jsonEscape(recommendedDoctor) + '", "consultedDoctor": "' + jsonEscape(consultedDoctor) + '", "dateOfConsultation":"' + dateOfConsultation + '", "diagnostic":"' + jsonEscape(diagnostic) + '", "investigation":"' + jsonEscape(investigation) + '","treatment":"' + jsonEscape(treatment) + '", "recommendation":"' + jsonEscape(recommendation) + '"}'
  console.log("registration", registration)

  data.append("registration", registration);

  let createdRegistration = CREATE_REGISTRATION_ENDPOINT_URL(clientId);
  let response;
  let resp = await fetch(createdRegistration, {
    method: "POST",
    body: data
  });

  if (resp.status !== 201) {
    response = {
      status: resp.status,
      statusText: getReasonPhrase(resp.status),
    };
  } else {
    let respData = await resp.json();

    response = {
      status: resp.status,
      data: respData,
    };
  }
  return response;
}

export async function getRegistrationById(
  registrationId
) {
  let getRegistrationUrl = GET_REGISTRATION_ENDPOINT_URL(registrationId);
  let response;

  await fetch(getRegistrationUrl, {
    method: "GET"
  })
    .then(async (resp) => {
      response = {
        status: resp.status,
        statusText: resp.statusText || getReasonPhrase(resp.status),
      };

      return resp.json();
    })
    .then((data) => {
      response = { ...response, data: data };
    })
    .catch((err) => {
      response = {
        status: 500,
        statusText: getReasonPhrase(500),
      };
    });


  return response;
}

export async function search(filterText, filterCriteria, tableName, clientId) {

  let url
  if (tableName === "clients") {
    url = FILTER_CLIENTS
  } else if (tableName === "registrations") {
    url = FILTER_REGISTRATIONS(clientId)
  }
  let response = null;
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filterText:  filterText,
      filterCriteria: filterCriteria
    }),
  })
    .then(async (resp) => {
      response = {
        status: resp.status,
        statusText: resp.statusText || getReasonPhrase(resp.status),
      };

      return resp.json();
    })
    .then((data) => {
      response = { ...response, data: data };
    })
    .catch((err) => {
      response = {
        status: 500,
        statusText: getReasonPhrase(500),
      };
    });


  return response;
}
export async function updateClientInDb(clientId, cnp, firstName, lastName, address, phone, gdprCompleted) {
  let response = null;
  await fetch(UPDATE_CLIENT_BY_ID_ENDPOINT_URL(clientId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cnp: cnp,
      firstName: firstName,
      lastName: lastName,
      address: address,
      phone: phone,
      gdprCompleted: gdprCompleted
    }),
  })
    .then(async (resp) => {
      response = {
        status: resp.status,
        statusText: resp.statusText || getReasonPhrase(resp.status),
      };

      return resp.json();
    })
    .then((data) => {
      response = { ...response, data: data };
    })
    .catch((err) => {
      response = {
        status: 500,
        statusText: getReasonPhrase(500),
      };
    });


  return response;
}

export async function updateClientImagesInDb(clientId, files) {
  let data = new FormData();

  for (const file of files) {
    data.append('files', file)
  }

  let createdRegistration = UPDATE_CLIENT_IMAGES_ENDPOINT_URL(clientId);
  let response;
  let resp = await fetch(createdRegistration, {
    method: "POST",
    body: data
  });

  if (resp.status !== 200) {
    response = {
      status: resp.status,
      statusText: getReasonPhrase(resp.status),
    };
  } else {
    let respData = await resp.json();

    response = {
      status: resp.status,
      data: respData,
    };
  }
  return response;
}

export async function deleteFile(clientId, fileId) {
  // console.log('fileId', fileId)
  // console.log('clientId', clientId)

  let response = null;
  await fetch(DELETE_FILE_BY_ID_ENDPOINT_URL(clientId, fileId), {
    method: "DELETE",
    // headers: {
    //   "Content-Type": "application/json",
    // }
  })
    .then(async (resp) => {
      response = {
        status: resp.status,
        statusText: resp.statusText || getReasonPhrase(resp.status),
      };

      return resp.status;
    })
    .then((data) => {
      response = { ...response, data: data };
    })
    .catch((err) => {
      response = {
        status: 500,
        statusText: getReasonPhrase(500),
      };
    });


  return response;
}