<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :labelCol="{ span: 7 }"
      :wrapperCol="{ span: 10 }"
    >
      <a-form-model-item
        ref="accessServer"
        label="门禁服务IP端口"
        prop="accessServer"
      >
        <a-input v-model="form.accessServer" placeholder="门禁服务IP端口" />
      </a-form-model-item>
      <a-form-model-item ref="uniServer" label="相机平台IP" prop="name">
        <a-input v-model="form.uniServer" placeholder="相机平台IP" />
      </a-form-model-item>
       <a-form-model-item ref="uniPort" label="相机平台端口" prop="name">
        <a-input v-model="form.uniPort" placeholder="相机平台端口" />
      </a-form-model-item>
      <a-form-model-item ref="admin" label="相机平台登录账号" prop="name">
        <a-input v-model="form.admin" placeholder="相机平台登录账号" />
      </a-form-model-item>

        <a-form-model-item ref="pw" label="相机平台登录密码" prop="name">
        <a-input type="password" v-model="form.pw" placeholder="相机平台登录密码" />
      </a-form-model-item>


      <a-form-model-item
        style="margin-top: 24px"
        :wrapperCol="{ span: 10, offset: 7 }"
      >
        <a-button type="primary"  @click="submit">提交</a-button>
        <a-button style="margin-left: 8px">重置</a-button>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script>

import { getSysConfig ,addSysConfig} from "@/services/system";
export default {
  data() {
    return {
      form: {},
      visible: false,
      token: null,
      rules: {},
      fileList: [],
    };
  },
  components: {},
  created() {
    this.getSysConfig()
  },

  computed: {},
  methods: {
    getSysConfig() {
      getSysConfig().then((res) => {
          if(res.code === 0){
              this.form = res.data
          }else{
              this.$message.error(res.msg)
          }
      });
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          addSysConfig(this.form).then((res) => {
            if (res.code === 0) {
              this.$message.success("添加成功");
              this.getSysConfig()
            } else {
              this.$message.error(res.msg);
            }
          });
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
.svgClass {
  width: 4em;
  height: 4em;
}
</style>
