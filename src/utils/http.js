import axios from 'axios'
import { isLoading } from '@/redux/actions/IsLoadingAction'
axios.defaults.baseURL = "http://localhost:5000"

// axios.interceptors.request.use
// axios.interceptors.response.use

axios.interceptors.request.use(function (config) {
    //显示loading
    isLoading(true)
    return config
}, function (error) {
    return Promise.reject(error)
})


axios.interceptors.response.use(function (response) {
    //隐藏loading
    isLoading(false)
    return response
}, (error) => {
    return Promise.reject(error)
})