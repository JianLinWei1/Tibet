<template>
  <a-card :body-style="{ padding: '24px 32px' }"
          :bordered="false">
    <a-row>
      <a-col :span="12">
        <a-tree checkable
                v-model="form.sns"
                v-if="treeData.length>0"
                :auto-expand-parent="expand"
                defaultExpandAll
                :tree-data="treeData" />
      </a-col>
      <a-col :span="12">
        <a-form-model ref="ruleForm"
                      :model="form"
                      :labelCol="{ span: 7 }"
                      :wrapperCol="{ span: 10 }">
          <a-form-model-item ref="accessServer"
                             label="上午上班时间"
                             prop="accessServer">
            <a-time-picker v-model="form.amClockIn"
                           value-format="HH:mm:ss"
                           :default-open-value="moment('00:00:00', 'HH:mm:ss')" />

          </a-form-model-item>
          <a-form-model-item ref="accessServer"
                             label="上午下班时间"
                             prop="accessServer">
            <a-time-picker v-model="form.amClockOut"
                           value-format="HH:mm:ss"
                           :default-open-value="moment('00:00:00', 'HH:mm:ss')" />

          </a-form-model-item>
          <a-form-model-item ref="accessServer"
                             label="下午上班时间"
                             prop="accessServer">
            <a-time-picker v-model="form.pmClockIn"
                           value-format="HH:mm:ss"
                           :default-open-value="moment('00:00:00', 'HH:mm:ss')" />
          </a-form-model-item>
          <a-form-model-item ref="accessServer"
                             label="下午下班时间"
                             prop="accessServer">
            <a-time-picker v-model="form.pmClockOut"
                           value-format="HH:mm:ss"
                           :default-open-value="moment('00:00:00', 'HH:mm:ss')" />

          </a-form-model-item>

        </a-form-model>

      </a-col>

    </a-row>
    <a-row style=" text-align: center;">
      <a-button style="width:200px"
                type="primary"
                @click="submit">
        提交
      </a-button>
    </a-row>
  </a-card>
</template>

<script>

import { getDeviceTree, addConfig, getConfig } from "@/services/attence";
import moment from 'moment';
export default {
  data () {
    return {
      treeData: [],
      form: {},
      expand: true,
      checkedKeys: []
    };
  },
  components: {},
  created () {

    getConfig().then(res => {
      if (res.code === 0)
        this.form = res.data
    })

  },

  computed: {},
  mounted () {
    this.getDeviceTree()
  },
  methods: {
    moment,
    getDeviceTree () {
      getDeviceTree().then((res) => {
        console.log(res)
        if (res.code === 0) {
          this.treeData = res.data
        } else {
          this.$message.error(res.msg)
        }
      });
    },
    submit () {
      console.log(this.form.sns)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          addConfig(this.form).then((res) => {
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
    onSelect (selectedKeys, info) {
      console.log('onSelect', info);
      this.selectedKeys = selectedKeys;
    },
  },
  watch: {
    checkedKeys (info) {
      console.log('onCheck', info);
      this.form.sns = info
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
