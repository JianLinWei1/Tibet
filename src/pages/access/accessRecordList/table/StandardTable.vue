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
      <div slot="doors" slot-scope="text">
       <span v-for="t in text" :key="t">{{t}}号门||</span>
      </div>
      
    </a-table>
  </div>
</template>

<script>

const columns = [
 /*  {
    title: "ID",
    dataIndex: "id",
    width: 180,
  }, */
  {
    title: "门禁卡号",
    dataIndex: "icCard",
    width: 180,
  },
  {
    title: "人员编号",
    dataIndex: "personId",
    width: 100,
  },
  {
    title: "姓名",
    dataIndex: "name",

    width: 180,
  },
  {
    title: "刷卡时间",
    dataIndex: "time",
    width: 180,
  },
  /* {
    title: "设备序列号",
    dataIndex: "sn",
    width: 180,
  }, */
  {
    title: "设备名称",
    dataIndex: "dvName",
    width: 180,
  },
  {
    title: "门名称",
    dataIndex: "doorName",
    width: 180,
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
