
import {Schema, type,MapSchema,ArraySchema} from "@colyseus/schema";
import {Player} from "./PlayerState";
// import {Question} from "./QuestionsState";
import { Adjectives_ } from './constants'

export class GameState extends Schema {

  @type({ map: Player })
  players = new MapSchema<Player>();

  @type("string")
  ready: string;

  @type([ "string" ])
  Adjectives: string[];

  constructor() {
    super();
    this.ready = 'pending' ;
    this.Adjectives = new ArraySchema<string>(...Adjectives_);
  } 
  createPlayer(sessionId: string,playerName: string) {
    this.players.set(sessionId, new Player(playerName));
  }

  removePlayer(sessionId: string) {
    if (this.players.has(sessionId)) {
      this.players.delete(sessionId);
  }
  }
}
