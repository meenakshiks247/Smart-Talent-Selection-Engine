import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

function buildApiError(error, fallbackMessage) {
  if (axios.isAxiosError(error)) {
    const detailMessage =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message

    return new Error(detailMessage || fallbackMessage)
  }

  return new Error(fallbackMessage)
}

export async function uploadResumes(files) {
  const formData = new FormData()

  files.forEach((file) => {
    formData.append('files', file)
  })

  try {
    const response = await apiClient.post('/resumes/bulk-upload', formData)
    return response.data
  } catch (error) {
    throw buildApiError(error, 'Failed to upload resumes.')
  }
}

export async function createJob(payload) {
  try {
    const response = await apiClient.post('/jobs/create', payload)
    return response.data
  } catch (error) {
    throw buildApiError(error, 'Failed to create job.')
  }
}

export async function rankCandidates(payload) {
  try {
    const response = await apiClient.post('/rank-candidates', payload)
    return response.data
  } catch (error) {
    throw buildApiError(error, 'Failed to rank candidates.')
  }
}