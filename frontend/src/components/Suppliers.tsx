import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { useSuppliers } from "../hooks/useSuppliers";
import AddSupplierModal from "./AddSupplierModal";

const Suppliers = () => {

    const navigate = useNavigate();
    const { data, error, isLoading } = useSuppliers()
    const [showModal, setShowModal] = useState(false)

    const handleNewSupplier = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }
    
    const suppliers = data ?? []
    // console.log("suppliers", suppliers)

    return(
        <div className="w-full h-full p-4 flex justify-center items-center relative">
            {
                isLoading ? <Loading size={50} /> : error ? <p>{error.message}</p> : (
                    <div className="w-full h-full grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                        <button className="h-25 border-2 border-black rounded-md bg-(--color-tertiary) flex flex-col gap-2 justify-center items-center"
                            onClick={handleNewSupplier}
                        >
                            <p className="text-4xl">+</p>
                            <p>{`New Supplier`}</p>
                        </button>
                        {
                            suppliers.length > 0 ? suppliers.map(supplier => {
                                return (
                                    <button className="h-25 border-2 border-black rounded-md bg-(--color-secondary) flex flex-col gap-2 justify-center items-center" key={supplier.id}
                                        onClick={() => navigate(`/supplier/${supplier.id}`, { state: { supplierData: supplier } })}
                                    >
                                        {supplier.name}
                                    </button>
                                )
                            }) : <p>No suppliers found</p>
                        }
                    </div>
                )
            }
            {
                showModal && <AddSupplierModal handleClose={handleCloseModal} />
            }
        </div>
    )
}

export default Suppliers;
