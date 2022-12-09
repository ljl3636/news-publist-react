//引入 首页
import Home from "@/views/NewsSandBox/Home";
//用户 管理模块
import UserList from "@/views/NewsSandBox/UserManage/UserList";
//引入权限管理模块
import RightList from "@/views/NewsSandBox/RightManage/RightList";
import RoleList from "@/views/NewsSandBox/RightManage/RoleList";
//引入 新闻模块
import NewsAdd from "@/views/NewsSandBox/NewsManage/NewsAdd";
import NewsDraft from "@/views/NewsSandBox/NewsManage/NewsDraft";
import NewsCategory from "@/views/NewsSandBox/NewsManage/NewsCategory";
import NewsPreview from "@/views/NewsSandBox/NewsManage/NewsPreview"
import NewsUpdate from "@/views/NewsSandBox/NewsManage/NewsUpdate"
//引入审核模块
import Audit from "@/views/NewsSandBox/AuditManage/Audit";
import AuditList from "@/views/NewsSandBox/AuditManage/AuditList";
//引入发布模块
import UnPublished from "@/views/NewsSandBox/PublishManage/UnPublished";
import Published from "@/views/NewsSandBox/PublishManage/Published";
import Sunset from "@/views/NewsSandBox/PublishManage/Sunset";

import NoPermission from "@/views/NewsSandBox/NoPermission";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useRoutes } from "react-router-dom";



const LocalRouteMap = {
    '/home': <Home />,
    '/user-manage/list': <UserList />,
    '/right-manage/role/list': <RoleList />,
    '/right-manage/right/list': <RightList />,
    '/news-manage/add': <NewsAdd />,
    '/news-manage/draft': <NewsDraft />,
    '/news-manage/category': <NewsCategory />,
    '/news-manage/preview/:id': <NewsPreview />,
    '/news-manage/update/:id': <NewsUpdate />,
    '/audit-manage/audit': <Audit />,
    '/audit-manage/list': <AuditList />,
    '/publish-manage/unpublished': <UnPublished />,
    '/publish-manage/published': <Published />,
    '/publish-manage/sunset': <Sunset />,

}

export default () => {
    const [myroute, setMyRoute] = useState([])
    const { username, role: { rights } } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        Promise.all([
            axios.get('/rights'),
            axios.get('/children'),
        ]).then(res => {
            //处理一级路由manage跳转到无显示的页面
            setMyRoute([...[...res[0].data, ...res[1].data].filter(item => rights.includes(item.key) && item.grade === 2), [...res[0].data, ...res[1].data].find(item => item.title === '首页')])
        })
    }, [username])


    return useRoutes([
        ...myroute.map(item => ({
            path: item.key,
            element: LocalRouteMap[item.key],
            exact: true
        })),
        {
            path: '',
            element: <Navigate to='/home' />
        },
        {
            path: '*',
            element: <NoPermission />
        }
    ])
}