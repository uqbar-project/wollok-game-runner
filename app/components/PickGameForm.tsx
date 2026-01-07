import {
  Button,
  CardBody,
  CardRoot,
  Field as ChakraField,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import type { FieldProps, FormikHelpers, FormikProps } from 'formik'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import { BsRocketTakeoff } from 'react-icons/bs'
import * as Yup from 'yup'
interface ProjectSettings {
  name: string
  owner: string
  branch: string
  main: string
}

interface FormValues {
  repoUrl: string
  branch: string
  main: string
}

interface PickGameFormProps {
  onSubmit?: (
    settings: ProjectSettings,
    formikBag: FormikHelpers<FormValues>
  ) => void
}

export default ({ onSubmit }: PickGameFormProps) => {
  // const initialValues: FormValues = {
  //   repoUrl: 'https://github.com/wollok/pepitaGame',
  //   branch: 'master',
  //   main: 'pgmPepitaGame'
  // };
  const [initialValues, setInitialValues] = useState<FormValues>({
    repoUrl: 'https://github.com/pdepjm/2024-o-tpjuego-bestiasalgoritmicas',
    branch: 'main',
    main: 'mainStickyBlocks',
  })

  const handleSubmit = (
    values: FormValues,
    formikBag: FormikHelpers<FormValues>
  ) => {
    const { owner, name } = parseGitHubUrl(values.repoUrl)
    const settings: ProjectSettings = {
      name,
      owner,
      branch: values.branch,
      main: values.main,
    }
    onSubmit?.(settings, formikBag)
    setInitialValues({ ...initialValues })
  }

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({
        isValid,
        isSubmitting,
        errors,
        touched,
      }: FormikProps<FormValues>) => {
        return (
          <Form>
            <CardRoot minW="40vw">
              <CardBody>
                <VStack gap={6} align="stretch">
                  <Heading size="lg">Launch Your Game</Heading>

                  <Field name="repoUrl">
                    {({ field }: FieldProps<string, FormValues>) => (
                      <ChakraField.Root
                        required
                        invalid={!!errors.repoUrl && touched.repoUrl}
                      >
                        <ChakraField.Label>
                          GitHub Repository URL
                        </ChakraField.Label>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://github.com/owner/repo"
                        />
                        <ChakraField.ErrorText>
                          {errors.repoUrl}
                        </ChakraField.ErrorText>
                      </ChakraField.Root>
                    )}
                  </Field>

                  <Field name="branch">
                    {({ field }: FieldProps<string, FormValues>) => (
                      <ChakraField.Root
                        required
                        invalid={!!errors.branch && touched.branch}
                      >
                        <ChakraField.Label>Branch</ChakraField.Label>
                        <Input {...field} type="text" placeholder="main" />
                        <ChakraField.ErrorText>
                          {errors.branch}
                        </ChakraField.ErrorText>
                      </ChakraField.Root>
                    )}
                  </Field>

                  <Field name="main">
                    {({ field }: FieldProps<string, FormValues>) => (
                      <ChakraField.Root
                        required
                        invalid={!!errors.main && touched.main}
                      >
                        <ChakraField.Label>Main (.wpgm) file</ChakraField.Label>
                        <Input {...field} type="text" placeholder="main" />
                        <ChakraField.ErrorText>
                          {errors.main}
                        </ChakraField.ErrorText>
                      </ChakraField.Root>
                    )}
                  </Field>

                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    colorPalette="brand"
                    color="white"
                    width="full"
                  >
                    Launch Game <BsRocketTakeoff />
                  </Button>
                </VStack>
              </CardBody>
            </CardRoot>
          </Form>
        )
      }}
    </Formik>
  )
}

const validationSchema = Yup.object().shape({
  repoUrl: Yup.string()
    .required('Repository URL is required')
    .url('Invalid URL')
    .matches(
      /^(https?:\/\/)?(www\.)?github\.com\/.+\/.+$/,
      'Must be a valid GitHub repository URL'
    ),
  branch: Yup.string().required('Branch is required'),
  main: Yup.string().required('Main file is required'),
})

const GITHUB_REPO_REGEX = /github\.com\/([^\/]+)\/([^\/]+)/

const parseGitHubUrl = (url: string) => {
  try {
    const match = url.match(GITHUB_REPO_REGEX)

    if (match) {
      const owner = match[1]
      const repo = match[2].replace(/\.git$/, '')
      return { owner, name: repo }
    }
  } catch (error) {
    return { owner: '', name: '' }
  }
  return { owner: '', name: '' }
}
