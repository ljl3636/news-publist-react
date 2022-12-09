import React, { useEffect, useState, useRef } from 'react'
import { PageHeader, Button, Steps, Form, Input, Select, message, notification } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import NewsEditor from '@/components/NewsEditor'
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss'
import axios from 'axios';
const { Step } = Steps;
const { Option } = Select
const steps = [
    {
        title: '基本信息',
        description: "新闻标题，新闻分类",
    },
    {
        title: '新闻内容',
        description: "新闻主题内容",
    },
    {
        title: '新闻提交',
        description: "保存草稿或者提交审核",
    },
];
export default function NewsUpdate() {
    const [newsCatrgory, setNewsCategory] = useState([])
    const [current, setCurrent] = useState(0);
    const [formInfo, setFormInfo] = useState({})
    const [editInfo, setEditInfo] = useState('')
    const NewsForm = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        axios.get(`/categories`).then(res => {
            setNewsCategory(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get(`/news/${location.pathname.split('/')[3]}`).then(res => {
            let { title, categoryId, content } = res.data

            //把获取来的数据 填入到表单中
            NewsForm.current.setFieldsValue({
                title,
                categoryId
            })
            //设置富文本框内容
            setEditInfo(content)
        })
    }, [location.pathname])



    // const { region, username, roleId } = JSON.parse(localStorage.getItem('token'))

    //点击跳转进度条
    const next = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                setFormInfo(res)
                setCurrent(current + 1);
            }).catch(error => {
                console.log(error);
            })
        } else {
            if (editInfo === '' || editInfo.replace(new RegExp('&nbsp;', 'g'), '').replace(new RegExp('<p></p>', 'g'), '').trim() === '') {
                message.error('新闻内容不能为空!')
            } else {
                setCurrent(current + 1);
            }
        }
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    //处理草稿箱更新 或 提交
    const handlerSaveOrSubmit = (auditState) => {
        axios.patch(`/news/${location.pathname.split('/')[3]}`, {
            title: formInfo.title,
            categoryId: formInfo.categoryId,
            content: editInfo,
            auditState,
        }).then(res => {
            navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
            //存入草稿或待审核提示
            notification.info({
                message: `通知`,
                description: `${auditState === 0 ? '更新成功' : '已加入审核列表'}`,
                icon: (
                    <CheckOutlined
                        style={{
                            color: '#52c41a',
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
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                onBack={() => window.history.back()}
            />
            <Steps current={current}>
                {steps.map((item) => (
                    <Step key={item.title} title={item.title} description={item.description} />
                ))}
            </Steps>
            <div style={{ 'marginTop': 50 }}>
                <div className={current === 0 ? '' : 'hidden'}>
                    <Form
                        name="basic"
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: '请输入新闻标题!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: '请勾选新闻类别!' }]}
                        >
                            <Select
                                placeholder="新闻类别"
                            >
                                {
                                    newsCatrgory.map(news => {
                                        return <Option value={news.id} key={news.id}>{news.title}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : 'hidden'}>
                    <NewsEditor getContent={(value) => { setEditInfo(value) }} editInfo={editInfo} ></NewsEditor>
                </div>
                {/* <div className={current === 2 ? '' : 'hidden'}></div> */}
            </div>
            <div className="steps-action" style={{ 'marginTop': 10 }}>
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()} >
                        下一步
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <span>
                        <Button type='primary' style={{ 'marginRight': 8 }} onClick={() => handlerSaveOrSubmit(0)}>保存草稿箱</Button>
                        <Button type="danger" onClick={() => handlerSaveOrSubmit(1)}>
                            提交审核
                        </Button>
                    </span>
                )}
                {current > 0 && (
                    <Button
                        style={{
                            margin: '0 8px',
                        }}
                        onClick={() => prev()}
                    >
                        上一步
                    </Button>
                )}
            </div>
        </div>
    )
}
