import { representations } from "@/constants/representations"

export const getValidMoves = (board, position) => {
    const moves = [
        [2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2],
    ]
    const [x, y] = position
    const validMoves = []

    for (const [dx, dy] of moves) {
        const nx = x + dx
        const ny = y + dy
        if (nx >= 0 && nx < board.length && ny >= 0 && ny < board[0].length && board[nx][ny] !== representations.darkHorse && board[nx][ny] !== representations.whiteHorse) {
            validMoves.push([nx, ny])
        }
    }
    return validMoves
}

export const makeMove = (state, player, move) => {
    const { matrix, scores, x2 } = state
    const [x, y] = move
    const current = player
    const opponent = player === representations.darkHorse ? representations.whiteHorse : representations.darkHorse

    const currentPosition = findHorsePosition(matrix, current)
    matrix[currentPosition[0]][currentPosition[1]] = 0

    if (matrix[x][y] >= 1 && matrix[x][y] <= 10) {
        const points = matrix[x][y]
        scores[player] += x2[player] ? points * 2 : points
        x2[player] = false
    } else if (matrix[x][y] === representations.extraPoints && !x2[player]) {
        x2[player] = true
    }
    matrix[x][y] = current

    state.turn = opponent;
};

export const witheHorseCriteria = (isMaximizing) => {
    return isMaximizing ? representations.whiteHorse : representations.darkHorse
}

export const darkHorseCriteria = (isMaximizing) => {
    return isMaximizing ? representations.darkHorse : representations.whiteHorse
}

export const witheHorsePoints = (state) => {
    return state.scores[representations.whiteHorse] - state.scores[representations.darkHorse]
}

export const darkHorsePointsAndDistance = (state) => {
    const { scores, matrix } = state

    const scoreDifference = scores[representations.darkHorse] - scores[representations.whiteHorse]

    const playerPosition = findHorsePosition(matrix, representations.darkHorse)
    const minDistanceToPoints = findClosestPointDistance(matrix, playerPosition, true)

    const proximityToPoints = minDistanceToPoints === Infinity ? 0 : -minDistanceToPoints

    return scoreDifference + proximityToPoints
}

const findClosestPointDistance = (board, start, searchPoints = true) => {
    const queue = [[...start, 0]]
    const visited = new Set()
    visited.add(start.toString())

    while (queue.length > 0) {
        const [x, y, dist] = queue.shift()

        if (searchPoints && board[x][y] >= 1 && board[x][y] <= 10) {
            return dist
        }

        const validMoves = getValidMoves(board, [x, y])
        for (const [nx, ny] of validMoves) {
            if (!visited.has([nx, ny].toString())) {
                visited.add([nx, ny].toString())
                queue.push([nx, ny, dist + 1])
            }
        }
    }

    return Infinity
}

const minimax = (state, depth, isMaximizing, heuristic, maximizingCriteria) => {
    const { matrix } = state
    const player = maximizingCriteria(isMaximizing)

    if (!boardHasPoints(matrix) || depth === 0) {
        return heuristic(state)
    }

    let bestScore = isMaximizing ? -Infinity : Infinity
    const currentPosition = findHorsePosition(matrix, player)
    const moves = getValidMoves(matrix, currentPosition)

    for (const move of moves) {
        const newState = JSON.parse(JSON.stringify(state))
        makeMove(newState, player, move)
        const score = minimax(newState, depth - 1, !isMaximizing, heuristic, maximizingCriteria)
        bestScore = isMaximizing
            ? Math.max(score, bestScore)
            : Math.min(score, bestScore)
    }

    return bestScore
}

export const findHorsePosition = (board, player) => {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === player) {
                return [i, j]
            }
        }
    }
}

export const boardHasPoints = (board) => {
    return countPoints(board) > 0
}

const countPoints = (board) => {
    let count = 0
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] > 0 && board[i][j] <= 10) {
                count++
            }
        }
    }
    return count
}

export const findBestMove = (state, depth = 2, heuristic, maximizingCriteria) => {
    const player = state.turn
    const currentPosition = findHorsePosition(state.matrix, player)
    const moves = getValidMoves(state.matrix, currentPosition)

    let bestMove = null
    let bestScore = -Infinity

    for (const move of moves) {
        const storeState = { ...state.$state }
        const newState = JSON.parse(JSON.stringify(storeState))
        makeMove(newState, player, move)
        const score = minimax(newState, depth, true, heuristic, maximizingCriteria)
        if (score > bestScore) {
            bestScore = score
            bestMove = move
        }
    }

    return bestMove
}