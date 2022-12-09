import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Tooltip, message, } from 'antd';
import { RollbackOutlined, SyncOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function AuditList() {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username])
  //免去三元表达式
  const auditList = ['未审核', '待审核', '已通过', '未通过']
  const btnIconList = [<RollbackOutlined />, <UploadOutlined />, <EditOutlined />]
  const btnType = ['default', 'primary', 'danger']
  const btnContent = ['撤回', '发布', '修改']
  const colorList = ['orange', 'green', 'red']

  //处理点击事件
  const handlerClick = (row) => {
    const { auditState, id, title } = row
    //通过auditState查看是要怎么  
    if (auditState === 1) {
      //1---处于待审核状态 撤回入草稿箱  
      axios.patch(`/news/${id}`, { auditState: 0 }).then(
        res => {
          message.success(`成功撤回“${title}”到草稿箱`)
          setDataSource(dataSource.filter(item => item.id !== id))
        },
        err => message.error(err.message)
      )
    } else if (auditState === 2) {
      //2---处于通过状态 发布上线
      axios.patch(`/news/${id}`, { publishState: 2, publishTime: Date.now() }).then(
        res => {
          message.success(`成功发布“${title}”到发布管理`)
          setDataSource(dataSource.filter(item => item.id !== id))
        },
        err => message.error(err.message)
      )
    } else if (auditState === 3) {
      //3 ---处于审核未通过 修改跳转
      navigate(`/news-manage/update/${id}`)
    }
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
      render: (category, row) => {
        return <Tag icon={<SyncOutlined spin />} color={colorList[row.auditState - 1]} style={{ 'fontSize': 16 }}>{category.title}</Tag>
      }
    },
    {
      title: '审核状态',
      align: 'center',
      dataIndex: 'auditState',
      render: (auditState) => {
        return (<Tag color={colorList[auditState - 1]} style={{ 'fontSize': 18 }}>{auditList[auditState]}</Tag>)
      }
    },
    {
      align: 'center',
      title: '操作',
      width: 250,
      render: (row) => {
        const { auditState } = row
        return (
          <div style={{ 'display': 'flex', 'justifyContent': 'space-evenly' }}>
            <Button type={btnType[auditState - 1]} shape="round" icon={btnIconList[auditState - 1]} onClick={() => { handlerClick(row) }} style={{ width: 120 }}>{btnContent[auditState - 1]}</Button>
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
