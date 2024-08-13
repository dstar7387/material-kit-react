
import axios from "axios";

export const saveData = (dataList) =>{
    axios.post(import.meta.env.VITE_BACKEND_URL + 'saveInit', dataList)
    .then((res) => {
        return res;
    })
    .catch ((err) =>{
        console.log(err)
    })
}

export const fetchData = async () => {
    try {
        const result = await axios.get(import.meta.env.VITE_BACKEND_URL + 'getAllInit')
        return result.data;
    } catch (error) {
        console.log(error)
    }
}

export const deleteData = async (rowIndex) => {
    axios.post(import.meta.env.VITE_BACKEND_URL + 'deleteInit', rowIndex)
    .then((res) => {
        return res;
    })
    .catch ((err) =>{
        console.log(err)
    })
}
