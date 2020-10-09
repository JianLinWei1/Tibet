<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :labelCol="{ span: 7 }"
      :wrapperCol="{ span: 10 }"
    >
      <a-form-model-item ref="name" label="姓名" prop="name">
        <a-input v-model="form.name" placeholder="请输入姓名" />
      </a-form-model-item>
      <a-form-model-item label="身份证" prop="idCard">
        <a-input v-model="form.idCard" placeholder="身份证" />
      </a-form-model-item>
      <a-form-model-item label="门禁卡号" prop="accessId">
        <a-input v-model="form.accessId" placeholder="门禁卡号" />
      </a-form-model-item>
      <a-form-model-item label="车牌号" prop="carId">
        <a-input v-model="form.carId" placeholder="车牌号" />
      </a-form-model-item>
      <a-form-model-item label="电话号" prop="phone">
        <a-input v-model="form.phone" placeholder="电话号" />
      </a-form-model-item>
      <a-form-model-item label="人脸照片" prop="photo">
        <a-upload-dragger
          name="file"
          accept=".jpg,.png"
          action="/api/api-auth/upload"
          :file-list="fileList"
          @change="handleChange"
          :headers="{ token: token }"
        >
          <p class="ant-upload-drag-icon">
            <svg-icon icon-class="face" class-name="svgClass"></svg-icon>
          </p>
          <p class="ant-upload-text">点击或者拖拽上传</p>
        </a-upload-dragger>
        
      </a-form-model-item>
      <a-form-model-item label="角色" prop="role">
        <a-radio-group v-model="form.role">
          <a-radio value="1"> 普通人员 </a-radio>
          <a-radio value="2"> 白名单人员 </a-radio>
          <a-radio value="3"> 黑名单人员 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="生效日期">
        <a-date-picker
          v-model="form.starTime"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          show-time
          placeholder="选择生效日期"
        />
      </a-form-model-item>
      <a-form-model-item label="失效日期">
        <a-date-picker
          v-model="form.invalidTime"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          show-time
          placeholder="选择失效日期"
        />
      </a-form-model-item>
      <a-form-model-item label="备注">
        <a-input v-model="form.content" placeholder="备注" />
      </a-form-model-item>
      <a-form-model-item
        style="margin-top: 24px"
        :wrapperCol="{ span: 10, offset: 7 }"
      >
        <a-button type="primary" @click="submit">提交</a-button>
        <a-button style="margin-left: 8px">重置</a-button>
      </a-form-model-item>
    </a-form-model>
    <!---->
    
  </a-card>
</template>

<script>

import Cookie from "js-cookie";
import { insertPerson } from "@/services/person.js";
export default {
  data() {
    return {
      form: {},
      visible: false,
      token: null,
      rules: {
        name: [{ required: true, message: "必填！", trigger: "blur" }],
        idCard: [{ required: true, message: "必填！", trigger: "blur" },
              { pattern: new RegExp( /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/),
               message: '请输入正确身份证号码', trigger: 'blur' }],
        accessId: [{ required: true, message: "必填！", trigger: "blur" }],
        carId: [{ required: true, message: "必填！", trigger: "blur" }],
        phone: [{ required: true, message: "必填！", trigger: "blur" },
              { pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/),
               message: '请输入正确手机号', trigger: 'blur' }],
        photo: [{ required: true, message: "必填！", trigger: "blur" }],
        role: [{ required: true, message: "必填！", trigger: "blur" }],
      },
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
    takePhoto() {
      this.visible = true;
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
          insertPerson(this.form).then((res) => {
            if (res.code === 0) {
              this.$message.success("添加成功");
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
