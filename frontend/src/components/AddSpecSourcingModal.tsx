import { useState } from "react";
import { useSpecSourcing } from "../hooks/useSpecSourcing";
import { useAddSpecSourcing } from "../hooks/useAddSpecSourcing";
import type { SourcingResponseData, SpecItemResponse } from "../types";
import Loading from "./Loading";

interface AddSpecSourcingModalProps {
    handleClose: () => void
    specData: SpecItemResponse
}

const AddSpecSourcingModal = ({ handleClose, specData }: AddSpecSourcingModalProps) => {

    const { data, error, isLoading } = useSpecSourcing(specData.id)
    const [selectedSourcingOption, setSelectedSourcingOption] = useState<SourcingResponseData | null>(null)

    const { mutate, isPending, isSuccess } = useAddSpecSourcing()

    const handleConfirmSpec = (sourcingData: SourcingResponseData) => {
        mutate({
            specItemId: specData.id,
            productId: sourcingData.product.id,
            lead_time_days: sourcingData.product.lead_time_days,
            total_cost: sourcingData.product.unit_price * specData.quantity,
            unitPrice: sourcingData.product.unit_price
        });
        setTimeout(handleClose, 2000)
    }

    const handleSpecClick = (sourcingData: SourcingResponseData) => {
        setSelectedSourcingOption(sourcingData)
    }

    return (
        <div className="w-full h-full absolute top-0 left-0 bg-(--color-tertiary) flex justify-center items-center">
            <div className="w-[95%] h-[95%] flex flex-col justify-center items-center gap-2 bg-(--color-secondary) rounded-md relative text-white">
                
                <div className="font-extrabold p-8 w-fit flex flex-col justify-center items-start rounded-lg bg-(--color-primary)">
                    <p>{`Spec: ${specData.name}`}</p>
                    <p>{`Unit: ${specData.unitOfMeasure}`}</p>
                </div>

                <p className="text-xl font-bold">Select your sourcing from below</p>

                {
                    isLoading ? <Loading size={50} /> : error ? error.message 
                    : data && data.length > 0 && (
                        <div className="w-full flex flex-col justify-center items-center bg-(-color-secondary) gap-1">
                            {
                                data.map(sourcingData => {
                                    const borderColor = selectedSourcingOption ? (selectedSourcingOption.product.id === sourcingData.product.id) ? 'green' : 'black' : 'black'
                                    return (
                                        <div className={"p-4 w-[80%] rounded-md flex flex-col justify-center items-start bg-(--color-primary) cursor-pointer"}
                                            style={{ borderColor: borderColor, borderWidth: borderColor === "black" ? 1 : 4 }}
                                            onClick={() => handleSpecClick(sourcingData)}
                                        >
                                            <p>{`Name: ${sourcingData.product.name}`}</p>
                                            <p>{`Supplier: ${sourcingData.product.supplier_name}`}</p>
                                            <p>{`Price: ${sourcingData.product.unit_price}`}</p>
                                            <p>{`Lead Time: ${sourcingData.product.lead_time_days}`}</p>
                                        </div>
                                    )
                                })
                            }
                            {
                                selectedSourcingOption && <button className="py-3 px-8 bg-(--color-primary) text-white rounded-lg cursor-pointer disabled:opacity-35"
                                    disabled={!selectedSourcingOption || isSuccess}
                                    onClick={() => handleConfirmSpec(selectedSourcingOption)}
                                >
                                    { isPending ? 'Attaching...' : 'Attach Souce'}
                                </button>
                            }
                            
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

export default AddSpecSourcingModal;
