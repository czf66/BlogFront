<template>
    <div class="main">
        <!-- 搜索框区域 -->
        <div class="input">
          <el-card shadow="always">
            <el-input
            v-model="input4"
            style="width: 240px"
            placeholder="请输入评论内容进行查询"
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
        <!-- 具体内容区域 -->
        <el-main>
          <el-card shadow="always">
            <el-scrollbar height="100%">
                <el-table
                    ref="multipleTableRef"
                    :data="tableData"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="序号" property="id" width="120" sortable>
                    </el-table-column>
                    <el-table-column property="content" label="内容"  />
                    <el-table-column property="userId" label="评论人ID"  />
                    <el-table-column property="pid" label="父级ID"  />
                    <el-table-column property="time" label="评论时间" show-overflow-tooltip />
                    <el-table-column property="fid" label="关联ID"  />
                    <el-table-column property="module" label="模块"  />
                    <el-table-column label="操作" width="300px" align="center">
                        <template #default="scope">
                            <el-button type="primary" size="medium" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                            <el-button type="danger" size="medium" icon="el-icon-delete" circle @click="removeById(scope.row.id)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-scrollbar>
          </el-card>  
        </el-main>

        <!-- 分页功能 -->
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
  
        <!-- 弹窗 -->
        <el-dialog title="信息" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false" destroy-on-close>
            <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
                <el-form-item label="内容" prop="content">
                    <el-input v-model="form.content" placeholder="内容"></el-input>
                </el-form-item>
                <el-form-item label="评论人" prop="userId">
                    <el-input v-model="form.userId" placeholder="评论人"></el-input>
                </el-form-item>
                <el-form-item label="评论时间" prop="time">
                    <el-date-picker
                    v-model="form.time"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="关联ID" prop="fid">
                    <el-input v-model="form.fid" placeholder="关联ID"></el-input>
                </el-form-item>
                <el-form-item label="模块" prop="module">
                    <el-input v-model="form.module" placeholder="模块"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="fromVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>


<script>
import API from '../../utils/request'

const url = "/api/comment"

export default{
    name:'Comment',
    data(){
        return{
            tableData:[], //具体内容数据
            input4:"", //搜索框数据
            pageNum: 1, //分页的第几页数据
            pageSize: 10, //分页的一页有几条数据
            total: 0, //一个有几条数据
            form:{}, // 表单数据
            fromVisible:false, //窗体是否打开
            rules: { // 与<el-form:rules="rules">form表单的父元素绑定
                content: [  //与<el-form-item prop="name">用户名的表单子元素项进行绑定
                    {required: true, message: '请输入内容', trigger: 'blur'}, // 给打开的弹窗写校验规则
                ],
                userId: [  //与<el-form-item prop="name">用户名的表单子元素项进行绑定
                    {required: true, message: '请输入评论人', trigger: 'blur'}, // 给打开的弹窗写校验规则
                ],
                pid: [  //与<el-form-item prop="name">用户名的表单子元素项进行绑定
                    {required: true, message: '请输入父级ID', trigger: 'blur'}, // 给打开的弹窗写校验规则
                ],
                rootId: [  //与<el-form-item prop="name">用户名的表单子元素项进行绑定
                    {required: true, message: '请输入根节点ID', trigger: 'blur'}, // 给打开的弹窗写校验规则
                ],
                time: [  //与<el-form-item prop="name">用户名的表单子元素项进行绑定
                    {required: true, message: '请输入评论时间', trigger: 'blur'}, // 给打开的弹窗写校验规则
                ],
                fid: [  //与<el-form-item prop="name">用户名的表单子元素项进行绑定
                    {required: true, message: '请输入关联ID', trigger: 'blur'}, // 给打开的弹窗写校验规则
                ],
                module: [  //与<el-form-item prop="name">用户名的表单子元素项进行绑定
                    {required: true, message: '请输入模块', trigger: 'blur'}, // 给打开的弹窗写校验规则
                ],
            },
            ids:[]
        }
    },
    created() {
        this.load()
    },
    methods: {
        // 设置一页多少条数据
        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            this.load()
        },

        // 换页功能
        handleCurrentChange(pageNum) {
            this.pageNum = pageNum
            this.load()
        },

        // 重置功能
        reset() {
            this.input4 = null
            this.load()
        },

        // 打开新增数据框
        handleAdd(){ 
            this.form = {} // 新增数据的时候清空数据
            this.fromVisible = true // 打开弹窗
        },

        // 打开修改数据框
        handleEdit(row){
            this.form = JSON.parse(JSON.stringify(row))  // 给form对象赋值  注意要深拷贝数据
            this.fromVisible = true // 打开弹窗
            console.log(row)
            console.log(this.form)
        },

        // 获取数据
        load(){
            API.get(url + "/page", {
            params: {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                content: this.input4
            }
        }).then(res => {
            this.tableData = res.data.records || []
            this.total = res.data.total
            console.log(this.tableData)
        })
        },

        // 保存
        save(){
            this.$refs.formRef.validate((valid) => {
            if (valid) {
                API.request({
                    url: this.form.id ? '/api/comment/update' : '/api/comment/save',
                    method: this.form.id ? 'PUT' : 'POST',
                    data: this.form
                }).then(res => {
                    if (res.code === '200') {  // 表示成功保存
                        this.$message.success('保存成功')
                        this.load()
                        this.fromVisible = false
                    } else {
                        this.$message.error(res.msg)  // 弹出错误的信息
                    }
                })
            }
        })   
        },

        // 单个删除
        removeById(id){
            this.$confirm('您确定删除吗？', '确认删除', {type: "warning"}).then(response => {
                API.delete(url + '/remove/' + id).then(res => {
                    if(res.code === '200'){
                        this.$message({
                            type: "success",
                            message: "删除成功"
                        })
                    }else {
                    this.$message({
                        type: "error",
                        message: res.msg
                    })
                    }
                    this.load()
                })
            })
        },

        // 将选中的id给数组ids
        handleSelectionChange(rows) {
            console.log(rows)
            this.ids = rows.map(v => v.id)
            console.log(this.ids)
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
    }
}
</script>

<style>
.demo-pagination-block  {
  /* margin-top: 10px; */
  margin-left: 20px;
}
.el-button {
  margin-left: 10px;
}
.el-table .el-table-column:last-child {
    width: 50px;
}
.top .el-checkbox:last-of-type {
    margin-right: 50px;
}
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
.el-table .cell {
    font-size: 16px;
}
</style>