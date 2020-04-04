<template>
    <div>
      <!--      面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--  卡片区域-->
      <el-card>
        <el-button type="primary">添加角色</el-button>
        <el-table :data="RolesData" border stripe>
<!--          展开列-->
          <el-table-column type="expand">
            <template slot-scope="scope">
<!--              行-->
              <el-row v-for="(item1,i1) in scope.row.children" :class="['btbottom',i1=== 0?'bdtop':'','vcenter']" :key="item1.id">
<!--                渲染一级权限-->
                  <el-col :span="5" >
                    <el-tag>{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i>
                  </el-col>
<!--                渲染二级权限-->
                  <el-col :span="19" >
<!--                    渲染二级权限-->
                    <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2===0?'':'bdtop','vcenter']">
                      <el-col :span="6">
                        <el-tag type="success">{{item2.authName}}</el-tag><i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
<!--                        渲染三级权限-->
                        <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable @close="deleteRights(scope.row,item3.id)">{{item3.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
              </el-row>
            </template>
          </el-table-column>
<!--          索引列-->
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作">
<!--            作用域插槽-->
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="changeRights(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
<!--        分配权限对话框-->
        <el-dialog title="修改权限" :visible.sync="changeRightVisiable" width="50%">
          <el-tree :data="rightLists" :props="rightsProps" node-key="id" default-expand-all show-checkbox :default-checked-keys="defaultKeys" ref="allotRefs"></el-tree>
          <span slot="footer" class="dialog-footer">
          <el-button @click="changeRightVisiable = false">取 消</el-button>
          <el-button type="primary" @click="allotRight">确 定</el-button>
          </span>
        </el-dialog>
      </el-card>
    </div>
</template>

<script>
  export default {
    name: 'Roles',
    data() {
      return {
        RolesData: [],
        changeRightVisiable: false,
        rightLists: [],
        rightsProps:{
          label: 'authName',
          children: 'children'
        },
        defaultKeys:[],
        roleId:''
      }
    },
    created () {
      this.getRolesLists()
    },
    methods: {
      async getRolesLists(){
        const {data: res} = await this.$http.get('roles')
        if(res.meta.status !== 200) return this.$message.error('获取用户信息失败')
        this.RolesData = res.data
      },
      async deleteRights(role,rightId){
        const res = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(res === 'cancel') return this.$message.info('取消删除')
        const {data: result} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(result.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        // 为了能让删除后的数据显示在屏幕中
        role.children = result.data
      },
      async changeRights(role) {
        this.roleId = role.id
        this.defaultKeys=[];
        const {data: res} = await this.$http.get('rights/tree')
        if(res.meta.status !== 200) return this.$message.error('加载失败')
        this.rightLists = res.data
        // 渲染树节点前的多选框
        this.getRoleLeafs(role,this.defaultKeys)
        console.log(this.defaultKeys)
        this.changeRightVisiable=true
      },
      getRoleLeafs(node,arr){
        if(!node.children){
          return arr.push(node.id)
        }
        node.children.forEach(item =>
          this.getRoleLeafs(item,arr))
      },
      async allotRight() {
        const keys = [
          ...this.$refs.allotRefs.getHalfCheckedKeys(),
          ...this.$refs.allotRefs.getCheckedKeys()
        ]
        const idstr = keys.join(',')
        const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids:idstr })
        if (res.meta.status !== 200) return this.$message.error('无法添加，请重试')
        this.changeRightVisiable = false
        this.$message.success('添加成功')
        this.getRolesLists()
      }
    }
  }
</script>

<style scoped>
.el-col{
  margin: 7px 0;
}
  .bdtop{
    border-top: 1px solid #eee;
  }
  .btbottom{
    border-bottom: 1px solid #eee;
  }
  .el-tag--warning{
    margin: 7px;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
