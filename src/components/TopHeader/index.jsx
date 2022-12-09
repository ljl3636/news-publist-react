import React from 'react'
import { Layout, Dropdown, Menu, Space, Avatar, Image, Tooltip } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateIsCollpased } from '@/redux/actions/CollpasedAction'
const { Header } = Layout;

const TopHeader = function (props) {
  const { isCollpased, updateIsCollpased } = props
  const navigate = useNavigate()
  const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <span>{roleName}</span>

          ),
        },
        {
          key: '2',
          danger: true,
          label: (
            <div onClick={() => {
              //清除token
              localStorage.removeItem('token')
              navigate('/login', { replace: true })
            }}>
              退出
            </div>
          ),
        },
      ]}></Menu>
  )
  //点击取反
  const changeCollapsed = () => {
    updateIsCollpased(!isCollpased)
  }
  return (
    <Header className="site-layout-background" style={{ padding: '0 18px' }}>
      {isCollpased ? <Tooltip title='展开'><MenuUnfoldOutlined onClick={changeCollapsed} /></Tooltip> : <Tooltip title='合起'><MenuFoldOutlined onClick={changeCollapsed} /></Tooltip>}
      <div style={{ float: 'right' }}>
        <span>欢迎 <span style={{ color: 'red' }}>{username}</span> 回来
          {/* 头像 */}
          <Dropdown overlay={menu}>
            <span onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar src={<Image src="https://joeschmoe.io/api/v1/random" style={{ width: 24 }} />} />
              </Space>
            </span>
          </Dropdown>
        </span>
      </div>
    </Header>
  )
}


/* 
  connect（
    //mapStateToProps
    //mapDispachToProps
    ）
  （被包装的组件）
*/

export default connect(
  state => ({ isCollpased: state.CollpasedReducer.isCollpased }),
  {
    updateIsCollpased
  }
)(TopHeader) 