import { useEffect, forwardRef, useImperativeHandle } from "react";
import { Formik, Form, Field } from 'formik';
import type { FormikBag, FormikHelpers, FormikProps } from 'formik';

interface ProjectSettings {
  name: string;
  owner: string;
  branch: string;
  main: string;
}

interface FormValues {
  repoUrl: string;
  branch: string;
  main: string;
}

interface PickGameFormProps {
  onSubmit?: (settings: ProjectSettings, formikBag: FormikHelpers<FormValues>) => void;
}

const PickGameForm = ({ onSubmit }: PickGameFormProps) => {
  const parseGitHubUrl = (url: string) => {
    try {
      const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)/;
      const match = url.match(githubRegex);
      
      if (match) {
        const owner = match[1];
        const repo = match[2].replace(/\.git$/, '');
        return { owner, name: repo };
      }
    } catch (error) {
      // Handle error silently
    }
    return { owner: '', name: '' };
  };

  const initialValues: FormValues = {
    repoUrl: 'https://github.com/pdepjm/2024-o-tpjuego-bestiasalgoritmicas',
    branch: 'main',
    main: 'mainStickyBlocks'
  };

  const handleSubmit = (values: FormValues, formikBag: FormikHelpers<FormValues>) => {
    const { owner, name } = parseGitHubUrl(values.repoUrl);
    
    if (name && owner && values.branch) {
      const settings: ProjectSettings = {
        name,
        owner,
        branch: values.branch,
        main: values.main
      };
      onSubmit?.(settings, formikBag);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}

    >
      {({ values, resetForm }: FormikProps<FormValues>) => {
        const { owner, name } = parseGitHubUrl(values.repoUrl);

        return (
          <Form>
            <div>
              <label htmlFor="repoUrl">
                GitHub Repository URL:
              </label>
              <Field
                name="repoUrl"
                type="url"
                placeholder="https://github.com/owner/repo"
              />
            </div>

            <div>
              <label htmlFor="branch">
                Branch:
              </label>
              <Field
                name="branch"
                type="text"
                placeholder="main"
              />
            </div>

            <div>
              <label htmlFor="main">
                Main (.wpgm) file:
              </label>
              <Field
                name="main"
                type="text"
                placeholder="main"
              />
            </div>

            {owner && name && (
              <div>
                <p>
                  <strong>{owner}/{name}</strong>
                </p>
                <p>
                  Main: <strong>{values.main}</strong>
                </p>
              </div>
            )}

            <button 
              type="submit"
              disabled={!name || !owner || !values.branch}
            >
              Select Game
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}

export default PickGameForm;