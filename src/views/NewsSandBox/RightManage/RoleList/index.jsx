import React, { useState, useEffect } from 'react'
import { DeleteOutlined, UnorderedListOutlined, CheckCircleOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import { Table, Button, Tag, Modal, Tree, message } from 'antd';
import axios from "axios";
const { confirm } = Modal;
export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  //删除的回调
  const deleteHandler = (row) => {
    confirm({
      title: `确定删除“${row.roleName}”吗 ?`,
      icon: <CloseCircleTwoTone />,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        setDataSource(dataSource.filter(item => item.id !== row.id))
        //通知服务器删除
        axios.delete(`/roles/${row.id}`)
        message.success('删除成功')
      }
    });
  }

  //弹出层处理
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    //同步dataSource
    setDataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return { ...item, rights: currentRights }
      } else {
        return item
      }
    }))

    axios.patch(`/roles/${currentId}`, {
      rights: currentRights
    })

    message.success('保存成功')

  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const onCheck = (checkedKeys) => {
    setCurrentRights(checkedKeys.checked)
  };

  useEffect(() => {
    //获取全部的角色
    axios.get('/roles').then(res => {
      setDataSource(res.data)
    })
    axios.get('/rights?_embed=children').then(res => {
      setRightList(res.data)
    })
  }, [])

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
      title: '角色名称',
      dataIndex: 'roleName',
      render: (roleName) => {
        return <Tag icon={<CheckCircleOutlined />} color="processing"><b><i style={{ 'fontSize': '16px' }}>{roleName}</i></b></Tag>
      }
    },
    {
      width: 200,
      align: 'center',
      title: '操作',
      render: (row) => {
        return (
          <div style={{ 'display': 'flex', 'justifyContent': 'space-evenly' }}>
            <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => {
              showModal(row)
              setCurrentRights(row.rights)
              setCurrentId(row.id)
            }}></Button>
            <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => deleteHandler(row)}></Button>
          </div>
        )
      }
    }
  ]
  return (
    <div>
      <Table bordered dataSource={dataSource} columns={columns} rowKey={(row) => row.id} pagination={false}  ></Table>
      <Modal title="权限设置" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="保存" cancelText="取消">
        <Tree
          checkable
          checkedKeys={currentRights}
          treeData={rightList}
          onCheck={onCheck}
          checkStrictly={true}
        />
      </Modal>
    </div>
  )
}
