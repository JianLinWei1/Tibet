<template>
  <a-card>
    <a-form-model ref="ruleForm" :model="bindCamModalFrom" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
      <a-form-model-item ref="ip" label="用户名" prop="admin">
        <a-input v-model="bindCamModalFrom.admin" placeholder="请输入平台用户名" />
      </a-form-model-item>
      <a-form-model-item ref="ip" label="密码" prop="pw">
        <a-input v-model="bindCamModalFrom.pw" placeholder="请输入平台密码" />
      </a-form-model-item>

      <a-form-model-item ref="name" label="组织" prop="name">
        <a-tree-select style="width: 100%" v-model="treeSel" v-if="treeData.length >0" tree-node-filter-prop="value" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="treeData" placeholder="请选择" @change="selTreeChange" tree-default-expand-all>
        </a-tree-select>
      </a-form-model-item>
      <a-form-model-item style="margin-top: 24px" :wrapperCol="{ span: 10, offset: 7 }">
        <a-button type="primary" @click="bindCam" :loading="suLoad">提交</a-button>
        <a-button style="margin-left: 8px">重置</a-button>
      </a-form-model-item>

    </a-form-model>

    <a-table :columns="columns" :data-source="data"   :pagination="pagination">
       <div slot="action" slot-scope="record">
            <a @click="deleteRecord(record.userId)" >
              <a-icon type="delete" />删除
            </a>
          </div>
    </a-table>

  </a-card>
</template>
<script>
import { cameraBind  ,cameraBindList ,delBind} from "@/services/camera";
import { getAccountTree2 } from "@/services/user"

const columns = [
  {
    title: '绑定组织',
    dataIndex: 'name'
  },
  {
    title: '用户名',
    dataIndex: 'admin',
  },
  {
    title: '密码',
    dataIndex: 'pw',
  }
  ,
  {
    title: '操作',
    scopedSlots: { customRender: "action" },
  }
];

export default {
  data() {
    return {
      treeData: [],
      treeSel: null,
      bindCamModalFrom: {},
      suLoad: false,
      columns: columns,
      data:null,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
        showTotal: (total) => `共 ${total} 条`,
        showSizeChange: (current, pageSize) => (this.pageSize = pageSize),
      },
    }
  },
  created() {
      this.cameraBindList()
    getAccountTree2().then(res => {
      if (res.code === 0) {
        this.treeSel = this.user
        this.treeData = res.data
      }
    })
  },
  methods: {
    bindCam() {
      this.suLoad = true
      cameraBind(this.bindCamModalFrom).then(res => {
        if (res.code === 0) {
          this.$message.success("成功")
          this.pagination.current = 1
          this.cameraBindList()
          
        } else {
          this.$message.error(res.msg)
        }
        this.suLoad = false
      })
    },
    cameraBindList(){
        this.bindCamModalFrom.page = this.pagination.current
        this.bindCamModalFrom.limit = this.pagination.pageSize
           cameraBindList(this.bindCamModalFrom).then(res =>{
               if(res.code === 0){
                   this.pagination.total = res.count
                   this.data = res.data
               }
           })
    },
    selTreeChange(value, label, ex) {
      if (ex.triggerNode !== undefined) {
        this.bindCamModalFrom.userId = ex.triggerNode.eventKey
      }

    },
    deleteRecord(userId){
        
      delBind({id:userId}).then(res =>{
        if(res.code === 0){
            this.$message.success("删除成功")
            this.cameraBindList()
        }
      })
    }
  }

}
</script>