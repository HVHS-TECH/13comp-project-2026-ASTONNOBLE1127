/*********************************************************/
//Mahjong_page.mjs
//written by Aston Noble
//started 28/04/2026
//updated 27/05/2026
//mahjong class, makes the mahjong page
/*********************************************************/

/*********************************************************/
//imports
/*********************************************************/
import Page from "./Page.mjs"
import {
    INSTANCES,
    CONTENT_MANAGER_INSTANCE,
    FB_IO_INSTANCE
} from "../controllers/Instance_vault.mjs"

export default class Mahjong_page extends Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //ID of the page
    static #PAGEID = "Mahjong_page"
    //lobby boolean
    #isInLobby = false
    //listener boolean
    #listenerIsOn = false
    
    /*****************************************************/
    //prepareHTML()
    //
    //prepares the HTML for creation
    /*****************************************************/
    prepareHTML() {
        //this.createDeck()
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
    async displayText() {
        let lobby = await this.lobbyCheck(false)
        if (lobby != false) this.makeLeaveButton(lobby)
        document.getElementById('waitCount').innerHTML = '0'
        document.getElementById('join').innerHTML = 'join'
        document.getElementById('join').onclick = () => {
            this.lobbyCheck(true)
        }
    }

   /*****************************************************/
    //makeLeaveButton(_ref)
    //
    //input _ref
    //=the path of the player in the lobby
    //
    //makes the leave button
    /*****************************************************/
    makeLeaveButton(_ref) {
        let str = _ref.slice(0,-16)
        document.getElementById('waitIndicator').appendChild(this.makeElement(
            'div',{id:'waitBox'},[this.makeElement('a',{id:'waiting'}),
            this.makeElement('button',{id:'leave'})]
        ))
        document.getElementById('waiting').innerHTML = 'waiting'
        document.getElementById('leave').innerHTML = 'leave'
        document.getElementById('leave').onclick = () => {
            this.#isInLobby = false
            document.getElementById('waiting').remove()
            document.getElementById('leave').remove()
            INSTANCES[FB_IO_INSTANCE].FB_Remove(_ref)
            this.#listenerIsOn = false
            INSTANCES[FB_IO_INSTANCE].FB_DestroyListener(str)
        }
        if (_ref.slice(-1) == '1' && this.#listenerIsOn == false) {
            this.#listenerIsOn = true
            INSTANCES[FB_IO_INSTANCE].FB_Listener(str,this.method0.bind(this))
        }
    }

    /*****************************************************/
    //lobbyCheck(_join)
    //
    //input _join
    //=whether tto join a lobby if they are not in one
    //
    //checks if the player is in a lobby
    /*****************************************************/
    async lobbyCheck(_join) {
        const UID = INSTANCES[FB_IO_INSTANCE].getUID()
        let j = 0
        let lobby
        for (let i = 1; i < 5; i++) {
            let ref = await INSTANCES[FB_IO_INSTANCE].FB_Finder('/lobbies/mahjong/',1,`players/player${i}`,UID)
            let refval = ref.val()
            if (refval != null) {j++; lobby = `/lobbies/mahjong/${Object.keys(refval)[0]}/players/player${i}`}
        }
        if (j < 1 && this.#isInLobby == false) {
            if (_join == true) {
                this.#isInLobby = true
                this.joinLobby(UID)
                return true
            } else this.#isInLobby = false; return false
        } else this.#isInLobby = true; return lobby
    }

    /*****************************************************/
    //joinLobby(UID)
    //
    //input UID
    //=the uid of the player
    //
    //makes the player join a lobby
    /*****************************************************/
    async joinLobby(UID) {
        let d = new Date();
        let D = d.getTime();
        let ref = await INSTANCES[FB_IO_INSTANCE].FB_Finder('/lobbies/mahjong/',1,'open','true')
        if (ref.val() == null) {
            INSTANCES[FB_IO_INSTANCE].FB_Write(`/lobbies/mahjong/lobby${UID}${D}`,{players:{player1:UID},open:'true'})
            this.makeLeaveButton(`/lobbies/mahjong/lobby${UID}${D}/players/player1`)
        } else {
            let j = 0
                let lobby = await INSTANCES[FB_IO_INSTANCE].FB_Read(`/lobbies/mahjong/${Object.keys(ref.val())[0]}/players/`)
                for (let i = 1; i < 5; i++) {
                    if (lobby != null) {
                        if (lobby[`player${i}`] == undefined) {
                            INSTANCES[FB_IO_INSTANCE].FB_Write(`/lobbies/mahjong/${Object.keys(ref.val())[0]}/players/`,{[`player${i}`]:UID})
                            this.makeLeaveButton(`/lobbies/mahjong/${Object.keys(ref.val())[0]}/players/player${i}`)
                            break;
                        }
                    } else {
                        INSTANCES[FB_IO_INSTANCE].FB_Remove(`/lobbies/mahjong/${Object.keys(ref.val())[0]}`)
                        j++
                    }
                }
                if (j > 0) this.joinLobby(UID);
            }
    }

    /*****************************************************/
    //
    /*****************************************************/
    async method0(_ref) {
        console.log(_ref)
        if (_ref == null) return
        let lobby = await this.lobbyCheck(false);
        console.log(lobby)
        if (INSTANCES[FB_IO_INSTANCE].getUID() == _ref['players'][`player${lobby.slice(-1)}`]) {
            console.log('true')
            console.log(Object.keys(_ref['players']).length == 4 && _ref['open'] == 'true')
            if (Object.keys(_ref['players']).length == 4 && _ref['open'] == 'true') {
                console.log('???')
                INSTANCES[FB_IO_INSTANCE].FB_Write(lobby.slice(0,-16),{open:"false"})
                this.createGame()
            }
        }
    }


    /*****************************************************/
    //createGame()
    //
    //
    /*****************************************************/
    createGame() {

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
        this.manageHand(player1.sort())
    }

    /*****************************************************/
    //manageHand(_hand)
    //
    //input _hand
    //=the hand to manage
    //
    //manages the hand
    /*****************************************************/
    manageHand(_hand) {
        //_hand = ['m1','m1','m1','m2','m3','m4','m5','m6','m7','m8','m9','m9','m9']
        //_hand = ['Dr','Dr','Dr','m2','m3','m4','m5','m6','m7','m8','m9','m9','m9']
        let ponWaits = this.calculatePonWaits(_hand)
        let kanWaits = this.calculateKanWaits(ponWaits)
        let chiWaits = this.calculateChiWaits(_hand)
        let tenpai = this.isTenpai(_hand,ponWaits)
        console.log('hand: '+_hand)
        console.log('pon waits: '+ponWaits)
        console.log('kan waits: '+kanWaits)
        console.log('chi waits: '+chiWaits)
        console.log('win waits: '+tenpai)
    }

    /*****************************************************/
    //calculatePonWaits(_hand)
    //
    //input _hand
    //=the hand to calculate pon waits for
    //
    //output
    //=an array of the triplets of the hand
    //
    //calculate the pon waits for a hand
    /*****************************************************/
    calculatePonWaits(_hand) {
        let ponWaits = []
        for (let i = 0; i < _hand.length - 1; i++) {
            if (_hand[i] == _hand[i + 1].slice(0,2)) {
                ponWaits.push(_hand[i])
            }
        }
        return ponWaits
    }

    /*****************************************************/
    //calculateKanWaits(_ponWaits)
    //
    //input _ponWaits
    //=the pon waits of the hand to calculate kan waits for
    //
    //output
    //=an array of the pairs of the hand
    //
    //calculate the kan waits for a hand
    /*****************************************************/
    calculateKanWaits(_ponWaits) {
        let kanWaits = []
        if (_ponWaits.length > 1) {
            for (let i = 0; i < _ponWaits.length - 1; i++) {
                if ((_ponWaits[i] == _ponWaits[i + 1].slice(0,2))/* && (_ponWaits[i + 1] != _ponWaits[i + 2].slice(0,2))*/) {
                    kanWaits.push(_ponWaits[i])
                }
            }
        }
        return kanWaits
    }

    /*****************************************************/
    //calculateChiWaits(_hand)
    //
    //input _hand
    //=the hand to calculate chi waits for
    //
    //output
    //=an array of the needed tiles to complete sequences
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
        return chiWaits
    }

    /*****************************************************/
    //isTenpai(_hand,_ponWaits)
    //
    //input _hand
    //=the hand to check tenpai for
    //input _ponWaits
    //=used for the pairs
    //
    //checks if a hand is in tenpai
    /*****************************************************/
    isTenpai(_hand,_ponWaits) {
        let dragons = []
        let winds = []
        let manzu = []
        let pinzu = []
        let souzu = []
        for (let i = 0; i < _hand.length; i++) {
            if (_hand[i][0] == 'D') {
                dragons.push(_hand[i])
            } else if (_hand[i][0] == 'W') {
                winds.push(_hand[i])
            } else if (_hand[i][0] == 'm') {
                manzu.push(_hand[i])
            } else if (_hand[i][0] == 'p') {
                pinzu.push(_hand[i])
            } else {
                souzu.push(_hand[i])
            }
        }
        let manzuCounts = [0,0,0,0,0,0,0,0,0]
        for (let tile of manzu) {
            manzuCounts[Number(tile[1])-1]++
        }
        let pinzuCounts = [0,0,0,0,0,0,0,0,0]
        for (let tile of pinzu) {
            pinzuCounts[Number(tile[1])-1]++
        }
        let souzuCounts = [0,0,0,0,0,0,0,0,0]
        for (let tile of souzu) {
            souzuCounts[Number(tile[1])-1]++
        }
        let dragonCounts = {['g']:0,['r']:0,['w']:0}
        for (let tile of dragons) {
            dragonCounts[tile[1]]++
        }
        let windsCounts = {['h']:0,['k']:0,['m']:0,['n']:0}
        for (let tile of winds) {
            windsCounts[tile[1]]++
        }
        let possibleSets = []
        this.canFormSets(manzuCounts,'manzu',possibleSets)
        this.canFormSets(pinzuCounts,'pinzu',possibleSets)
        this.canFormSets(souzuCounts,'souzu',possibleSets)
        this.honorSetFinder(dragonCounts,'Dragon',possibleSets)
        this.honorSetFinder(windsCounts,'Winds',possibleSets)
        let pairWaits = this.calculatePairWaits(0,possibleSets,_hand)
        let setWaits = this.calculateSetWaits(0,possibleSets,_hand,_ponWaits)
        pairWaits.push(...setWaits)
        if (pairWaits.length == 0) return false
            else return pairWaits //returns the combination of set and pair waits
    }

    /*****************************************************/
    //canFormSets(_counts,_suit,_sets)
    //
    //input _counts
    //=the object counting how many of each tile
    //input _suit
    //=the suit of the tiles
    //input _sets
    //=the array of possible sets for a hand
    //
    //output
    //=an object with the count of an suited set
    //
    //finds suited triplets and sequences
    /*****************************************************/
    canFormSets(_counts,_suit,_sets) {
        for (let i = 0; i < 9; i++) {
            if (_counts[i] >= 3) {
                _sets.push({[_suit]:{
                    [i]:3
                }})
            }
            if ((_counts[i] >= 1) && (_counts[i+1] >= 1) && (_counts[i+2] >= 1)) {
                _sets.push({[_suit]:{
                    [i]:1,
                    [i+1]:1,
                    [i+2]:1
                }})
            }
        }
        return _sets
    }

    /*****************************************************/
    //honorSetFinder(_counts,_type,_sets)
    //
    //input _counts
    //=the object counting how many of each honor
    //input _type
    //=the type of honor tile (dragon/wind)
    //input _sets
    //=the array of possible sets for a hand
    //
    //output
    //=an object with the count of an honor set
    //
    //finds honor triplets
    /*****************************************************/
    honorSetFinder(_counts,_type,_sets) {
        Object.keys(_counts).forEach(_key => {
            if (_counts[_key] >= 3) {
                _sets.push({[_type]:{
                    [_key]:3
                }})
            }
        })
        return _sets
    }

    /*****************************************************/
    //calculatePairWaits(_calledSets,_sets,_hand,_ponWaits) 
    //
    //input _calledSets
    //=the ammount of sets called
    //input _sets
    //=the possible sets for the hand
    //input _hand
    //=the hand to calculate the waits for
    //
    //output
    //=all the pair waits of the hand
    //
    //calculates the hands pair waits
    /*****************************************************/
    calculatePairWaits(_calledSets,_sets,_hand) {
        const arr = _sets.slice()
        let arr2 = []
        for (let a = 0; a < arr.length; a++) {
            let seta = this.makeSetArray(arr[a])
            for (let b = 0; b < arr.length; b++) {
                let setb = this.makeSetArray(arr[b])
                for (let c = 0; c < arr.length; c++) {
                    let setc = this.makeSetArray(arr[c])
                    for (let d = 0; d < arr.length; d++) {
                        let setd = this.makeSetArray(arr[d])
                        let poss = seta.slice()
                        poss.push(...setb,...setc,...setd)
                        if (this.AsupersetB(_hand,poss)) {
                            arr2.push(...this.AremoveB(_hand,poss))
                        }
                    }
                }
            }
        }
        return this.removeDuplicates(arr2)
    }

    /*****************************************************/
    //calculateSetWaits(_calledSets,_sets,_hand,_ponWaits) 
    //
    //input _calledSets
    //=the ammount of sets called
    //input _sets
    //=the possible sets for the hand
    //input _hand
    //=the hand to calculate the waits for
    //input _ponWaits
    //=the possible pairs for the hand
    //
    //output
    //=all the set waits of the hand
    //
    //calculates the hands set waits
    /*****************************************************/
    calculateSetWaits(_calledSets,_sets,_hand,_ponWaits) {
        let pairs = this.removeDuplicates(_ponWaits).slice()
        const arr = _sets.slice()
        let arr2 = []
        for (let a = 0; a < arr.length; a++) {
            let seta = this.makeSetArray(arr[a])
            for (let b = 0; b < arr.length; b++) {
                let setb = this.makeSetArray(arr[b])
                for (let c = 0; c < arr.length; c++) {
                    let setc = this.makeSetArray(arr[c])
                    for (let d = 0; d < _ponWaits.length; d++) {
                        let poss = seta.slice()
                        poss.push(...setb,...setc,pairs[d],pairs[d])
                        if (this.AsupersetB(_hand,poss)) {
                            if (this.AremoveB(_hand,poss).length ==1) {
                                arr2.push(this.AremoveB(_hand,poss))
                            } else {
                                arr2.push(...this.calculateChiWaits(this.AremoveB(_hand,poss)))
                            }
                        }
                    }
                }
            }
        }
        return this.removeDuplicates(arr2)
    }

    /*****************************************************/
    //removeDuplicates(_arr)
    //
    //input _arr
    //=the array to remove duplicates for
    //
    //output
    //=an array with duplicates removed
    //
    //removes duplicate entries from an array
    /*****************************************************/
    removeDuplicates(_arr) {
        return [...new Set(_arr)];
    }

    /*****************************************************/
    //makeSetArray(_set)
    //
    //input _set
    //=the set to turn into an array
    //
    //output 
    //=the array for a possible set
    //
    //makes the possible sets object into arrays
    /*****************************************************/
    makeSetArray(_set) {
        let setcounts = []
        let suit = Object.keys(_set)[0] 
        for (let i = 0; i < Object.keys(_set[suit]).length; i++) {
            for (let l = 0; l < _set[suit][Object.keys(_set[suit])[i]]; l++) {
                let temp = Object.keys(_set[suit])[i]
                if (!isNaN(temp)){
                    temp++
                }
                setcounts.push(suit[0]+ temp)
            }
        }
        return setcounts
    }

    /*****************************************************/
    //AsupersetB(A,B)
    //
    //input A
    //=the set to check
    //input B
    //=the subset to check
    //
    //output 
    //=true if B is a subset of A
    //=false if B is not a subset of A
    //
    //A ⊇ B: checks if A is a superset of B
    /*****************************************************/
    AsupersetB(A,B) {
        const result = B.every(val => A.includes(val) 
            && B.filter(el => el === val).length
            <=
            A.filter(el => el === val).length);
        return result
    }

    /*****************************************************/
    //AremoveB(A,B)
    //
    //input A
    //=the array to subtract from
    //input B
    //=the array of items to remove
    //
    //output
    //=the array with the result of A\B
    //
    //A\B: removes the values of B from A
    /*****************************************************/
    AremoveB(A,B) {
        let result = [...A];
        for (let item of B) {
            let index = result.indexOf(item);
            if (index !== -1) {
                result.splice(index, 1);
            }
        }
        return result
    }
    
    /*****************************************************/
    //calculatePoints(_han,_fu,_honba,_ron,_dealer)
    //
    //input _han
    //=the main score used in calculating points
    //input _fu
    //=the sub score used in calculating points
    //input _honba
    //=the repeat count
    //input _ron
    //=the type of win, true on ron, false on tsumo
    //input _dealer
    //=is the player dealer
    //
    //output
    //=the ammount of points to take from each person
    //
    //calculates the points for a hand
    /*****************************************************/
    calculatePoints(_han,_fu,_honba,_ron,_dealer) {
        const BASEPOINTS = _fu * (2 ^ (2 + _han))
        if (_ron == true) {
            if (_dealer == false) {
                points = BASEPOINTS * 4 + (_honba * 300)
            } else if (_dealer == true) {
                points = BASEPOINTS * 6 + (_honba * 300)
            }
        } else if (_dealer == true) {
            points = BASEPOINTS * 2 + (_honba * 100)
        } else {
            points.east = BASEPOINTS * 2 + (_honba * 100)
            points.child = BASEPOINTS + (_honba * 100)
        }
        points = 100 * Math.ceil(points/100)
        if (BASEPOINTS >= 2000) return false
            else return points
    }

    /*****************************************************/
    //manganHandler(_han,_honba,_ron,_dealer)
    //
    //input _han
    //=the main score used in calculating points
    //input _honba
    //=the repeat count
    //input _ron
    //=the type of win, true on ron, false on tsumo
    //input _dealer
    //=is the player dealer?
    //
    //output
    //=the ammount of points to take from each person
    //
    //handles point higher than the formula can handle
    /*****************************************************/
    manganHandler(_han,_honba,_ron,_dealer) {
        let basePoints
        let points
        if (_han <= 5) {basePoints = 2000
        } else if (_han <= 7) {basePoints = 3000
        } else if (_han <= 10) {basePoints = 4000
        } else if (_han <= 12) {basePoints = 6000
        } else if (_han >= 13) {basePoints = 9000}
        if (_ron == true) {
            points = basePoints * 4 + (_honba * 300)
            if (_dealer = true) points = basePoints * 6 + (_honba * 300)
        } else {
            if (_dealer = false) {
                points.east = basePoints * 2 + (_honba * 100)
                points.child = basePoints + (_honba * 100)
            } else points = basePoints * 2 + (_honba * 100)
        }
        return points
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