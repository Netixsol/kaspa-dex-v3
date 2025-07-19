import styled from 'styled-components'
import { Heading, Text, Flex, Button, IconButton } from '@pancakeswap/uikit'
import FileUploader from './components/FileUploader'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { useCreateBugReport } from './hooks/useCreateBugReport'
import SpinnerLoader from './components/shared/SpinnerLoader'
import toast from 'react-hot-toast'
import { ShareIcon } from './icons/share.ico'

const MAX_DESCRIPTION_LENGTH = 5000

const ReportBug = () => {
  const { mutate, isLoading } = useCreateBugReport()

  const {
    handleSubmit,
    register,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: '',
      file: null,
    },
  })

  const description = watch('description') || ''

  const onSubmit = (data: any) => {
    if (!data.file) {
      alert('Please upload a file.')
      return
    }

    mutate(
      {
        text: data.description,
        file: data.file,
      },
      {
        onSuccess: () => {
          toast.success('Successfully toasted!')
          reset()
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex style={{ flexDirection: 'column', gap: '28px' }}>
        <Flex style={{ flexDirection: 'column', gap: '16px' }}>
          <Flex style={{ justifyContent: 'space-between' }}>
            <ResponsiveHeading scale="xxl">Submit Bug Report</ResponsiveHeading>
            <Flex>
              <Button type='button' variant="secondary" height={38}>
                <ResponsiveText fontSize={10} py={1} px={3}>
                  Share Now
                </ResponsiveText>
              </Button>
            </Flex>
          </Flex>

          <Text fontSize={16}>Describe the bug in detail. Valid bug reports earn 500–2,000 points.</Text>

          <TextareaWrapper>
            <textarea
              {...register('description', {
                required: 'Bug description is required',
                maxLength: {
                  value: MAX_DESCRIPTION_LENGTH,
                  message: `Maximum ${MAX_DESCRIPTION_LENGTH} characters allowed`,
                },
              })}
              maxLength={MAX_DESCRIPTION_LENGTH}
              placeholder="Type here........"
              style={{
                flex: 1,
                width: '100%',
                fontSize: '14px',
                padding: 0,
                margin: 0,
                background: 'transparent',
                color: 'white',
                border: 'none',
                outline: 'none',
                resize: 'none',
                overflowY: 'auto',
              }}
            />
            <CharacterCount>{`${description.length}/${MAX_DESCRIPTION_LENGTH}`}</CharacterCount>
          </TextareaWrapper>

          {errors.description && (
            <Text color="red" fontSize={12}>
              {errors.description.message}
            </Text>
          )}
        </Flex>

        <Flex style={{ flexDirection: 'column', gap: '28px' }}>
          <Heading scale="xxl">Upload Bug Report</Heading>
          <Controller
            name="file"
            control={control}
            rules={{
              required: 'A file is required',
              validate: {
                fileType: (file) =>
                  (file && ['image/png', 'image/jpeg', 'application/pdf'].includes(file.type)) ||
                  'Only PNG, JPG, or PDF files are allowed.',
                fileSize: (file) => (file && file.size <= 5 * 1024 * 1024) || 'File must be under 5MB.',
              },
            }}
            render={({ field }) => (
              <FileUploader
                onFileSelect={(file) => field.onChange(file)}
                error={errors.file as import('react-hook-form').FieldError | undefined}
                fileName={field.value?.name || ''}
              />
            )}
          />
        </Flex>

        <Flex style={{ justifyContent: 'center', paddingTop: '15px' }}>
          <Button variant="secondary" style={{ width: '332px', height: '40px' }} type="submit" disabled={isLoading}>
            {isLoading ? (
              <Flex alignItems="center" justifyContent="center" width="100%">
                <SpinnerLoader size={24} color="#1FD26F" bg="#eee" />
              </Flex>
            ) : (
              <Text fontSize={16} style={{ whiteSpace: 'nowrap' }}>
                Submit
              </Text>
            )}
          </Button>
        </Flex>
      </Flex>
    </form>
  )
}

const TextareaWrapper = styled(Flex)`
  position: relative;
  background: #252136;
  margin-top: 5px;
  padding: 18px 15px;
  height: 190px;
  border-radius: 16px;
  flex-grow: 1;
`

const CharacterCount = styled(Text)`
  position: absolute;
  bottom: 12px;
  right: 15px;
  font-size: 12px;
  color: #aaa;
`

const ResponsiveHeading = styled(Heading)`
  white-space: nowrap;

  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`

const ResponsiveText = styled(Text)`
  white-space: nowrap;

  @media screen and (min-width: 768px) {
    font-size: 14px;
  }
`

export default ReportBug
