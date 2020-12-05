<template>
   <div style="overflow: hidden;">

     <a-row type="flex" :gutter="10" justify="center" v-show="!fullscreen">
      <a-col :span="4"> </a-col>
      <a-col :span="16"><div class="grid-content bg-purple"> 
        <a-button-group>
        <a-button :type="classtype1"  @click="saecttype('classtype1',1,24)">单屏</a-button>
        <a-button :type="classtype2"  @click="saecttype('classtype2',4,12)">四分屏</a-button>
        
        <a-button > 
           <div class="btn-fullscreen" @click="handleFullScreen">
                    <a-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="a-icon-rank"></i>
                    </a-tooltip>
          </div>
        </a-button>
        </a-button-group>
        </div>
      </a-col>
      <a-col :span="4"> </a-col>
    </a-row>
       

         <a-container class="center">
      <a-main>
      <a-row  :gutter="10" >
          <a-col  v-for="(n,index) in fornum" :xs="24" :sm="24" :md="clonum" :lg="clonum" :xl="clonum"  :class="videoclass" :key="index" >
            <div  class="player-wrapper" aement-loading-text="加载中..." aement-loading-background="#000">
              <div class="video-wrapper" :style="videoclass" :id="`videoid${n}`">
                <div class="video-inner live hide-waiting" style="position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;">
                  <div class="alt table-c">
                    <div class="talbetop">
                      <table>
                        <tr>
                          <td>无信号</td>
                        </tr>
                      </table>
                      <div v-show="true" class="saectchanna"  @click="dialogFormVisible=true"> 选择通道</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-col>
      </a-row>
      </a-main>
  </a-container>  

  <a-dialog title="收货地址" :visible.sync="dialogFormVisible">
       
  <div slot="footer" class="dialog-footer">
    <a-button @click="dialogFormVisible = false">取 消</a-button>
    <a-button type="primary" @click="dialogFormVisible = false">确 定</a-button>
  </div>
</a-dialog> 
   </div>
</template>

<script>

