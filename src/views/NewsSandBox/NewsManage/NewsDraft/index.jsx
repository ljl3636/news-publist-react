import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Tooltip, notification, message } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, CloudUploadOutlined, BulbOutlined, CloseOutlined, SyncOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
const { confirm } = Modal;

export default function NewsDraft() {
  const [dataSource, setDataSource] = useState([])
  const navigate = useNavigate()
  const { username } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      setDataSource(res.data)
    })

  }, [username])
  const columns = [
    {
      width: 150,
      align: 'center',
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      align: 'center',
      dataIndex: 'title',
      render: (title, row) => {
        return (
          <Tooltip title="查看">
            <Button type='link' style={{ 'fontWeight': 'bold', 'fontSize': 18, 'color': '#1890ff' }} onClick={() => navigate(`/news-manage/preview/${row.id}`)}>{title}</Button>
          </Tooltip>
        )
      }
    },
    {
      title: '作者',
      align: 'center',
      dataIndex: 'author',
      render: (author) => {
        return <b style={{ 'fontFamily': 'sans-serif' }}>{author}</b>
      }
    },
    {
      align: 'center',
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <Tag icon={<SyncOutlined spin />} style={{ 'fontSize': 18 }}>{category.title}</Tag>
      }
    },
    {
      width: 250,
      align: 'center',
      title: '操作',
      render: (row) => {
        return (
          <div style={{ 'display': 'flex', 'justifyContent': 'space-evenly' }}>
            <Tooltip title="修改草稿">
              <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => { navigate(`/news-manage/update/${row.id}`) }} ></Button>
            </Tooltip>
            <Tooltip title="删除">
              <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => deleteHandler(row)}></Button>
            </Tooltip>
            <Tooltip title="加入审核">
              <Button type="primary" shape="circle" icon={<CloudUploadOutlined />} onClick={() => uploadHandler(row)} ></Button>
            </Tooltip>

          </div>
        )
      }
    }
  ];
  //删除的回调
  const deleteHandler = (row) => {
    confirm({
      title: `确定删除“${row.title}”吗 ?`,
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        axios.delete(`/news/${row.id}`).then(res => {
          message.success(`成功删除“${res.data.title}”`)
        }, error => {
          message.error(`${error.message}`)
        })
        setDataSource(dataSource.filter(item => item.id !== row.id))
      }
    });
  }

  //上传的回调
  const uploadHandler = (row) => {
    axios.patch(`/news/${row.id}`, {
      auditState: 1
    }).then(res => {
      //过滤本地数据
      setDataSource(dataSource.filter(item => item.id !== row.id))
      notification.info({
        message: `通知`,
        description: `“${res.data.title}”已加入审核列表`,
        icon: (
          <BulbOutlined
            style={{
              color: '#dcb862',
            }}
          />),
        placement: 'topRight'
      });
    }, error => {
      notification.info({
        message: `通知`,
        description: `${error.message}`,
        icon: (
          <CloseOutlined
            style={{
              color: 'red',
            }}
          />),
        placement: 'topRight'
      });
    })
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(row) => row.id} bordered pagination={{
        pageSize: 5
      }} />
    </div>
  )
}
