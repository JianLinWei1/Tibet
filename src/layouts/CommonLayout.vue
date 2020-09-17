<template>
  <div class="common-layout">
    <div class="content"><slot></slot></div>
    <page-footer :link-list="footerLinks" :copyright="copyright"></page-footer>
  </div>
</template>

<script>
import PageFooter from '@/layouts/footer/PageFooter'
import {mapState} from 'vuex'

export default {
  name: 'CommonLayout',
  components: {PageFooter},
  computed: {
    ...mapState('setting', ['footerLinks', 'copyright'])
  }
}
</script>

<style scoped lang="less">
.common-layout{
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  //background-color: @layout-body-background;
  background-color: #d9e4ff;;
  background-image: url('https://jian-images.oss-cn-beijing.aliyuncs.com/tibet_back.png');
  background-repeat: no-repeat;
  // background-position-x: center;
   background-position-y: 110px;
  background-size: 36%;
  .content{
    padding: 32px 0;
     flex: 1;
    @media (min-width: 768px){

      padding: 112px 0 24px;
    }
  }
}
</style>
