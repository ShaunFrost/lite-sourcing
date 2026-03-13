import { RowDataPacket } from "mysql2"

export enum ProjectStatus {
    'Draft',
    'Sourcing',
    'Quoted',
    'Closed'
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

export interface ProductRow extends RowDataPacket {
    id: string,
    supplier_id: string,
    name: string,
    category: string,
    unit_price: number,
    currency: string,
    unit_of_measure: string,
    lead_time_days: number
}

export interface SpecRow extends RowDataPacket {
    id: string
    project_id: string
    name: string
    description: string
    quantity: number
    unit_of_measure: string
}

export interface ProjectDetails extends RowDataPacket {
    project_id: string,
    project_name: string,
    project_client: string,
    project_status: string,
    project_created_at: string,
    project_updated_at: string,
    spec_item_id: string | null,
    spec_item_name: string | null,
    spec_item_description: string | null,
    spec_item_quantity: number | null,
    spec_item_uom: string | null,
    spec_item_created_at: string | null,
    sourcing_id: string | null,
    sourcing_unit_price: number | null,
    sourcing_total_cost: number | null,
    sourcing_lead_time_days: number | null,
    sourcing_created_at: string | null,
    product_id: string | null,
    product_name: string | null,
    product_category: string | null,
    product_unit_price: number | null,
    product_currency: string | null,
    product_uom: string | null,
    product_lead_time_days: number | null,
    supplier_id: string | null,
    supplier_name: string | null,
    supplier_country: string | null,
    supplier_website: string | null
}
