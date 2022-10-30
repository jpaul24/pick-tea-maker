import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useMainStore = defineStore({
  id: "main",
  state: () => ({
    teaMakers: useStorage("teaMakers", []),
    id: useStorage("id", 1)
  }),
  getters: {
    getAllTeaMakers() {
      return this.teaMakers;
    },
    teaMakersEmpty() {
      return this.teaMakers.length <= 0;
    },
    getIdReference() {
      return this.id;
    }
  },
  actions: {
    addTeaMaker(teaMaker) {
      this.teaMakers.push(teaMaker);
    },
    removeTeaMaker(index) {
      this.teaMakers.splice(index, 1);
    },
    updateIdNumber() {
      this.id += 1;
    },
    updateTeaMakerRoundCount(id) {
      const result = this.teaMakers.find((obj) => {
        return obj.id === id;
      });

      result.teaRoundsMade += 1;
    },
    resetTeaRounds() {
      this.teaMakers.forEach((teaMaker) => {
        teaMaker.teaRoundsMade = 0;
      });
    }
  }
});
