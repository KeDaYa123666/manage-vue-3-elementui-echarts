<template>
    <el-row class="home" :gutter="20">
        <el-col :span="8" style="margin-top: 20px;">
            <el-card shadow="hover">
                <div class="user">
                    <img src="../../assets/images/user.png" alt="" />
                    <div class="userinfo">
                        <p class="name">Admin</p>
                        <p class="role">超级管理员</p>
                    </div>
                </div>
                <div class="login-info">
                    <p>上次登录时间:<span>xxxx-yy-zz</span></p>
                    <p>上次登录地点:<span>xxxx</span></p>
                </div>
            </el-card>
            <el-card shadow="hover" style="margin-top: 20px;" height="450px">
                <el-table :data="tableData">
                    <el-table-column v-for="(val, key) in tableLabel" :key="key" :prop="key" :label="val">
                    </el-table-column>
                </el-table>
            </el-card>
        </el-col>
        <el-col :span="16" style="margin-top: 20px;">
            <div class="num">
                <el-card :body-style="{ display: 'flex', padding: 0 }" v-for="item in countData" :key="item.name">
                    <component class="icons" :is="item.icon" :style="{ background: item.color }"></component>
                    <div class="detail">
                        <p class="num">￥{{ item.value }}</p>
                        <p class="txt">{{ item.name }}</p>
                    </div>
                </el-card>
            </div>
            <el-card style="height: 280px;">
                <div ref="echart" style="height: 280px;">

                </div>
            </el-card>
            <div class="graph">
                <el-card style="height: 260px;">
                    <div ref="userechart" style="height: 240px;">

                    </div>
                </el-card>
                <el-card style="height: 260px;">
                    <div ref="videoechart" style="height: 240px;">

                    </div>
                    <div ref="piechart" style="height: 240px;">

                    </div>
                </el-card>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue';
import axios from "axios"
import { reactive } from 'vue';
import * as echarts from 'echarts'

export default defineComponent({
    setup() {
        const { proxy } = getCurrentInstance()

        //设置为响应式数据
        let tableData = ref([])
        let countData = ref([])

        const tableLabel = {
            name: '课程',
            todayBuy: '今日购买',
            monthBuy: '本月购买',
            totalBuy: '总购买'
        };
        //异步方法
        const getTableList = async () => {
            //这是本地的mock模拟数据
            await axios.get("/home/getData").then((res) => {
                console.log(res);

                if (res.data.code === 200) {
                    tableData.value = res.data.data.tableData
                }
            })
            // let res = await proxy.$api.getTableData()
            // tableData.value = res.data.data.tableData
            // console.log(res);

        }
        //获取首页count数据
        const getCountData = async () => {
            //这是本地的mock模拟数据
            await axios.get("/home/getData").then((res) => {
                if (res.data.code === 200) {
                    countData.value = res.data.data.countData
                }
            })
        }

        onMounted(() => {
            getTableList(),
                getCountData(),
                getChartData()
        })

        // 图表配置
        let lineOptions = reactive({
            tooltip: { trigger: "axis" },
            xAxis: { type: "category", data: [], axisLine: { lineStyle: { color: "#17b3a3" } } },
            yAxis: [{ type: "value", axisLine: { lineStyle: { color: "#17b3a3" } } }],
            color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
            series: []
        });

        let barOptions = reactive({
            tooltip: { trigger: "axis" },
            xAxis: { type: "category", data: [], axisLine: { lineStyle: { color: "#17b3a3" } } },
            yAxis: [{ type: "value", axisLine: { lineStyle: { color: "#17b3a3" } } }],
            color: ["#2ec7c9", "#5ab1ef"],
            series: []
        });

        let pieOptions = reactive({
            tooltip: { trigger: "item" },
            color: ["#0f78f4", "#dd536b", "#9462e5", "#a6a6a6", "#e1bb22", "#39c362", "#3ed1cf"],
            series: []
        });

        // 图表数据
        let orderData = reactive({ xData: [], series: [] });
        let userData = reactive({ xData: [], series: [] });
        let videoData = reactive({ series: [] });

        //获取数据
        const getChartData = async () => {
            await axios.get("/home/getData").then((result) => {
                if (result.data.code === 200) {
                    //折线图数据
                    let res = result.data.data.orderData
                    console.log(res, 'res');

                    //柱状图数据
                    let userRes = result.data.data.userData
                    console.log(userRes, 'userRes');
                    //饼状图数据
                    let videoRes = result.data.data.videoData
                    console.log(videoRes, 'videoRes');

                    orderData.xData = res.date
                    const keyArray = Object.keys(res.date[0])
                    const series = keyArray.map((key) => ({
                        name: key,
                        data: res.data.map(item => item[key]),
                        type: "line"
                    }))
                    orderData.series = series
                    lineOptions.xAxis.data = orderData.xData;
                    lineOptions.series = orderData.series;
 
                    let lineChart = echarts.init(proxy.$refs['echart']);
                    lineChart.setOption(lineOptions);
 
                    // 柱状图数据
                    userData.xData = userRes.map(item => item.date);
                    userData.series = [
                        { name: '新增用户', data: userRes.map(item => item.new), type: 'bar' },
                        { name: '活跃用户', data: userRes.map(item => item.active), type: 'bar' }
                    ];
 
                    barOptions.xAxis.data = userData.xData;
                    barOptions.series = userData.series;
 
                    let barChart = echarts.init(proxy.$refs['userechart']);
                    barChart.setOption(barOptions);

                    // 饼图数据
                    videoData.series = [
                        {
                            type: 'pie',
                            data: videoRes.map(item => ({ name: item.name, value: item.value }))
                        }
                    ];
 
                    pieOptions.series = videoData.series;
 
                    let pieChart = echarts.init(proxy.$refs['piechart']);
                    pieChart.setOption(pieOptions);
                }
            })
        }
        return {
            tableData,
            tableLabel,
            countData
        }
    }
})
</script>

<style lang="less" scoped>
.home {
    .user {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;

        img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin-right: 40px;
        }
    }

    .login-info {
        p {
            line-height: 30px;
            font-size: 14px;
            color: #999;

            span {
                color: #666;
                margin-left: 60px;
            }
        }
    }

    .num {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .el-card {
            width: 32%;
            margin-bottom: 20px;
        }

        .icons {
            width: 80px;
            height: 80px;
            font-size: 30px;
            text-align: center;
            line-height: 80px;
            color: #fff;
        }

        .detail {
            margin-left: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .num {
                font-size: 30px;
                margin-bottom: 10px;
            }

            .txt {
                font-size: 14px;
                text-align: center;
                color: #999;
            }
        }
    }
}
</style>