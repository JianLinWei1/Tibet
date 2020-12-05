<template>
  <div>
    <a-spin :spinning="spinning" tip="正在下发中.....">
      <a-form-model ref="issueFrom" :model="issueFrom" :rules="rules" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
        <a-form-model-item ref="ip" label="IP" prop="ip">
          <a-input disabled v-model="issueFrom.ip" placeholder="ip" />
        </a-form-model-item>
        <!-- <a-form-model-item label="设备名称" prop="name">
        <a-input disabled v-model="issueFrom.name" placeholder="设备名称" />
      </a-form-model-item> -->
        <a-form-model-item label="下发人员" prop="pids">
          <a-select mode="multiple" v-model="issueFrom.pids" placeholder="根据姓名搜索人员" style="width: 100%" :filter-option="false" :not-found-content="fetching ? undefined : null" @search="fetchUser">
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in data" :key="d.id" :value="d.id">
              {{ d.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- <a-form-model-item label="门禁卡号" prop="accessId">
        <a-input v-model="issueFrom.accessId" placeholder="门禁卡号" />
      </a-form-model-item>
      <a-form-model-item label="开门密码" prop="passwd">
        <a-input v-model="issueFrom.passwd" placeholder="开门密码" />
      </a-form-model-item> -->
        <a-form-model-item label="门号" prop="passwd">
          <a-select v-model="doorsNum" mode="tags" style="width: 100%" placeholder="选择门">
            <a-select-option v-for="(d ,index) in issueFrom.doors" :value="d |object2String" :key="index"> {{d.name}} </a-select-option>
            <!--  <a-select-option value="1"> 1号门 </a-select-option>
          <a-select-option value="2"> 2号门 </a-select-option>
          <a-select-option value="3"> 3号门 </a-select-option>
          <a-select-option value="4"> 4号门 </a-select-option> -->
          </a-select>
        </a-form-model-item>

        <a-form-model-item style="margin-top: 24px" :wrapperCol="{ span: 10, offset: 7 }">
          <a-button type="primary" @click="submit">提交</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </div>
</template>
<script>
import { queryPersonsList, issuedPerson } from "@/services/access.js";


export default {
  props: {
    issueFrom: Object,
  },
  data() {
    return {
      form: {},
      visible: false,
      token: null,
      data: [],
      value: ['1'],
      fetching: false,
      spinning: false,
      rules: {
        pids: [{ required: true, message: "必填！", trigger: "blur" }],
        role: [{ required: true, message: "必填！", trigger: "blur" }],
      },
      fileList: [],
      doorsNum: []
    };
  },
  methods: {
    submit() {
      this.$refs.issueFrom.validate((valid) => {
        if (valid) {
          console.log(this.issueFrom)
          this.issueFrom.advId = this.issueFrom.id
          this.issueFrom.advName = this.issueFrom.name
          this.issueFrom.doorsNum = []
          for (var d in this.doorsNum) {
            this.issueFrom.doorsNum.push(JSON.parse(this.doorsNum[d]))
          }
          this.spinning = true
          issuedPerson(this.issueFrom).then(res => {
            this.spinning = false
            if (res.code == 0) {
              this.$message.success("下发成功")
              this.$emit("closed")
            } else {
              this.$message.error(JSON.stringify(res.data)+res.msg)
            }
          }).catch(err => {
            console.log(err)
            this.spinning = false
          })
        }
      })


    },
    fetchUser(value) {


      this.data = [];
      this.fetching = true;

      queryPersonsList({ name: value }).then((res) => {
        if (res.code === 0) {
          this.data = res.data
          console.log("fetching user", res.data);
        }
        this.fetching = false
      });
    },
    handleChange(value) {

      Object.assign(this, {
        value,
        data: [],
        fetching: false,
      });
    },
  },
  filters: {
    object2String: function (obj) {
      return JSON.stringify(obj)
    }
  }
};
</script>