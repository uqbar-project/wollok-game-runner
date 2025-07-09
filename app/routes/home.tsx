import type { Route } from "./+types/home";
import { Game } from "../.client/game.client";
import { useWollokGameGithubProject } from "../pick-repo";
import pepitaGame from 'public/pepitaGame.json'

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const {loadProject, loading, project} = useWollokGameGithubProject();
  // const loading = false
  // const loadProject = (...args:any[]) => {}
  // const project = pepitaGame;
  const clientSide = typeof window !== "undefined";

  if (!clientSide) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-4">
        <p className="text-lg">No access to browser API</p>
      </div>
    );
  }

  if(loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-4">
        <p className="text-lg">Fetching from Github</p>
      </div>
    );
  }

  if(!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-4">
        <p className="text-lg">No project loaded</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => loadProject({name: "pepitaGame", owner: "wollok", branch: "master"})}
        >
          Load Wollok Game
        </button>
      </div>
    );
  }

  return (<div className="flex-1 flex flex-col items-center justify-center pt-16 pb-4">
    <Game settings={project}/>
  </div>);
}
