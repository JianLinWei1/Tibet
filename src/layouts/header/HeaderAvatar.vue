<template>
  <div>
    <a-dropdown>
      <div class="header-avatar"
           style="cursor: pointer">
        <a-avatar class="avatar"
                  size="small"
                  shape="circle"
                  src="https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png" />
        <span class="name">{{ user }}</span>
      </div>
      <a-menu :class="['avatar-menu']"
              slot="overlay">
        <a-menu-item @click="visible = true">
          <a-icon type="setting" />
          <span>修改密码</span>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item @click="logout">
          <a-icon style="margin-right: 8px"
                  type="poweroff" />
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-modal v-model="visible"
             title="修改密码"
             @ok="handleOk">
      <a-form-model :model="form">
        <a-form-model-item label="旧密码">
          <a-input type="password"
                   v-model="form.oldPw"
                   placeholder="请输入旧密码" />
        </a-form-model-item>
        <a-form-model-item label="新密码">
          <a-input type="password"
                   v-model="form.newPw"
                   placeholder="请输入新密码" />
        </a-form-model-item>
        <a-form-model-item label="确认新密码">
          <a-input type="password"
                   v-model="form.newPw2"
                   placeholder="确认新密码" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { logout, updatePw } from "@/services/user";

export default {
  name: "HeaderAvatar",
  data () {
    return {
      visible: false,
      form: {},
    };
  },
  computed: {
    ...mapGetters("account", ["user"]),
  },
  methods: {
    logout () {
      logout();
      this.$router.push("/login");
    },

    handleOk () {
      if (this.form.newPw !== this.form.newPw2) {
        this.$message.error("两次密码不一致")
        return
      }

      updatePw(this.form).then((res) => {
        if (res.code !== 0) this.$message.error(res.msg);
        else this.$message.success("修改成功");
      });
    },
  },
};
</script>

<style lang="less">
.header-avatar {
  //display: inline-flex;
  .avatar,
  .name {
    align-self: center;
  }
  .avatar {
    margin-right: 8px;
  }
  .name {
    font-weight: 500;
  }
}
.avatar-menu {
  width: 150px;
}
</style>
