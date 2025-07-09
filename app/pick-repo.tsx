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

type LoadRepoArgs = {
    name: string;
    owner: string;
    branch: string;
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


  const ghApi = new Octokit({});

  

  async function loadProject({branch: tree_sha, name: repo, owner}: LoadRepoArgs){
    setLoading(true);
    const {data: {tree}} = await ghApi.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
      owner,
      repo,
      tree_sha, // or the specific branch you want to fetch
      recursive: "true",
    })

    console.log(tree);
    const wlkSources = await getWollokFiles(tree, ghApi);

    setProject({
      sources: wlkSources,
      main: 'pgmPepitaGame',
      description: `Game from ${owner}/${repo} on branch ${tree_sha}`,
      images: getImages(tree, `https://raw.githubusercontent.com/${owner}/${repo}/${tree_sha}`),
      sounds: [],
    })
    setLoading(false);
  }

  return {
    loadProject,
    loading,
    project
  }
}

function getImages(tree: Tree, baseUrl: string): { possiblePaths: string[]; url: string }[] {
  const imageFiles = tree.filter((file) => file.path.endsWith('.png') || file.path.endsWith('.jpg') || file.path.endsWith('.jpeg') || file.path.endsWith('.gif'));
  console.log("Image files found:", imageFiles);
  return imageFiles.map(file => ({
    possiblePaths: [file.path, file.path.split('/').pop()!],
    url: `${baseUrl}/${file.path}`
  }));
}



function getWollokFiles(tree: Tree, ghApi: Octokit = new Octokit({})): Promise<SourceFile[]> {
  const wlkFiles = tree.filter((file) => file.path.endsWith('.wlk') || file.path.endsWith('.wpgm') || file.path.endsWith('.wtest'));
  console.log("Wollok files found:", wlkFiles);
  const file = wlkFiles[0]

  const getFileContent = async (file: Tree[number]): Promise<SourceFile> => {
    const res =  await ghApi.rest.repos.getContent({
      owner: 'wollok',
      repo: 'pepitaGame',
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