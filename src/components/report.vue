<template>
    <div>
      <!--      面包屑导航栏-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
<!--      卡片区域-->
      <el-card>
<!--        为echarts准备一个具备大小的div-->
        <div id="main" style="width:750px;height: 400px;"></div>
      </el-card>
    </div>
</template>

<script>
  import echarts from 'echarts'
  import _ from 'lodash'
  export default {
    name: 'report',
    data() {
      return {
        // 需要合并的数据
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    async mounted () {
      // 3 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      const {data:res} = await this.$http.get('reports/type/1')
      // 4 指定图表的配置项和数据
     const result =  _.merge(res.data,this.options)
      // 5 展示数据
      myChart.setOption(result);
      }
  }
</script>

<style scoped>

</style>
