// src/utils/api.js

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export async function fetchSurveys() {
    const response = await fetch(`${API_BASE_URL}/surveys/`);
    if (!response.ok) throw new Error('Failed to fetch surveys');
    return await response.json();
}

export async function fetchSurveyById(surveyId) {
    const response = await fetch(`${API_BASE_URL}/surveys/${surveyId}/`);
    if (!response.ok) throw new Error('Failed to fetch survey');
    return await response.json();
}

export async function createSurvey(surveyData) {
    const response = await fetch(`${API_BASE_URL}/surveys/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(surveyData)
    });
    if (!response.ok) throw new Error('Failed to create survey');
    return await response.json();
}

export async function submitSurveyResponse(surveySubmission) {
    const response = await fetch(`${API_BASE_URL}/survey-submissions/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(surveySubmission)
    });
    if (!response.ok) throw new Error('Failed to submit survey response');
    return await response.json();
}
