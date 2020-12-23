<template>
  <a-card ref="videoDom" v-html="videoDom">
     <a-button @click="playLive">Bo播</a-button>
  </a-card>
</template>
<script>

import { loginV2 } from "@/services/camera"
export default {
  props: {
    cameraInfo: Object,
  },
  data() {
    return {
      token: null,
      imosSdk: null,
      window: window,
      iframeObj: null,
      videoDom: null
    }
  },
  created() {
    this.imosSdk = window.imosSdk
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

            the.iframeObj = the.imosSdk.createPanelWindow();

            /*  the.iframeObj.width = "100%"
             the.iframeObj.height = "720px" */
            the.videoDom = the.nodeToString(the.iframeObj)

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
    nodeToString(node) {
      //createElement()返回一个Element对象
      var tmpNode = document.createElement("div");
      //appendChild()  参数Node对象   返回Node对象  Element方法
      //cloneNode()  参数布尔类型  返回Node对象   Element方法
      tmpNode.appendChild(node.cloneNode(true));
      var str = tmpNode.innerHTML;
      tmpNode = node = null; // prevent memory leaks in IE  
      return str;
    }
  }
}
</script>