import axios, { type AxiosResponse } from "axios"
import type { 
    AddSupplierBody, SuppliersResponse, AddSupplierProductBody, SupplierProductsResponse, 
    AddSupplierResponseData,
    AddSupplierProductResponseData,
    ProjectsResponse,
    AddProjectBody,
    AddProjectResponseData,
    AddSpecBody,
    AddProjectSpecItemResponseData,
    ProjectDetailsResponse,
    SourcingResponse,
    AddSourcingBody,
    AddSourcingResponseData
} from "../types"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const getSuppliers = async () => {
    const url = `${BACKEND_URL}/supplier`
    const response: AxiosResponse<SuppliersResponse> = await axios.get(url)
    if (!response.data.success) {
        throw new Error("Error fetching suppliers")
    }
    return response.data.data
}

export const addNewSupplier = async (body: AddSupplierBody) => {
    const url = `${BACKEND_URL}/supplier`
    const response = await axios.post(url, body)
    const responseData: AddSupplierResponseData = response.data
    if (!responseData.success) {
        throw new Error("Error adding supplier")
    }
    return responseData.data
}

export const getProductsForSupplier = async (supplierId: string) => {
    const url = `${BACKEND_URL}/products/${supplierId}`
    const response: AxiosResponse<SupplierProductsResponse> = await axios.get(url)
    if (!response.data.success) {
        throw new Error("Error fetching supplier products")
    }
    return response.data.data
}

export const addNewProductForSupplier = async (body: AddSupplierProductBody) => {
    const url = `${BACKEND_URL}/products`
    const response = await axios.post(url, body)
    const responseData: AddSupplierProductResponseData = response.data
    if (!responseData.success) {
        throw new Error("Error fetching supplier products")
    }
    return responseData.data
}

export const getProjects = async () => {
    const url = `${BACKEND_URL}/project`
    const response: AxiosResponse<ProjectsResponse> = await axios.get(url)
    if (!response.data.success) {
        throw new Error("Error fetching supplier products")
    }
    return response.data.data
}

export const addNewProject = async (body: AddProjectBody) => {
    const url = `${BACKEND_URL}/project`
    const response = await axios.post(url, body)
    const responseData: AddProjectResponseData = response.data
    if (!responseData.success) {
        throw new Error("Error fetching supplier products")
    }
    return responseData.data
}

export const getProjectData = async (projectId: string) => {
    const url = `${BACKEND_URL}/project/details/${projectId}`
    const response: AxiosResponse<ProjectDetailsResponse> = await axios.get(url)
    const responseData = response.data
    if (!responseData.success) {
        throw new Error("Error fetching supplier products")
    }
    return responseData.data
}

export const addNewSpecItem = async (body: AddSpecBody) => {
    const url = `${BACKEND_URL}/project/spec-item`
    const response = await axios.post(url, body)
    const responseData: AddProjectSpecItemResponseData = response.data
    if (!responseData.success) {
        throw new Error("Error fetching supplier products")
    }
    return responseData.data
}

export const getSourcingOptions = async (specId: string) => {
    const url = `${BACKEND_URL}/project/source-list/${specId}`
    const response: AxiosResponse<SourcingResponse> = await axios.get(url)
    const responseData = response.data
    if (!responseData.success) {
        throw new Error("Error fetching sourcing options")
    }
    return responseData.data
}

export const attachSourcing = async (body: AddSourcingBody) => {
    const url = `${BACKEND_URL}/project/sourcing`
    const response = await axios.post(url, body)
    const responseData: AddSourcingResponseData = response.data
    if (!responseData.success) {
        throw new Error("Error attaching sourcing")
    }
    return responseData.data
}
