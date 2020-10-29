<template>
  <a-card>
    <a-spin :spinning="spinning" tip="请稍候....">
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="IP"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input v-model="form.ipaddr" placeholder="请输入(精确查询)" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="名称"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input v-model="form.device_name" placeholder="请输入" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="form = {}"
              >重置</a-button
            >
          </span>
        </a-form>
      </div>
      <div>
        <div class="operator">
          <a-button @click="delList" ghost type="danger">批量删除</a-button>
        </div>
        <standard-table
          :bordered="true"
          :pagination="pagination"
          :dataSource="dataSource"
          :selectedRows.sync="selectedRows"
          @change="onChange"
          @selectedRowChange="onSelectChange"
        >
          <div slot="action" slot-scope="{ record }">
               <a style="margin-right: 8px" @click="issuedRecord(record)">
              <a-icon type="arrow-down" />下发白名单
            </a>
            <a style="margin-right: 8px" @click="editRecord(record)">
              <a-icon type="edit" />编辑
            </a>
            <a @click="deleteRecord(record.serialno)">
              <a-icon type="delete" />删除
            </a>
          </div>
        </standard-table>
      </div>
<!--编辑-->
      <a-modal v-model="visible" title="编辑" :footer="null">
        <a-form-model
          ref="ruleForm"
          :model="recordFrom"
          :rules="rules"
          :labelCol="{ span: 7 }"
          :wrapperCol="{ span: 10 }"
        >
          <a-form-model-item ref="serialno" label="序列号" prop="serialno">
            <a-input disabled v-model="recordFrom.serialno" placeholder="ip" />
          </a-form-model-item>
          <a-form-model-item
            ref="device_name"
            label="设备名称"
            prop="device_name"
          >
            <a-input v-model="recordFrom.device_name" />
          </a-form-model-item>
          <a-form-model-item ref="serialno" label="IP" prop="ipaddr">
            <a-input
              disabled
              v-model="recordFrom.ipaddr"
              placeholder="ipaddr"
            />
          </a-form-model-item>

          <a-form-model-item label="绑定账号" prop="userId">
            <a-select
            show-search
              mode="default"
              v-model="recordFrom.userId"
              placeholder="搜索"
              style="width: 100%"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchUser"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in data" :key="d.id" :value="d.id">
                {{ d.userName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            style="margin-top: 24px"
            :wrapperCol="{ span: 10, offset: 7 }"
          >
            <a-button type="primary" @click="submit">提交</a-button>
            <a-button style="margin-left: 8px">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <!--下发-->
      <a-modal v-model="issuedvisible" title="编辑" :footer="null">
        <a-form-model
          ref="ruleForm"
          :model="issuedFrom"
          :rules="rules"
          :labelCol="{ span: 7 }"
          :wrapperCol="{ span: 10 }"
        >
          <a-form-model-item ref="serialno" label="序列号" prop="serialno">
            <a-input disabled v-model="issuedFrom.serialno" placeholder="ip" />
          </a-form-model-item>
          <a-form-model-item
            ref="device_name"
            label="设备名称"
            prop="device_name"
          >
            <a-input disabled v-model="issuedFrom.device_name" />
          </a-form-model-item>
          <a-form-model-item label="选择人员" prop="personId">
            <a-select
            show-search
              mode="multiple"
              v-model="issuedFrom.personIds"
              placeholder="搜索"
              style="width: 100%"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchPerson"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in issuedData" :key="d.id" :value="d.id">
                {{ d.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
           <!-- <a-form-model-item ref="carId" label="车牌号" prop="carId">
            <a-input
              disabled
              v-model="issuedFrom.carId"
              placeholder="请输入车牌号"
            />
          </a-form-model-item> -->

          <a-form-model-item
            style="margin-top: 24px"
            :wrapperCol="{ span: 10, offset: 7 }"
          >
            <a-button type="primary" @click="submit2">提交</a-button>
            <a-button style="margin-left: 8px">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </a-spin>
  </a-card>
</template>

<script>
import StandardTable from "./table/StandardTable";
import { listParking,delParkInfo, getUserIdByName,saveParkInfo ,getPersonByName ,saveParkPersonInfo} from "@/services/parking";

export default {
  name: "QueryList",
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      dataSource: [],
      selectedRows: [],
      form: {},
      recordFrom: {},
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
      spinning: false,
      rules: {},
      fetching: false,
      data: [],
      issuedvisible:false,
      issuedFrom:{},
      issuedData:[]
    };
  },
  // authorize: {
  //   deleteRecord: "delete",
  // },
  created() {
    this.listParking();
  },
  methods: {
    listParking() {
      this.form.page = this.pagination.current;
      this.form.limit = this.pagination.pageSize;
      listParking(this.form).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data;
          this.pagination.total = res.count;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    search() {
      this.form.id = null;
      this.listParking();
    },

    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    onClear() {},
    deleteRecord(key) {
      let data = [];
      data.push(key);
      this.spinning = true;
        delParkInfo(data).then((res) => {
        console.log(res)
        if(res.code === 0){
          this.$message.success("删除成功")
        }else{
          this.$message.error("删除失败："+res.data)
        }
        this.listParking()
        this.spinning = false
      });
    },
    editRecord(key) {
      this.visible = true;
      this.recordFrom = key;
    },
    issuedRecord(key){
      this.issuedvisible = true
      this.issuedFrom = key
    },

    onChange(page) {
      this.pagination = page;
      this.listParking();
    },
    onSelectChange() {
      console.log(this.selectedRows);
    },
    delList() {
      let data = [];
      this.selectedRows.forEach((item) => {
        data.push(item.serialno);
      });
        delParkInfo(data).then((res) => {
        console.log(res)
        if(res.code === 0){
          this.$message.success("删除成功")
        }else{
          this.$message.error("删除失败："+res.data)
        }
        this.listParking()
        this.spinning = false
      });
    },

    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
    },
    fetchUser(value) {
      this.data = [];
      this.fetching = true;

      getUserIdByName({ userName: value }).then((res) => {
          console.log(res)
        if (res.code === 0) {
          this.data = res.data;
          console.log("fetching user", res.data);
        }else{
            this.$message.error("搜索异常")
        }
        this.fetching = false;
      });
    },
    fetchPerson(value){
      this.issuedData = [];
      this.fetching = true;

      getPersonByName({ name: value }).then((res) => {
          console.log(res)
        if (res.code === 0) {
          this.issuedData = res.data;
          console.log("fetching user", res.data);
        }else{
            this.$message.error("搜索异常")
        }
        this.fetching = false;
      });
    },
    submit() {
      this.spinning = true;
       saveParkInfo(this.recordFrom).then(res =>{
      this.spinning = false
        if(res.code == 0){
          this.$message.success("提交成功")
        }else{
          this.$message.error(JSON.stringify(res.data))
        }
      })
    },
      submit2() {
      this.spinning = true;
       saveParkPersonInfo(this.issuedFrom).then(res =>{
      this.spinning = false
        if(res.code == 0){
          this.$message.success("提交成功")
        }else{
          this.$message.error(JSON.stringify(res.data))
        }
      })
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
