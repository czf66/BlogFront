<template>
  <div style="width: 90%;margin: 10px auto 80px ;">
    <el-card>
      <div style="margin-top: 10px;text-align: center;font-size: 20px;">
        您对我们有什么建议吗？有的话请留下您宝贵的意见
      </div>
      <div style="padding: 20px; color: #888">
        <div>
          <el-input type="textarea" :rows="3" v-model="entity.content"></el-input>
          <div style="text-align: right; padding: 10px"><el-button type="primary" @click="save">留言</el-button></div>
        </div>
      </div>

      <div style="display: flex; padding: 20px" v-for="item in messages">
        <div style="text-align: center; flex: 1">
          <el-image :src="item.avatar" style="width: 60px; height: 60px; border-radius: 50%"></el-image>
        </div>
        <div style="padding: 0 10px; flex: 5">
          <div><b style="font-size: 14px">{{ item.username }}</b></div>
          <div style="padding: 10px 0; color: #888;font-size: 16px">
            {{ item.content }}
            <el-popconfirm
                @confirm="del(item.id)"
                title="确定删除？"
            >
            <el-button type="text" icon="el-icon-delete" circle slot="reference" v-if="item.username === user.username" style="margin-left: 10px">删除</el-button>
            </el-popconfirm>
          </div>
          <div style="color: #888; font-size: 12px">
            <span>{{ item.time  }}</span>
            <el-button type="text" style="margin-left: 20px" @click="reReply(item.id)">回复</el-button>
          </div>
          <!-- 回复 -->
          <div style="background-color: #fff; padding: 10px;" v-for="children in item.children">
              <img :src="$baseUrl + '/files/' + children.avatar" alt="" style="width: 50px; height: 50px; border-radius: 50%">
              {{ children.username }}：<span style="color: #888;font-size: 14px">{{ children.content }}</span>
              <el-popconfirm
                @confirm="del(children.id)"
                title="确定删除？"
              >
              <el-button type="text" icon="el-icon-delete" circle slot="reference" v-if="children.username === user.username" style="margin-left: 10px">删除</el-button>
              </el-popconfirm>
            <div style="color: #888; font-size: 12px">
              <span>{{ children.time  }}</span>
            </div>
          </div>
        </div>
      </div>

      <el-dialog title="回复信息" :visible.sync="dialogFormVisible" width="30%"
                 :close-on-click-modal="false">
        <el-form :model="entity">
          <el-form-item label="内容" label-width="120px">
            <el-input v-model="entity.reply" autocomplete="off" type="textarea" :rows="3"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="reply">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>


  </div>
</template>

<script>
import API from "@/utils/request";

export default {
  name: "Message",
  data() {
    return {
      user: {},
      messages: [],
      dialogFormVisible: false,
      isCollapse: false,
      entity: {}
    }
  },
  created() {
    this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {};
    this.loadMessage();


  },
  methods: {
    handleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    logout() {
      $.get("/api/user/logout");
      sessionStorage.removeItem("user");
      location.href = "/page/end/login.html";
    },

    loadMessage() {
      API.get("/api/message/foreign/").then(res => {
        console.log(res.data)
        this.messages = res.data;
      })
    },
    cancel() {
      this.dialogFormVisible = false;
      this.entity = {};
    },
    reReply(id) {
      this.dialogFormVisible = true;
      this.entity.parentId = id;
    },
    reply() {
      this.entity.content = this.entity.reply;
      this.save();
    },

    save() {
      if (!this.user.username) {
        this.$message({
          message: "请登录",
          type: "warning"
        });
        return;
      }
      if (!this.entity.content) {
        this.$message({
          message: "请填写内容",
          type: "warning"
        });
        return;
      }
      this.entity.username = this.user.username
      API.post("/api/message", this.entity).then(res => {
        if (res.code === '200') {
          this.$message({
            message: "评论成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
        this.entity = {}
        this.loadMessage();
        this.dialogFormVisible = false;
      })
    },
    del(id) {
      API.delete("/api/message/remove/" + id).then(res => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.loadMessage()
      })
    }
  }
}
</script>
