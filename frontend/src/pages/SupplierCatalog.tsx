import { useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { useState } from "react";
import AddSupplierProductModal from "../components/AddSupplierProduct";
import HomeLink from "../components/HomeLink";

const SupplierCatalog = () => {

    const { supplierId } = useParams()

    const { data, isLoading, error } = useProducts(supplierId)
    const products = data ?? []

    const [showModal, setShowModal] = useState(false)

    const handleNewProduct = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    return (
        <main className="w-screen h-screen flex flex-col items-center gap-4 relative">
            <HomeLink />
            <Header />
            
            <div className="w-[80%] h-[600px] rounded-2xl border-2 border-black overflow-y-scroll">
                <div className="p-4 w-full h-full flex justify-center items-center relative">
                    {
                        isLoading ? <Loading size={50} /> : error ? <p>{error.message}</p> : (
                            <div className="w-full h-full grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                                <button className="h-25 border-2 border-black rounded-md bg-(--color-tertiary) flex flex-col gap-2 justify-center items-center"
                                    onClick={handleNewProduct}
                                >
                                    <p className="text-4xl">+</p>
                                    <p>{`New Product`}</p>
                                </button>
                                {
                                    products.length > 0 ? products.map(product => {
                                        return (
                                            <div className="h-25 border-2 border-black rounded-md bg-(--color-secondary) flex flex-col gap-2 justify-center items-center" key={product.id}
                                            >
                                                <p>{product.name}</p>
                                                <p>{product.category}</p>
                                            </div>
                                        )
                                    }) : <p>No products found</p>
                                }
                            </div>
                        )
                    }
                    {
                        supplierId && showModal && <AddSupplierProductModal handleClose={handleCloseModal} supplierId={supplierId} />
                    }
                </div>
            </div>
        </main>
    )
}

export default SupplierCatalog;
