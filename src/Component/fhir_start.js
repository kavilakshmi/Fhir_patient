import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyComponent = () => {
    const [code, setCode] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [patient, setPatient] = useState('');
    const [patientData, setPatientData] = useState({});
    const clientId = '7c4a9063-cc65-498a-baa9-a0551091f183';
    const redirect = 'http://localhost:3000';

    useEffect(() => {
        const fetchData = async () => {
            const params = new URLSearchParams();
            const urlParams = new URLSearchParams(window.location.search);
            setCode(urlParams.get('code'));
            params.append('grant_type', 'authorization_code');
            params.append('redirect_uri', redirect);
            params.append('code', code);
            params.append('client_id', clientId);
            params.append('state', '1234');

            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/fhir+json'
                },
            };

            try {
                if (code && accessToken === '') {
                    const response = await axios.post(
                        'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token',
                        params,
                        config
                    );

                    setAccessToken(response.data.access_token);
                    setPatient(response.data.patient);
                }

                else if (accessToken) {
                    const response = await axios.get(
                        `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient/${patient}`,
                        { headers: { Authorization: `Bearer ${accessToken}` } }
                    );

                    setPatientData(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [code, accessToken]);

    const authorizelink = `https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=code&redirect_uri=${redirect}&client_id=${clientId}&state=1234&scope=patient.read, patient.search`;

    return (
        <div className="container">
            <div style={{ textAlign: 'center' }}>
                <h1>Smart on FHIR - Patient Info</h1>
                <p>
                    <strong>Username:</strong> fhircamila
                </p>
                <p>
                    <strong>Password:</strong> epicepic1
                </p>
                <a
                    href={authorizelink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Sign in
                </a>
                <hr />
            </div>
            {accessToken && (
                <div>
                    <p>
                        <strong>Patient Id:</strong> {patient}
                    </p>
                    <strong>Access code:</strong>
                    <p>
                        {accessToken}
                    </p>
                    <strong>Patient Resource:</strong>
                    <pre>{JSON.stringify(patientData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default MyComponent;
