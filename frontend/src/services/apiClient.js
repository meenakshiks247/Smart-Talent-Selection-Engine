const API_BASE_URL = 'http://localhost:8000/api/v1'

export async function uploadResumes(files) {
  const formData = new FormData()

  files.forEach((file) => {
    formData.append('files', file)
  })

  const response = await fetch(`${API_BASE_URL}/resumes/bulk-upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload resumes')
  }

  return response.json()
}

export async function createJob(payload) {
  const response = await fetch(`${API_BASE_URL}/jobs/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to create job')
  }

  return response.json()
}

export async function rankCandidates(payload) {
  const response = await fetch(`${API_BASE_URL}/rank-candidates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to rank candidates')
  }

  return response.json()
}