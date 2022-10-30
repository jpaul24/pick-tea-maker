<template>
  <div
    class="p-8 w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="flex mb-5">
      <input
        class="m-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        type="text"
        placeholder="Enter tea drinker's name"
        v-model="teaMaker"
      />
      <button class="btn btn-blue" @click="AddTeaMaker">Add Tea Drinker</button>
    </div>
    <div v-if="!isEmpty">
      <div
        v-for="(teaMaker, index) in teaMakers"
        :key="index"
        class="flex justify-between mb-1"
      >
        <p>{{ teaMaker.name }}</p>
        <div class="flex">
          <p class="mr-2">Rounds made - {{ teaMaker.teaRoundsMade }}</p>
          <button @click="removeTeaMaker(index)">🗑</button>
        </div>
      </div>
      <div class="flex mt-5">
        <button class="btn btn-blue" @click="PickTeaMaker">
          Pick Tea Maker
        </button>
        <button class="btn btn-blue" @click="ResetTeaRounds">
          Reset Tea Rounds
        </button>
      </div>
      <h3 v-if="chosenTeaMaker" class="text-center text-xl mt-5">
        <span class="font-bold">{{ chosenTeaMaker }}</span> has to make this
        round of tea
      </h3>
    </div>
    <div v-else>
      No tea makers found. Add some using the input field above to begin fairly
      distributing who's turn it is to make the tea
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useMainStore } from "../store/store.js";

export default {
  setup() {
    const main = useMainStore();
    const teaMaker = ref("");
    let chosenTeaMaker = ref("");

    // Function for adding a name to the tea makers list
    const AddTeaMaker = () => {
      // checks value of the input
      if (teaMaker.value != "") {
        // creates object containing the name of the tea maker, an id to identify the tea maker and a count on how many rounds they have made
        const teaMakerObject = {
          id: main.getIdReference,
          name: teaMaker.value,
          teaRoundsMade: 0
        };
        // uses the store to add the tea maker to state
        main.updateIdNumber();
        main.addTeaMaker(teaMakerObject);
        // clears the value in the input
        teaMaker.value = "";
      }
    };

    // Function for selecting the tea maker that has to make this round
    const PickTeaMaker = () => {
      chosenTeaMaker.value = "";
      let eligibleTeaMakers = [];

      // create a copy of the tea makers stored in our store so as not to change that directly
      const sortedArray = [...main.getAllTeaMakers];

      // takes the array of tea makers and sorts them based on how many rounds they have made, those with the least at the start of the array
      sortedArray.sort((a, b) => a.teaRoundsMade - b.teaRoundsMade);

      // to ensure a fair distribution of tea making check the value of tea rounds made on each and remove the tea maker with the most from contention
      sortedArray.forEach((teaMaker) => {
        if (
          sortedArray.at(-1).teaRoundsMade !== sortedArray[0].teaRoundsMade &&
          sortedArray.indexOf(teaMaker, -1)
        ) {
          if (teaMaker.teaRoundsMade < sortedArray.at(-1).teaRoundsMade) {
            eligibleTeaMakers.push(teaMaker);
          }
        } else {
          // this else is to ensure if all tea makers have done the same amount of rounds then they
          eligibleTeaMakers.push(teaMaker);
        }
      });

      // selects a random tea maker from the eligible tea makers array
      let selectedTeaMaker =
        eligibleTeaMakers[Math.floor(Math.random() * eligibleTeaMakers.length)];

      chosenTeaMaker.value = selectedTeaMaker.name;

      // Updates the tea maker object in the store to increment the count
      main.updateTeaMakerRoundCount(selectedTeaMaker.id);
    };

    // Function to reset the count on rounds through the store
    const ResetTeaRounds = () => {
      main.resetTeaRounds();
    };

    return {
      AddTeaMaker,
      PickTeaMaker,
      ResetTeaRounds,
      teaMaker,
      chosenTeaMaker,
      teaMakers: computed(() => main.getAllTeaMakers),
      isEmpty: computed(() => main.teaMakersEmpty),
      removeTeaMaker: main.removeTeaMaker
    };
  }
};
</script>

<style scoped>
.btn {
  @apply font-bold py-1 px-2 m-1 rounded;
}
.btn-blue {
  @apply bg-blue-500 text-white;
}
.btn-blue:hover {
  @apply bg-blue-700;
}
</style>
