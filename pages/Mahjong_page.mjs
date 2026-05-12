/*********************************************************/
//Mahjong_page.mjs
//written by Aston Noble
//started 28/04/2026
//updated 12/05/2026
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
        //this.calculatePonWaits(player1.sort())
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
        _hand = ['Dr','Dr','Dr','m2','m3','m4','m5','m6','m7','m8','m9','m9','m9']
        let ponWaits = this.calculatePonWaits(_hand)
        let kanWaits = this.calculateKanWaits(ponWaits)
        let chiWaits = this.calculateChiWaits(_hand)
        let tenpai = this.isTenpai(_hand,ponWaits,kanWaits)
        console.log('hand: '+_hand)
        console.log('pon waits: '+ponWaits)
        console.log('kan waits: '+kanWaits)
        console.log('chi waits: '+chiWaits)
        if (tenpai == false) console.log('てんぱいじゃない')
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
    //isTenpai(_hand)
    //
    //input _hand
    //=the hand to check tenpai for
    //
    //check if a hand is in tenpai
    /*****************************************************/
    isTenpai(_hand,_ponWaits) {
        var _handsnapshot = _hand.slice()
        let honors = []
        let pairWait = false
        let completedSets = 0
        while (0 < _handsnapshot.length && ((_handsnapshot[0][0] === 'D') || (_handsnapshot[0][0] === 'W'))) {
                honors.push(_handsnapshot.shift())
        }
        console.log('non honors: '+_handsnapshot)
        console.log('honors: '+honors)
        let singlehonors = 0
        let honorpairs = 0
        let honortrips = 0
        let counts = {}
        if (honors.length != 0) {
            for (let tile of honors) {
                counts[tile] = (counts[tile] || 0) + 1
            }
            Object.keys(counts).forEach(_tile => {
                if (counts[_tile] >=3) honortrips++
                else if (counts[_tile] == 2) honorpairs++
            })
            singlehonors = (honors.length - (2*honorpairs) - (3*honortrips))
            console.log(singlehonors)
            console.log(honorpairs)
            console.log(honortrips)
            completedSets = honortrips
            if (singlehonors > 1 || (singlehonors == 1 && honorpairs >= 1) || (honorpairs > 2)) {
                console.log('not tenpai')
                return false
            } else if (singlehonors == 1) {
                console.log('honor pair wait?')
                pairWait = true
            }
        }

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
        console.log(manzu,pinzu,souzu)
        if (manzu.length == 1) {
            if (pairWait = true) return false
            else pairWait = true
        }
        if (pinzu.length == 1) {
            if (pairWait = true) return false
            else pairWait = true
        }
        if (souzu.length == 1) {
            if (pairWait = true) return false
            else pairWait = true
        }
        //from here manage suits
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
        console.log(manzuCounts,pinzuCounts,souzuCounts,dragonCounts,windsCounts)
        completedSets = this.canFormTrips(manzuCounts,completedSets)
        completedSets = this.canFormTrips(pinzuCounts,completedSets)
        completedSets = this.canFormTrips(souzuCounts,completedSets)
        console.log('completed sets: '+completedSets)
        let possibleSeq = []
        //let possibleSeq = {'manzu':{0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0},
        //'pinzu':{0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0},
        //'souzu':{0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0}}
        //this.canFormSequences(manzuCounts,'manzu',possibleSeq)
        //this.canFormSequences(pinzuCounts,'pinzu',possibleSeq)
        //this.canFormSequences(souzuCounts,'souzu',possibleSeq)
        //console.log(possibleSeq)
        let possibleSets = possibleSeq.slice() 
        this.canFormSets(manzuCounts,'manzu',possibleSets)
        this.canFormSets(pinzuCounts,'pinzu',possibleSets)
        this.canFormSets(souzuCounts,'souzu',possibleSets)
        this.honorSetFinder(dragonCounts,'Dragon',possibleSets)
        this.honorSetFinder(windsCounts,'Winds',possibleSets)
        console.log(possibleSets)
        this.isDaShit(0,possibleSets,_hand)
        this.calculateSetWaits(0,possibleSets,_hand,_ponWaits)
        
    }

    /*****************************************************/
    //canFormTrips(_counts,_trips)
    //
    //input _counts
    //=the array that counts how many tiles in a suit
    //
    //searchs for valid sets
    /*****************************************************/
    canFormTrips(_counts,_trips) {
        let i = _counts.findIndex(c => c > 0)
        while (i < _counts.length - 1){
        if (i == -1) {console.log(_trips); break;}
        if (_counts[i] >= 3) {
            _trips++
        }
        i++
    }
    return _trips;
    }

    /*****************************************************/
    //canFormSequences(_counts,_trips)
    //
    //input _counts
    //=the array that counts how many tiles in a suit
    //
    //searchs for valid sets
    /*****************************************************/
    canFormSequences(_counts,_suit,_seqs) {
        for (let i = 0; i < 7; i++) {
            if ((_counts[i] >= 1) && (_counts[i+1] >= 1) && (_counts[i+2] >= 1)) {
                _seqs.push({[_suit]:{
                    [i]:1,
                    [i+1]:1,
                    [i+2]:1
                }})
            }
                //_seqs[_suit][i] += 1
               // _seqs[_suit][i+1] += 1
                //_seqs[_suit][i+2] += 1
        }
        return _seqs
    }

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

    isDaShit(_calledSets,_sets,_hand) { //calculate pair waits
        let _handsnap = _hand.slice()
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
    if (this.AsubsetB(_hand,poss)) {
        //console.log(poss);
        arr2.push(...this.AremoveB(_hand,poss))
    }
            }
        }
    }
}
console.log(this.removeDuplicates(arr2))
    }

removeDuplicates(arr) {
return [...new Set(arr)];
}
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
    AsubsetB(A,B) {
        const result = B.every(val => A.includes(val) 
        && B.filter(el => el === val).length
        <=
        A.filter(el => el === val).length
        );
        return result
    }
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

      calculateSetWaits(_calledSets,_sets,_hand,_ponWaits) { //calculate set waits
        let pairs = _ponWaits.slice()
        this.removeDuplicates(pairs)
        let _handsnap = _hand.slice()
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
    //console.log(...setb,...setc,pairs[d],pairs[d])
    poss.push(...setb,...setc,pairs[d],pairs[d])
    if (this.AsubsetB(_hand,poss)) {
        //console.log(this.AremoveB(_hand,poss) + poss);
        //console.log(this.AremoveB(_hand,poss))
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
console.log(this.removeDuplicates(arr2))
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