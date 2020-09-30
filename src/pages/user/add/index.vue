<template>
  <div>
  <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="Activity name">
      <a-input v-model="form.name" />
    </a-form-model-item>
    
    
  </a-form-model>
    </div>
</template>
<script>
export default {
   data(){
     return{
       form:{}
     }
   }
}
</script>