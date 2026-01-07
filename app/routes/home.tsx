import type { Route } from './+types/home'
import PickGameForm from '../components/PickGameForm'
import type { ComponentProps } from 'react'
import { AbsoluteCenter, Box } from '@chakra-ui/react'
import { useNavigate } from 'react-router'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Wollok Game' },
    { name: 'description', content: 'Welcome to the Wollok Game runner app!' },
  ]
}

export default function Home() {
  const navigate = useNavigate()

  const projectSelected: ComponentProps<typeof PickGameForm>['onSubmit'] = (
    settings,
    formikBag
  ) => {
    const ghRepo = `${settings.owner}/${settings.name}`
    const ghBranch = settings.branch
    const main = settings.main

    navigate(
      `/play?ghRepo=${encodeURIComponent(ghRepo)}&ghBranch=${encodeURIComponent(ghBranch)}&main=${encodeURIComponent(main)}`
    )
    formikBag.resetForm()
  }

  return (
    <Box>
      <AbsoluteCenter>
        <PickGameForm onSubmit={projectSelected} />
      </AbsoluteCenter>
    </Box>
  )
}
