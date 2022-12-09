import React, { forwardRef, useEffect } from 'react'
import * as echarts from 'echarts';

var myChart;
const Bar = forwardRef((props, ref) => {
    const { style, title } = props
    // 基于准备好的dom，初始化echarts实例
    useEffect(() => {
        const { barData } = props
        if (myChart !== null && myChart !== "" && myChart !== undefined) {
            myChart.dispose();//销毁
        }
        myChart=echarts.init(ref.current)
        myChart?.setOption({
            title: {
                text: title
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(barData),
                axisLabel: {
                    rotate: 45,
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(barData).map(item => item.length)
                }
            ]
        });
        window.onresize = () => {
            //图标重新设置大小
            myChart.resize()
        }
        return () => {
            window.onresize = null
        }

    }, [props])


    return (
        <div ref={ref} style={style}></div>
    )
})

export default Bar