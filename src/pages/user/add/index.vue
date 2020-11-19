<template>
  <div>
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="userName" label="账号" prop="userName">
        <a-input v-model="form.userName" />
      </a-form-model-item>
      <a-form-model-item ref="passwd" label="密码" prop="passwd">
        <a-input type="password" v-model="form.passwd" />
      </a-form-model-item>
      <a-form-model-item
        ref="nickName"
        label="昵称(用于显示级联结构)"
        prop="nickName"
      >
        <a-input v-model="form.nickName" />
      </a-form-model-item>
      <a-form-model-item ref="permission" label="菜单权限" prop="permission">
        <!-- <a-tree-select 
                       style="width: 100%"
                       :tree-data="treeData"
                       tree-checkable
                      
                       show-checked-strategy="SHOW_ALL"
                       search-placeholder="请选择" @select="change" /> -->
        <a-tree
          checkable
          v-model="form.routerIds"
          :auto-expand-parent="autoExpandParent"
          :tree-data="treeData"
          @check="change"
        />
      </a-form-model-item>

      <a-form-model-item ref="description" label="描述" prop="description">
        <a-input v-model="form.description" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 14 }">
        <a-button @click="resetForm"> 重置 </a-button>
        <a-button type="primary" style="margin-left: 10px" @click="onSubmit">
          提交
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import { addUser, getAddUserTree, updateUser } from "@/services/user";
import { TreeSelect } from "ant-design-vue";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
export default {
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },

      treeData: [],
      SHOW_PARENT,
      autoExpandParent: true,
      rules: {
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        passwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 36, message: "最小长度3", trigger: "blur" },
        ],
        nickName: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 1, max: 8, message: "最小长度1，最大长度4", trigger: "blur" },
        ],
      },
    };
  },
  props: { parentId: String, form: Object, checkedKeys: Array, action: Number },
  created() {
    console.log(this.form);
    this.getAddUserTree();
  },
  methods: {
    onSubmit() {
      // console.log(JSON.stringify(this.form));
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
        

          if (this.action == 2) {
            updateUser(this.form).then((res) => {
              if (res.code === 0) {
                this.$message.success("编辑成功");
                setTimeout(() => {
                  this.$emit("frech");
                  this.$emit("closed");
                }, 500);
               
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
              this.form.parentId = this.parentId;
            addUser(this.form).then((res) => {
              if (res.code === 0) {
                this.$message.success("添加成功");
                setTimeout(() => {
                  this.$emit("frech");
                  this.$emit("closed");
                 
                }, 500);
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        } else {
          this.$message.error("请按要求输入");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },

    getAddUserTree() {
      getAddUserTree().then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.treeData = res.data;
        }
      });
    },

    change(value, label) {
      this.form.routerIds = null;
      let checkedKeysResult = [...value, ...label.halfCheckedKeys];
      this.form.routerIds = checkedKeysResult;
    },
  },
};
</script>