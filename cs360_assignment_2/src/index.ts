import { 
    getAllTranscripts, 
    createStudent, 
    getTranscriptById, 
    getStudentIdsByName, 
    deleteStudent, 
    addGrade, 
    getGrade,
} from './dataService';

// Extend Window so TS stops complaining
declare global {
    interface Window {
        getAllTranscripts: () => Promise<void>;
        createStudent: () => Promise<void>;
        getTranscriptById: () => Promise<void>;
        deleteStudent: () => Promise<void>;
        getStudentIds: () => Promise<void>;
        addGrade: () => Promise<void>;
        getGrade: () => Promise<void>;
        invokeApi: () => Promise<void>;
        updateBaseUrl: () => void;
        testFn: () => void;
    }
}
let baseUrl = 'http://localhost:4001';

function updateBaseUrl() {
    const input = document.getElementById('baseUrl') as HTMLInputElement | null;
    if (!input) return;
    const newUrl = input.value.replace(/\/$/, '');
    baseUrl = newUrl;
    showResponse('config-response', `Base URL updated to: ${newUrl}`, 'success');
}

function showResponse(elementId: string, data: any, type = 'normal') {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
        element.className = `response-area ${type}`;
    }
}

async function handleGetAllTranscripts() {
    try {
        const transcripts = await getAllTranscripts();
        showResponse('transcripts-response', transcripts, 'success');
    } catch (error: any) {
        showResponse('transcripts-response', error.message, 'error');
    }
}

async function handleCreateStudent() {
    const name = (document.getElementById('studentName') as HTMLInputElement)?.value;
    if (!name) {
        showResponse('transcripts-response', 'Please enter a student name', 'error');
        return;
    }
    try {
        const result = await createStudent(name);
        showResponse('transcripts-response', result, 'success');
    } catch (error: any) {
        showResponse('transcripts-response', error.message, 'error');
    }
}

async function handleGetTranscriptById() {
    const id = parseInt((document.getElementById('studentId') as HTMLInputElement)?.value);
    if (!id) {
        showResponse('transcripts-response', 'Please enter a student ID', 'error');
        return;
    }
    try {
        const transcript = await getTranscriptById(id);
        showResponse('transcripts-response', transcript, 'success');
    } catch (error: any) {
        showResponse('transcripts-response', error.message, 'error');
    }
}

async function handleDeleteStudent() {
    const id = parseInt((document.getElementById('studentId') as HTMLInputElement)?.value);
    if (!id) {
        showResponse('transcripts-response', 'Please enter a student ID', 'error');
        return;
    }
    try {
        await deleteStudent(id);
        showResponse('transcripts-response', 'Student deleted successfully', 'success');
    } catch (error: any) {
        showResponse('transcripts-response', error.message, 'error');
    }
}

async function handleGetStudentIds() {
    const name = (document.getElementById('searchName') as HTMLInputElement)?.value;
    if (!name) {
        showResponse('studentids-response', 'Please enter a student name', 'error');
        return;
    }
    try {
        const ids = await getStudentIdsByName(name);
        showResponse('studentids-response', ids, 'success');
    } catch (error: any) {
        showResponse('studentids-response', error.message, 'error');
    }
}

async function handleAddGrade() {
    const studentId = parseInt((document.getElementById('gradeStudentId') as HTMLInputElement)?.value);
    const course = (document.getElementById('courseName') as HTMLInputElement)?.value;
    const grade = parseInt((document.getElementById('gradeValue') as HTMLInputElement)?.value);
    if (!studentId || !course || !grade) {
        showResponse('grades-response', 'Please fill in all grade fields', 'error');
        return;
    }
    try {
        await addGrade(studentId, course, grade);
        showResponse('grades-response', 'Grade added successfully', 'success');
    } catch (error: any) {
        showResponse('grades-response', error.message, 'error');
    }
}

async function handleGetGrade() {
    const studentId = parseInt((document.getElementById('gradeStudentId') as HTMLInputElement)?.value);
    const course = (document.getElementById('courseName') as HTMLInputElement)?.value;
    if (!studentId || !course) {
        showResponse('grades-response', 'Please enter student ID and course', 'error');
        return;
    }
    try {
        const gradeInfo = await getGrade(studentId, course);
        showResponse('grades-response', gradeInfo, 'success');
    } catch (error: any) {
        showResponse('grades-response', error.message, 'error');
    }
}

async function invokeApi() {
    const method = (document.getElementById('method') as HTMLSelectElement)?.value;
    const endpoint = (document.getElementById('endpoint') as HTMLInputElement)?.value;
    const bodyText = (document.getElementById('requestBody') as HTMLTextAreaElement)?.value;
    if (!endpoint) {
        showResponse('api-response', 'Please enter an endpoint', 'error');
        return;
    }
    try {
        const options: RequestInit = { method, headers: { 'Content-Type': 'application/json' } };
        if (bodyText.trim() && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(JSON.parse(bodyText));
        }
        const response = await fetch(`${baseUrl}${endpoint}`, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        const data = response.status === 204 ? 'Success (No Content)' : await response.json();
        showResponse('api-response', data, 'success');
    } catch (error: any) {
        showResponse('api-response', error.message, 'error');
    }
}

// Attach to window
window.getAllTranscripts = handleGetAllTranscripts;
window.createStudent = handleCreateStudent;
window.getTranscriptById = handleGetTranscriptById;
window.deleteStudent = handleDeleteStudent;
window.getStudentIds = handleGetStudentIds;
window.addGrade = handleAddGrade;
window.getGrade = handleGetGrade;
window.invokeApi = invokeApi;
window.updateBaseUrl = updateBaseUrl;
window.testFn = () => alert("It works!");

document.addEventListener('DOMContentLoaded', () => {
    console.log('Transcript Manager Client loaded');
});
