import Service from '@ember/service';
import { tracked } from 'tracked-built-ins';
import { isArray } from '@ember/array';
import GameMeta from '../models/game_meta';
import Move from '../models/move';

import { inject as service } from '@ember/service';


function extractRelationships(object) {
    let relationships = {};

    for (let relationshipName in object) {
        relationships[relationshipName] = object[relationshipName].links.related;
    }

    return relationships;
}

export default class ChessService extends Service {
    @tracked storage = {};
    @service('websockets') websockets;

    constructor() {
        super(...arguments);
        this.storage.games = tracked({});
        this.storage.moves = tracked({});

        const socket = this.websockets.socketFor(`ws://${window.location.hostname}:8080/`);

        socket.on('open', this.myOpenHandler.bind(this));
        socket.on('message', this.myMessageHandler.bind(this));
        socket.on('close', this.myCloseHandler.bind(this));

        this.socketRef = socket;
    }

    myOpenHandler(event) {
        console.log(`On open event has been called:`, event);
        this.socketRef.send("Hallo ws!");
    }

    myMessageHandler(event) {
        console.log(`Message: ${event.data}`);
    }

    myCloseHandler(event) {
        console.log(`On close event has been called:`, event);
    }

    async fetchAll(url) {
        const fetches = [];
        let response = await fetch(url); // Fetch
        console.log(url, response);
        let { data } = await response.json();
        console.log('fetchall', data);
        for (let entity of data) {
            console.log(entity);
            fetches.push(await this.load(entity));
        }

        return fetches;
    }

    async fetch(type, id) {
        if (type === 'games') {
            let game;
            if (this.storage.games[id]) {
                // Check cache
                game = this.storage.games[id];
            } else {
                let response = await fetch('/games/' + id); // Fetch
                let json = await response.json();
                game = this.load(json);
            }

            return game;
        }

        if (type === 'moves') {
            console.error('Who would do something like this??');
            if (this.storage.moves[id])
                // Check cache
                return this.storage.moves[id];
            let response = await fetch('/moves/' + id); // Fetch
            let json = await response.json();
            return this.load(json);
        }
    }

    async load(data) {
        let { id, type, attributes, relationships } = data;
        const res = type === 'games' ? this.storage.games : this.storage.moves;
        let rels = extractRelationships(relationships);

        if (res[id]) {
            Object.assign(res[id], attributes); // Update
        } else {
            if (type === 'games') {
                res[id] = new GameMeta({ id, ...attributes }, rels, this);
            }

            if (type === 'moves') {
                res[id] = new Move({ id, ...attributes }, rels);
            }
        }

        if (type === 'games') res[id].moves = await this.fetchAll(rels.moves);

        return res[id];
    }

    async create() {
        const payload = {
            data: {
                type: 'games',
                attributes: {
                    start: 'rnbqk1nr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                },
                relationships: {},
            },
        };

        let response = await fetch('/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(payload),
        });

        let { data } = await response.json();
        return await this.load(data);
    }

    async move(id, move = { fromx: 0, fromy: 0, tox: 0, toy: 0 }) {
        const payload = {
            data: {
                type: 'moves',
                attributes: move,
                relationships: {
                    game: { data: { id, type: 'games' } },
                },
            },
        };

        let response = await fetch('/moves', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.api+json',
            },
            body: JSON.stringify(payload),
        });

        let { data } = await response.json();
        return await this.load(data);
    }
}
