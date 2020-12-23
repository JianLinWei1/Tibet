<template>
  <a-card ref="videoDom">
    <a-row :span="24" v-if="replay">
      <a-col :span="8">
        <a-date-picker style="width:90%" v-model="replayForm.start" format="yyyy-MM-DD HH:mm:ss" placeholder="请选择开始时间" showTime :showToday="false" />
      </a-col>
      <a-col :span="8">
        <a-date-picker style="width:90%" v-model="replayForm.end" format="yyyy-MM-DD HH:mm:ss" placeholder="请选择结束时间" showTime :showToday="false" />
      </a-col>
      <a-col :span="8">
        <a-button @click="replayClick" type="primary">
          播放
        </a-button>
      </a-col>
    </a-row>
    <a-row :span="24" style="margin-top:20px">
      <iframe v-if="ifa" width="100%" height="760px" :src="ifasrc"> </iframe>
    </a-row>

  </a-card>
</template>
<script>

import { loginV2 } from "@/services/camera"
export default {
  props: {
    cameraInfo: Object,
    replay: Boolean
  },
  data() {
    return {
      token: null,
      imosSdk: null,
      window: window,
      iframeObj: null,
      videoDom: null,
      ifa: false,
      ifasrc: null,
      replayForm: {}
    }
  },
  created() {
    this.imosSdk = window.imosSdk

  },
  mounted() {
    this.loginV2()

  },
  methods: {
    loginV2() {
      //console.log(imosSdk)
      //window.open("/imosSdk.html")
      loginV2(this.cameraInfo.cameraBind).then(res => {
        if (res.code === 0) {
          this.token = res.msg
          let the = this
          this.imosSdk.init(
            this.cameraInfo.cameraBind.serverIp,
            this.token,
            9,
            "/imosSdk.html"
          ).then(function (res) {
            console.log(res)
            the.$message.success("登录成功");
            if (!the.replay) {
              the.ifa = true
              the.ifasrc = "/demo.html?token=" + the.token + "&vmip=" + the.cameraInfo.cameraBind.serverIp + "&cameraCode=" + the.cameraInfo.cameraCode
              //the.iframeObj = the.imosSdk.createPanelWindow();

              /*  the.iframeObj.width = "100%"
               the.iframeObj.height = "724px" */
              //the.videoDom = the.iframeObj.outerHTML
              //the.playLive()
            }
          }).catch(function (err) {
            console.log(err);
            the.$message.error("调用失败" + err);
          });
          console.log(this.imosSdk)
        }

      });
    },
    playLive() {
      let cameraCode = this.cameraInfo.cameraCode
      let iframeId = this.iframeObj.id
      console.log(cameraCode, iframeId)
      console.log(this.imosSdk)
      this.imosSdk.playLive(
        iframeId,
        cameraCode,
        cameraCode,
        function (e) {
          console.log("播放", e);
        }, 1
      );
      cameraCode = null;
    },
    replayClick() {
      console.log(this.replayForm)
      this.ifa = false
      setTimeout(() => {
        this.ifasrc = "/demo.html?token=" + this.token + "&vmip=" +
          this.cameraInfo.cameraBind.serverIp + "&cameraCode=" + this.cameraInfo.cameraCode +
          "&start=" + this.replayForm.start + "&end=" + this.replayForm.end
        this.ifa = true
      }, 1000);

    }
  }
}
</script>