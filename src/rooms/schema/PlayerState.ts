import {ArraySchema, Schema, type} from "@colyseus/schema";
import { QandACount } from './constants'
import { Q } from './constants'

export class Player extends Schema {
    
    @type("string" )
    Question: string;

    @type("number" )
    Questionno: number;

    @type("string")
    playerName: string;

    @type("string" )
    playerState: string;
    
    @type("boolean")
    isRoomCreator: boolean;

    @type(["boolean"] )
    choice_of_adj_player: boolean[];

    @type(["number"] )
    choice_of_adj_otherplayers: number[];

    constructor(playerName: string = "" ) {
        super();
        this.Question = '';
        this.Questionno = 0;
        this.playerName = playerName;
        this.playerState = 'idle';
        this.isRoomCreator = false;
        this.choice_of_adj_otherplayers = new ArraySchema<number>(...(new Array<number>(QandACount-1).fill(0)));
    }
}