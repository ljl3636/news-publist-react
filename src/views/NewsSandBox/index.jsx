import { Layout } from 'antd'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import NProgress from 'nprogress'
import { connect } from 'react-redux'
import 'nprogress/nprogress.css'
import './index.scss'
import { Spin } from 'antd'
import NewsSandBoxRouter from './NewsSandBoxRouter'
const { Content } = Layout;

const NewsSandBox = function (props) {

    const { isLoading } = props
    NProgress.start()
    useEffect(() => {
        NProgress.done()
    }, [])
    return (
        <Layout>
            <SideMenu></SideMenu>
            <Layout className="site-layout">
                <TopHeader></TopHeader>

                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: 'auto'
                    }}
                >
                    <NewsSandBoxRouter />
                    {/* 路由组件出口位置 */}
                    <Spin size='large' spinning={isLoading}>
                        <Outlet />
                    </Spin>
                </Content>

            </Layout>
        </Layout>
    )
}

export default connect(
    state => ({ isLoading: state.IsLoadingReducer.isLoading })
)(NewsSandBox)