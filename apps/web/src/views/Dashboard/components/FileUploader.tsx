import { Box, Button, Flex, Heading, Input, Text } from '@pancakeswap/uikit'
import React, { useRef, useState } from 'react'
import { FieldError } from 'react-hook-form'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  error?: FieldError
  fileName?: string
}

const FileUploader = ({ onFileSelect, error = undefined, fileName = '' }: FileUploaderProps) => {
  const fileInputRef = useRef(null)
  const [highlight, setHighlight] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    onFileSelect(file)
    setHighlight(false)
  }

  const handleBrowse = (e) => {
    const file = e.target.files[0]
    onFileSelect(file)
  }

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault()
        setHighlight(true)
      }}
      onDragLeave={() => setHighlight(false)}
      style={{
        height: '303px',
        border: '2px dashed #26FF87',
        borderRadius: '10px',
        padding: '40px',
        background: '#0f0e1a',
        color: '#fff',
        cursor: 'pointer',
        transition: 'border 0.2s',
      }}
    >
      <Flex height="100%" width="100%" flexDirection="column" alignItems="center" justifyContent="center">
        <Heading style={{ fontWeight: '500' }}>Drag and drop or browse</Heading>
        <Text fontSize="14px" color="#ccc" mt="4px">
          PNG, JPG, Screenshot, or PDF
        </Text>

        <Flex mt="16px">
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              fileInputRef.current?.click()
            }}
            style={{
              background: '#26FF87',
              color: '#000',
              border: 'none',
              height: '40px',
              borderRadius: '999px',
              padding: '10px 20px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Browse File
          </Button>
        </Flex>

        <Input type="file" ref={fileInputRef} onChange={handleBrowse} style={{ display: 'none' }} />

        {error && (
          <Text color="#ff4d4f" mt="12px">
            {error.message}
          </Text>
        )}

        {fileName && !error && (
          <Text color="#26FF87" mt="12px">
            {fileName}
          </Text>
        )}
      </Flex>
    </Box>
  )
}


export default FileUploader
