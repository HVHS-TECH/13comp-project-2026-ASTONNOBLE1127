/*********************************************************/
//Mahjong_page.mjs
//written by Aston Noble
//started 28/04/2026
//updated 29/04/2026
//mahjong class, makes the mahjong page
/*********************************************************/

/*********************************************************/
//imports
/*********************************************************/
import Page from "./Page.mjs"

export default class Mahjong_page extends Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //ID of the page
    static #PAGEID = "Mahjong_page"
    
    /*****************************************************/
    //prepareHTML()
    //
    //prepares the HTML for creation
    /*****************************************************/
    prepareHTML() {
        this.createDeck()
        return this.makeElement('div',{},[
            this.makeElement('button',{id:'join'}),
            this.makeElement('a',{id:'waitCount'}),
            this.makeElement('a',{id:'waitIndicator'})
        ])
    }

    /*****************************************************/
    //displayText()
    //
    //sets the text on the page and makes the buttons work
    /*****************************************************/
    displayText() {
        document.getElementById('join').innerHTML = 'join'
        document.getElementById('waitCount').innerHTML = '0'
        document.getElementById('join').onclick = () => {
            this.createDeck() // for testing
            document.getElementById('waitIndicator').appendChild(this.makeElement(
                'div',{id:'waitBox'},[this.makeElement('a',{id:'waiting'}),
                    this.makeElement('button',{id:'leave'})]
            ))
            document.getElementById('waiting').innerHTML = 'waiting'
            document.getElementById('leave').innerHTML = 'leave'
        }
    }

    /*****************************************************/
    //createDeck()
    //
    //creates the mahjong deck
    /*****************************************************/
    createDeck() {
        let deck = []
        for (let i = 0; i < 4; i++) {
            deck.push('Dg','Dr','Dw','Wh','Wm','Wn','Wk')
            for (let l = 1 ; l < 10; l++) {
                if (i == 3 && l == 5) deck.push('m5r','p5r','s5r')
                    else deck.push('m'+l,'p'+l,'s'+l)
            }
        }
        this.shuffleDeck(deck)
    }

    /*****************************************************/
    //shuffleDeck(_deck)
    //
    //input _deck
    //=the deck to shuffle
    //
    //shuffles the deck
    /*****************************************************/
    shuffleDeck(_deck) {
        for (let i = 0; i < (4*_deck.length);i++) {
            const x = Math.floor(Math.random() * (_deck.length))
            const y = Math.floor(Math.random() * (_deck.length))
            let p = _deck[x]
            let q = _deck[y]
            _deck[y] = p
            _deck[x] = q
        }
        this.cutDeck(_deck)
    }

    /*****************************************************/
    //cutDeck(_deck)
    //
    //input _deck
    //=the deck to cut
    //
    //splits the deck in half and swaps them
    /*****************************************************/
    cutDeck(_deck) {
        let i = Math.floor(Math.random() * _deck.length)
        let half = _deck.slice(0,i)
        _deck = _deck.slice(i,_deck.length)
        _deck = _deck.concat(half)
        console.log(_deck)
        this.deadWall(_deck)
    }

    /*****************************************************/
    //deadWall(_deck)
    //
    //input _deck
    //=the deck the take the dead wall from
    //
    //separates the dead wall from the deck
    /*****************************************************/
    deadWall(_deck) {
        let dora = {}
        let ura = {}
        let kan = {}
        for(let i = 0; i < 5; i++) {
            dora[i] = _deck.splice(0,1)[0]
            ura[i] = _deck.splice(0,1)[0]
        }
        for(let i = 1; i < 5; i++) kan[i] = _deck.splice(0,1)[0]
        console.log('dora tiles: '+dora,'ura dora tiles: '+ura,'kan draw tiles: '+kan,'wall: '+_deck)
        this.deal(_deck)
    }

    /*****************************************************/
    //deal(_deck)
    //
    //input _deck
    //=the deck to deal from
    //
    //deals tiles to each player
    /*****************************************************/
    deal(_deck) {
        let player1 = []
        let player2 = []
        let player3 = []
        let player4 = []
        for (let i = 0; i < 13; i++) {
            player1.push(_deck.splice(0,1)[0])
            player2.push(_deck.splice(0,1)[0])
            player3.push(_deck.splice(0,1)[0])
            player4.push(_deck.splice(0,1)[0])
        }
        console.log(player1,player2,player3,player4,_deck)
        console.log(player1.sort(),player2.sort(),player3.sort(),player4.sort(),_deck.sort())
        this.calculatePonWaits(player1.sort())
    }

    /*****************************************************/
    //calculateWaits(_hand)
    //
    //input _hand
    //=the hand to calculate waits for
    //
    //calculate the waits for a hand
    /*****************************************************
    calculateWaits(_hand) {
        let honors = []
        let waits = []
        for (let i = 0; i < _hand.length; i++) {
            if ((_hand[i].slice(0,1) == 'D') || (_hand[i].slice(0,1) == 'W')) {
                honors.push(_hand[i])
            } else break;
        }
        if (honors.length > 1) {
            for (let i = 0; i < honors.length - 1; i++) {
                if (honors[i] == honors[i + 1]) {
                    waits.push(honors[i])
                }
            }
        }
        console.log(waits)
    }
    */

    /*****************************************************/
    //calculatePonWaits(_hand)
    //
    //input _hand
    //=the hand to calculate pon waits for
    //
    //calculate the pon waits for a hand
    /*****************************************************/
    calculatePonWaits(_hand) {
        let ponWaits = []
        let kanWaits = []
        for (let i = 0; i < _hand.length - 1; i++) {
            if (_hand[i] == _hand[i + 1].slice(0,2)) {
                ponWaits.push(_hand[i])
            }
        }
        if (ponWaits.length > 1) {
            for (let i = 0; i < ponWaits.length - 1; i++) {
                if (ponWaits[i] == ponWaits[i + 1].slice(0,2)) {
                    kanWaits.push(ponWaits[i])
                }
            }
        }
        console.log('hand: '+_hand)
        console.log('pon waits: '+ponWaits)
        console.log('kan waits: '+kanWaits)
        this.calculateChiWaits(_hand)
    }

    /*****************************************************/
    //calculateChiWaits(_hand)
    //
    //input _hand
    //=the hand to calculate chi waits for
    //
    //calculate the chi waits for a hand
    /*****************************************************/
    calculateChiWaits(_hand) {
        let chiWaits = []
        for (let i = 0; i < _hand.length - 1; i++) {
            if (_hand[i].slice(0,1) == _hand[i + 1].slice(0,1)) {
                if ((Number(_hand[i].slice(1,2))+1) == Number(_hand[i+1].slice(1,2))) {
                    if (_hand[i].slice(1,2) == '1') chiWaits.push(_hand[i].slice(0,1)+3)
                    else if (_hand[i].slice(1,2) == '8') chiWaits.push(_hand[i].slice(0,1)+7)
                    else {
                        chiWaits.push(_hand[i].slice(0,1)+(Number(_hand[i].slice(1,2))-1))
                        chiWaits.push(_hand[i].slice(0,1)+(Number(_hand[i+1].slice(1,2))+1))
                    }
                } else if ((Number(_hand[i].slice(1,2))+2) == Number(_hand[i+1].slice(1,2))) {
                    chiWaits.push(_hand[i].slice(0,1)+(Number(_hand[i].slice(1,2))+1))
                }
            }
        }
        console.log('chi waits: '+chiWaits)
    }

    /*****************************************************/
    //getPageID()
    //
    //output
    //=page ID
    //
    //litterally just returns #PAGEID
    /*****************************************************/
    getPageID() {
        return Mahjong_page.#PAGEID
    }
}