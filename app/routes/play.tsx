import {
  AbsoluteCenter,
  Box,
  Button,
  EmptyState,
  IconButton,
  Progress,
  VStack,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import { useNavigate, useSearchParams } from 'react-router'
import { Game } from '../.client/game.client'
import { useWollokGameGithubProject } from '../hooks/pick-repo'
import type { Route } from './+types/play'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Play - Wollok Game' },
    { name: 'description', content: 'Play your Wollok Game!' },
  ]
}

export default function Play() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loadProject, loadingState, project, reset, error } =
    useWollokGameGithubProject()
  const clientSide = typeof window !== 'undefined'

  const ghRepo = searchParams.get('ghRepo')
  const ghBranch = searchParams.get('ghBranch')
  const main = searchParams.get('main')

  useEffect(() => {
    if (ghRepo && ghBranch && main && !project && !loadingState.loading) {
      const [owner, name] = ghRepo.split('/')
      if (owner && name) {
        loadProject({
          owner,
          name,
          branch: ghBranch,
          main,
        })
      }
    }
  }, [ghRepo, ghBranch, main, project, loadingState.loading, loadProject])

  const handleGoBack = () => {
    reset()
    navigate(-1)
  }

  if (loadingState.loading) {
    return (
      <Box>
        <AbsoluteCenter>
          <Progress.Root
            min={0}
            max={100}
            defaultValue={10}
            value={loadingState.progress}
            minW={300}
            striped
            animated
          >
            <Progress.Label>Loading Assets...</Progress.Label>
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>

            <Progress.ValueText>{loadingState.progress}%</Progress.ValueText>
          </Progress.Root>
        </AbsoluteCenter>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <AbsoluteCenter>
          <div className="text-red-500">
            <p>Error: {error}</p>
            <Button colorPalette="brand" onClick={handleGoBack} mt={4}>
              Go Back
            </Button>
          </div>
        </AbsoluteCenter>
      </Box>
    )
  }

  if (!project) {
    return (
      <Box>
        <AbsoluteCenter>
          <EmptyState.Root>
            <EmptyState.Title>No project loaded</EmptyState.Title>
            <EmptyState.Description>
              Please go back and select a project to play.
            </EmptyState.Description>
          </EmptyState.Root>
          <Button colorPalette="brand" onClick={handleGoBack} mt={4}>
            Go Back
          </Button>
        </AbsoluteCenter>
      </Box>
    )
  }

  // Only happens if trying to SSR this page
  if (!clientSide) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-4">
        <p className="text-lg">No access to browser API</p>
      </div>
    )
  }

  return (
    <VStack paddingX={'4rem'}>
      <IconButton
        alignSelf={'start'}
        aria-label="Go Back"
        size="lg"
        marginY="1rem"
        onClick={handleGoBack}
      >
        <IoMdArrowBack />
      </IconButton>
      <Game settings={project} />
    </VStack>
  )
}
