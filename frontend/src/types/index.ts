import type { MeasuringUnit } from "../constants"

export type Supplier = {
    id: string
    name: string
    country: string
    website: string
}

export type Product = {
    id: string
    supplierId: string
    name: string
    category: string
    unitPrice: number
    currency: string
    unitOfMeasure: string
    leadTimeDays: number
}

export type Project = {
    id: string,
    name: string,
    client: string
    status: string
}

export type SpecItem = {
    id: string,
    projectId: string,
    name: string,
    description: string,
    quantity: number,
    unitOfMeasure: string
}

export type SourcingData = {
    id: string,
    specItemId: string,
    productId: string,
    unitPrice: number,
    total_cost: number,
    lead_time_days: number
}

export type AddSupplierBody = Omit<Supplier, "id">
export type AddSupplierProductBody = Omit<Product, "id">
export type AddProjectBody = Omit<Project, "id">
export type AddSpecBody = Omit<SpecItem, "id">
export type AddSourcingBody = Omit<SourcingData, "id">

export type SuppliersResponse = {
    success: true
    data: Supplier[]
} | {
    success: false
    data: null
}

export type SupplierProductsResponse = {
    success: true
    data: Product[]
} | {
    success: false
    data: null
}

export type AddSupplierResponseData = {
    success: true,
    data: {
        id: string
    }
} | {
    success: false,
    data: null
}

export type AddSupplierProductResponseData = {
    success: true,
    data: {
        id: string,
        supplier_id: string
    }
} | {
    success: false,
    data: null
}

export type AddProjectSpecItemResponseData = {
    success: true,
    data: {
        id: string,
        project_id: string
    }
} | {
    success: false,
    data: null
}

export type AddSourcingResponseData = {
    success: true,
    data: {
        id: string,
        spec_id: string
    }
} | {
    success: false,
    data: null
}

export type ProjectsResponse = {
    success: true
    data: Project[]
} | {
    success: false
    data: null
}

export type ProjectDetailsResponse = {
    success: true
    data: ProjectDetailsResponseData
} | {
    success: false
    data: null
}

export type SourcingResponse = {
    success: true
    data: SourcingResponseData[]
} | {
    success: false
    data: null
}

export type AddProjectResponseData = {
    success: true,
    data: {
        id: string
    }
} | {
    success: false,
    data: null
}

export type Tab = "Projects" | "Directory"

export type ParsedSpec = {
    name: string,
    unitOfMeasure: MeasuringUnit | '',
    quantity: number,
    description: string
}

export type SourcingDataResponse = {
    id: string,
    unitPrice: number,
    totalCost: number,
    leadTimeDays: number,
    product_id: string,
    supplier_id: string
}

export type SpecItemResponse = {
    id: string,
    name: string,
    description: string,
    quantity: number,
    unitOfMeasure: string,
    sourcingData: SourcingDataResponse | null
}

export type ProjectDetailsResponseData = {
    id: string,
    name: string,
    client: string,
    status: string,
    supplierCount: number,
    maxLeadDays: number,
    totalCost: number,
    specItems: SpecItemResponse[] | null
}

export type SourcingResponseData = {
    score: number,
    product: {
        id: string,
        supplier_id: string,
        name: string,
        category: string,
        unit_price: number,
        unit_of_measure: string,
        lead_time_days: number,
        supplier_name: string,
        supplier_country: string
    }
}
