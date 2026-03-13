import { useEffect, useState } from "react";
import { useAddProject } from "../hooks/useAddProject";

type ProjectState = {
    name: string,
    client: string,
    status: "Draft"
}

interface AddProjectModalProps {
    handleClose: () => void
}

const AddProjectModal = ({ handleClose }: AddProjectModalProps) => {

    const { mutate, isPending, isSuccess } = useAddProject()
    const [newProject, setNewProject] = useState<ProjectState>({
        name: '',
        client: '',
        status: "Draft"
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSave = () => {
        mutate(newProject)
        setTimeout(handleClose, 1500)
    }

    const validateForm = (projectState: ProjectState) => {
        if (projectState.name.trim() === "") {
            setErrors(prev => {
                return {
                    ...prev, "name": "name can't be empty"
                }
            })
        } else {
            setErrors(prev => {
                const { name, ...rest } = prev
                return rest
            })
        }
        if (projectState.client.trim() === "") {
            setErrors(prev => {
                return {
                    ...prev, "client": "client can't be empty"
                }
            })
        } else {
            setErrors(prev => {
                const { client, ...rest } = prev
                return rest
            })
        }
    }

    useEffect(() => {
        validateForm(newProject)
    }, [newProject])

    return (
        <div className="w-full h-full absolute bg-(--color-tertiary) flex justify-center items-center">
            <div className="w-[80%] h-[80%] flex flex-col justify-center items-center bg-(--color-secondary) gap-4 rounded-md relative">
                <p className="text-2xl mb-8">Add New Project</p>
                <div className="flex flex-col gap-1">
                    <label htmlFor="name">Name:</label>
                    <input className="w-62.5 h-7.5 pl-2 bg-white border border-gray-300 rounded-sm" id="name" name="name" type="text" 
                        value={newProject.name} placeholder="Enter Project name..." 
                        onChange={(e) => setNewProject(prev => {
                            return {
                                ...prev, name: e.target.value
                            }
                        })} autoComplete="off"
                    />
                    <p className="text-sm text-red-500">{ errors['name'] }</p>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="client">Client:</label>
                    <input className="w-62.5 h-7.5 pl-2 bg-white border border-gray-300 rounded-sm" id="client" type="text" value={newProject.client} placeholder="Enter client..."
                        onChange={(e) => setNewProject(prev => {
                            return {
                                ...prev, client: e.target.value
                            }
                        })}
                    />
                    <p className="text-sm text-red-500">{ errors['client'] }</p>
                </div>

                <button className="py-3 px-8 bg-(--color-primary) text-white rounded-lg cursor-pointer disabled:opacity-35"
                    onClick={handleSave} disabled={isSuccess || Object.keys(errors).length > 0}
                >
                    { isPending ? 'Saving...' : 'Save' }
                </button>

                <button className="text-xl text-black absolute right-4 top-4" onClick={handleClose}>
                    ✖️
                </button>
            </div>
        </div>
    )
}

export default AddProjectModal;
