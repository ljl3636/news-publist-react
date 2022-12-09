import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from "axios";
const { confirm } = Modal;


export default function RightList() {
  const [dataSource, setDataSource] = useState([])
  
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      res.data.find(item => {
        //查找到children字段为空的并且删除空children字段
        return item.children.length === 0 && delete item.children
      })
      setDataSource(res.data)
    })

  }, [])
  const columns = [
    {
      width: 150,
      align:'center',
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      render: (title) => {
        return <Tag color="#1890ff">{title}</Tag>
      }
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color='volcano'>{key}</Tag>
      }
    },
    {
      align: 'center',
      title: '操作',
      width: 200,
      render: (row) => {
        return (
          <div style={{ 'display': 'flex', 'justifyContent': 'space-evenly' }}>
            <Popover content={<div style={{ textAlign: 'center' }}> <Switch checked={row.pagepermission} onChange={() => switchHandler(row)}></Switch></div>} trigger={row.pagepermission === undefined ? '' : 'click'}>
              <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={row.pagepermission === undefined}></Button>
            </Popover>
            <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => deleteHandler(row)}></Button>
          </div>
        )
      }
    }
  ];
  const deleteHandler = (row) => {
    confirm({
      title: `确定删除“${row.title}”吗 ?`,
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        //需要判断是几级菜单
        if (row.grade === 1) {
          setDataSource(dataSource.filter(item => item.id !== row.id))
          //通知服务器删除
          axios.delete(`/rights/${row.id}`)
        } else {
          // 找到上一级菜单 在菜单过滤掉对应子菜单
          const preMenu = dataSource.find(item => item.id === row.rightId)
          preMenu.children = preMenu.children.filter(item => item.id !== row.id)
          setDataSource([...dataSource])
          axios.delete(`/children/${row.id}`)
        }

      }
    });
  }


  const switchHandler = (row) => {
    row.pagepermission = row.pagepermission === 0 ? 1 : 0
    setDataSource([...dataSource])
    if (row.grade === 1) {
      axios.patch(`/rights/${row.id}`, {
        pagepermission: row.pagepermission
      })
     
    } else {
      axios.patch(`/children/${row.id}`, {
        pagepermission: row.pagepermission
      })
    }
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} bordered pagination={{
        pageSize: 5
      }} />;
    </div>
  )
}
