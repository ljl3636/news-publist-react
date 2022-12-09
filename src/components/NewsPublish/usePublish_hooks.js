
import axios from 'axios'
import { useEffect, useState } from 'react'
//接受publishState参数认证是 发布管理哪一项
function usePublish(publishState) {
    const { username } = JSON.parse(localStorage.getItem('token'))
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${publishState}&_expand=category`).then(res => {
            setDataSource(res.data)
        })

    }, [username])
    return dataSource
}


export default usePublish