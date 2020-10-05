<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form-model
      :model="form"
      :rules="rules"
      :labelCol="{ span: 7 }"
      :wrapperCol="{ span: 10 }"
    >
      <a-form-model-item label="姓名" prop="required">
        <a-input v-model="form.name" placeholder="请输入姓名" />
      </a-form-model-item>
      <a-form-model-item label="身份证" prop="required">
        <a-input v-model="form.name" placeholder="身份证" />
      </a-form-model-item>
      <a-form-model-item label="门禁卡号" prop="required">
        <a-input v-model="form.name" placeholder="门禁卡号" />
      </a-form-model-item>
      <a-form-model-item label="车牌号" prop="required">
        <a-input v-model="form.name" placeholder="车牌号" />
      </a-form-model-item>
      <a-form-model-item label="电话号" prop="required">
        <a-input v-model="form.name" placeholder="电话号" />
      </a-form-model-item>
      <a-form-model-item label="人脸照片" prop="required">
        <a-upload-dragger
          name="file"
          :multiple="true"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          @change="handleChange"
        >
          <p class="ant-upload-drag-icon">
            <svg-icon icon-class="face" class-name="svgClass"></svg-icon>
          </p>
          <p class="ant-upload-text">点击或者拖拽上传</p>
        </a-upload-dragger>
      </a-form-model-item>
      <a-form-model-item label="角色" prop="required">
        <a-radio-group name="radioGroup" :default-value="1">
          <a-radio :value="1"> 普通人员 </a-radio>
          <a-radio :value="2"> 白名单人员 </a-radio>
          <a-radio :value="3"> 黑名单人员 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="生效日期">
        <a-date-picker show-time placeholder="选择生效日期" />
      </a-form-model-item>
      <a-form-model-item label="失效日期">
        <a-date-picker show-time placeholder="选择失效日期" />
      </a-form-model-item>
      <a-form-model-item label="备注">
       <a-input v-model="form.name" placeholder="备注" />
      </a-form-model-item>
      <a-form-model-item
        style="margin-top: 24px"
        :wrapperCol="{ span: 10, offset: 7 }"
      >
        <a-button type="primary">提交</a-button>
        <a-button style="margin-left: 8px">重置</a-button>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script>
export default {
  data() {
    return {
      form: {},

      rules: {
        required: [{ required: true, message: "必填！", trigger: "blur" }],
      },
    };
  },
  computed: {},
};
</script>

<style scoped>
.svgClass {
  width: 4em;
  height: 4em;
}
</style>
