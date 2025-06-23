import { API_URL } from "./apiPath";
import axios from 'axios'
import { CareerItem } from "../type/types";



export const updateUserInformation = async (name: string, role: string, userId: string) => {
    const response = await axios.put(`${API_URL}/admin/update-user-information`, {
        name: name,
        role: role,
        user_id: userId
    },
    {
        withCredentials: true

    }
    );
    return response
}

export const updateBalanceScore = async (userId: string, balance: number, score: number, adminPassword: string) => {
    const response = await axios.put(`${API_URL}/admin/update-balance-score`, {
        user_id: userId,
        balance: balance,
        score: score,
        admin_password: adminPassword
    },
    {
        withCredentials: true

    }
    );
    return response
}

export const deleteTransaction = async (transactionId: string) => {
    const response = await axios.post(`${API_URL}/admin/delete-transaction`, {
        transaction_id: transactionId
    }, {
        withCredentials: true
    })
    return response.data
}

export const updateTransaction = async (
    reason: string,
    amount: number,
    type: string,
    transactionId: string
) => {
    const response = await axios.put(`${API_URL}/admin/update-transaction`, {
        reason,
        amount,
        type,
        transaction_id: transactionId
    }, {
        withCredentials: true
    })
    return response.data
}

export const addUser = async (
    name: string,
    password: string,
    email: string,
    public_key: string,
    role: string,
    balance: number,
    career: CareerItem[]
) => {
    const response = await axios.post(`${API_URL}/admin/add-user`, {
        name,
        password,
        email,
        public_key,
        role,
        balance,
        career
    }, {
        withCredentials: true
    })

    return response.data
}   