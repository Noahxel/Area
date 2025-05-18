import { TriggerReactionParameters } from "./postArea"

export interface Ingredient {
    name: string
    description: string
}

export interface aboutService {
    name: string
    color: string
    triggers: TriggerActions[]
    actions: TriggerActions[]
}

export interface TriggerActions {
    name: string
    description: string
    parameters: TriggerReactionParameters[]
    ingredients?: Ingredient[]
}

