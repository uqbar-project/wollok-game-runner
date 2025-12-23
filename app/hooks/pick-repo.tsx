import { useState } from "react";
import { Octokit } from 'octokit'
import type { Endpoints } from '@octokit/types';

type Tree = {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url?: string;
}[];


type SourceFile = {
    name: string;
    content: string;
}

type MediaFile = {
  possiblePaths: string[];
  url: string;
}

type LoadRepoArgs = {
    name: string;
    owner: string;
    branch: string;
    main: string;
  };

export function useWollokGameGithubProject() {
  const [project, setProject] = useState<{
    sources: SourceFile[];
    main: string;
    description: string;
    images: MediaFile[];
    sounds: MediaFile[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const ghApi = new Octokit({
    auth: '', // Ensure you have a valid GitHub token
    userAgent: 'Wollok Game Runner',
  });

  

  async function loadProject(args: LoadRepoArgs){
    setLoading(true);
    const {branch: tree_sha, name: repo, owner, main} = args

    try {
      const {data: {tree}} = await ghApi.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
        owner,
        repo,
        tree_sha, // or the specific branch you want to fetch
        recursive: "true",
      })

      const fetchFiles = repoFetcher(tree, ghApi, args);
      setProject({
        sources: await fetchFiles('raw', endsWithExtension(sourceFileExtensions), toSourceFile) ,
        main,
        description: `Game from ${owner}/${repo} on branch ${tree_sha}`,
        images: await fetchFiles('base64', endsWithExtension(imageFileExtensions), toMediaBase64File('image')),
        sounds: await fetchFiles('base64', endsWithExtension(soundFileExtensions), toMediaBase64File('audio'))
      })
    } catch (error) {
      setError(`Failed to load project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally{
      setLoading(false);
    }
  }

  function reset(){
    setProject(null);
    setError(null);
    setLoading(false);
  }

  return {
    loadProject,
    loading,
    project,
    reset,
    error
  }
}

type GetContentResponse = Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]

function repoFetcher(files: Tree, ghApi: Octokit, {name, owner}: LoadRepoArgs){
  return async function <R>(fileFormat: string, shouldRequestFile: (tree: Tree[number]) => boolean, mapResponse: (path: string, file: GetContentResponse) => R): Promise<R[]> {
    const getFileContent = async (file: Tree[number], mediaType: string = 'raw'): Promise<GetContentResponse> => {
      return ghApi.rest.repos.getContent({
        owner,
        repo: name,
        path: file.path,
        mediaType: {
          format: mediaType,
        },
      })
    }
    const filesToRequest = files.filter(shouldRequestFile);
    return await Promise.all(filesToRequest.map(f => getFileContent(f, fileFormat).then(response => mapResponse(f.path, response))))
  }
}

function toMediaBase64File(mimeType: string) {
  return function (_path: string, file: GetContentResponse): MediaFile {
    if(Array.isArray(file.data)){
      throw new Error(`Expected file but got directory for file ${_path}`);
    }

    if(file.data.type !== 'file'){
      throw new Error(`Expected file but got ${file.data.type} for file ${_path}`);
    }

    if(file.data.encoding !== 'base64'){
      throw new Error(`Expected base64 encoding but got ${file.data.encoding} for file ${_path}`);
    }

    return {
        possiblePaths: [file.data.name, file.data.path],
        url:`data:${mimeType}/${file.data.name.split('.').pop()};base64,${file.data.content}`
    }
  }
}

function toSourceFile(path:string, file: GetContentResponse): SourceFile {
  if(typeof file.data !== 'string'){
    throw new Error(`Expected raw file but got ${file.headers["content-type"]} for file ${path}`);
  }

  return {
      name:path,

      // May want some error handling here but the response
      // will be a string because of the mediaType format
      content: file.data
  }
}

function endsWithExtension(extensions: string[]) {
  return function (file: Tree[number]): boolean {
    return extensions.some(ext => file.path.endsWith(`.${ext}`));
  }
}
const sourceFileExtensions = (['wlk', 'wpgm', 'wtest'])
const imageFileExtensions = (['png', 'jpg', 'jpeg', 'gif'])
const soundFileExtensions = (['mp3', 'wav', 'ogg'])