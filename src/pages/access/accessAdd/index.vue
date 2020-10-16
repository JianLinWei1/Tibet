<template>
  <a-spin :spinning="spinning" tip="正在搜索门禁控制器请稍后.....">
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-input-search style="padding:20px"
      placeholder="请输入门禁控制器服务地址ip"
      enter-button="搜索门禁控制器"
      v-model="searchIP"
      size="large"
      @search="onSearch"
    />
    <a-table bordered :data-source="dataSource" :columns="columns">
      
      <div slot="action" slot-scope="{record}">
          <a style="margin-right: 8px"  @click="editRecord(record)"> <a-icon type="edit"  />编辑 </a>
          <a @click="deleteRecord(record.id)">
            <a-icon type="delete" />删除
          </a>
        </div>
    </a-table>

  
     
   
  </a-card>
 </a-spin>
  
</template>

<script>

import Cookie from "js-cookie";
import { searchDevice } from "@/services/access.js";
export default {
  data() {
    return {
      form: {},
      visible: false,
      token: null,
      spinning:false,
      searchIP:"49.4.85.77",
      columns: [
        {
          title: '设备序列号',
          dataIndex: 'SN',
          width: '20%',
        },
        {
          title: 'IP地址',
          dataIndex: 'IP',
        },
        {
          title: '网关',
          dataIndex: 'GATEIPAddress',
        },
        {
          title: '子网掩码',
          dataIndex: 'NetMask',
        },
        {
          title: 'MAC地址',
          dataIndex: 'MAC',
        },
        {
          title: '设备类型',
          dataIndex: 'DeviceType',
        },
        
        
        {
          title: '版本',
          dataIndex: 'Ver',
        },
        {
          title: '操作',
         
          scopedSlots: { customRender: 'action' },
        },
      ],
      fileList: [],
    };
  },
  components: {
    
  },
  created() {
    this.token = Cookie.get("token");
  },
  computed: {},
  methods: {
    onSearch() {
      this.spinning = true;
      let params = {
        ip:this.searchIP
      }
      searchDevice(params).then(res =>{
        console.log(res)
        this.spinning = false
      }).catch(err =>{
        console.log(err)
        this.spinning =false
      })

    },
    handleChange(info) {
      const status = info.file.status;
      const res = info.file.response;
      this.fileList = [];

      this.fileList.push(info.fileList[info.fileList.length - 1]);
      if (status === "done") {
        if (res.code === 0) {
          this.$message.success(`${info.file.name} 上传成功`);
          this.form.photo = res.data;
        } else {
          this.$message.error(res.msg);
        }
      } else if (status === "error") {
        this.$message.error(`${info.file.name} 上传失败`);
      }
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // insertPerson(this.form).then((res) => {
          //   if (res.code === 0) {
          //     this.$message.success("添加成功");
          //   } else {
          //     this.$message.error(res.msg);
          //   }
          // });
        } else {
          this.$message.error("请按要求输入");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
