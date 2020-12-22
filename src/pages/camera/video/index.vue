<template>
  <a-card>

  </a-card>
</template>
<script>
import axios from 'axios'
export default {
  props: {
    cameraInfo: Object,
  },
  data() {
    return {

    }
  },
  created() {
     this.loginV2()
  },
  methods: {
    loginV2() {
      var password = this.cameraInfo.cameraBind.admin
      var username = this.cameraInfo.cameraBind.pw
      axios({
        method: "POST",
        url: "http://" + this.cameraInfo.cameraBind.serverIp + ":7010/VIID/login/v2",
        headers: {
          "Content-Type": "application/json; charset=utf8"
        },
        responseType: "json"
      }).then(function (res) {
        var accessCode = res.data.AccessCode;
        var md1 = this.forge.md.md5.create(); //md5
        var md2 = this.forge.md.md5.create(); //md5
        md1.update(password); //md5
        var passwordMd5 = md1.digest().toHex(); //md5
        var base64Username = window.btoa(username);
        var loginSignatureTemp =
          base64Username + accessCode + passwordMd5;
        md2.update(loginSignatureTemp); //md5
        var loginSignature = md2.digest().toHex(); //md5
        var data = {
          UserName: username,
          AccessCode: accessCode,
          LoginSignature: loginSignature
        };
        axios({
          method: "POST",
          url: "http://" + this.cameraInfo.cameraBind.serverIp + ":7010/VIID/login/v2",
          headers: {
            "Content-Type": "application/json; charset=utf8"
          },
          responseType: "json",
          data: data
        }).then(function (r) {
          this.loginResult = r.data.ErrCode;
          switch (
          this.loginResult //判断返回值：12351是‘用户不存在’；50004是‘密码错误，登录失败’
          ) {
            case 50004:
              this.$message.error("密码错误");
              break;
            case 12351:
              this.$message.error("用户不存在");
              break;
            case undefined:
              window.token = r.data.AccessToken;
              var vmip = this.cameraInfo.serverIp
              this.imosSdk.init(
                vmip,
                window.token,
                9,
                "imosSdk.html"
              ).then(function (res) {
                  console.log(res)
                this.$message.success("登录成功");
              }).catch(function (err) {
                console.log(err);
                this.$message.success("调用失败" + err);
              });
              break;
          }
        })
          .catch(function (e) {
            this.$message.error("服务器连接异常");
            console.log(e);
          });
      })
        .catch(function (error) {
          this.$message.error("服务器连接异常");
          console.log(error);
        });

    }
  }
}
</script>