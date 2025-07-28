import type { Route } from "./+types/home";
import { Game } from "../.client/game.client";
import { useWollokGameGithubProject } from "../hooks/pick-repo";
import pepitaGame from 'public/pepitaGame.json'
import PickGameForm from "../components/PickGameForm";
import type { ComponentProps } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const {loadProject, loading, project, reset, error} = useWollokGameGithubProject();
  // const loading = false
  // const loadProject = (...args:any[]) => {}
  // const project = pepitaGame;
  const clientSide = typeof window !== "undefined";

  const projectSelected: ComponentProps<typeof PickGameForm>["onSubmit"] = (settings, formikBag) => {
    loadProject(settings).then(() => {
      formikBag.resetForm();
    });
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
        <PickGameForm onSubmit={projectSelected} />
        {error && (
          <div className="text-red-500 mt-4">
            <p>Error: {error}</p>
          </div>)
        }
      </div>
    );
  }

   if (!clientSide) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-4">
        <p className="text-lg">No access to browser API</p>
      </div>
    );
  }

  return (<div className="flex-1 flex flex-col items-center justify-center pt-16 pb-4">
    <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={reset}>
      Reset Game
    </button>
    <Game settings={project}/>
  </div>);
}
