import { useState } from "react";
import Loading from "./Loading";
import { useProjects } from "../hooks/useProjects";
import AddProjectModal from "./AddProjectModal";
import { useNavigate } from "react-router-dom";

const Projects = () => {

    const navigate = useNavigate()
    const { data, error, isLoading } = useProjects()
    const projects = data ?? []
    const [showModal, setShowModal] = useState(false);

    const handleNewProject = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleProjectClick = (projectId: string) => {
        navigate(`/project/${projectId}`)
    }

    return(
        <div className="p-4 w-full h-full flex justify-center items-center relative">
            {
                isLoading ? <Loading size={50} /> : error ? <p>{error.message}</p> : (
                    <div className="w-full h-full grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                        <button className="h-25 border-2 border-black rounded-md bg-(--color-tertiary) flex flex-col gap-2 justify-center items-center"
                            onClick={handleNewProject}
                        >
                            <p className="text-4xl">+</p>
                            <p>{`New Project`}</p>
                        </button>
                        {
                            projects.length > 0 ? projects.map(project => {
                                return (
                                    <button className="h-25 border-2 border-black rounded-md bg-(--color-secondary) flex flex-col gap-2 justify-center items-center" key={project.id}
                                        onClick={() => handleProjectClick(project.id)}
                                    >
                                        <p>{`${project.name}`}</p>
                                        <p>{`${project.client}`}</p>
                                    </button>
                                )
                            }) : <div className="h-25 border-2 border-black rounded-md bg-(--color-secondary) flex flex-col gap-2 justify-center items-center"
                                    
                                >
                                    <p>{`No projects found.`}</p>
                                </div>
                        }
                    </div>
                )
            }
            {
                showModal && <AddProjectModal handleClose={handleCloseModal} />
            }
        </div>
    )
}

export default Projects;
