import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Modal, Tooltip, notification } from 'antd';
import { CloudUploadOutlined, CloudDownloadOutlined, SyncOutlined, DeleteOutlined, CheckOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined, InfoOutlined } from '@ant-design/icons';
import axios from 'axios';
// import axios from "axios";
const { confirm } = Modal;


export default function NewsPublish(props) {
    const [dataSource, setDataSource] = useState([])
    // const [publishState, setPublishState] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        setDataSource(props.dataSource)
        //一开始是undefined   等它有值 才赋值
        // props.dataSource[0] && setPublishState(props.dataSource[0].publishState)
    }, [props.dataSource])

    //icon图标颜色
    const iconList = ['orange', 'green', 'gray']
    const btnTextList = ['发布', '下线', '删除']
    const btnTypeList = ['primary', 'link', 'danger']
    const btnIconList = [<CloudUploadOutlined />, <CloudDownloadOutlined />, <DeleteOutlined />]

    const columns = [
        {
            width: 150,
            align: 'center',
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, row) => {
                return <Tooltip title="查看"><Button type='link' style={{ 'fontWeight': 'bold', 'fontSize': 16, 'color': '#1890ff' }} onClick={() => { navigate(`/news-manage/preview/${row.id}`) }}>{title}</Button></Tooltip>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
            align: 'center',
            render: (author) => {
                return <b style={{ 'fontFamily': 'sans-serif' }}>{author}</b>
            }
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            align: 'center',
            render: (category, row) => {
                return <Tag icon={<SyncOutlined spin />} color={iconList[row.publishState - 1]} style={{ 'fontSize': 16 }}>{category.title}</Tag>
            }
        },
        {
            align: 'center',
            title: '操作',
            width: 200,
            render: (row,) => {
                return (
                    <div style={{ 'display': 'flex', 'justifyContent': 'space-evenly' }}>
                        <Tooltip title={btnTextList[row.publishState - 1]} >
                            <Button type={btnTypeList[row.publishState - 1]} shape="circle" icon={btnIconList[row.publishState - 1]} onClick={() => handlerClick(row)}></Button>
                        </Tooltip>
                    </div>
                )
            }
        }
    ];

    //封装处理操作后的数据的函数
    const resetData = (row) => {
        setDataSource(dataSource.filter(item => item.id !== row.id))
    }
    //对应提示所对应的图标
    const errWarnIncoList = {
        CloseCircleOutlined: <CloseCircleOutlined style={{ color: 'red' }} />,
        CheckOutlined: <CheckOutlined style={{ color: '#52c41a' }} />,
        InfoCircleOutlined: <InfoCircleOutlined style={{ color: '#52c41a' }} />,
        WarningOutlined: <WarningOutlined style={{ color: '#52c41a' }} />,
        InfoOutlined: <InfoOutlined style={{ color: '#52c41a' }} />
    }
    //封装错误通知的的函数
    const warnMessage = (err, icon, type, text) => {
        notification[type]({
            message: '通知',
            description: `“${type === 'error' ? `${err.message}` : `${text}`}”`,
            icon: errWarnIncoList[icon],
            placement: type==='success'?'topRight':'bottomRight'
        })
    }

    const handlerClick = (row) => {
        const { publishState, id, title } = row
        switch (publishState) {
            case 1:
                //待发布  发布按钮操作
                axios.patch(`/news/${id}`, {
                    publishState: 2,
                    publishTime: Date.now()
                }).then(res => {
                    resetData(row)
                    warnMessage(undefined, 'CheckOutlined', 'success', `“${title}”已发布!`)
                }, err => {
                    warnMessage(err, 'CloseCircleOutlined', 'error', undefined)
                })

                break;
            case 2:
                //已发布  下线按钮操作
                axios.patch(`/news/${id}`, {
                    publishState: 3,
                    publishTime: null
                }).then(res => {
                    resetData(row)
                    warnMessage(undefined, 'InfoCircleOutlined', 'success', `“${title}”已下线!`)
                }, err => {
                    warnMessage(err, 'CloseCircleOutlined', 'error', undefined)
                })
                break;
            default:
                // case 3 : 删除
                confirm({
                    title: `确定删除“${row.title}”吗 ?`,
                    icon: <WarningOutlined style={{ color: 'red' }} />,
                    okText: "确认",
                    cancelText: "取消",
                    onOk() {
                        axios.delete(`/news/${id}`).then(res => {
                            resetData(row)
                            warnMessage(undefined, 'InfoOutlined', 'success', `“${title}”已删除!`)
                        }, err => {
                            warnMessage(err, 'CloseCircleOutlined', 'error', undefined)
                        })
                    }
                })
                break;
        }
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(row) => row.id} bordered pagination={{
                pageSize: 5
            }} />;
        </div>
    )
}
