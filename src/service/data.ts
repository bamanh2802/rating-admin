import { API_URL } from "./apiPath";
import axios from 'axios'

export const actionTypeTimeLine = async (mode: string) => {
    const response = await axios.post(`${API_URL}/analyst/action-type-timeline`, {
            mode: mode
    },
    {
        withCredentials: true

    }
    );
    return response
}

export const cardAnalyst = async () => {
    const response = await axios.get(`${API_URL}/analyst/card-analyst`, 
    {
        withCredentials: true

    }
    );
    return response
}

export const getAllUser = async () => {
    const response = await axios.get(`${API_URL}/admin/get-all-users`, 
    {
        withCredentials: true

    }
    );
    return response
}

export const getAllTransactions = async () => {
    const response = await axios.get(`${API_URL}/admin/get-all-transactions`, 
    {
        withCredentials: true

    }
    );
    return response
}

export const getRecentActivities = async () => {
    const response = await axios.get(`${API_URL}/analyst/recent-activities`, {
        withCredentials: true
    })
    return response.data
}

export const getCashFlow = async (mode: string) => {
    const response = await axios.post(`${API_URL}/analyst/cash-flow`,{
        mode: mode
}, {
        withCredentials: true
    })
    return response.data
}