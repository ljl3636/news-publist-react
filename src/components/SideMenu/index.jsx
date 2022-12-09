import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import { HomeOutlined, DingtalkOutlined, BookOutlined, CheckSquareOutlined, UsergroupAddOutlined, UserOutlined, LockOutlined, RedditOutlined, AndroidFilled, TwitterOutlined, HighlightOutlined, UnderlineOutlined, BarsOutlined, AlibabaOutlined, ChromeOutlined, FacebookOutlined, ClearOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import './index.scss'
import axios from "axios";
const { Sider } = Layout;

const iconList = {
  '/home': <HomeOutlined />,
  '/user-manage': <UserOutlined />,
  '/user-manage/list': <UsergroupAddOutlined />,
  '/right-manage': <LockOutlined />,
  '/right-manage/role/list': <AndroidFilled />,
  '/right-manage/right/list': <RedditOutlined />,
  '/news-manage': <DingtalkOutlined />,
  '/news-manage/add': <HighlightOutlined />,
  '/news-manage/draft': <UnderlineOutlined />,
  '/news-manage/category': <BarsOutlined />,
  '/audit-manage': <CheckSquareOutlined />,
  '/audit-manage/audit': <ChromeOutlined />,
  '/audit-manage/list': <FacebookOutlined />,
  '/publish-manage': <BookOutlined />,
  '/publish-manage/unpublished': <TwitterOutlined />,
  '/publish-manage/published': <AlibabaOutlined />,
  '/publish-manage/sunset': <ClearOutlined />

}
const SideMenu = (props) => {
  const { isCollpased } = props
  // 定义 useReducer
  const [menu, setMenu] = useState([])
  const navigate = useNavigate()
  //处理刷新路径不变 高亮改变问题  
  const location = useLocation()  //pathname
  const handleClick = ({ key }) => {
    navigate(key)
  }
  const { role: { rights }} = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      const list = res.data
      // console.log(res.data);
      //处理掉侧边栏没有子菜单的一级菜单
      list.forEach(element => {
        return element.children.length === 0 && delete element.children
      });
      const menus = list.map(element => {
        
        if (element.children) {
          //整理有子菜单的一级菜单的孩子
          element.children = element.children.map(item => {
            return item.pagepermission === 1 && rights.includes(item.key) && { key: item.key, label: item.title, icon: iconList[item.key] }
          })
        }
        return element.pagepermission === 1 && rights.includes(element.key) && { key: element.key, children: element.children, label: element.title, icon: iconList[element.key] }
      })
      setMenu(menus)
    })
  }, [])

  return (
    <Sider trigger={null} collapsible collapsed={isCollpased}>
      <div style={{ display: 'flex', height: '100%', 'flexDirection': 'column' }}>
        <div className="logo" >全球新闻发布管理系统</div>
        <div style={{ flex: 1, 'overflow': 'auto' }}>
          <Menu
            defaultOpenKeys={["/" + location.pathname.split('/')[1]]}
            theme="dark"
            mode="inline"
            // triggerSubMenuAction='hover'
            // defaultSelectedKeys={[location.pathname]}
            selectedKeys={[location.pathname]}
            onClick={handleClick}
            items={menu}
          />
        </div>
      </div>
    </Sider>
  )
}


export default connect(
  state => ({ isCollpased: state.CollpasedReducer.isCollpased })
)(SideMenu)
