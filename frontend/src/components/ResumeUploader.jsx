import { useRef, useState } from 'react'


const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.jpg', '.jpeg', '.png']
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]


function ResumeUploader({ onFilesChange }) {
  const inputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [validationMessage, setValidationMessage] = useState('')

  function handleInputChange(event) {
    const selectedFiles = Array.from(event.target.files || [])
    processSelectedFiles(selectedFiles)
  }

  function handleDrop(event) {
    event.preventDefault()
    const droppedFiles = Array.from(event.dataTransfer.files || [])
    processSelectedFiles(droppedFiles)
  }

  function processSelectedFiles(selectedFiles) {
    const validFiles = []
    const invalidNames = []

    selectedFiles.forEach((file) => {
      const lowerName = file.name.toLowerCase()
      const hasSupportedExtension = ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))
      const hasSupportedType = file.type ? ACCEPTED_TYPES.includes(file.type) : false

      if (hasSupportedExtension || hasSupportedType) {
        validFiles.push(file)
      } else {
        invalidNames.push(file.name)
      }
    })

    setFiles(validFiles)

    if (invalidNames.length > 0) {
      setValidationMessage(`Unsupported file type: ${invalidNames.join(', ')}`)
    } else {
      setValidationMessage('')
    }

    if (typeof onFilesChange === 'function') {
      onFilesChange(validFiles)
    }
  }

  return (
    <div className="mt-4">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_EXTENSIONS.join(',')}
        onChange={handleInputChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        className="w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-slate-400 hover:bg-slate-100"
      >
        <span className="block text-sm font-medium text-slate-700">
          Drag and drop resumes here, or click to browse
        </span>
        <span className="mt-1 block text-xs text-slate-500">Supported: PDF, DOCX, JPG, JPEG, PNG</span>
      </button>

      <p className="mt-3 text-sm font-medium text-slate-700">Selected files: {files.length}</p>

      {validationMessage ? <p className="mt-1 text-sm text-rose-600">{validationMessage}</p> : null}

      {files.length > 0 ? (
        <ul className="mt-3 space-y-2 rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">
          {files.map((file) => (
            <li key={`${file.name}-${file.lastModified}`} className="truncate">
              {file.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}


export default ResumeUploader