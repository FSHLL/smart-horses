import { representations } from "@/constants/representations";
import { generateMatrix } from "@/helpers/matrix";
import { defineStore } from "pinia";

export const useSmartHorsesStore = defineStore('smart-horses', {
    state: () => ({
        matrix: [],
        spareMatrix: [],
        level: [2],
        scores: { [representations.whiteHorse]: 0, [representations.darkHorse]: 0 },
        x2: { [representations.whiteHorse]: false, [representations.darkHorse]: false },
        turn: representations.whiteHorse,
        automatic: false,
    }),
    actions: {
        start() {
            this.scores = { [representations.whiteHorse]: 0, [representations.darkHorse]: 0 }
            this.x2 = { [representations.whiteHorse]: false, [representations.darkHorse]: false }
            this.turn = representations.whiteHorse
            this.matrix = generateMatrix()
            this.spareMatrix = JSON.parse(JSON.stringify(this.matrix))
        },
    },
})