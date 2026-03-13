import { useEffect, useState } from "react";
import { useAddSpec } from "../hooks/useAddSpec";
import { ALLOWED_UNITS, type MeasuringUnit } from "../constants";
import type { ParsedSpec } from "../types";
import { parseSpec } from "../utils";

interface AddSpecModalProps {
    handleClose: () => void
    projectId: string
}

const AddSpecModal = ({ handleClose, projectId }: AddSpecModalProps) => {

    const [specText, setSpecText] = useState('')
    const [parsedData, setParsedData] = useState<ParsedSpec>({
        name: '',
        quantity: 0,
        unitOfMeasure: '',
        description: ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { mutate, isPending, isSuccess } = useAddSpec()
    // const [newSpec, setNewSpec] = useState<SpecState>({
    //     name: '',
    //     description: '',
    //     quantity: 0,
    //     unitOfMeasure: ''
    // })
    
    const handleSaveSpec = () => {
        const SpecBody = {
            ...parsedData,
            projectId
        }
        // console.log(SpecBody);
        mutate(SpecBody)
        setTimeout(handleClose, 1000)
    }

    const validateParsedData = (parsedDataState: ParsedSpec) => {
        if (parsedDataState.name === '') {
            setErrors(prev => {
                return {
                    ...prev, name: "name can't be empty"
                }
            })
        } else {
            setErrors(prev => {
                const { name, ...rest } = prev
                return rest
            })
        }

        if (parsedDataState.quantity <= 0) {
            setErrors(prev => {
                return {
                    ...prev, quantity: "quantity must be > 0"
                }
            })
        } else {
            setErrors(prev => {
                const { quantity, ...rest } = prev
                return rest
            })
        }

        if (parsedDataState.unitOfMeasure === '') {
            setErrors(prev => {
                return {
                    ...prev, unitOfMeasure: "unit must not be empty"
                }
            })
        } else {
            setErrors(prev => {
                const { unitOfMeasure, ...rest } = prev
                return rest
            })
        }
    }

    const handleParsing = (specTextData: string) => {
        const parsedResponse = parseSpec(specTextData)
        console.log("parsedResponse", parsedResponse)
        setParsedData(parsedResponse)
    }

    useEffect(() => {
        validateParsedData(parsedData)
    }, [parsedData])

    return (
        <div className="w-full h-full absolute top-0 left-0 bg-(--color-tertiary) flex justify-center items-center">
            <div className="w-[95%] h-[95%] flex flex-col justify-center items-center bg-(--color-secondary) gap-4 rounded-md relative">
                <div className="flex flex-col justify-center items-center gap-1">
                    <input className="w-[200px] bg-white border border-gray-300 rounded-sm" 
                        value={specText} placeholder="Enter a spec" onChange={
                            (e) => setSpecText(e.target.value)
                        }
                    />
                    <p>{`e.g: 500 meters of 4mm Copper Wire`}</p>
                    <button className="py-3 px-8 bg-(--color-primary) text-white rounded-lg cursor-pointer disabled:opacity-35"
                        onClick={() => handleParsing(specText)} disabled={isSuccess}
                    >
                        Parse
                    </button>
                </div>

                {
                    parsedData && parsedData.name !== '' && (
                        <div className="w-full flex flex-col justify-center items-center">
                            <div className="flex flex-row gap-2 justify-center items-start">
                                <div className="flex flex-col justify-start items-center">
                                    <label htmlFor="name" className="w-full">Name:</label>
                                    <input id="name" className="w-[200px] bg-white border border-gray-300 rounded-sm" value={parsedData.name ?? ''} onChange={
                                        (e) => setParsedData(prev => {
                                            return {
                                                ...prev, name: e.target.value
                                            }
                                        })
                                    } />
                                    <p className="w-[200px] text-sm text-red-500">{errors['name']}</p>
                                </div>
                                
                                <div className="flex flex-col justify-start items-center">
                                    <label htmlFor="quantity" className="w-full">Quantity:</label>
                                    <input id="quantity" className="w-[200px] bg-white border border-gray-300 rounded-sm" value={parsedData.quantity} type="number" onChange={
                                        (e) => setParsedData(prev => {
                                            return {
                                                ...prev, quantity: Number(e.target.value)
                                            }
                                        })
                                    } />
                                    <p className="w-[200px] text-sm text-red-500">{errors['quantity']}</p>
                                </div>
    
                                <div className="flex flex-col justify-start items-center">
                                    <label htmlFor="unitOfMeasure" className="w-full">Unit:</label>
                                    <select id="unitOfMeasure" className="w-[200px] pl-2 bg-white border border-gray-300 rounded-sm"
                                        onChange={(e) => setParsedData(prev => {
                                            return {
                                                ...prev, unitOfMeasure: e.target.value as MeasuringUnit | ''
                                            }
                                        })}
                                        value={parsedData.unitOfMeasure}
                                    >
                                        <option value="">{'Select unit'}</option>
                                        {
                                            ALLOWED_UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)
                                        }
                                    </select>
                                    <p className="w-[200px] text-sm text-red-500">{errors['unitOfMeasure']}</p>
                                </div>
    
                            </div>
                            <button className="py-3 px-8 bg-(--color-primary) text-white rounded-lg cursor-pointer disabled:opacity-35"
                                disabled={isSuccess || Object.keys(errors).length > 0}
                                onClick={handleSaveSpec}
                            >
                                { isPending ? 'Saving...' : 'Save' }
                            </button>
                        </div>
                    )
                }
                <button className="text-xl text-black absolute right-4 top-4" onClick={handleClose}>
                    ✖️
                </button> 
            </div>
        </div>
    )
}

export default AddSpecModal;
