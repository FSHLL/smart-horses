<template>
  <a-spin :spinning="spinning && !smartHorsesStore.automatic">
    <a-result v-if="smartHorsesStore.matrix.length === 0" title="Great, click for start the game!">
      <template #icon>
        <SmileTwoTone />
      </template>
      <template #extra>
        Automatico: <a-switch v-model:checked="smartHorsesStore.automatic" />
        <a-button type="primary" @click="start">Start</a-button>
      </template>
    </a-result>
    <div v-else :spinning="spinning">
      <a-alert
        :message="`Turno ${smartHorsesStore.turn === representations.whiteHorse ? 'Máquina' : 'Jugador (Negro)'}`"
        :type="smartHorsesStore.turn === representations.whiteHorse ? 'error' : 'info'"></a-alert>
      <a-divider></a-divider>
      <div class="row">
        <a-space>
          Automatico: <a-switch v-model:checked="smartHorsesStore.automatic" />
          <a-button @click="restart">Reiniciar</a-button>
        </a-space>
      </div>
      <a-spin :spinning="spinning && smartHorsesStore.automatic">
        <a-divider></a-divider>
        <a-row>
          <a-col :span="12">
            <a-statistic title="Blanco (Maquina)" :value="smartHorsesStore.scores[representations.whiteHorse]"
              style="margin-right: 50px" />
          </a-col>
          <a-col :span="12">
            <a-statistic title="Negro (Jugador)" :value="smartHorsesStore.scores[representations.darkHorse]"
              style="margin-right: 50px" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-statistic v-if="smartHorsesStore.x2[representations.whiteHorse]" value="&#x2713;" title="Blanco x2"
              style="margin-right: 50px" />
          </a-col>
          <a-col :span="12">
            <a-statistic v-if="smartHorsesStore.x2[representations.darkHorse]" value="&#x2713;" title="Negro x2"
              style="margin-right: 50px" />
          </a-col>
        </a-row>
      </a-spin>
      <a-divider></a-divider>
      <div v-for="(row, rowIndex) in smartHorsesStore.matrix" :key="rowIndex" class="row">
        <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell"
          :style="{ backgroundColor: getColorByRepresentation(cell) }" v-html="printCell(cell)"
          @click="move([rowIndex, colIndex])">
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script setup>
import { representations, getColorByRepresentation } from '@/constants/representations';
import { boardHasPoints, findBestMove, findHorsePosition, getValidMoves, makeMove, darkHorsePointsAndDistance, darkHorseCriteria, witheHorseCriteria, whiteHorsePointsAndDistance } from '@/helpers/minimax';
import { useSmartHorsesStore } from '@/stores/smartHorsesStore';
import { message, Modal } from 'ant-design-vue';
import { SmileTwoTone } from '@ant-design/icons-vue';
import { ref, watch } from 'vue';

const spinning = ref(false);

const smartHorsesStore = useSmartHorsesStore()

const printCell = (cell) => {
  let html = `<strong>${cell}</strong>`

  if (cell === representations.light) {
    html = ''
  } else if (cell === representations.extraPoints) {
    html = '<img src="https://cdn-icons-png.flaticon.com/512/25/25685.png" alt="" title="" class="cell">'
  } else if (cell === representations.whiteHorse) {
    html = '<img alt="Dark Horse" loading="lazy" decoding="async" data-nimg="1" class="cell" style="color: transparent;" src="https://cdn-icons-png.freepik.com/512/4263/4263609.png">'
  } else if (cell === representations.darkHorse) {
    html = '<img alt="Withe Horse" loading="lazy" decoding="async" data-nimg="1" class="cell" style="color: transparent;" src="https://cdn-icons-png.freepik.com/512/4263/4263911.png">'
  }

  return html
}

const checkFinish = () => {
  if (!boardHasPoints(smartHorsesStore.matrix)) {
    if (smartHorsesStore.scores[representations.whiteHorse] > smartHorsesStore.scores[representations.darkHorse]) {
      Modal.error({
        title: 'Perdiste',
        content: smartHorsesStore.scores[representations.whiteHorse],
        onOk() {
          start()
        }
      })
    } else if (smartHorsesStore.scores[representations.darkHorse] > smartHorsesStore.scores[representations.whiteHorse]) {
      Modal.success({
        title: 'Ganaste',
        content: smartHorsesStore.scores[representations.darkHorse],
        onOk() {
          start()
        }
      })
    } else {
      Modal.info({
        title: 'Empate',
        onOk() {
          start()
        }
      })
    }
  }
}

const machineMove = () => {
  spinning.value = true
  setTimeout(() => {
    const bestMove = findBestMove(smartHorsesStore, smartHorsesStore.level[0], whiteHorsePointsAndDistance, witheHorseCriteria)

    makeMove(smartHorsesStore, smartHorsesStore.turn, bestMove)
    spinning.value = false
    checkFinish()
    if (smartHorsesStore.automatic && boardHasPoints(smartHorsesStore.matrix)) {
      automaticMove()
    }
  }, 1000);
}

const automaticMove = () => {
  spinning.value = true
  setTimeout(() => {
    const bestMove = findBestMove(smartHorsesStore, smartHorsesStore.levelIA2[0], darkHorsePointsAndDistance, darkHorseCriteria)

    makeMove(smartHorsesStore, smartHorsesStore.turn, bestMove)
    spinning.value = false
    checkFinish()
    if (boardHasPoints(smartHorsesStore.matrix)) {
      machineMove()
    }
  }, 1000);
}

const move = (cell) => {
  const currentPosition = findHorsePosition(smartHorsesStore.matrix, smartHorsesStore.turn);
  const moves = getValidMoves(smartHorsesStore.matrix, currentPosition)

  if (moves.some((move) => move[0] === cell[0] && move[1] === cell[1])) {
    makeMove(smartHorsesStore, smartHorsesStore.turn, cell)
    if (boardHasPoints(smartHorsesStore.matrix)) {
      machineMove()
    }
    checkFinish()
  } else {
    message.error('Jugada no permitida');
  }
}

const start = () => {
  smartHorsesStore.start()
  machineMove()
}

const restart = () => {
  let active = false
  if (smartHorsesStore.automatic) {
    spinning.value = true
    smartHorsesStore.automatic = false
    active = true
  }
  setTimeout(() => {
    smartHorsesStore.start()
    spinning.value = false
    if (active) {
      smartHorsesStore.automatic = true
    }
    machineMove()
  }, 2000);
}

watch(() => smartHorsesStore.automatic, (value) => {
  if (value && smartHorsesStore.turn === representations.darkHorse) {
    automaticMove()
  }
})
</script>

<style>
.matrix {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.row {
  display: flex;
  justify-content: center;
}

.cell {
  width: 50px;
  height: 50px;
  border: 2px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #f0f0f0;
}

.cell img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.cell strong {
  font-size: 24px;
}
</style>