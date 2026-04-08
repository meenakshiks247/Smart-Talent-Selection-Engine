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
  const [isDragging, setIsDragging] = useState(false)

  function handleInputChange(event) {
    const selectedFiles = Array.from(event.target.files || [])
    processSelectedFiles(selectedFiles)
    event.target.value = ''
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(event.dataTransfer.files || [])
    processSelectedFiles(droppedFiles)
  }

  function handleDragOver(event) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
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
      setValidationMessage(validFiles.length > 0 ? `${validFiles.length} file(s) ready to upload.` : '')
    }

    if (typeof onFilesChange === 'function') {
      onFilesChange(validFiles)
    }
  }

  function handleBrowseClick() {
    inputRef.current?.click()
  }

  function handleClearFiles() {
    setFiles([])
    setValidationMessage('')

    if (inputRef.current) {
      inputRef.current.value = ''
    }

    if (typeof onFilesChange === 'function') {
      onFilesChange([])
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

      <div
        role="button"
        tabIndex={0}
        onClick={handleBrowseClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleBrowseClick()
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full cursor-pointer rounded-xl border-2 border-dashed px-4 py-8 text-center transition sm:px-6 ${
          isDragging
            ? 'border-slate-900 bg-slate-100'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
        }`}
      >
        <span className="block text-sm font-semibold text-slate-800">
          Drag and drop resumes here, or click to browse
        </span>
        <span className="mt-1 block text-xs text-slate-500">Supported: PDF, DOCX, JPG, JPEG, PNG</span>
        <span className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
          Choose files
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-700">Selected files: {files.length}</p>
        {files.length > 0 ? (
          <button
            type="button"
            onClick={handleClearFiles}
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Clear files
          </button>
        ) : null}
      </div>

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