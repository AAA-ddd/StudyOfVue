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
      <!--        消息提示框-->
      <el-alert title="添加商品信息" type="info" show-icon center>
      </el-alert>
      <!--        进度条-->
      <!--        -0的目的 转换为数字-->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--        tab栏-->
      <el-form :model="goodsForm" :rules="goodsRules" ref="goodsRefs" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeaved" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader v-model="goodsForm.goods_cat" :options="cateLists" expand-Trigger='hover' :props="cateProps"
                           @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--            商品item项-->
            <el-form-item v-for="item in manyTabList" :label="item.attr_name" :key="item.attr_id">
              <!--渲染多选框-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb"  v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTabList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
<!--            upload组件上传图片不用axios 所以不会在上传的时候添加token 导致上传不上-->
            <el-upload :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="goodsForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
<!--    预览图片对话框-->

    <el-dialog title="图片预览" :visible.sync="previewVisiable" width="30%">
      <img :src="previewPath" alt="" class="preImg">
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    name: 'Add',
    data () {
      return {
        activeIndex: 0,
        goodsForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          // 商品所属的分类数组
          goods_cat: [],
          // 图片路径数组
          pics: [],
          // 商品详情描述
          goods_introduce: '',
          attrs: []
        },
        cateLists: [],
        goodsRules: {
          goods_name: [
            {
              required: true,
              message: '请输入商品名称',
              triggle: 'blur'
            }
          ],
          goods_price: [
            {
              required: true,
              message: '请输入商品价格',
              triggle: 'blur'
            }
          ],
          goods_weight: [
            {
              required: true,
              message: '请输入重量',
              triggle: 'blur'
            }
          ],
          goods_number: [
            {
              required: true,
              message: '请输入数量',
              triggle: 'blur'
            }
          ],
          // goods_cat: [
          //   {
          //     required: true,
          //     message: '请选择分类',
          //     triggle: 'blur'
          //   }
          // ]
        },
        cateProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        // 动态参数列表数据
        manyTabList: [],
        // 静态参数列表参数
        onlyTabList:[],
        uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
        // 请求头 添加token
        headerObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        previewPath: '',
        previewVisiable: false
      }
    },
    computed: {
      cateId () {
        if (this.goodsForm.goods_cat.length === 3) {
          return this.goodsForm.goods_cat[2]
        }
        return null
      }
    },
    created () {
      this.getCateList()
    },
    methods: {
      async getCateList () {
        const { data: res } = await this.$http.get('categories')
        if (res.meta.status !== 200) return this.$message.error('请求失败')
        this.cateLists = res.data
        console.log(this.cateLists)
      },
      // 级联选择器中发生变化会触发这个函数
      handleChange () {
        console.log(this.goodsForm.goods_cat)
        if (this.goodsForm.goods_cat.length !== 3) {
          this.goodsForm.goods_cat = []
        }
      },
      beforeTabLeaved (newVal, oldVal) {
        if (oldVal === '0' && this.goodsForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品分类')
          return false
        }
      },
      async tabClick () {
        if (this.activeIndex === '1') {
          const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'many'
            }
          })
          if (res.meta.status !== 200) return this.$message.error('请求失败')
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          this.manyTabList = res.data
        }else if(this.activeIndex === '2') {
          const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'only'
            }
          })
          if (res.meta.status !== 200) return this.$message.error('请求失败')
          this.onlyTabList = res.data
          console.log(this.onlyTabList)
        }
      },
      // 点击图片名称触发的函数
      handlePreview(file) {
        this.previewPath = file.response.data.url
        this.previewVisiable = true
      },
      // 点击删除后触发的函数
      handleRemove(file) {
        // 1 获取将要删除的图片的临时路径
        const filePath = file.response.data.tmp_path
        // 2 从pics数组中，找到这个图片对应的索引值
       const i =  this.goodsForm.pics.findIndex(x =>
          x.pic === filePath)
        // 3 调用函数的splice方法，把图片信息从pics数组中移除
        this.goodsForm.pics.splice(i,1)
      },
      handleSuccess(response) {
        // 拼接得到图片信息对象
        const picInfo = {
          pic: response.data.tmp_path
        }
        // 将信息对象加入到pics 数组中
        this.goodsForm.pics.push(picInfo)
      },
      add() {
        this.$refs.goodsRefs.validate(async valid => {
          if(!valid) return this.$message.error('请填写必要的表单项目')
          // 执行添加业务逻辑 用深拷贝 拷贝一个 表单项
          const form = _.cloneDeep(this.goodsForm)
          form.goods_cat = form.goods_cat.join(',')
          // 处理动态参数
          this.manyTabList.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.goodsForm.attrs.push(newInfo)
          })
          // 处理静态参数
          this.onlyTabList.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.goodsForm.attrs.push(newInfo)
          })
          form.attrs = this.goodsForm.attrs
          const {data:res} = await this.$http.post('goods',form)
          if(res.meta.status !== 201) return this.$message.error('添加商品信息失败')
          this.$message.success('添加商品信息成功')
          this.$router.push('/goods')
        })
      }
    },

  }
</script>

<style scoped>
.preImg {
  width: 100%;
}
  .addBtn {
    margin-top: 10px;
  }
</style>
