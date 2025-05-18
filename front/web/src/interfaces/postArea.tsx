export interface TriggerReactionParameters {
    name: string;
    input: string;
    optional?: boolean
}

export interface TriggerReaction {
    service: string;
    name: string;
    parameters: TriggerReactionParameters[];
}

export interface postService {
    _id: string
    trigger: TriggerReaction;
    isActive: boolean
    actions: TriggerReaction[];
    area_description?: string
}

export function getLocalSelectedArea(): postService {
    let currArea: postService = JSON.parse(localStorage.getItem('selectedArea') || 'null')
    if (currArea)
        return (currArea)
    else
        return (
            {
                _id: '',
                trigger: {
                    service: '',
                    name: '',
                    parameters: []
                },
                isActive: true,
                actions: [
                    {
                        service: '',
                        name: '',
                        parameters: []
                    }
                ]
            })
}
