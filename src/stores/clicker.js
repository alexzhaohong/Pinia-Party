import { defineStore } from 'pinia'

export const useClicker = defineStore('clicker', {
    // Default state / config
    state: () => {
        return {
            balance: 0,
            tickDurationMs: 250,
            factoryPriceMultiplier: 1.05,
            factories: {
                partyPopper: {
                    id: 'partyPopper',
                    name: 'Party Popper',
                    emoji: '🎉',
                    basePrice: 10,
                    confettiPerSecond: .25,
                    owned: 0,
                },
                balloon: {
                    id: 'balloon',
                    name: 'Balloon',
                    emoji: '🎈',
                    basePrice: 100,
                    confettiPerSecond: 2.5,
                    owned: 0
                },
                cake: {
                    id: 'cake',
                    name: 'Cake',
                    emoji: '🎂',
                    basePrice: 1000,
                    confettiPerSecond: 100,
                    owned: 0
                },
            },
        }
    },
    getters: {
        factoryPrice: (state) => (factoryID) => {
            // factoryPrice = basePrice * (factoryPriceMultiplier ** owned)
            return state.factories[factoryID].basePrice * (state.factoryPriceMultiplier ** state.factories[factoryID].owned)
        },
        factoryConfettiPerSecond: (state) => (factoryID) => {
            // factoryConfettiPerSecond = confettiPerSecond * owned
            return state.factories[factoryID].confettiPerSecond * state.factories[factoryID].owned
        },
        canBuyFactory(state) {
            return (factoryID) => state.balance >= this.factoryPrice(factoryID)
        },
        confettiPerSecond(state) {
            return Object.keys(state.factories).reduce((confettiPerSecond, factoryID) => {
                return confettiPerSecond + this.factoryConfettiPerSecond(factoryID)
            }, 0)
        },
    },
    actions: {
        buyFactory(factoryID) {
            if (!this.canBuyFactory) {
                throw new Error('Not enough money')
            }

            // withdraw money and increment owned amount
            this.balance -= this.factoryPrice(factoryID) 
            this.factories[factoryID].owned++
        },
        tick() {
            this.balance += this.confettiPerSecond * this.tickDurationMs / 1000
        },
        click() {
            this.balance += 1 + (this.confettiPerSecond / 25)
        }
    }
})