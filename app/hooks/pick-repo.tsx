import { useState } from "react";
import { Octokit } from 'octokit'

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
    images: { possiblePaths: string[]; url: string }[];
    sounds: { possiblePaths: string[]; url: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const ghApi = new Octokit({
    auth: '', // Ensure you have a valid GitHub token
    userAgent: 'Wollok Game Runner',
  });

  

  async function loadProject({branch: tree_sha, name: repo, owner, main}: LoadRepoArgs){
    setLoading(true);

    try {
      const {data: {tree}} = await ghApi.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
        owner,
        repo,
        tree_sha, // or the specific branch you want to fetch
        recursive: "true",
      })

      const wlkSources = await getWollokFiles(tree, ghApi, {name: repo, owner, branch: tree_sha, main});

      const baseAssetUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${tree_sha}`;
      setProject({
        sources: wlkSources,
        main,
        description: `Game from ${owner}/${repo} on branch ${tree_sha}`,
        images: filesWithExtension(tree, baseAssetUrl, ['png', 'jpg', 'jpeg', 'gif']),
        sounds: filesWithExtension(tree, baseAssetUrl, ['mp3', 'wav', 'ogg'])
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

function filesWithExtension(files: Tree, baseUrl: string, validExtensions: string[]): MediaFile[] {
  return files
    .filter(file => validExtensions.some(ext => file.path.endsWith(`.${ext}`)))
    .map(file => ({
      possiblePaths: [file.path, file.path.split('/').pop()!],
      url: file.url || `${baseUrl}/${file.path}`
    }));
}

function getWollokFiles(tree: Tree, ghApi: Octokit = new Octokit({}), {name, owner}: LoadRepoArgs): Promise<SourceFile[]> {
  const wlkFiles = tree.filter((file) => file.path.endsWith('.wlk') || file.path.endsWith('.wpgm') || file.path.endsWith('.wtest'));
  console.log("Wollok files found:", wlkFiles);

  const getFileContent = async (file: Tree[number]): Promise<SourceFile> => {
    const res =  await ghApi.rest.repos.getContent({
      owner,
      repo: name,
      path: file.path,
      mediaType: {
        format: 'raw',
      }
    })

    return {
      name:file.path,

      // May want some error handling here but the response
      // will be a string because of the mediaType format
      content:res.data as unknown as string
    }
  }
  
  return Promise.all(wlkFiles.map(getFileContent));
}