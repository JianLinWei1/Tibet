<template>
  <common-layout>
    <div class="logincontent">
      <div class="top">
        <div class="header">
          <img alt="logo"
               class="logo"
               src="@/assets/img/logo.png" />
          <span class="title">{{ systemName }}</span>
        </div>
      </div>
      <div class="login">
        <a-form @submit="onSubmit"
                :form="form">
          <a-tabs size="large"
                  :tabBarStyle="{ textAlign: 'center' }"
                  style="padding: 0 2px">
            <a-tab-pane tab="账户密码登录"
                        key="1">
              <a-alert type="error"
                       :closable="false"
                       v-show="error"
                       :message="error"
                       showIcon
                       style="margin-bottom: 24px" />
              <a-form-item>
                <a-input autocomplete="autocomplete"
                         size="large"
                         placeholder="admin"
                         v-decorator="[
                    'name',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入账户名',
                          whitespace: true,
                        },
                      ],
                    },
                  ]">
                  <a-icon slot="prefix"
                          type="user" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input size="large"
                         placeholder="admin"
                         autocomplete="autocomplete"
                         type="password"
                         v-decorator="[
                    'password',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入密码',
                          whitespace: true,
                        },
                      ],
                    },
                  ]">
                  <a-icon slot="prefix"
                          type="lock" />
                </a-input>
              </a-form-item>
            </a-tab-pane>
          </a-tabs>
          <!-- <div>
          <a-checkbox :checked="true">自动登录</a-checkbox>
          <a style="float: right">忘记密码</a>
        </div> -->
          <a-form-item>
            <a-button :loading="logging"
                      style="width: 100%; margin-top: 24px"
                      size="large"
                      htmlType="submit"
                      type="primary">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { login, getRoutesConfig, getUserPermission } from "@/services/user";
import { setAuthorization } from "@/utils/request";
import { loadRoutes } from "@/utils/routerUtil";
import { mapMutations } from "vuex";

export default {
  name: "Login",
  components: { CommonLayout },
  data () {
    return {
      logging: false,
      error: "",
      form: this.$form.createForm(this),
    };
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName;
    },
  },
  methods: {
    //, 'setPermissions', 'setRoles'
    ...mapMutations("account", ["setUser", "setPermissions"]),
    onSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const name = this.form.getFieldValue("name");
          const password = this.form.getFieldValue("password");
          login(name, password).then(this.afterLogin);
        }
      });
    },
    afterLogin (res) {
      this.logging = false;
      const loginRes = res;

      if (loginRes.code >= 0) {
        //const { user, permissions, roles } = loginRes.data
        const user = this.form.getFieldValue("name");

        this.setUser(user);
        setAuthorization({ token: loginRes.data.token });
        this.$message.info("正在获取权限");
        getUserPermission().then((res) => {
          if (res.code === 0) {
            this.setPermissions(res.data);
            // this.setRoles(roles)

            // 获取路由配置
            getRoutesConfig().then((result) => {
              console.log(result);
              const routesConfig = result.data;
              loadRoutes(
                { router: this.$router, store: this.$store, i18n: this.$i18n },
                routesConfig
              );
              this.$router.push("/index");
              this.$message.success(loginRes.msg, 3);
            });
          } else {
            this.$message.error("权限获取失败" + res.msg);
          }
        });
      } else {
        this.error = loginRes.msg;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
      a {
        text-decoration: none;
      }
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 33px;
        color: @title-color;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
  .logincontent {
    background-color: #fff;
    // width: 22%;
    padding: 24px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: #75b4fd 4px 4px 10px;
    border-radius: 10px;
  }
}
</style>
