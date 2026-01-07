import { useState } from 'react'
import { Octokit } from 'octokit'
import type { Endpoints } from '@octokit/types'

type Tree = {
  path: string
  mode: string
  type: string
  sha: string
  size?: number
  url?: string
}[]

type SourceFile = {
  name: string
  content: string
}

type MediaFile = {
  possiblePaths: string[]
  url: string
}

type LoadRepoArgs = {
  name: string
  owner: string
  branch: string
  main: string
}

type LoadingState =
  | {
      /**
       * Progress from 0 to 100
       */
      progress: number
      loading: true
    }
  | {
      loading: false
    }

export function useWollokGameGithubProject() {
  const [project, setProject] = useState<{
    sources: SourceFile[]
    main: string
    description: string
    images: MediaFile[]
    sounds: MediaFile[]
  } | null>(null)

  const [loading, setLoading] = useState<LoadingState>({ loading: false })
  const [error, setError] = useState<string | null>(null)

  const ghApi = new Octokit({
    // ToDo authenticate with github for higher rate limits
    userAgent: 'Wollok Game Runner',
  })

  async function loadProject(args: LoadRepoArgs) {
    setLoading({ progress: 0, loading: true })
    const { branch: tree_sha, name: repo, owner, main } = args

    try {
      const {
        data: { tree },
      } = await ghApi.request(
        'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
        {
          owner,
          repo,
          tree_sha, // or the specific branch you want to fetch
          recursive: 'true',
        }
      )

      const sourceFiles = tree.filter(endsWithExtension(sourceFileExtensions))
      const imageFiles = tree.filter(endsWithExtension(imageFileExtensions))
      const soundFiles = tree.filter(endsWithExtension(soundFileExtensions))

      const totalFiles =
        sourceFiles.length + imageFiles.length + soundFiles.length
      let fetchedFiles = 0

      const reportProgress = () => {
        fetchedFiles++
        setLoading({
          progress: Math.round((fetchedFiles / totalFiles) * 100),
          loading: true,
        })
      }

      const fetchFiles = repoFetcher(ghApi, args, reportProgress)
      setProject({
        sources: await fetchFiles('raw', sourceFiles, toSourceFile),
        main,
        description: `Game from ${owner}/${repo} on branch ${tree_sha}`,
        images: await fetchFiles(
          'base64',
          imageFiles,
          toMediaBase64File('image')
        ),
        sounds: await fetchFiles(
          'base64',
          soundFiles,
          toMediaBase64File('audio')
        ),
      })
    } catch (error) {
      setError(
        `Failed to load project: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      setLoading({ loading: false })
    }
  }

  function reset() {
    setProject(null)
    setError(null)
    setLoading({ loading: false })
  }

  return {
    loadProject,
    loadingState: loading,
    project,
    reset,
    error,
  }
}

type GetContentResponse =
  Endpoints['GET /repos/{owner}/{repo}/contents/{path}']['response']

function repoFetcher(
  ghApi: Octokit,
  { name, owner }: LoadRepoArgs,
  reportProgress: () => void
) {
  return async function <R>(
    fileFormat: string,
    filesToFetch: Tree,
    mapResponse: (path: string, file: GetContentResponse) => R
  ): Promise<R[]> {
    const getFileContent = async (
      file: Tree[number],
      mediaType: string = 'raw'
    ): Promise<GetContentResponse> => {
      return ghApi.rest.repos.getContent({
        owner,
        repo: name,
        path: file.path,
        mediaType: {
          format: mediaType,
        },
      })
    }
    const fetchFilesPromises = filesToFetch.map((f) =>
      getFileContent(f, fileFormat).then((response) => {
        reportProgress()
        return mapResponse(f.path, response)
      })
    )
    return await Promise.all(fetchFilesPromises)
  }
}

function toMediaBase64File(mimeType: string) {
  return function (_path: string, file: GetContentResponse): MediaFile {
    if (Array.isArray(file.data)) {
      throw new Error(`Expected file but got directory for file ${_path}`)
    }

    if (file.data.type !== 'file') {
      throw new Error(
        `Expected file but got ${file.data.type} for file ${_path}`
      )
    }

    // If the file is not base64 encoded, we are probably a large file
    // so we try to salvage the situation by passing in the download_url
    if (file.data.encoding !== 'base64') {
      if (!file.data.download_url) {
        throw new Error(`Expected download_url for non-base64 file ${_path}`)
      }
      return {
        possiblePaths: [file.data.name, file.data.path],
        url: file.data.download_url,
      }
    }

    return {
      possiblePaths: [file.data.name, file.data.path],
      url: `data:${mimeType}/${file.data.name.split('.').pop()};base64,${file.data.content}`,
    }
  }
}

function toSourceFile(path: string, file: GetContentResponse): SourceFile {
  if (typeof file.data !== 'string') {
    throw new Error(
      `Expected raw file but got ${file.headers['content-type']} for file ${path}`
    )
  }

  return {
    name: path,

    // May want some error handling here but the response
    // will be a string because of the mediaType format
    content: file.data,
  }
}

function endsWithExtension(extensions: string[]) {
  return function (file: Tree[number]): boolean {
    return extensions.some((ext) => file.path.endsWith(`.${ext}`))
  }
}
const sourceFileExtensions = ['wlk', 'wpgm', 'wtest']
const imageFileExtensions = ['png', 'jpg', 'jpeg', 'gif']
const soundFileExtensions = ['mp3', 'wav', 'ogg']
