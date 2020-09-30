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
            <span>{{ node.label }}</span>
            <span>
              <el-button type="text"
                         size="mini"
                         @click="() => append(data)">
                添加下级
              </el-button>
              <el-button type="text"
                         size="mini"
                         @click="() => append(data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </a-col>
      <a-col :xs="2"
             :sm="4"
             :md="6"
             :lg="8"
             :xl="10">
        <p>账号列表</p>
        <!-- <a-table
          :columns="columns"
          :row-key="(record) => record.login.uuid"
          :data-source="datalsit"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <template slot="name" slot-scope="name">
            {{ name.first }} {{ name.last }}
          </template>
        </a-table>  -->
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { getAccountTree } from "@/services/user"


export default {
  data () {

    return {
      data: null,
    };
  },
  created () {
    this.getAccountTreeFetch()
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
      getAccountTree().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.data = res.data
        } else {
          this.$message.error(res.msg);
        }
      })
    }
  },
};
</script>