export default {
  data () {
    return {
       fullscreen: false,
       fornum:4,
       clonum:12,
       dialogFormVisible:false,
       videoclass:"padding-bottom: 40.25%; position: raative; margin: 0px auto; overflow: hidden;",
        classtype1:'',
        classtype2:'primary',
        classtype3:'',
        classtype4:'',
        items:[false,false,false,false]
       
    }
  },
  created(){
            let that = this
            window.onresize = function(){
                if(!that.checkFull()){
         //  alert(that.videoclass)
                    // 退出全屏后要执行的动作
                    console.log("退出全屏")
          that.fullscreen = false;
           //alert(that.fornum)
           for(let n=1;n<=that.fornum;n++){
             //alert('videoid'+n)
            // alert(document.getaementById('videoid'+n))
              document.getaementById('videoid'+n).style = "padding-bottom: 40.25%; position: raative; margin: 0px auto; overflow: hidden;";
           }
         // that.videoclass="padding-bottom: 43.25%; position: raative; margin: 0px auto; overflow: hidden;",
           //document.getaementById('videoid1').style = "padding-bottom: 42.25%; position: raative; margin: 0px auto; overflow: hidden;";
          // document.getaementById('videoid2').style = "padding-bottom: 42.25%; position: raative; margin: 0px auto; overflow: hidden;";
          // document.getaementById('videoid3').style = "padding-bottom: 42.25%; position: raative; margin: 0px auto; overflow: hidden;";
           //document.getaementById('videoid4').style = "padding-bottom: 42.25%; position: raative; margin: 0px auto; overflow: hidden;";
         // that.tableclass="table-c"
        }
        else{
          for(let n=1;n<=that.fornum;n++){
            // alert('videoid'+n)
            // alert(document.getaementById('videoid'+n))
              document.getaementById('videoid'+n).style = "padding-bottom: 52.25%; position: raative; margin: 0px auto; overflow: hidden;";
           }
          //document.getaementById('videoid1').style='padding-bottom: 54.25%; position: raative; margin: 0px auto; overflow: hidden;';
          //document.getaementById('videoid2').style='padding-bottom: 54.25%; position: raative; margin: 0px auto; overflow: hidden;';
          //document.getaementById('videoid3').style='padding-bottom: 54.25%; position: raative; margin: 0px auto; overflow: hidden;';
          //document.getaementById('videoid4').style='padding-bottom: 54.25%; position: raative; margin: 0px auto; overflow: hidden;';
       }
      }
    },
  methods:{
     showsaect(item1){
      this.items=[];
     // alert(this.items.length)
      for(let i=0;i<this.fornum;i++){
        if(item1==i){
         // alert(item1)
          this.items[i] = true;
        }else{
          this.items[i]=false;
        }
       }
    },
     saecttype(item,fnum,clo) {
     //  alert( this.items[0])
       this.items=[];
      for(let i=0;i<fnum;i++){
        this.items[i]=false;
      }
      this.fornum = fnum;
      this.clonum = clo;

      if(item==='classtype1'){
        this.classtype1='primary'
        this.classtype2=''
        this.classtype3=''
        this.classtype4=''
      }
      else if(item==='classtype2'){
        this.classtype1=''
        this.classtype2='primary'
        this.classtype3=''
        this.classtype4=''
      }
        else if(item==='classtype3'){
        this.classtype1=''
        this.classtype2=''
        this.classtype3='primary'
        this.classtype4=''
      }
      else if(item==='classtype4'){
        this.classtype1=''
        this.classtype2=''
        this.classtype3=''
        this.classtype4='primary'
      }
    },
      checkFull(){
      //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
      //火狐浏览器
      var isFull = document.mozFullScreen||
      document.fullScreen ||
      //谷歌浏览器及Webkit内核浏览器
      document.webkitIsFullScreen ||
      document.webkitRequestFullScreen ||
      document.mozRequestFullScreen ||
      document.msFullscreenEnabled
      if(isFull === undefined) {
          isFull = false
          }
          return isFull;
    },

// 全屏事件
    handleFullScreen(){
        let aement = document.documentaement;
       // let that=this;
       // alert(this.fullscreen)
        if (this.fullscreen) {
         
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitCancaFullScreen) {
                document.webkitCancaFullScreen();
            } else if (document.mozCancaFullScreen) {
                document.mozCancaFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            // alert("ddd")
            //that.videoclass='padding-bottom: 42.25%; position: raative; margin: 0px auto; overflow: hidden;';
        } else {
            if (aement.requestFullscreen) {
                aement.requestFullscreen();
            } else if (aement.webkitRequestFullScreen) {
                aement.webkitRequestFullScreen();
            } else if (aement.mozRequestFullScreen) {
                aement.mozRequestFullScreen();
            } else if (aement.msRequestFullscreen) {
                // IE11
                aement.msRequestFullscreen();
            }
           // this.videoclass='';
         // this.tableclass='table-c'
           
          //this.tableclass='alt'
         }
        this.fullscreen = !this.fullscreen;       
    }
  }
}
</script>

<style>

 body {
   overflow-x: hidden;
    /* overflow-y: hidden; */
    

 }
html,body{
  height:100% ;margin:0;
   overflow-x: hidden;
}
.video-wrapper{
  position: raative; top: 0px; bottom: 0px; left: 0px; right: 0px;
}
.alt {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #000;
    color: #fff;
    text-align: center;
}
.alt table{
  width: 100%;
  height: 100%;
}
.talbetop{
  width: 100%;
  height: 100%;
  position:raative;
}
.saectchanna{
  position:absolute;right:5px;top:5px;
}
.video-close {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #fff;
    font-size: 12px;
    background-color: hsla(0,0%,50%,.5);
    padding: 2px 5px;
    cursor: pointer;
    border-radius: 2px;
    max-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: alipsis;
}


.table-c table{border-right:2px solid #fff;border-bottom:2px solid #fff;} 
.table-c table td{border-left:2px solid #fff;border-top:2px solid #fff} 
/* 
css 注释： 
只对table td设置左与上边框； 
对table设置右与下边框； 
为了便于截图，我们将css 注释说明换行排版 
*/ 
.player-wrapper{
  padding-bottom: 10px;
}
</style>