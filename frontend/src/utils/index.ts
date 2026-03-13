import { ALLOWED_UNITS, type MeasuringUnit, SIMILAR_UNIT_MAPS } from "../constants";
import type { ParsedSpec } from "../types";

const QUANTITY_AND_UNIT_REGEX = /^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)/
const QUANTITY_AND_NUMBER_REGEX = /^(\d+(?:\.\d+)?)\s+(\d+)/

export const wait = (time: number) => new Promise(resolve => setTimeout(resolve, time))

export const parseSpec = (specTextData: string): ParsedSpec => {
    try {
        let parsingCandidate = specTextData.trim().toLowerCase()
        // split into words and remove preposition of
        parsingCandidate = parsingCandidate.split(/\s+/).filter(word => word !== "of").join(" ")
        console.log('parsingCandidate', parsingCandidate)

        let unitOfMeasure: MeasuringUnit | null = null

        // find quantity and measurement unit
        const match = parsingCandidate.match(QUANTITY_AND_UNIT_REGEX)
        console.log("match", match)
        if (match) {
            const fullMatch = match[0];
            const quantityFromSpec = parseFloat(match[1]);
            const unitFromSpec = match[2];
            
            for(const unit of ALLOWED_UNITS) {
                const similarUnits = SIMILAR_UNIT_MAPS[unit]
                for (const similarUnit of similarUnits) {
                    if (similarUnit.toLowerCase() === unitFromSpec.toLowerCase()) {
                        unitOfMeasure = unit;
                        break;
                    }
                }
                if (unitOfMeasure) {
                    break;
                }
            }

            let potentialName = parsingCandidate.substring(fullMatch.length + 1)

            if (unitOfMeasure && quantityFromSpec > 0 && potentialName) {
                return {
                    name: parsingCandidate.substring(fullMatch.length + 1),
                    unitOfMeasure: unitOfMeasure,
                    quantity: quantityFromSpec,
                    description: specTextData
                }
            }
        }

        const quantityOnlyMatch = parsingCandidate.match(QUANTITY_AND_NUMBER_REGEX)
        console.log("quantityOnlyMatch", quantityOnlyMatch)
        if (quantityOnlyMatch) {
            const quantity = quantityOnlyMatch[1];
            const potentialName = parsingCandidate.substring(quantity.length + 1)
            // in absense of measurement units
            unitOfMeasure = "piece"
            return {
                name: potentialName,
                unitOfMeasure,
                quantity: parseFloat(quantity),
                description: specTextData
            }
        }

        return {
            name: specTextData,
            unitOfMeasure: '',
            quantity: 0,
            description: specTextData
        }

    } catch (error) {
        console.error("Error in parsing spec")
        return {
            name: specTextData,
            unitOfMeasure: '',
            quantity: 0,
            description: specTextData
        }
    }
    
}

// parseSpec("100")