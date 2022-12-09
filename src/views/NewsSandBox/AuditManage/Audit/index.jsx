import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Tooltip, message, } from 'antd';
import { SyncOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


export default function Audit() {
  const [dataSource, setDateSource] = useState([])
  const { roleId, username, region } = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      //先查看是不是超级用户  如果是全部返回   那只能是区域管理员（区域编辑不显示此页） 把自己过滤出来 再把区域一致，区域编辑新闻过滤出来
      setDateSource(roleId === 1 ? list : [
        // ...list.filter(item => item.author === username),    区域管理应该不能审核自己的  
        ...list.filter(item => item.region === region && item.roleId === 3 )
      ])
    })
  }, [roleId, region, username])

  const pass = (row) => {
    axios.patch(`/news/${row.id}`, {
      auditState: 2,
      publishState: 1
    }).then(res => {
      message.success(`“${row.title}”通过审核`)
      setDateSource(dataSource.filter(item => item.id !== row.id))
    }, err => {
      message.error(err.message)
    })
  }
  const noPass = (row) => {
    axios.patch(`/news/${row.id}`, {
      auditState: 3,
      publishState: 0
    }).then(res => {
      message.info(`“${row.title}”未通过审核`)
      setDateSource(dataSource.filter(item => item.id !== row.id))
    }, err => {
      message.error(err.message)
    })
  }

  const columns = [
    {
      width: 250,
      align: 'center',
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, row) => {
        return <Tooltip title="查看"><Button type='link' style={{ 'fontWeight': 'bold', 'fontSize': 16, 'color': '#1890ff' }} onClick={() => { navigate(`/news-manage/preview/${row.id}`) }}>{title}</Button></Tooltip>
      }

    },
    {
      align: 'center',
      title: '作者',
      dataIndex: 'author',
      render: (author) => {
        return <b style={{ 'fontFamily': 'sans-serif' }}>{author}</b>
      }
    },
    {
      title: '新闻分类',
      align: 'center',
      dataIndex: 'category',
      render: (category) => {
        return <Tag icon={<SyncOutlined spin />} color='orange' style={{ 'fontSize': 16 }}>{category.title}</Tag>
      }

    },
    {
      align: 'center',
      title: '审核',
      width: 250,
      render: (row) => {
        return (
          <div style={{ 'display': 'flex', 'justifyContent': 'space-evenly' }}>
            <Tooltip title="通过">
              <Button shape="round" type='primary' icon={<CheckOutlined />} onClick={() => pass(row)}></Button>
            </Tooltip>
            <Tooltip title="不通过">
              <Button shape="round" type='danger' icon={<CloseOutlined />} onClick={() => noPass(row)}></Button>
            </Tooltip>
          </div>
        )
      }
    }
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(row) => row.id} bordered pagination={{
        pageSize: 5
      }} />;
    </div>
  )
}
