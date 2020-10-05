<template>
  <a-card class="user">
    <a-row>
      <a-col :xs="2"
             :sm="4"
             :md="6"
             :lg="8"
             :xl="10">
        <p>组织结构</p>
        <el-tree :data="data"
                 node-key="id"
                 default-expand-all
                 
                 :expand-on-click-node="false">
          <span class="custom-tree-node"
                slot-scope="{ node, data }">
            <svg-icon icon-class="user1" class-name="svgClass"></svg-icon>
            <span class-name="svgClass">{{ node.label }}</span>
            <span>
              <el-button type="text"
                         size="mini"
                         @click="() => addUserClick(data)">
                添加下级
              </el-button>
              <a-popconfirm title="确定删除该级和下级所有账号么？"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="() => delUser(data)">
                <el-button type="text"
                           size="mini">
                  删除
                </el-button>
              </a-popconfirm>
            </span>
          </span>
        </el-tree>
      </a-col>
      <!-- <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
        <p>账号列表</p>
        <a-table
          :columns="columns"
          :row-key="(record) => record.login.uuid"
          :data-source="datalsit"
          
          :loading="loading"
          @change="handleTableChange"
        >
          <template slot="name" slot-scope="name">
            {{ name.first }} {{ name.last }}
          </template>
        </a-table> 
      </a-col> -->
    </a-row>
    <!--添加下级的组件-->
    <a-modal title="添加下级"
             :visible="add_user_visible"
             :confirm-loading="confirmLoading"
             :footer="null"
             @cancel="add_user_visible = false">
      <addUser @frech="getAccountTreeFetch"
               @closed="add_user_visible = false"
               :parentId="parentId"
               :add_user_visible="add_user_visible"></addUser>
    </a-modal>
  </a-card>
</template>

<script>
import { getAccountTree, delUserByParentId } from "@/services/user";
import addUser from "./add";

export default {
  data () {
    return {
      data: null,
      add_user_visible: false,
      confirmLoading: false,
      parentId: null,
      datalsit: null,
      loading: false
    };
  },
  components: {
    addUser,
  },
  created () {
    this.getAccountTreeFetch();
  },
  watch: {
    checkedKeys (val) {
      console.log("onCheck", val);
    },
  },
  methods: {
    onExpand (expandedKeys) {
      console.log("onExpand", expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck (checkedKeys) {
      console.log("onCheck", checkedKeys);
      this.checkedKeys = checkedKeys;
    },
    onSelect (selectedKeys, info) {
      console.log("onSelect", info);
      this.selectedKeys = selectedKeys;
    },
    getAccountTreeFetch () {
      getAccountTree().then((res) => {
        if (res.code === 0) {
          this.data = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    addUserClick (data) {
      this.add_user_visible = true;
      this.parentId = data.id;
    },
    delUser (data) {
      let params = new URLSearchParams()
      params.append('parentId', data.id)
      delUserByParentId(params).then(res => {
        if (res.code === 0) {
          this.$message.success("删除成功")
          this.getAccountTreeFetch()
        } else {
          this.$message.error(res.msg)
        }
      });
    },
  },
};
</script>
<style scoped>
.svgClass{
  margin-right: 10px;
}
</style>