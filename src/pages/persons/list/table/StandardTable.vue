<template>
  <div class="standard-table">
    <a-table
      :bordered="bordered"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :rowKey="rowKey"
      :pagination="pagination"
      :expandedRowKeys="expandedRowKeys"
      :expandedRowRender="expandedRowRender"
      @change="onChange"
      :rowSelection="
        selectedRows
          ? { selectedRowKeys: selectedRowKeys, onChange: updateSelect }
          : undefined
      "
    >
      <template
        slot-scope="text, record, index"
        :slot="slot"
        v-for="slot in Object.keys($scopedSlots).filter(
          (key) => key !== 'expandedRowRender'
        )"
      >
        <slot :name="slot" v-bind="{ text, record, index }"></slot>
      </template>
      <template :slot="slot" v-for="slot in Object.keys($slots)">
        <slot :name="slot"></slot>
      </template>
      <template
        slot-scope="record, index, indent, expanded"
        :slot="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"
      >
        <slot
          v-bind="{ record, index, indent, expanded }"
          :name="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"
        ></slot>
      </template>
      <viewer slot="photo" style="width:10%" slot-scope="text">
        <img ref="img" v-if="text !== null" width="100" :src="'/api/api-auth/' + text" />
      </viewer>
      <div slot="role" slot-scope="text">
        <span v-if="text === 1">普通人员</span>
         <span v-if="text === 2">白名单人员</span>
          <span v-if="text === 3">黑名单人员</span>
      </div>
      
    </a-table>
  </div>
</template>

<script>

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    width: 100,
  },
  {
    title: "姓名",
    dataIndex: "name",
    scopedSlots: { customRender: "name" },
    width: 100,
  },
  {
    title: "身份证号",
    dataIndex: "idCard",
    width: 100,
  },
  {
    title: "门禁卡号",
    dataIndex: "accessId",

    width: 100,
  },
  {
    title: "车牌号",
    dataIndex: "carId",
    width: 100,
  },
  {
    title: "电话",
    dataIndex: "phone",
    width: 100,
  },
  {
    title: "照片",
    dataIndex: "photo",
    width: 100,
    scopedSlots: { customRender: "photo" },
  },
  {
    title: "角色",
    dataIndex: "role",
    width: 100,
    scopedSlots: { customRender: "role" },
  },
  {
    title: "生效时间",
    dataIndex: "starTime",

    width: 100,
  },
  {
    title: "失效时间",
    dataIndex: "invalidTime",

    width: 100,
  },
  {
    title: "注册时间",
    dataIndex: "createTime",

    width: 100,
  },
  {
    title: "备注",
    dataIndex: "content",
  },

  {
    title: "操作",

    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "StandardTable",
  props: {
    bordered: Boolean,
    loading: [Boolean, Object],

    dataSource: Array,
    rowKey: {
      type: [String, Function],
      default: "id",
    },
    pagination: {
      type: [Object, Boolean],
      default: true,
    },
    selectedRows: Array,
    expandedRowKeys: Array,
    expandedRowRender: Function,
  },
  data() {
    return {
      needTotalList: [],
      columns: columns,
    };
  },
  created() {
    // this.needTotalList = this.initTotalList(this.columns)
  },
  beforeMount() {
   
  },
  methods: {
    updateSelect(selectedRowKeys, selectedRows) {
      this.$emit("update:selectedRows", selectedRows);
      this.$emit("selectedRowChange", selectedRowKeys, selectedRows);
    },
    initTotalList(columns) {
      const totalList = columns
        .filter((item) => item.needTotal)
        .map((item) => {
          return {
            ...item,
            total: 0,
          };
        });
      return totalList;
    },
    onClear() {
      this.updateSelect([], []);
      this.$emit("clear");
    },
    onChange(pagination, filters, sorter, { currentDataSource }) {
      this.$emit("change", pagination, filters, sorter, { currentDataSource });
    },
    
   
  },

  watch: {
    selectedRows(selectedRows) {
      this.needTotalList = this.needTotalList.map((item) => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            return sum + val[item.dataIndex];
          }, 0),
        };
      });
    },
  },
  computed: {
    selectedRowKeys() {
      return this.selectedRows.map((record) => {
        return typeof this.rowKey === "function"
          ? this.rowKey(record)
          : record[this.rowKey];
      });
    },
  },
};
</script>

<style scoped lang="less">
.standard-table {
  .alert {
    margin-bottom: 16px;
    .message {
      a {
        font-weight: 600;
      }
    }
    .clear {
      float: right;
    }
  }
}
</style>
