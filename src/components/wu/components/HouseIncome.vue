<template>
  <!-- <h3>房源收入</h3>
  <table>
    <thead>
      <tr>
        <th>時間區段</th>
        <th>收入</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td></td>
      </tr>
    </tbody>
  </table> -->

  <v-card class="mx-auto text-center" color="green" max-width="600" dark>
    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-sparkline :model-value="incomeRecords" color="rgba(255, 255, 255, .7)" height="100" padding="24"
          stroke-linecap="round" smooth>
          <template v-slot:label="item"> ${{ item.value }} </template>
        </v-sparkline>
      </v-sheet>
    </v-card-text>

    <v-card-text>
      <div class="text-h4 font-weight-thin">Sales Last 24h</div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="justify-center">
      <v-btn variant="text" block> Go to Report </v-btn>
    </v-card-actions>
  </v-card>

</template>

<script setup>

const props = defineProps({
  incomeRecords: Array
});

const value = props.incomeRecords
// const value = [
//     423,
//     446,
//     675,
//     510,
//     590,
//     610,
//     760,
//   ]

</script>

<style scoped></style>
