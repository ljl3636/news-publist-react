import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select;


const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setIsDisabled] = useState(false)
    useEffect(() => {
        setIsDisabled(props.isUpdateDisable)
    }, [props.isUpdateDisable])

    const { roleId, region } = JSON.parse(localStorage.getItem('token'))

    //传过来的 openType  = { add *-----*  {为了当时拿到修改的用户存储了进来} }
    const checkRegionDisable = (item) => {
        if (props.openType !== 'add') {
            //添加用户
            if (roleId === 1) {
                //超级管理员
                return false
            } else {
                return true
            }
        } else {
            //修改用户
            if (roleId === 1) {
                //超级管理员
                return false
            } else {
                return item.value !== region
            }
        }
    }

    const checkRoleDisable = (item) => {
        if (props.openType !== 'add') {
            //编辑用户
            if (roleId === 1) {
                //超级用户
                return false
            } else {
                //区域编辑
                return true
            }
        } else {
            //添加用户
            if (roleId === 1) {
                return false
            } else {
                return item.id !== 3
            }

        }
    }


    //角色选择的回调
    const handleChange = (value) => {
        //如果选择的是超级用户状态  区域设置为禁用状态
        //设置表单里面的区域
        if (value === 1) {
            setIsDisabled(true)
            ref.current.setFieldsValue({
                region: '全球'
            })
        } else {
            setIsDisabled(false)
            ref.current.setFieldsValue(
                ref.current.getFieldValue().region === '全球' && { region: '' }
            )
        }
    };

    return (
        <Form
            ref={ref}
            layout="vertical"  >
            <Form.Item name="username" label="用户名" rules={[
                {
                    required: true,
                    message: '用户名不能为空',
                },
            ]}
            >
                <Input maxLength={10} />
            </Form.Item>
            <Form.Item name="password" label="密码" rules={[
                {
                    required: true,
                    message: '密码不能为空',
                },
            ]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="roleId" label="角色" rules={[
                {
                    required: true,
                    message: 'Please input the usernmae of collection!',
                },
            ]}
            >
                <Select onChange={handleChange} style={{ 'touchAction': 'none' }} >
                    {
                        props.roleList.map(item => {
                            return <Option value={item.roleType} key={item.id} disabled={checkRoleDisable(item)}>{item.roleName}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item name="region" label="区域" rules={[
                {
                    required: true,
                    message: 'Please input the region of collection!',
                },
            ]}
            >
                <Select disabled={isDisabled} >
                    {
                        props.regionList.map(item => {
                            return <Option value={item.value} key={item.id} disabled={checkRegionDisable(item)}>{item.title} </Option>
                        })
                    }
                </Select>

            </Form.Item>

        </Form>
    )
})

export default UserForm