import { Room, Client } from "colyseus";
import {GameState} from "./schema/GameState";
import { Q ,QandACount} from './schema/constants'

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class MyRoom extends Room {
  maxClients = 4;

  async onCreate (options: any) {
    if (options.password) {
      this.setPrivate();
    }
    this.roomId = await this.generateRoomId();
    console.log("ChatRoom created!", options);

    this.onMessage("message", (client, message) => {
      console.log("ChatRoom received message from", client.sessionId, ":", message);
      this.broadcast("messages", `(${client.sessionId}) ${message}`);
    });

    this.onMessage("roomcreator", (client, data) => {
      console.log("ChatRoom received message from", client.sessionId, ":", data.value);
      if( data.value){
        this.state.players.get(client.sessionId).isRoomCreator=true
      }
      console.log('PlayerWhoCreatesRoom state in backend ', this.state.players.get(client.sessionId).isRoomCreator);
    });

    this.onMessage("ready", (client, data) => {
      console.log("onMessage ready received message from", client.sessionId, ":", data);
      this.state.ready = data.value;
      this.broadcast("readychange", {value:data.value});
      this.state.players.forEach((value, key) => {
          value.Question = Q[0];
          value.Questionno = 0 ;
          value.playerState = 'inplay'
          console.log("key =>", key)
          console.log("value =>", value.Question)
          console.log("value =>", value.Questionno)

      });
      console.log('ready state in backend', this.state.ready);
    });

    this.onMessage("answerforQ0", (client, data) => {
      console.log("onMessage ready received message from", client.sessionId, ":", data);
      var player = this.state.players.get(client.sessionId);
      if(data?.value){
        player.choice_of_adj_player=data.value
      }
      if(player.Questionno===0){
        player.Questionno = 1 
        player.Question = Q[1]
        console.log('player.Question ', player.Question);
        console.log('player.Questionno ', player.Questionno);
    }
    console.log("player.choice_of_adj_player",player.choice_of_adj_player);
    });

    this.onMessage("answer", (client, data) => {
      console.log("onMessage ready received message from", client.sessionId, ":", data);
      var player = this.state.players.get(client.sessionId);

      if(data?.value){
        data.value.forEach((element: { sessionId: string; }) => {
          if(element.sessionId!==client.sessionId){
            var otherplayer = this.state.players.get(element.sessionId);
            otherplayer.choice_of_adj_otherplayers[player.Questionno-1]+=1
            console.log('otherplayer.choice_of_adj_otherplayers',otherplayer.choice_of_adj_otherplayers);  
          }
        });
      }
    


      if(player.Questionno>0 && player.Questionno<QandACount-1){


        player.Questionno += 1 
        player.Question = Q[player.Questionno]
        console.log('player.Question ', player.Question);
        console.log('player.Questionno ', player.Questionno);
    }else{
        player.playerState="done"
        player.Questionno = -1 
        player.Question = ""
        console.log('player.Question ', player.Question);
        console.log('player.Questionno ', player.Questionno);
    }
    });

    this.onMessage("endgame", (client, data) => {
      console.log("onMessage ready received message from", client.sessionId, ":", data);
      if(data.value){
        this.state.ready = data.value;
        this.broadcast("readychange", {value:data.value});
      }
      console.log('ready state in backend', this.state.ready);
    });
    this.setState(new GameState())
  }

  onJoin (client: Client, options: any) {
    this.broadcast("messages", `${ client.sessionId } joined.`);
    client.send("status", "Welcome!", options);

    this.state.createPlayer(client.sessionId,options.name);
  }

  async onLeave (client: Client, consented: boolean) {
    this.broadcast("messages", `${ client.sessionId } left.`);

        console.log(client.sessionId, "left", { consented });
        try {
          if (consented) {
              /*
               * Optional:
               * you may want to allow reconnection if the client manually closed the connection.
               */
              throw new Error("left_manually");
          }
          console.log(' in onleave');

          await this.allowReconnection(client, 60);
          console.log("Reconnected!");

          client.send("status", "Welcome back!");
          this.broadcast("messages", `${ client.sessionId } joined.`);

      } catch (e) {
          this.state.removePlayer(client.sessionId);
          console.log(e);
      }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }



          // The channel where we register the room IDs.
    // This can be anything you want, it doesn't have to be `$mylobby`.
    LOBBY_CHANNEL = "$mylobby"

    // Generate a single 4 capital letter room ID.
    generateRoomIdSingle(): string {
        let result = '';
        for (var i = 0; i < 4; i++) {
            result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        }
        return result;
    }

    // 1. Get room IDs already registered with the Presence API.
    // 2. Generate room IDs until you generate one that is not already used.
    // 3. Register the new room ID with the Presence API.
    async generateRoomId(): Promise<string> {
        const currentIds = await this.presence.smembers(this.LOBBY_CHANNEL);
        let id;
        do {
            id = this.generateRoomIdSingle();
        } while (currentIds.includes(id));

        await this.presence.sadd(this.LOBBY_CHANNEL, this.roomId);
        return id;
    }

}
