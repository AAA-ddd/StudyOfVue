<template>
  <div class="userViews">
    <!--      面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片区域-->
    <el-card class="box-card">
      <!--       查找区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="userInfo.query" clearable
                    @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--        显示用户区域-->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!--              取出boolean类型的值-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="EditUsersrForm(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="修改管理员" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRolesPower(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--        分页区域-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="userInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="userInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!--      添加用户对话框-->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" @close="closeEvent">
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserRefs" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>
    <!--      添加修改框-->
    <el-dialog title="修改用户信息" :visible.sync="editVisible" width="50%" @close="editFormClosed">
      <!--        表单部分-->
      <el-form :model="editForm" :rules="editRules" ref="editRefs" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--          底面部分-->
      <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
    </el-dialog>
    <!--      分配角色对话框-->
    <el-dialog title="分配角色" :visible.sync="rolesVisiable" width="30%">
      <div>
        <p>当前用户：{{userinfoofRole.username}}</p>
        <p>当前角色：{{userinfoofRole.role_name}}</p>
        <p>
          分配角色：
<!--          绑定的是被选则的那个选项的rid值-->
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="rolesVisiable = false">取 消</el-button>
    <el-button type="primary" @click="setRoles()">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Users',
    data () {
      const checkEmail = (rule, value, callback) => {
        const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
        if (emailReg.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法的邮箱'))
      }
      const checkphone = (rule, value, callback) => {
        const phoneReg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
        if (phoneReg.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法的手机号'))
      }

      return {
        userInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        userList: [],
        total: 0,
        dialogVisible: false,
        addUserForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        editVisible: false,
        editForm: {
          username: '',
          email: '',
          mobile: ''
        },
        addUserRules: {
          username: [
            {
              required: true,
              message: '请输入用户名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 6,
              message: '长度在3-6之间',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 15,
              message: '长度在 6 到 15 个字符',
              trigger: 'blur'
            }
          ],
          email: [
            {
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: checkphone,
              trigger: 'blur'
            }
          ]
        },
        editRules: {
          email: [
            {
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: checkphone,
              trigger: 'blur'
            }
          ]
        },
        // 控制角色对话框显示与隐藏
        rolesVisiable: false,
        userinfoofRole: {},
        rolesList:[],
        selectedRoleId: ''
      }
    },
    created () {
      this.getUserList()
    },
    methods: {
      async getUserList () {
        const { data: res } = await this.$http.get('users', {
          params: this.userInfo
        })
        if (res.meta.status !== 200) return this.$message.error('网络不好，请重新加载')
        this.userList = res.data.users
        this.total = res.data.total
      },
      // 每一页显示多少条数据
      handleSizeChange (newSize) {
        this.userInfo.pagesize = newSize
        this.getUserList()
      },
      // 当前页是多少
      handleCurrentChange (newPage) {
        this.userInfo.pagenum = newPage
        this.getUserList()
      },
      async changeStatus (dataStr) {
        console.log(dataStr)
        const { data: res } = await this.$http.put(`users/${dataStr.id}/state/${dataStr.mg_state}`)
        if (res.meta.status !== 200) {
          dataStr.mg_state = !dataStr.mg_state
          return this.$message.error('修改状态失败')
        }
        this.$message.success('修改成功')
      },
      closeEvent () {
        this.$refs.addUserRefs.resetFields()
      },
      addUser () {
        this.$refs.addUserRefs.validate(async valid => {
          if (!valid) return this.$message.error('添加数据失败，请重新添加')
          const { data: res } = await this.$http.post('users', this.addUserForm)
          this.$message.success('添加成功')
          this.dialogVisible = false
          this.getUserList()
        })
      },
      async EditUsersrForm (id) {
        const { data: res } = await this.$http.get('users/' + id)
        if (res.meta.status !== 200) return this.$message.error('查询不到')
        this.editForm = res.data
        this.editVisible = true
      },
      editFormClosed () {
        this.$refs.editRefs.resetFields()
      },
      editUser () {
        this.$refs.editRefs.validate(async valid => {
          if (!valid) return this.$message.error('您输入的信息有误，无法提交')
          const { data: res } = await this.$http.put('users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (res.meta.status !== 200) return this.$message.error('修改失败')
          this.editVisible = false
          this.getUserList()
          this.$message.success('修改成功')
        })
      },
      async deleteUser (id) {
        const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (res === 'cancel') return this.$message.info('取消删除')
        const { data: del } = await this.$http.delete('users/' + id)
        if (del.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getUserList()
      },
      // 设置用户权限
      async setRolesPower(role) {
        this.rolesVisiable = true
        this.userinfoofRole = role
        const {data:res} = await this.$http.get('roles')
        this.rolesList = res.data
      },
      // 点击确认修改之后将数据传递给数据库
      async setRoles() {
       if(!this.selectedRoleId) return this.$message.error('你没有选择要分配的权限，不能提交')
        const {data:res} = await this.$http.put(`users/${this.userinfoofRole.id}/role`,{
         rid: this.selectedRoleId
        })
        if(res.meta.status !== 200) return this.$message.error('设置角色失败，请重新尝试')
        this.$message.success('设置角色成功')
        this.rolesVisiable = false
        this.getUserList()
      }
    }
  }
</script>

<style scoped lang="less">
  .el-breadcrumb {
    font-size: 12px;
  }
</style>
