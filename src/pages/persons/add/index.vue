<template>

<add :action="action" :form="form"></add>

</template>
<script>
import add from "./index2.vue"
export default {
  data() {
      return{
          form:{
              carId:[]
          },
          action:0
      }
  },
   components: { add },
};
</script>
