import React, { useState, useEffect, useRef } from 'react'
import { Table, Tag, Button, Modal, Switch, notification, message } from 'antd';
import { DeleteOutlined, EditOutlined, CloseCircleTwoTone, AliwangwangOutlined, RedditOutlined, PlusOutlined, SmileOutlined, AndroidOutlined } from '@ant-design/icons';
import './index.scss'
import axios from 'axios';
import UserForm from '@/components/UserForm';
const { confirm } = Modal;

export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [open, setOpen] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const [openType, setOpenType] = useState('')
  const [isUpdateDisable, setIsUpdateDisaple] = useState(false)
  const addForm = useRef(null)

  useEffect(() => {
    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
    axios.get('/users?_expand=role').then(res => {
      setDataSource(roleId === 1 ? res.data : [
        ...res.data.filter(item => item.username === username),
        ...res.data.filter(item => item.region === region && item.roleId === 3)
      ])
    })
    axios.get('/regions').then(res => {
      setRegionList(res.data)
    })
    axios.get('/roles').then(res => {
      setRoleList(res.data)
    })
  }, [])

  const roleIconList = [<AndroidOutlined />, <AliwangwangOutlined />, <RedditOutlined />]
  const colorList = ['red', 'blue', 'orange']

  const columns = [
    {
      width: 150,
      align: 'center',
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: '全球',
          value: '全球'
        }
      ],
      onFilter: (value, item) => item.region === value,
      render: (region) => {
        return <b>{region === "" ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      align: 'center',
      render: (role) => {
        return <Tag icon={roleIconList[role.id - 1]} color={colorList[role.id - 1]} style={{ width: 130, fontSize: 18 }}><b>{role.roleName}</b></Tag>
      }
    },
    {
      width: 500,
      align: 'center',
      title: '用户名',
      dataIndex: 'username',
      render: (username) => {
        return <b style={{ 'fontFamily': 'sans-serif' }}>{username}</b>
      }
    },
    {
      title: '用户状态',
      align: 'center',
      width: 250,
      dataIndex: 'roleState',
      render: (roleState, row) => {
        return <Switch color='volcano' checked={roleState} disabled={row.default} onClick={() => { updateRoleState(row) }}></Switch>
      }
    },
    {
      align: 'center',
      title: '操作',
      width: 250,
      render: (row) => {
        return (
          <div>
            <div style={{ 'display': 'flex', 'justifyContent': 'space-evenly' }}>
              <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => changeHandler(row)} style={{ display: row.default && 'none' }}></Button>
              <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => deleteHandler(row)} style={{ display: row.default && 'none' }}></Button>
              <Button type="link" shape="circle" icon={<AndroidOutlined style={{ fontSize: 24, color: '#cf1322' }} />} onClick={() => message.error('禁用操作!')} style={{ display: !row.default && 'none' }} />
            </div>
          </div>

        )
      }
    }
  ];
  //删除角色的回调
  const deleteHandler = (row) => {
    confirm({
      title: `确定删除“${row.username}”吗 ?`,
      icon: <CloseCircleTwoTone />,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        setDataSource(dataSource.filter(item => item.id !== row.id))
        //通知服务器删除
        axios.delete(`/users/${row.id}`)
        message.success('删除成功')
      }
    });
  }

  //修改用户状态的回调
  const updateRoleState = (row) => {
    row.roleState = !row.roleState;
    //修改本地状态
    setDataSource([...dataSource])
    //通知后台修改状态
    axios.patch(`/users/${row.id}`, { roleState: row.roleState })
  }

  //修改角色的回调
  const changeHandler = (row) => {
    setOpen(true)
    //保存点击修改的值
    setOpenType(row)
    //异步填入 数据
    setTimeout(() => {
      if (row.roleId === 1) {
        //点开的是超级用户 通知UserForm 修改状态
        setIsUpdateDisaple(true)
      } else {
        //点开的不是超级用户
        setIsUpdateDisaple(false)
      }
      addForm.current.setFieldsValue(row)
    })

  }


  //添加用户||修改用户
  const addFormOk = () => {
    addForm.current.validateFields().then(value => {
      //校验成功 关闭 后提示
      setOpen(false)
      addForm.current.resetFields()
      notification.open({
        message: openType === 'add' ? `成功添加 ${value.username} 用户` : `成功修改 ${value.username} 用户`,
        icon: (
          <SmileOutlined
            style={{
              color: '#108ee9',
            }}
          />
        ),
      });
      //post到后端，生成id，再设置dataSource，方便后面的删除和更新
      if (openType === 'add') {
        axios.post('/users', {
          ...value,
          'roleState': true,
          'default': false
        }).then(res => {
          //成功返回id及数据
          setDataSource([...dataSource, {
            ...res.data,
            role: roleList.find(item => item.id === value.roleId)
          }])
        })
      } else {
        //通知后台修改
        //修改当前的状态
        setDataSource(dataSource.map(item => {
          if (item.id === openType.id) {
            return {
              ...item,
              ...value,
              role: roleList.find(item => item.id === value.roleId)
            }
          } else {
            return item
          }
        }))
        axios.patch(`/users/${openType.id}`, value)
      }
    })
      .catch(err => {
        console.log('Validate Failed:', err);
      });

  }


  return (
    <div>
      <Button type='primary' icon={<PlusOutlined />} style={{ marginBottom: 14 }} onClick={() => {
        setOpen(true);
        setOpenType('add')
        setTimeout(() => {
          addForm.current.resetFields()
          setIsUpdateDisaple(false)
        })
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} bordered pagination={{
        pageSize: 6
      }}
        rowKey={row => row.id}
      />;
      <Modal
        open={open}
        title={openType === 'add' ? '添加用户' : '修改用户'}
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setOpen(false)
          setIsUpdateDisaple(!isUpdateDisable)

        }}
        onOk={() => addFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList}
          ref={addForm} isUpdateDisable={isUpdateDisable} openType={openType} />
      </Modal>
    </div>
  )
}
