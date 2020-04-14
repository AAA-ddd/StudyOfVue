<template>
  <div>
    <!--      面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!--        表格区域-->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="70px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="150px">
          <template slot-scope="scope">
            {{scope.row.add_time|dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180x">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--        分页功能-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size=this.queryInfo.pagesize
                     layout="total, sizes, prev, pager, next, jumper"
                     :total=total background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'GoodsLists',
    data () {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [],
        total: 0,
      }
    },
    created () {
      this.getGoodsList()
    },
    methods: {
      async getGoodsList () {
        const { data: res } = await this.$http.get('goods', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) return this.$message.error('加载数据失败')
        this.goodsList = res.data.goods
        this.total = res.data.total
      },
      handleSizeChange(newVal) {
        this.queryInfo.pagesize = newVal
        this.getGoodsList()
      },
      handleCurrentChange(newVal) {
        this.queryInfo.pagenum = newVal
        this.getGoodsList()
      },
      async removeGoods(id) {
        const result = await this.$confirm('此操作将永久删除该商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)

        if(result !== 'confirm') return this.$message.info('取消失败')
        const {data:res} = await this.$http.delete(`goods/${id}`)
        if(res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getGoodsList()
      },
      goAddPage() {
        // 添加新的路由 并跳转
        this.$router.push('/goods/add')
      }
    }
  }
  //【买2付1】南极人男士女士保暖内衣情侣薄款棉质基础棉毛衫秋衣秋裤套装P6007
  //PPTV-32C3 32英寸 1GB+8GB 4核 64位处理器 高清智能网络WIFI平板电视机
</script>

<style scoped>

</style>
