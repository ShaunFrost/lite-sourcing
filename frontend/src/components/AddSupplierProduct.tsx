import { useEffect, useState } from "react";
import { useAddProduct } from "../hooks/useAddProduct";
import { ALLOWED_CATEGORIES, ALLOWED_UNITS } from "../constants";

type ProductState = {
    name: string,
    supplierId: string,
    category: string
    unitPrice: number
    currency: string
    unitOfMeasure: string
    leadTimeDays: number
}

interface AddSupplierProductModalProps {
    handleClose: () => void
    supplierId: string
}

const AddSupplierProductModal = ({ handleClose, supplierId }: AddSupplierProductModalProps) => {

    const { mutate, isPending, isSuccess } = useAddProduct()
    const [newProduct, setNewProduct] = useState<ProductState>({
        name: '',
        supplierId: supplierId,
        category: '',
        unitPrice: 0,
        currency: "USD",
        unitOfMeasure: '',
        leadTimeDays: 0
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSave = () => {
        mutate(newProduct)
    }

    const validateForm = (productState: ProductState) => {
        if (productState.name.trim() === "") {
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
        if (productState.category.trim() === "") {
            setErrors(prev => {
                return {
                    ...prev, "category": "category must be selected"
                }
            })
        } else {
            setErrors(prev => {
                const { category, ...rest } = prev
                return rest
            })
        }
        if (productState.unitPrice <= 0) {
            setErrors(prev => {
                return {
                    ...prev, "unitPrice": "unitPrice must be positive"
                }
            })
        } else {
            setErrors(prev => {
                const { unitPrice, ...rest } = prev
                return rest
            })
        }
        if (productState.unitOfMeasure.trim() === "") {
            setErrors(prev => {
                return {
                    ...prev, "unitOfMeasure": "unit must be selected"
                }
            })
        } else {
            setErrors(prev => {
                const { unitOfMeasure, ...rest } = prev
                return rest
            })
        }
        if (productState.leadTimeDays <= 0) {
            setErrors(prev => {
                return {
                    ...prev, "leadTimeDays": "leadTimeDays must be > 0"
                }
            })
        } else {
            setErrors(prev => {
                const { leadTimeDays, ...rest } = prev
                return rest
            })
        }
    }

    useEffect(() => {
        validateForm(newProduct)
    }, [newProduct])

    return (
        <div className="w-full h-full absolute bg-(--color-tertiary) flex justify-center items-center">
            <div className="w-[95%] h-[95%] flex flex-col justify-center items-center bg-(--color-secondary) gap-4 rounded-md relative">
                <p className="text-2xl mb-8">Add New Product</p>

                <div className="flex flex-col gap-1">
                    <label htmlFor="name">Name:</label>
                    <input className="w-62.5 h-7.5 pl-2 bg-white border border-gray-300 rounded-sm" id="name" name="name" type="text" 
                        value={newProduct.name} placeholder="Enter Product name..." 
                        onChange={(e) => setNewProduct(prev => {
                            return {
                                ...prev, name: e.target.value
                            }
                        })} autoComplete="off"
                    />
                    <p className="text-sm text-red-500">{ errors['name'] }</p>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="category">Category:</label>
                    <select id="category" className="w-62.5 h-7.5 pl-2 bg-white border border-gray-300 rounded-sm"
                        onChange={(e) => setNewProduct(prev => {
                            return {
                                ...prev, category: e.target.value
                            }
                        })}
                    >
                        <option value="">{'Select category'}</option>
                        {
                            ALLOWED_CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)
                        }
                    </select>
                    
                    <p className="text-sm text-red-500">{ errors['category'] }</p>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="unitPrice">Unit Price:</label>
                    <input className="w-62.5 h-7.5 pl-2 bg-white border border-gray-300 rounded-sm" 
                        id="unitPrice" type="number" 
                        value={newProduct.unitPrice} placeholder="Enter unit price"
                        onChange={(e) => setNewProduct(prev => {
                            return {
                                ...prev, unitPrice: Number(Number(e.target.value).toFixed(2))
                            }
                        })}
                    />
                    <p className="text-sm text-red-500">{ errors['unitPrice'] }</p>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="unitOfMeasure">Unit of Measure:</label>
                    <select id="unitOfMeasure" className="w-62.5 h-7.5 pl-2 bg-white border border-gray-300 rounded-sm"
                        onChange={(e) => setNewProduct(prev => {
                            return {
                                ...prev, unitOfMeasure: e.target.value
                            }
                        })}
                    >
                        <option value="">{'Select unit'}</option>
                        {
                            ALLOWED_UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)
                        }
                    </select>
                    
                    <p className="text-sm text-red-500">{ errors['unitOfMeasure'] }</p>
                </div>

                <p>{`Currency: USD`}</p>

                <div className="flex flex-col gap-1">
                    <label htmlFor="leadTime">Lead Time(days):</label>
                    <input className="w-62.5 h-7.5 pl-2 bg-white border border-gray-300 rounded-sm" 
                        id="leadTime" type="number" 
                        value={newProduct.leadTimeDays} placeholder="Enter unit price"
                        onChange={(e) => setNewProduct(prev => {
                            return {
                                ...prev, leadTimeDays: Math.ceil(Number(e.target.value))
                            }
                        })}
                    />
                    <p className="text-sm text-red-500">{ errors['leadTimeDays'] }</p>
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

export default AddSupplierProductModal;
