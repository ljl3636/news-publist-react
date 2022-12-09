import { Navigate, useRoutes } from 'react-router-dom'
import React from 'react';
//引入一级路由
import Login from "@/views/Login";
import NewsSandBox from "@/views/NewsSandBox";
//引入游客登录的路由
import News from '@/views/New/New';
import Detail from '@/views/New/Detail';
import { message } from 'antd';

export default () => {
    return useRoutes([
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/*',
            element: localStorage.getItem('token') ? <NewsSandBox /> : <Navigate to='/login'/>
          
        },
        {
            path: '/news',
            element: <News />,
        },
        {
            path: '/detail/:id',
            element: <Detail />,
        },
    ])
}




