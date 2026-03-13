import { useEffect, useState } from "react";
import { useAddSupplier } from "../hooks/useAddSupplier";
import { getCodeList } from "country-list";

type SupplierState = {
    name: string,
    country: string,
    website: string
}

interface AddSupplierModalProps {
    handleClose: () => void
}

const countryCodes = getCodeList();
const countryOptions =  Object.keys(countryCodes)

const AddSupplierModal = ({ handleClose }: AddSupplierModalProps) => {

    const { mutate, isPending, isSuccess } = useAddSupplier()
    const [newSupplier, setNewSupplier] = useState<SupplierState>({
        name: '',
        country: '',
        website: ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSave = () => {
        mutate(newSupplier)
    }

    const validateForm = (supplierState: SupplierState) => {
        if (supplierState.name.trim() === "") {
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
        if (supplierState.country.trim() === "") {
            setErrors(prev => {
                return {
                    ...prev, "country": "country must be selected"
                }
            })
        } else {
            setErrors(prev => {
                const { country, ...rest } = prev
                return rest
            })
        }
        if (supplierState.website.trim() === "") {
            setErrors(prev => {
                return {
                    ...prev, "website": "website can't be empty"
                }
            })
        } else {
            try {
                new URL(supplierState.website.trim())
                setErrors(prev => {
                    const { website, ...rest } = prev
                    return rest
                })
            } catch (e) {
                setErrors(prev => {
                    return {
                        ...prev, "website": "website url invalid"
                    }
                })
            }
        }
    }

    useEffect(() => {
        validateForm(newSupplier)
    }, [newSupplier])

    return (
        <div className="w-full h-full absolute bg-(--color-tertiary) flex justify-center items-center">
            <div className="w-[90%] h-[90%] flex flex-col justify-center items-center bg-(--color-secondary) gap-4 rounded-md relative">
                <p className="text-2xl mb-8">Add New Supplier</p>

                <div className="flex flex-col gap-1">
                    <label htmlFor="name">Name:</label>
                    <input className="w-62.5 h-7.5 pl-2 bg-white border border-gray-300 rounded-sm" id="name" name="name" type="text" 
                        value={newSupplier.name} placeholder="Enter Supplier name..." 
                        onChange={(e) => setNewSupplier(prev => {
                            return {
                                ...prev, name: e.target.value
                            }
                        })} autoComplete="off"
                    />
                    <p className="text-sm text-red-500">{ errors['name'] }</p>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="country">Country:</label>
                    <select id="country" className="w-62.5 h-7.5 pl-2 bg-white border border-gray-300 rounded-sm"
                        onChange={(e) => setNewSupplier(prev => {
                            return {
                                ...prev, country: e.target.value
                            }
                        })}
                    >
                        <option value="">{'Select country'}</option>
                        {
                            countryOptions.map(countryOption => <option key={countryOption} value={countryOption}>{countryCodes[countryOption]}</option>)
                        }
                    </select>
                    
                    <p className="text-sm text-red-500">{ errors['country'] }</p>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="website">Website:</label>
                    <input className="w-62.5 h-7.5 pl-2 bg-white border border-gray-300 rounded-sm" id="website" type="text" value={newSupplier.website} placeholder="Enter Supplier website..."
                        onChange={(e) => setNewSupplier(prev => {
                            return {
                                ...prev, website: e.target.value
                            }
                        })}
                    />
                    <p className="text-sm text-red-500">{ errors['website'] }</p>
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

export default AddSupplierModal;
