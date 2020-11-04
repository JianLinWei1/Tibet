<template>
  <div class="analysis">
    <a-row style="margin-top: 0" :gutter="[24, 24]">
      <a-col :sm="24" :md="12" :xl="6">
        <router-link to="/person" >
        <a-card style="width: 330px">
          <svg-icon icon-class="persons" class-name="svgClass"></svg-icon>
          <div class="box">
            <div  class="count">9</div>
            <div class="text">人员数量</div>
          </div>
        </a-card>
        </router-link>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
       <a-card style="width: 330px">
          <svg-icon icon-class="camera" class-name="svgClass"></svg-icon>
          <div class="box">
            <div  class="count">9</div>
            <div class="text">监控数量</div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <a-card style="width: 330px">
          <svg-icon icon-class="access" class-name="svgClass"></svg-icon>
          <div class="box">
            <div  class="count">9</div>
            <div class="text">门禁数量</div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
       <a-card style="width: 330px">
          <svg-icon icon-class="car" class-name="svgClass"></svg-icon>
          <div class="box">
            <div  class="count">9</div>
            <div class="text">车道数量</div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row  :gutter="[24, 24]">
       <a-col :sm="24" :md="12" :xl="24">
       <!-- <div id="map"></div> -->
       <img  width="100%" height="600" src="@/assets/img/1.png" />
       </a-col>
    </a-row>
   
  </div>
</template>

<script>
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
export default {
  name: "dashboard",
  data() {
    return {
      loading: true,
    };
  },

  created() {
    setTimeout(() => (this.loading = !this.loading), 1000);
  },
  mounted() {
    const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'light',
    center: [ 121.435159, 31.256971 ],
    zoom: 14.89,
    minZoom: 10
  })
});
fetch(
  'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json'
)
  .then(res => res.json())
  .then(data => {
    const pointLayer = new PointLayer({})
      .source(data, {
        parser: {
          type: 'json',
          x: 'longitude',
          y: 'latitude'
        }
      })
      .shape('name', [
        'circle',
        'triangle',
        'square',
        'pentagon',
        'hexagon',
        'octogon',
        'hexagram',
        'rhombus',
        'vesica'
      ])
      .size('unit_price', [ 10, 25 ])
      .color('name', [ '#5B8FF9', '#5CCEA1', '#5D7092', '#F6BD16', '#E86452' ])
      .style({
        opacity: 0.3,
        strokeWidth: 2
      });

    scene.addLayer(pointLayer);
  });
  }
};
</script>

<style lang="less" scoped>
.extra-wrap {
  .extra-item {
    display: inline-block;
    margin-right: 24px;
    a:not(:first-child) {
      margin-left: 24px;
    }
  }
}
@media screen and (max-width: 992px) {
  .extra-wrap .extra-item {
    display: none;
  }
}
@media screen and (max-width: 576px) {
  .extra-wrap {
    display: none;
  }
}
.svgClass {
  width: 10em;
  height: 10em;
  float: left;
}
.box{
  text-align: center;
    padding: 42px;
    float: left;
}
.text {
 
}
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 500px;
}
</style>
