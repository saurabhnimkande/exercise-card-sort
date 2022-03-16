import { CardEvent, Transaction } from './types'

type CardTransactionMapping = {
  [cardId: string]: Transaction
}

interface ObjectMapping {
  [index: string]: [
    {
      amount: number
      cardId: string
      id: string
      type: string
    }
  ]
}

/**
 * Write a function that receives a large batch of card events from multiple cards,
 * returning an object which maps from cardId -> valid transaction. Only cardIds with
 * a valid transaction should appear in the returned object.
 *
 * A valid transaction is a pair of card events, starting with a RESERVATION event
 * and finishing with either a CONFIRMATION or CANCELLATION event.
 *
 * The input is an array of unprocessed card events. Some events might be duplicated
 * or missing. For duplicated events, you may only use one of its occurrences and
 * discard the rest. Missing events invalidate the transaction.
 *
 * @param cardEvents CardEvent[] List of card events
 * @returns CardTransactionMapping Valid transactions grouped by cardId
 */
export const processCardEvents = (cardEvents: CardEvent[]): CardTransactionMapping => {
  // logic
  let obj: ObjectMapping = {}

  for (let i = 0; i < cardEvents.length; i++) {
    let val = cardEvents[i]
    if (val.type === 'RESERVATION') {
      if (obj[val.cardId] === undefined) {
        obj[val.cardId] = [val]
      }
    } else if (val.type === 'CONFIRMATION') {
      if (obj[val.cardId] !== undefined) {
        let tranArr = obj[val.cardId]
        if (tranArr.length == 1 && tranArr[0].amount === cardEvents[i].amount) {
          tranArr.push(val)
        }
      }
    } else if (val.type === 'CANCELLATION') {
      if (obj[val.cardId] !== undefined) {
        let tranArr = obj[val.cardId]
        if (tranArr.length == 1 && tranArr[0].amount === cardEvents[i].amount) {
          tranArr.push(val)
        }
      }
    }
  }

  for (let keys in obj) {
    if (obj[keys].length < 2) {
      delete obj[keys]
    }
  }

  return obj as CardTransactionMapping
}
