<template>
    <div>
      <!--      面包屑导航栏-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
<!--      卡片区域-->
      <el-card>
<!--        警告区域-->
        <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
<!--        商品分类-->
        <el-row class="cat_opt">
          <el-col>
            <span>选择商品分类：</span>
<!--            级联选择框-->
            <el-cascader v-model="selectedCateKeys" :options="cateLists" expandTrigger="hover" :props="cateProps" @change="handleChange"></el-cascader>
          </el-col>
        </el-row>
<!--        tab标签-->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
<!--          添加静态属性名阪-->
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="isBtnUsable" @click="addClickCate()">添加属性</el-button>
            <el-table :data="manyTabData">
<!--              扩展列-->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleColose(i,scope.row)">{{item}}</el-tag>
<!--                  添加新的标签-->
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
<!--              索引列-->
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editShow(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
<!--          添加动态参数面板-->
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isBtnUsable" @click="addClickCate()">添加属性</el-button>
            <el-table :data="onlyTabData">
<!--              展开行-->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleColose(i,scope.row)">{{item}}</el-tag>
                  <!--                  添加新的标签-->
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
<!--              索引列-->
              <el-table-column type="index"></el-table-column>
              <el-table-column label="属性名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini"  @click="editShow(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!--        添加属性对话框-->
      <el-dialog :title="'添加'+titleText " :visible.sync="addCateVisiable" width="50%" @close="addDialogClose">
        <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRefs" label-width="100px">
          <el-form-item :label=titleText prop="attr_name">
            <el-input v-model="addCateForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCateVisiable = false">取 消</el-button>
          <el-button type="primary" @click="addParams()">确 定</el-button>
        </div>
      </el-dialog>
<!--      修改参数的对话框 -->
      <el-dialog :title="'修改'+titleText " :visible.sync="editCateVisiable" width="50%" @close="editDialogClose">
        <el-form :model="editCateForm" :rules="editCateRules" ref="editCateRefs" label-width="100px">
          <el-form-item :label=titleText prop="attr_name">
            <el-input v-model="editCateForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCateVisiable = false">取 消</el-button>
          <el-button type="primary" @click="editParams()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'Params',
    data() {
      return {
        cateLists: [],
        cateProps: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        selectedCateKeys: '',
        activeName: 'many',
        //动态参数的数据
        manyTabData: [],
        //静态属性的数组
        onlyTabData: [],
        addCateVisiable: false,
        addCateForm: {
          attr_name: ''
        },
        addCateRules:{
          attr_name:[
            {required:true,message:'请输入名称'}
          ]
        },
        // 控制修改对话框
        editCateVisiable: false,
        //修改表单中的内容
        editCateForm: [],
        editCateRules:{
          attr_name:[
            {required:true,message:'请输入名称'}
          ]
        }
      }
    },
    created () {
      this.getCateLists()
    },
    computed: {
      isBtnUsable() {
        if(this.selectedCateKeys.length !== 3) {
          return true
        }else{
          return false
        }
      },
      cateId() {
        if(this.selectedCateKeys.length===3){
          return this.selectedCateKeys[2]
        }
        return null
      },
      titleText() {
        if(this.activeName === 'many'){
          return '动态参数'
        }else{
          return '静态属性'
        }
      }
    },
    methods: {
      async getCateLists() {
        const {data: res} = await this.$http.get('categories')
        if(res.meta.status !== 200) return this.$message.error('获取数据失败')
        this.cateLists = res.data
      },
      handleChange() {
       this.getParamsData()
      },
      handleTabClick() {
        this.getParamsData()
      },
     async getParamsData(){
        //如果当前选择的不是第三级的 那么不能选中
        if(this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = []
          this.manyTabData = []
          this.onlyTabData = []
          return
        }
      const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
        params: {sel : this.activeName}
      })
       if(res.meta.status !== 200) return this.$message.error('获取失败')
       res.data.forEach(item => {
         item.attr_vals = item.attr_vals ? item.attr_vals.split(' '):[]
         // 控制文本框的显示与隐藏
         item.inputVisible = false
         item.inputValue = ''
       })
        if(this.activeName === 'many'){
          this.manyTabData = res.data
        }else{
          this.onlyTabData = res.data
        }
      },
      addClickCate() {
        this.addCateVisiable = true
      },
      addDialogClose() {
        this.$refs.addCateRefs.resetFields()
      },
      addParams() {
        this.$refs.addCateRefs.validate(async valid => {
          if(!valid) return this.$message.error('添加失败')
          const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
            attr_name: this.addCateForm.attr_name,
            attr_sel: this.activeName
          })
          if(res.meta.status !== 201) return this.$message.error('添加失败')
          this.$message.success('添加成功')
          this.addCateVisiable=false
          this.getParamsData()
        })
      },
      editParams() {
        this.$refs.editCateRefs.validate(async valid => {
          if(!valid) return this.$message.error('添加失败')
          const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editCateForm.attr_id}`,{
              attr_name: this.editCateForm.attr_name,
              attr_sel: this.activeName
          })
          if(res.meta.status !== 200) return this.$message.error('请求失败')
          this.$message.success('添加成功')
          this.getParamsData()
          this.editCateVisiable = false
        })
      },
      async editShow(attr_id) {
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`)
        if(res.meta.status !== 200) return this.$message.error('请求失败')
        this.editCateForm = res.data
        this.editCateVisiable=true
      },
      editDialogClose(){
        this.$refs.editCateRefs.resetFields()
      },
      async removeParams(attr_id) {
        const result =  await this.$confirm('确定要删除这个属性吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(result !== 'confirm') return this.$message.info('取消删除')
        const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if(res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getParamsData()
      },
      // 文本点击按钮或者回车都会触发
      async handleInputConfirm(row) {
        // 如果文本框没输入东西
       if(row.inputValue.trim().length === 0){
         row.inputValue = ''
         row.inputVisible = false
         return
       }
       //如果没有return 那么就直接进行下面的部分
        // 将添加的数据 加入到循环遍历的标签上面
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        this.saveAttrValues(row)
      },
      // 点击按钮展示文本输入框
      showInput(row) {
        row.inputVisible=true
        // 让文本框自动获取焦点
        //$nextTick 方法的作用就是当页面渲染完之后，才会指定回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //删除当前删除的项
      handleColose(i, row) {
        row.attr_vals.splice(i,1)
        this.saveAttrValues(row)
      },
      // 保存当前vals中的数据
      async saveAttrValues(row){
        // 将参数加入到数据库中
        const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
          {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(' ')
          })
        if(res.meta.status !== 200) return this.$message.error('添加失败')
        this.$message.success('添加成功')

      }
    }
  }
</script>

<style scoped>
  .el-alert__title {
    line-height: 30px!important;
  }
  .cat_opt{
    margin: 15px 0;
    font-size: 14px;
  }
  .el-cascader{
    width: 20%;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
