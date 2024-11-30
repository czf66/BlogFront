<template>
  <div>
            <!-- 搜索框区域 -->
        <div class="input">
          <el-card shadow="always">
            <el-input
            v-model="input4"
            style="width: 240px"
            placeholder="请输入标题进行查询"
            >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button type="primary" size="medium" @click="load">查询</el-button>
            <el-button type="warning" size="medium" @click="reset">重置</el-button>
          </el-card>
        </div>
        <!-- 新增与批量删除区域 -->
        <div class="button">
          <el-card shadow="always">
            <el-button type="primary" size="medium" plain @click="handleAdd">新增</el-button>
            <el-button type="danger" size="medium" plain @click="removeByIds">批量删除</el-button>
          </el-card>
        </div>
        <el-main>
          <el-card shadow="always">
            <el-table :data="tableData" border stripe style="width: 100% " >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="ID" width="100"> </el-table-column>
              <el-table-column prop="title" label="标题"> </el-table-column>
              <el-table-column prop="content" label="内容" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="time" label="发布时间"> </el-table-column>

              <el-table-column
                  fixed="right"
                  label="操作"
                  width="200">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" circle  @click="edit(scope.row)"></el-button>
                  <el-popconfirm
                      @confirm="del(scope.row.id)"
                      title="确定删除？"
                  >
                    <el-button type="danger" icon="el-icon-delete" circle slot="reference" style="margin-left: 10px"></el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-main>
    <div style="margin-top: 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        :page-sizes="[2, 5, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 弹窗   -->
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%"
               :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form :model="entity">
        <el-form-item label="标题" label-width="120px">
          <el-input v-model="entity.title" autocomplete="off" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="内容" label-width="120px">
          <el-input type="textarea" :rows="5" v-model="entity.content" autocomplete="off" style="width: 80%"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from '../../utils/request'
const url = "/api/notice/"

export default {
  name: "Notice",
  data() {
    return {
      user: {},
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      entity: {},
      dialogFormVisible: false,
      total: 0,
      input4:"", //搜索框数据
    };
  },
  created() {
    this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
    this.load()
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()
    },
    // 重置功能
    reset() {
        this.input4 = null
        this.load()
    },
    load() {
       API.get(url + "/page", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            name: this.input4
          }
       }).then(res => {
          this.tableData = res.data.records || []
          this.total = res.data.total
       })
    },
    handleAdd() {
      this.entity = {}
      this.dialogFormVisible = true
    },
    edit(row) {
      this.entity = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    save() {
      if (!this.entity.id) {
        API.post(url, this.entity).then(res => {
          this.$message({
            type: "success",
            message: "操作成功"
          })
          this.load()
          this.dialogFormVisible = false
        })
      } else {
        API.put(url, this.entity).then(res => {
          this.$message({
            type: "success",
            message: "操作成功"
          })
          this.load()
          this.dialogFormVisible = false
        })
      }

    },
    del(id) {
      API.delete(url + id).then(res => {
        this.$message({
          type: "success",
          message: "操作成功"
        })
        this.load()
      })
    },
    // 批量删除
    removeByIds() {   
      if (!this.ids.length) {
          this.$message.warning('请选择数据')
          return
      }
      this.$confirm('您确定批量删除这些数据吗？', '确认删除', {type: "warning"}).then(response => {
          API.delete(url + '/remove/ids', {data: this.ids}).then(res => {
          if (res.code === '200') {   // 表示操作成功
              this.$message.success('操作成功')
              this.load(1)
          } else {
              this.$message.error(res.msg)  // 弹出错误的信息
          }
          })
      }).catch(() => {
      })
      },
  },
};
</script>

<style scoped>
.input .el-card{
    background-color: #fff;
    margin-left: 20px;
    margin-right: 20px;
    /* height: 50px; */
    /* line-height: 50px; */
    padding-left: 10px;
    box-sizing: border-box;
}
.button .el-card{
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    background-color: #fff;
    /* height: 60px; */
    padding-left: 10px;
}
</style>
