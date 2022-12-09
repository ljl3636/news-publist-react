import React, { forwardRef, useEffect, useState } from 'react'
import * as echarts from 'echarts';
var myChart;
const Pie = forwardRef((props, ref) => {
    const { style, title } = props
    const [pieChart, setPieChart] = useState(null)
    // 基于准备好的dom，初始化echarts实例
    useEffect(() => {
        const { pieData } = props
        //处理pieData数据
        var list = []
        for (var i in pieData) {
            list.push({ name: i, value: pieData[i].length })
        }
        //如果有数据才初始化
        if (!pieChart) {
            myChart = echarts.init(ref.current);
            setPieChart(myChart)
        } else {
            myChart = pieChart
        }
        myChart.setOption({
            title: {
                text: title,
                left: 'center',
                top: 20,
                textStyle: {
                  color:'rgb(217, 74, 56,.8)',
                  fontSize:20
                }
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    type: 'pie',
                    radius: '65%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });




    }, [])


    return (
        <div ref={ref} style={style} ></div>
    )
})

export default Pie