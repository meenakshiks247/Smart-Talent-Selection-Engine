import { useRef, useState } from 'react'


const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.jpg', '.jpeg', '.png']
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]


function ResumeUploader({ files = [], onFilesChange, isAnalyzing = false }) {
  const inputRef = useRef(null)
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

    if (invalidNames.length > 0) {
      setValidationMessage(`Unsupported file type: ${invalidNames.join(', ')}`)
    } else {
      setValidationMessage(validFiles.length > 0 ? `${validFiles.length} file(s) added to batch.` : '')
    }

    // Append new valid files to existing files (sequential uploads)
    if (validFiles.length > 0 && typeof onFilesChange === 'function') {
      const mergedFiles = [...files, ...validFiles]
      onFilesChange(mergedFiles)
    }
  }

  function handleBrowseClick() {
    inputRef.current?.click()
  }

  function handleClearFiles() {
    setValidationMessage('')

    if (inputRef.current) {
      inputRef.current.value = ''
    }

    if (typeof onFilesChange === 'function') {
      onFilesChange([])
    }
  }

  function handleRemoveFile(indexToRemove) {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove)
    
    if (typeof onFilesChange === 'function') {
      onFilesChange(updatedFiles)
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
        onClick={() => {
          if (!isAnalyzing) {
            handleBrowseClick()
          }
        }}
        onKeyDown={(event) => {
          if ((event.key === 'Enter' || event.key === ' ') && !isAnalyzing) {
            event.preventDefault()
            handleBrowseClick()
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full rounded-2xl border-2 border-dashed px-4 py-9 text-center transition sm:px-6 ${
          isDragging
            ? 'border-sky-500 bg-sky-50'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-white'
        } ${isAnalyzing ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
        aria-disabled={isAnalyzing}
      >
        <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 16V6" strokeLinecap="round" />
            <path d="M8.5 9.5 12 6l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 17.5a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 17.5" strokeLinecap="round" />
          </svg>
        </span>
        <span className="block text-sm font-semibold text-slate-800">
          {isAnalyzing ? 'Upload locked while analysis is running' : 'Drag and drop resumes here, or click to browse'}
        </span>
        <span className="mt-1 block text-xs text-slate-500">Bulk upload supported</span>
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
            disabled={isAnalyzing}
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            Clear files
          </button>
        ) : null}
      </div>

      {validationMessage ? <p className="mt-1 text-sm text-rose-600">{validationMessage}</p> : null}

      {files.length > 0 ? (
        <ul className="mt-3 space-y-2 rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.lastModified}`}
              className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2"
            >
              <span className="truncate">{file.name}</span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
                  Ready
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  disabled={isAnalyzing}
                  className="text-slate-400 transition hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Remove file"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}


export default ResumeUploader