<template>
  <a-card>

    <a-row>
      <a-col :md="8" :sm="24" style="height: 246px;overflow: auto;">
        <a-divider>人员选择</a-divider>
        <a-tree v-model="checkedPersons" checkable :auto-expand-parent="autoExpandParent" :tree-data="treeDataPerson" />
      </a-col>
      <a-col :md="8" :sm="24">
        <a-divider>设备选择</a-divider>
        <a-tree v-model="checkedDevice" checkable :auto-expand-parent="autoExpandParent" :tree-data="treeDataDevice" />
      </a-col>

    </a-row>

    <a-row>
      <a-button type="primary">
        开始下发
      </a-button>
    </a-row>

    <a-table :columns="columns" :data-source="data">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="customTitle">
        <a-icon type="smile-o" /> Name
      </span>
      <span slot="tags" slot-scope="tags">
        <a-tag v-for="tag in tags" :key="tag" :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
          {{ tag.toUpperCase() }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a>Invite 一 {{ record.name }}</a>
        <a-divider type="vertical" />
        <a>Delete</a>
        <a-divider type="vertical" />
        <a class="ant-dropdown-link"> More actions
          <a-icon type="down" />
        </a>
      </span>
    </a-table>

  </a-card>
</template>
<script>
import { getPersonTree } from "@/services/batch"

const columns = [

  {
    title: '人员编号',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '姓名',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '门禁设备IP',
    key: 'tags',
    dataIndex: 'tags',
    scopedSlots: { customRender: 'tags' },
  },
  {
    title: '门禁设备名称',
    key: 'dvname',
   
  },
  {
    title: '下发状态',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
export default {
  data() {
    return {
      mockData: [],
      targetKeys: [],
      data: [],
      columns,
      autoExpandParent: true,
      treeDataPerson:[],
      checkedPersons:[],
      treeDataDevice:[],
      checkedDevice:[]
    }
  }, 
  created(){
  this.getPersonTree(null)
  },
  methods: {
      getPersonTree(id){
          getPersonTree({pid:id}).then(res =>{
              console.log(res)
              if(res.code ===0){
                 this.treeDataPerson = res.data
              }else{
                  this.$message.error(res.msg)
              }
          })
      }

  }
}
</script>
<style scoped>
.tree-transfer .ant-transfer-list:first-child {
  width: 50%;
  flex: none;
}
</style>