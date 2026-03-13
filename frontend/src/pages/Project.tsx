import { useParams } from "react-router-dom"
import HomeLink from "../components/HomeLink"
import Header from "../components/Header"
import { useProjectDetails } from "../hooks/useProjectDetails"
import Loading from "../components/Loading"
import { useState } from "react"
import AddSpecModal from "../components/AddSpecModal"
import type { SpecItemResponse } from "../types"
import AddSpecSourcingModal from "../components/AddSpecSourcingModal"

const Project = () => {
    const { projectId } = useParams()

    const { data, isLoading, error } = useProjectDetails(projectId)
    console.log("data", data)
    const [showAddSpecModal, setShowAddSpecModal] = useState(false)

    const [showAttachSpecModal, setShowAttachSpecModal] = useState(false)
    const [selectedSpec, setSelectedSpec] = useState<SpecItemResponse | null>(null)

    const handleCloseAddShowModal = () => {
        setShowAddSpecModal(false)
    }

    const handleCloseAttachSpecModal = () => {
        setShowAttachSpecModal(false)
        setSelectedSpec(null);
    }

    const handleSpecClick = (specData: SpecItemResponse) => {
        if (specData.sourcingData) {
            return;
        }
        setSelectedSpec(specData);
        setShowAttachSpecModal(true);
    }

    return (
        <main className="w-screen h-screen flex flex-col items-center gap-4 relative">
            <HomeLink />
            <Header />
            
            <div className="w-[80%] h-[600px] rounded-2xl border-2 border-black bg-(--color-tertiary) relative overflow-hidden">
                <div className="w-full h-full flex justify-center items-center overflow-y-scroll">
                    {
                        isLoading ? <Loading size={50} /> : error ? <p>{error.message}</p> : data && (
                            <div className="p-8 w-full h-full flex flex-col gap-2 justify-start items-center">
                                <div className="font-extrabold p-8 w-fit flex flex-col justify-center items-start rounded-lg bg-(--color-secondary)">
                                    <p>{`Project Name: ${data.name}`}</p>
                                    <p>{`Client: ${data.client}`}</p>
                                    <p>{`Status: ${data.status}`}</p>
                                    {
                                        data.status === "Quoted" && (
                                            <>
                                                <p>{`Total Cost: ${data.totalCost}`}</p>
                                                <p>{`Max Lead Days: ${data.maxLeadDays}`}</p>
                                                <p>{`Suppliers involved: ${data.supplierCount}`}</p>
                                            </>
                                        )
                                    }

                                </div>
                                <p className="text-2xl mt-8" >SPEC ITEMS</p>
                                <button className="p-2 w-full bg-(--color-quarternary) flex flex-col gap-1 justify-center items-center rounded-md"
                                    onClick={() => setShowAddSpecModal(true)}
                                >
                                    <p className="text-4xl">+</p>
                                    <p>{`Add Spec`}</p>
                                </button>
                                {
                                    data.specItems &&  data.specItems.map(specItem => {
                                        return (
                                            <button key={specItem.id} className="p-2 w-full bg-(--color-secondary) flex flex-col gap-1 justify-center items-center rounded-md"
                                                onClick={() => handleSpecClick(specItem)}
                                            >
                                                <p className="text-xl">{`Name: ${specItem.name}`}</p>
                                                <p>{`Quantity: ${specItem.quantity}`}</p>
                                                <p>{`Unit: ${specItem.unitOfMeasure}`}</p>
                                                <p>{`Sourcing Status: ${specItem.sourcingData ? 'Done' : 'Pending'}`}</p>
                                            </button>
                                        )
                                    })
                                }
                                
                            </div>
                        )
                    }
                </div>
                {
                    projectId && showAddSpecModal && <AddSpecModal handleClose={handleCloseAddShowModal} projectId={projectId} />
                }
                {
                    selectedSpec && showAttachSpecModal && <AddSpecSourcingModal handleClose={handleCloseAttachSpecModal} specData={selectedSpec} />
                }
            </div>
            
        </main>
    )
}

export default Project;
