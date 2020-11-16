<template>
  <a-card>
    <a-spin :spinning="spinning"
            tip="正在从设备删除....">
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="8"
                     :sm="24">
                <a-form-item label="人员编号"
                             :labelCol="{ span: 5 }"
                             :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.personId"
                           placeholder="请输入(精确查询)" />
                </a-form-item>
              </a-col>
              <a-col :md="8"
                     :sm="24">
                <a-form-item label="姓名"
                             :labelCol="{ span: 5 }"
                             :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.name"
                           placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col :md="8"
                     :sm="24">
                <a-form-item label="条件"
                             :labelCol="{ span: 5 }"
                             :wrapperCol="{ span: 18, offset: 1 }">
                  <a-radio-group v-model="form.con">
                    <a-radio value="1">
                      当天
                    </a-radio>
                    <a-radio value="2">
                      最近一周
                    </a-radio>
                    <a-radio value="3">
                      最近一月
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>

            </a-row>
            <a-row>
              <a-col :md="8"
                     :sm="24">
                <a-form-item label="自定义时间段"
                             :labelCol="{ span: 5 }"
                             :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker format="YYYY-MM-DD"
                                  v-model="form.times" />
                </a-form-item>
              </a-col>

            </a-row>
          </div>
          <span style="float: right; margin-top: 3px">
            <a-button type="primary"
                      @click="search">生成报表</a-button>
            <a-button style="margin-left: 8px"
                      @click="form = {}">重置</a-button>
          </span>
        </a-form>
      </div>
      <div>
        <div class="operator">
          <a-button @click="delList"
                    v-auth:permission="`del`"
                    ghost
                    type="primary">导出</a-button>
        </div>
        <standard-table :bordered="true"
                        :pagination="pagination"
                        :dataSource="dataSource"
                        :selectedRows.sync="selectedRows"
                        @change="onChange"
                        @selectedRowChange="onSelectChange">
          <div slot="action"
               slot-scope="{ record }">
            <!-- <a style="margin-right: 8px"  @click="editRecord(record)"> <a-icon type="edit"  />编辑 </a> -->
            <a @click="deleteRecord(record.id)"
               v-auth:permission="`del`">
              <a-icon type="delete" />删除
            </a>
          </div>
        </standard-table>
      </div>

    </a-spin>
  </a-card>
</template>

<script>
import StandardTable from "./table/StandardTable";
import { getAttenceReport } from "@/services/attence";


export default {
  name: "QueryList",
  components: { StandardTable },
  data () {
    return {
      advanced: true,
      dataSource: [],
      selectedRows: [],
      form: {
        con: "1"
      },
      issueFrom: {},
      pagination: {
        current: 0,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
        showTotal: (total) => `共 ${total} 条`,
        showSizeChange: (current, pageSize) => (this.pageSize = pageSize),
      },
      visible: false,
      spinning: false
    };
  },
  authorize: {
    deleteRecord: {
      check: "del",
      type: "permission",
    },
    delList: {
      check: "del",
      type: "permission",
    }
  },
  created () {

  },
  methods: {
    listAccessPersons () {
      /*   this.form.page = this.pagination.current;
        this.form.limit = this.pagination.pageSize;
        listAccessPersons(this.form).then((res) => {
          if (res.code === 0) {
            this.dataSource = res.data;
            this.pagination.total = res.count;
          } else {
            this.$message.error(res.msg);
          }
        }); */
    },
    search () {
      console.log(this.form)
      getAttenceReport(this.form).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.dataSource = res.data
        } else {
          this.$message.info("生成失败")
        }
      })

    },

    toggleAdvanced () {
      this.advanced = !this.advanced;
    },

    onClear () { },
    deleteRecord (key) {
      let data = [];
      data.push(key);
      this.spinning = true
      /*    DelAccessPerson(data).then((res) => {
           console.log(res)
           if (res.code === 0) {
             this.$message.success("删除成功")
           } else {
             this.$message.error("删除失败：" + res.data)
           }
           this.listAccessPersons()
           this.spinning = false
         }); */
    },
    editRecord (key) {
      console.log(key);
      this.visible = true;
      this.issueFrom = key;
    },

    onChange (date, dateString) {
      console.log(date, dateString);
    },
    onSelectChange () {
      console.log(this.selectedRows);
    },
    delList () {
      let data = [];
      this.selectedRows.forEach((item) => {
        data.push(item.id);
      });
      /*  DelAccessPerson(data).then((res) => {
         console.log(res)
         if (res.code === 0) {
           this.$message.success("删除成功")
         } else {
           this.$message.error("删除失败：" + res.data)
         }
         this.listAccessPersons()
         this.spinning = false
       }); */
    },

    handleMenuClick (e) {
      if (e.key === "delete") {
        this.remove();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
