<template>
    <div>
      <!--      面包屑导航栏-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-button type="primary" @click="addCate">添加分类</el-button>
        <tree-table :data="categoriesLists" :columns="columns" :show-index="true" index-text="#" border :selection-type="false" :expand-type="false" :show-row-hover="false">
<!--          是否有效-->
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:green"></i>
            <i class="el-icon-error" v-else style="color:red"></i>
          </template>
<!--          排序-->
          <template slot="order" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
            <el-tag v-else type="warning" size="mini">三级</el-tag>
          </template>
<!--          操作-->
          <template slot="opt" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </tree-table>
<!--        分页功能-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[2, 3, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total=total>
        </el-pagination>
<!--        添加分类对话框-->
        <el-dialog title="添加分类" :visible.sync="addCateVisiable" width="50%" @close="addCateDialogClose">
          <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRefs" label-width="100px">
            <el-form-item label="分类名称：" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：">
<!--              options用来指定数据源-->
<!--              props 用来指定数据对象-->
              <el-cascader clearable change-on-select  v-model="selectedKeys" expand-Trigger='hover' :options="parentCateList" :props="cascaderProps" @change="parentCateChange"></el-cascader>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addCateVisiable = false">取 消</el-button>
            <el-button type="primary" @click="addClickCate">确 定</el-button>
          </div>
        </el-dialog>

      </el-card>
    </div>
</template>

<script>
  export default {
    name: 'Categories',
    data(){
      return {
        categoriesLists: [],
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        total: 0,
        columns:[
          {
            label: '分类名称',
            prop: 'cat_name',
            width: '200px',
          },
          {
            label: '是否有效',
            //设置模板类型,将当前列定义为模板列
            type: 'template',
            //模板名称
            template: 'isok'
          },
          {
            label: '排序',
            //设置模板类型,将当前列定义为模板列
            type: 'template',
            //模板名称
            template: 'order'
          },
          {
            label: '操作',
            //设置模板类型,将当前列定义为模板列
            type: 'template',
            //模板名称
            template: 'opt'
          }
        ],
        addCateVisiable: false,
        addCateForm: {
          // 将要添加分类的名称
          cat_name: '',
          // 父级分类的名称
          cat_pid: 0,
          // 分类等级默认为一级分类
          cat_level: 0
        },
        addCateRules: {
          cat_name: [
            {required: true, message: '请输入分类名名称', trigger: 'blur'}
          ]
        },
        parentCateList: [],
        // 指定数据对象是什么
        cascaderProps: {
            value: 'cat_id',
            label: 'cat_name',
            children: 'children'
          },
        selectedKeys: ''
      }
    },
    created () {
      this.getCateLists()
    },
    methods:{
      async getCateLists() {
        const {data: res} = await this.$http.get('categories',{params: this.queryInfo})
        if(res.meta.status !== 200) return this.$message.error('请求失败，请稍后再试')
        this.categoriesLists = res.data.result
        this.total = res.data.total
      },
      //处理页数的大小改变的函数
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getCateLists()
      },
      //处理当前页面的函数
      handleCurrentChange(current) {
        this.queryInfo.pagenum = current
        this.getCateLists()
      },
      // 点击添加分类
      addCate() {
        this.getParentList()
        this.addCateVisiable = true
      },
      // 获取父级数据列表
      async getParentList() {
        const {data: res} = await this.$http.get('categories',{
          params: {
            type: 2
        }
        })
        if(res.meta.status !== 200) return this.$message.error('获取数据失败')
        this.parentCateList = res.data
      },
      parentCateChange() {
        if(this.selectedKeys.length > 0){
          //设置当前添加分类的父id
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          //设置当前分类等级
          this.addCateForm.cat_level = this.selectedKeys.length
        }else{
          //设置当前添加分类的父id
          this.addCateForm.cat_pid = 0
          //设置当前分类等级
          this.addCateForm.cat_level = 0
        }
      },
      addClickCate() {
        this.$refs.addCateRefs.validate(async valid => {
          if(!valid) return
          const {data:res} = await this.$http.post('categories',this.addCateForm)
          if(res.meta.status !== 201) return this.$message.error('添加失败')
          this.$message.success('添加成功')
          this.getCateLists()
          this.addCateVisiable = false
        })
      },
      addCateDialogClose() {
        this.$refs.addCateRefs.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_pid=0
        this.addCateForm.cat_level=0

      }
    }
  }
</script>

<style scoped>

</style>
