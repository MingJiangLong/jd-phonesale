import { fetchStoresList, Store as Office } from "@/service";
import { showError } from "@/utils";
import { defineStore } from "pinia";

/**
 * 门店信息
 */
export default defineStore('officeInfo', {
  state: (): State => {
    return {
      officeList: [],
      currentOffice: {}
    }
  },
  getters: {
    storeId(state) {
      return state.currentOffice?.storeId
    }
  },
  actions: {
    async initOfficeInfo() {
      try {
        let result = await fetchStoresList();
        let data = result.data;
        if (!Array.isArray(data) || data.length < 1) throw new Error('该账号下没有门店信息');
        this.updateList(data)
        const [firstStore] = data
        this.updateCurrentOffice(firstStore)
      } catch (error: any) {
        showError(error?.message)
      }
    },
    updateList(list: Office[]) {
      this.officeList = list
    },
    updateCurrentOffice(officeInfo?: Office) {
      this.currentOffice = officeInfo;
    }
  },
  persist: true
})

type State = {
  currentOffice?: Partial<Office>
  officeList: Office[]
}