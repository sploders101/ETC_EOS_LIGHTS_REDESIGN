import {boardAPI} from './board';

export interface plugin {
    enabled: boolean;
    includes: {
        ui?: {
            settings?: string // Vue cards for settings window
        },
        node?: {
            board?: boardAPI // Middleware to use for communication
        }
    }
}