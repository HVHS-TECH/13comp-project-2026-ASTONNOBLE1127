/*********************************************************/
//Mahjong_page.mjs
//written by Aston Noble
//started 28/04/2026
//updated 09/06/2026
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
    //lobby
    #currentLobby
    //current player
    #currentPlayer
    //has discarded
    #hasDiscarded
    //play order
    #playOrder = {playOrder:false}
    //call count
    #callCount = 0
    
    /*****************************************************/
    //prepareHTML()
    //
    //prepares the HTML for creation
    /*****************************************************/
    prepareHTML() {
        //this.createDeck()
        return this.makeElement('div',{},[
                this.makeElement('div',{id:'joindiv'},[
                this.makeElement('button',{id:'join'}),
                this.makeElement('a',{id:'waitCount'}),
                this.makeElement('a',{id:'waitIndicator'})
            ]),
            this.makeElement('p',{id:'position'}),
            this.makeElement('a',{id:'discardDiv'}),
            this.makeElement('p',{id:'stealIndicator'}),
            this.makeElement('a',{id:'hand'})
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
        document.getElementById('waitCount').innerHTML = '0 players in waitlist'
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
        //this.manageHand(['m5'])
        this.#currentLobby = _ref.slice(0,-16)
        document.getElementById('joindiv').appendChild(/*this.makeElement(
            'div',{id:'waitBox'},[/*this.makeElement('a',{id:'waiting'}),*/
            this.makeElement('button',{id:'leave'})/*]
        )*/)
        //document.getElementById('waiting').innerHTML = 'waiting'
        document.getElementById('leave').innerHTML = 'leave'
        document.getElementById('leave').onclick = async () => {
            await INSTANCES[FB_IO_INSTANCE].FB_DestroyListener(this.#currentLobby)
            this.#isInLobby = false
            //document.getElementById('waiting').remove()
            document.getElementById('leave').remove()
            INSTANCES[FB_IO_INSTANCE].FB_Remove(_ref)
            this.#listenerIsOn = false
            INSTANCES[FB_IO_INSTANCE].FB_Write(this.#currentLobby,{open:"true"})
            document.getElementById('waitCount').innerHTML = '0 players in waitlist'
        }
        if (!isNaN(_ref.slice(-1)) && this.#listenerIsOn == false) {
            this.#listenerIsOn = true
            INSTANCES[FB_IO_INSTANCE].FB_Listener(this.#currentLobby,this.method0.bind(this))
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
            this.#currentPlayer = 'player1'
            INSTANCES[FB_IO_INSTANCE].FB_Listener(`${this.#currentLobby}/hands/${this.#currentPlayer}`,this.displayHand.bind(this))
            INSTANCES[FB_IO_INSTANCE].FB_Listener(`${this.#currentLobby}/wins`,this.manageWin.bind(this))
            INSTANCES[FB_IO_INSTANCE].FB_Listener(`${this.#currentLobby}/discards`,this.displayDiscards.bind(this))
            INSTANCES[FB_IO_INSTANCE].FB_Listener(`${this.#currentLobby}/calls`,this.displayDiscards.bind(this))
            this.#callCount = 0
        } else {
            let j = 0
                let lobby = await INSTANCES[FB_IO_INSTANCE].FB_Read(`/lobbies/mahjong/${Object.keys(ref.val())[0]}/players/`)
                for (let i = 1; i < 5; i++) {
                    if (lobby != null) {
                        if (lobby[`player${i}`] == undefined) {
                            INSTANCES[FB_IO_INSTANCE].FB_Write(`/lobbies/mahjong/${Object.keys(ref.val())[0]}/players/`,{[`player${i}`]:UID})
                            this.makeLeaveButton(`/lobbies/mahjong/${Object.keys(ref.val())[0]}/players/player${i}`)
                            this.#currentPlayer = `player${i}`
                            INSTANCES[FB_IO_INSTANCE].FB_Listener(`${this.#currentLobby}/hands/${this.#currentPlayer}`,this.displayHand.bind(this))
                            INSTANCES[FB_IO_INSTANCE].FB_Listener(`${this.#currentLobby}/wins`,this.manageWin.bind(this))
                            INSTANCES[FB_IO_INSTANCE].FB_Listener(`${this.#currentLobby}/discards`,this.displayDiscards.bind(this))
                            INSTANCES[FB_IO_INSTANCE].FB_Listener(`${this.#currentLobby}/calls`,this.displayDiscards.bind(this))
                            this.#callCount = 0  //this place will need to be changed
                            break;
                        } else if (i == 4) {
                            INSTANCES[FB_IO_INSTANCE].FB_Write(`/lobbies/mahjong/${Object.keys(ref.val())[0]}/`,{open:"false"})
                            this.joinLobby(UID)
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
        if (_ref == null) return
        if (_ref['players'] == null) return
        //let lobby = await this.lobbyCheck(false);
        //console.log(lobby?.slice(-1),lobby.slice(-1))
        //console.log('fuck you')
        if (INSTANCES[FB_IO_INSTANCE].getUID() == _ref['players'][this.#currentPlayer]) {
            document.getElementById('waitCount').innerHTML = Object.keys(_ref['players']).length + ' players in waitlist'
        } else {
            document.getElementById('waitCount').innerHTML = '0 players in waitlist'
        }
        if (INSTANCES[FB_IO_INSTANCE].getUID() == _ref['players'][`player1`]) {
            if (Object.keys(_ref['players']).length == 4 && _ref['open'] == 'true') {
                console.log('kill yourself now')
                INSTANCES[FB_IO_INSTANCE].FB_Write(this.#currentLobby,{open:"false"})
                this.createGame()
            }
        }
    }

    /*****************************************************/
    //displayHand()
    /*****************************************************/
    async displayHand() {
        if (document.getElementById('handDiv')) {
            //document.getElementById('handDiv').remove()
            document.querySelectorAll('#handDiv').forEach(_el => _el.remove())
        }
        //console.log(`${this.#currentLobby}/hands/${this.#currentPlayer}`)
        let val = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/hands/${this.#currentPlayer}`)
        let handtiles = []
        if (Object.values(val).length >= 13) this.#callCount = 0
        if (val == null) return
        //if (this.#playOrder['playOrder'] == false) this.playOrder['playOrder'] = 
        //console.log(await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/playOrder`))
        let pla = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/playOrder`)
        //pla[0] = 'timmy'
        this.#playOrder = {playOrder:pla}
        const POSITION = Object.keys(this.#playOrder['playOrder']).find(POSITION => 
            this.#playOrder['playOrder'][POSITION] === this.#currentPlayer);
        document.getElementById('position').innerHTML = POSITION
        INSTANCES[FB_IO_INSTANCE].FB_Listener(`${this.#currentLobby}/skips/${POSITION}`,this.manageSkips.bind(this))
        val.forEach(_tile => {
            handtiles.push(this.makeElement('button',{
                textContent:_tile,id:_tile,class:'tile','data-value':_tile},[
                    this.makeElement('img',{src:`./mahjong_tiles/${_tile}.png`,alt:_tile,'data-value':_tile})]))
        })
        let correctLength = false
        document.getElementById('hand').appendChild(this.makeElement('div',{id:'handDiv'},handtiles))
        document.querySelectorAll('.tile').forEach(async _el => {
            //_el.innerHTML = _el.getAttribute('data-value')
            _el.addEventListener("click", (e) => {this.discard(e,val)});
            //if (this.#hasDiscarded == true) 
            if (![14,11,8,5,2].includes(val.length)) {_el.setAttribute("disabled", true)
            } else {
                correctLength = true
            }
        })
        if (correctLength == true) {
            let waits = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/waits/${this.#currentPlayer}/waits`)
            console.log(waits)
            console.log(this.#callCount)
            if (waits != false) {
                if (waits.includes(val[val.length - 1])) this.makeTsumoButton(val[val.length - 1])
            }
        }
        this.displayDiscards()
    }

    /*****************************************************/
    //discard(_tile)
    /*****************************************************/
    async discard(_tile,_bronchitis) {
        let val = _tile['target'].getAttribute('data-value')
        this.#hasDiscarded = true
        let d = new Date();
        let D = d.getTime();
        for (let i = 0; i < _bronchitis.length; i++) {
            if (_bronchitis[i] ==  val) {
                _bronchitis.splice(i,1)
                break;
            }
        }
        await INSTANCES[FB_IO_INSTANCE].FB_Set(`${this.#currentLobby}/hands/${this.#currentPlayer}`,_bronchitis.sort())
        await INSTANCES[FB_IO_INSTANCE].FB_Write(
            `${this.#currentLobby}/discards/${this.#currentPlayer}`,
            {[d.getTime()]:val})
        _tile['target'].remove()
        this.checkWaits(val)
        let waits = await this.manageHand(_bronchitis.sort())
        console.log('bronchitis',_bronchitis,waits)
        await INSTANCES[FB_IO_INSTANCE].FB_Write(`${this.#currentLobby}/waits/${this.#currentPlayer}`,waits)
        //this.pickUp()
        this.displayHand()
    }

    /*****************************************************/
    //checkWaits(_tile)
    /*****************************************************/
    async checkWaits(_tile) {
        let skips = {1:true,2:true,3:true,4:true}
        let waits = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/waits/`)
        console.log(waits)
        console.log(this.#playOrder)
        const POSITION = Object.keys(this.#playOrder['playOrder']).find(POSITION => 
            this.#playOrder['playOrder'][POSITION] === this.#currentPlayer);
            console.log(POSITION)
        let nextPlayer = Number(POSITION) + 1
        if (nextPlayer == 5) nextPlayer = 1
        for (let i = 0; i < 3; i++) {
            let otherPlayers = i + nextPlayer
            if (otherPlayers > 4) otherPlayers-=4
            //console.log(waits[this.#playOrder['playOrder'][otherPlayers]],otherPlayers)
            //console.log(waits[this.#playOrder['playOrder'][otherPlayers]].ponWaits)
            if (waits[this.#playOrder['playOrder'][otherPlayers]].ponWaits?.includes(_tile.slice(0,2))) skips[otherPlayers] = false
            if (waits[this.#playOrder['playOrder'][otherPlayers]].kanWaits?.includes(_tile.slice(0,2))) skips[otherPlayers] = false
            if (waits[this.#playOrder['playOrder'][otherPlayers]].waits != false) {
                if (waits[this.#playOrder['playOrder'][otherPlayers]].waits?.includes(_tile.slice(0,2))) skips[otherPlayers] = false
            }
        }
        console.log(waits[this.#playOrder['playOrder'][nextPlayer]].chiWaits?.includes(_tile.slice(0,2)))
        console.log(waits[this.#playOrder['playOrder'][nextPlayer]].chiWaits,_tile.slice(0,2))
        console.log(waits,this.#playOrder['playOrder'],nextPlayer)
        if (waits[this.#playOrder['playOrder'][nextPlayer]].chiWaits?.includes(_tile.slice(0,2))) skips[nextPlayer] = false
        console.log(skips)
        INSTANCES[FB_IO_INSTANCE].FB_Write(this.#currentLobby,{skips:skips})
        INSTANCES[FB_IO_INSTANCE].FB_Listener(`${this.#currentLobby}/skips/`,this.skipWaits.bind(this))
    }

    //
    //skipWaits
    //
    skipWaits(_skips) {
        if (_skips.includes(false) == false) {
            INSTANCES[FB_IO_INSTANCE].FB_DestroyListener(`${this.#currentLobby}/skips`)
            if (Object.values(_skips).some(x => x !== true)) {
                //alert('taken')
                //INSTANCES[FB_IO_INSTANCE].FB_Remove(`${this.#currentLobby}/skips`)
                //handle calls in priority order
                //e.g. (ron,kan/pon,chi)
            } else {
                //alert('skipped')
                this.pickUp()
                INSTANCES[FB_IO_INSTANCE].FB_Remove(`${this.#currentLobby}/skips`)
            }
        }
    }

    /*****************************************************/
    //pickUp()
    /*****************************************************/
    async pickUp() {
        //console.log('picked up')
        const POSITION = Object.keys(this.#playOrder['playOrder']).find(POSITION => 
            this.#playOrder['playOrder'][POSITION] === this.#currentPlayer);
        let nextPlayer = Number(POSITION) + 1
        if (nextPlayer == 5) nextPlayer = 1
        INSTANCES[FB_IO_INSTANCE].FB_Write(`${this.#currentLobby}`,{turn:nextPlayer})
        let tile = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/deck/`)
        let drawn = tile[tile.length - 1]
        let nextHand = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/hands/${this.#playOrder['playOrder'][nextPlayer]}`)
        INSTANCES[FB_IO_INSTANCE].FB_Remove(`${this.#currentLobby}/deck/${tile.length-1}`)
        await INSTANCES[FB_IO_INSTANCE].FB_Write(`${this.#currentLobby}/hands/${this.#playOrder['playOrder'][nextPlayer]}`,{[nextHand.length]:drawn})
        this.displayHand()
    }

    //
    //manageSkips(_val)
    //
    async manageSkips(_val) {
        if (_val == false && !document.getElementById('skip')) {
            const POSITION = Object.keys(this.#playOrder['playOrder']).find(POSITION => 
                this.#playOrder['playOrder'][POSITION] === this.#currentPlayer);
            //console.log(POSITION)
            let el = await this.makeElement('button',{id:'skip'})
            if (!document.getElementById('skip')) {
                await document.getElementById('stealIndicator').append(el)
                document.getElementById('skip').innerHTML = 'skip'
                document.getElementById('skip').onclick = () => {
                    document.querySelectorAll('.steal').forEach(_el => _el.remove())
                    document.getElementById('skip').remove()
                    INSTANCES[FB_IO_INSTANCE].FB_Write(`${this.#currentLobby}/skips/`,{[POSITION]:true})
                }
                let turn = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/turn`)
                let temp = await INSTANCES[FB_IO_INSTANCE].FB_SortedRead(
                    `${this.#currentLobby}/discards/${this.#playOrder['playOrder'][turn]}`,false,1,false)
                    let currentDiscard = temp.val()
                    console.warn(Object.values(currentDiscard)[0])
                let waits = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/waits/${this.#currentPlayer}`)
                let turnOverlap = Number(turn) + 1
                if (turnOverlap == 5) turnOverlap = 1
                console.log(this.#playOrder['playOrder'][turnOverlap] == this.#currentPlayer,waits.chiWaits?.includes(Object.values(currentDiscard)[0]))
                console.log(turnOverlap,)
                if (this.#playOrder['playOrder'][turnOverlap] == this.#currentPlayer) {
                    if (waits.chiWaits?.includes(Object.values(currentDiscard)[0].slice(0,2))) this.makeStealButton(currentDiscard,'chi',turn)
                }
                if (waits.kanWaits?.includes(Object.values(currentDiscard)[0].slice(0,2))) this.makeStealButton(currentDiscard,'kan',turn)
                if (waits.ponWaits?.includes(Object.values(currentDiscard)[0].slice(0,2))) this.makeStealButton(currentDiscard,'pon',turn)
                if (waits.waits != false) {
                    if (waits.waits?.includes(Object.values(currentDiscard)[0].slice(0,2))) this.makeStealButton(currentDiscard,'ron',turn)
                }
            }
        }
    }

    //
    //
    //
    async makeTsumoButton(_tile) {
        document.querySelectorAll('.tile').forEach(_el => _el.setAttribute('disabled',true))
        let el = await this.makeElement('button',{id:'skip'})
        await document.getElementById('stealIndicator').append(el)
        document.getElementById('skip').innerHTML = 'skip'
        let el2 = await this.makeElement('button',{id:'tsumo','data-value':_tile})
        await document.getElementById('stealIndicator').append(el2)
        document.getElementById('tsumo').innerHTML = 'tsumo'
        el.onclick = () => {
            el.remove()
            el2.remove()
            document.querySelectorAll('.tile').forEach(_el => _el.setAttribute('disabled',false))
        }
        el2.onclick = async () => {
            el.remove()
            el2.remove()
            //do something here lol
            INSTANCES[FB_IO_INSTANCE].FB_Write(this.#currentLobby,{wins:{'tsumo':this.#currentPlayer}})
            let UID = INSTANCES[FB_IO_INSTANCE].getUID()
                let userwins = await INSTANCES[FB_IO_INSTANCE].FB_Read(`leaderboards/mahjong/${UID}`)
                console.log(userwins)
                if (userwins == null) userwins = {wins:0}
                if (!isNaN(userwins['wins'])) userwins['wins'] = userwins['wins'] + 1
                    else userwins['wins'] = 1
                INSTANCES[FB_IO_INSTANCE].FB_Write(`leaderboards/mahjong/${UID}`,userwins)
        }
    }

    //
    //makeStealButton(_tile,_type,_from)
    //
    async makeStealButton(_tile = {},_type,_from) {
        const POSITION = Object.keys(this.#playOrder['playOrder']).find(POSITION => 
            this.#playOrder['playOrder'][POSITION] === this.#currentPlayer);
        await document.getElementById('stealIndicator').append(await this.makeElement('button',{
            id:_type,'data-value':Object.values(_tile)[0],class:'steal','from':_from}))
        document.getElementById(_type).innerHTML = _type +' '+_from
        document.getElementById(_type).onclick = async () => {
            INSTANCES[FB_IO_INSTANCE].FB_Write(`${this.#currentLobby}/skips/`,{[POSITION]:_type})
            INSTANCES[FB_IO_INSTANCE].FB_Listener(`${this.#currentLobby}/skips`,this.steal.bind(this))
            document.querySelectorAll('.steal').forEach(_el => _el.remove())
            document.getElementById('skip').remove()
        }
    }

    //
    //steal
    //
    async steal(_val) {
        let turn = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/turn`)
        if (_val.includes(false) == false) {
            INSTANCES[FB_IO_INSTANCE].FB_DestroyListener(`${this.#currentLobby}/skips`)
            const POSITION = Object.keys(this.#playOrder['playOrder']).find(POSITION => 
                this.#playOrder['playOrder'][POSITION] === this.#currentPlayer);
            let _type = _val[POSITION]
            let typeval
            let enemtypeval = 0
            if (_type == 'chi') typeval = 1
            if (_type == 'pon') typeval = 2
            if (_type == 'kan') typeval = 3 //this shouldn't need to be higher than pon but idk
            if (_type == 'ron') typeval = 4
            // await _val.forEach(vali => {
            // if (vali == 'chi') enemtypeval = 1
            // if (vali == 'pon') enemtypeval = 2
            // if (vali == 'kan') enemtypeval = 3 //this shouldn't need to be higher than pon but idk
            // if (vali == 'ron') enemtypeval = 4
            // // })
            // for (let vali of _val) {
            // if (vali == 'chi') enemtypeval = 1
            // if (vali == 'pon') enemtypeval = 2
            // if (vali == 'kan') enemtypeval = 3 //this shouldn't need to be higher than pon but idk
            // if (vali == 'ron') enemtypeval = 4
            // }
            if (_val.includes('ron')) enemtypeval = 4
            if (_val.includes('kan')) enemtypeval = 3
            if (_val.includes('pon')) enemtypeval = 2
            console.log(typeval,enemtypeval)
            if (typeval >= enemtypeval) {
            let temp = await INSTANCES[FB_IO_INSTANCE].FB_SortedRead(
                `${this.#currentLobby}/discards/${this.#playOrder['playOrder'][turn]}`,false,1,false)
            let _tile = temp.val()
            INSTANCES[FB_IO_INSTANCE].FB_Write(this.#currentLobby,{turn:POSITION})
            let hand = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/hands/${this.#currentPlayer}`)
            INSTANCES[FB_IO_INSTANCE].FB_Write(`${this.#currentLobby}/skips/`,{[POSITION]:_type})
            if (_type == 'chi') {
                let chi = await this.checkChi(Object.values(_tile)[0])
                console.log(chi)
                //chi = [chi[0]] //remove this later 
                if (chi.length == 1) {
                    let newHand = this.AremoveB(hand,chi[0])
                    console.log(chi[0],hand,newHand)
                    chi[0].push(Object.values(_tile)[0])
                    await INSTANCES[FB_IO_INSTANCE].FB_Set(`${this.#currentLobby}/hands/${this.#currentPlayer}`,newHand)
                    let jim = {}
                    jim[this.#callCount] = chi[0]
                    INSTANCES[FB_IO_INSTANCE].FB_Write(`${this.#currentLobby}/calls/${this.#currentPlayer}`,jim)
                } else if (chi.length > 0) {
                    let possibleChi = []
                    chi.forEach(_set => {
                        possibleChi.push(this.makeElement('button',{class:'chiOptions','data-value':JSON.stringify(_set)},[
                            this.makeElement('img',{src:`./mahjong_tiles/${_set[0]}.png`}),
                            this.makeElement('img',{src:`./mahjong_tiles/${_set[1]}.png`})
                        ]))
                    })
                    console.log(possibleChi)
                    document.getElementById('stealIndicator').append(this.makeElement('div',{id:'chiOptionDiv'},possibleChi))
                    document.querySelectorAll('.chiOptions').forEach(_el => {
                        _el.onclick = async () => {
                            let newChi = JSON.parse(_el.getAttribute('data-value'))
                            let newHand = this.AremoveB(hand,newChi)
                            document.querySelectorAll('.chiOptions').forEach(_div => _div.remove())
                            console.log(newChi,hand,newHand)
                            newChi.push(Object.values(_tile)[0])
                            await INSTANCES[FB_IO_INSTANCE].FB_Set(`${this.#currentLobby}/hands/${this.#currentPlayer}`,newHand)
                            let jim = {}
                            jim[this.#callCount] = newChi
                            INSTANCES[FB_IO_INSTANCE].FB_Write(`${this.#currentLobby}/calls/${this.#currentPlayer}`,jim)
                        }
                    })
                }
            }
            if (_type == 'kan') {
                let kan = [Object.values(_tile)[0],Object.values(_tile)[0],Object.values(_tile)[0]]
                let newHand = this.AremoveB(hand,kan)
                if (newHand.length != (hand.length - kan.length)) {
                    kan[0] = Object.values(_tile)[0] + 'r'
                    newHand = this.AremoveB(hand,kan)
                }
                kan.push(Object.values(_tile)[0])
                await INSTANCES[FB_IO_INSTANCE].FB_Set(`${this.#currentLobby}/hands/${this.#currentPlayer}`,newHand)
                let jim = {}
                jim[this.#callCount] = kan
                INSTANCES[FB_IO_INSTANCE].FB_Write(`${this.#currentLobby}/calls/${this.#currentPlayer}`,jim)
                this.kanDraw()
            }
            if (_type == 'pon') {
                let pon = [Object.values(_tile)[0].slice(0,2),Object.values(_tile)[0].slice(0,2)]
                let newHand = this.AremoveB(hand,pon)
                if (newHand.length != (hand.length - pon.length)) {
                    if (Object.values(_tile)[0].slice(2,3) != 'r') {
                        pon[0] = Object.values(_tile)[0] + 'r'
                        newHand = this.AremoveB(hand,pon)
                    } else alert('critical error')
                }
                pon.push(Object.values(_tile)[0])
                await INSTANCES[FB_IO_INSTANCE].FB_Set(`${this.#currentLobby}/hands/${this.#currentPlayer}`,newHand)
                let jim = {}
                jim[this.#callCount] = pon
                INSTANCES[FB_IO_INSTANCE].FB_Write(`${this.#currentLobby}/calls/${this.#currentPlayer}`,jim)
            }
            if (_type == 'ron') {
                //do something here lol
                INSTANCES[FB_IO_INSTANCE].FB_Write(this.#currentLobby,{wins:{[POSITION]:this.#currentPlayer}})
                let UID = INSTANCES[FB_IO_INSTANCE].getUID()
                let userwins = await INSTANCES[FB_IO_INSTANCE].FB_Read(`leaderboards/mahjong/${UID}`)
                console.log(userwins)
                if (userwins == null) userwins = {wins:0}
                if (!isNaN(userwins['wins'])) userwins['wins'] = userwins['wins'] + 1
                    else userwins['wins'] = 1
                    userwins['uid'] = UID
                INSTANCES[FB_IO_INSTANCE].FB_Write(`leaderboards/mahjong/${UID}`,userwins)
                
            }
            this.#callCount++
            INSTANCES[FB_IO_INSTANCE].FB_Write(this.#currentLobby,{turn:POSITION})
        }
    }
    }

    //
    //manageWin()
    //
    async manageWin(_val) {
        let winners = []
        // await Object.values(_val).forEach(async _player => {
        //     let winnerUID = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/players/${_player}`)
        //     let winnerName = await INSTANCES[FB_IO_INSTANCE].FB_Read(`users/${winnerUID}/public/username`)
        //     await winners.push(winnerName)
        // })
        if (_val == null || _val == undefined) return
        for (let _player of Object.values(_val)) {
            let winnerUID = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/players/${_player}`)
            let winnerName = await INSTANCES[FB_IO_INSTANCE].FB_Read(`users/${winnerUID}/public/username`)
            await winners.push(winnerName)
        }
        await console.log(winners)
        let winnerString = `${winners[0]}`
        for (let i = 1; i < winners.length; i++) winnerString = winnerString + ' and ' +winners[i]
        if (winners != []) {
            alert(`${winnerString} won`)
        }
        
    }

    //
    //kanDraw()
    //
    async kanDraw() {
        let kanCount = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/kanCount`)
        kanCount++
        let kanDraw = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/deadwall/kan/${kanCount}`)
        let hand = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/hands/${this.#currentPlayer}`)
        await hand.push(kanDraw)
        await INSTANCES[FB_IO_INSTANCE].FB_Set(`${this.#currentLobby}/hands/${this.#currentPlayer}`,hand)
    }

    //
    //checkChi(_tile)
    //
    async checkChi(_tile) {
        let viable = []
        let redFives = []
        let blandFives = []
        console.log(_tile)
        let shand = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/hands/${this.#currentPlayer}`)
        let hand = shand.slice()
            for (let i = 0; i < hand.length; i++) {
                hand[i] = hand[i].slice(0,2)
            }
        if (shand.includes('m5r')) redFives.push('m5r')
        if (shand.includes('p5r')) redFives.push('p5r')
        if (shand.includes('s5r')) redFives.push('s5r')
        if (shand.includes('m5')) blandFives.push('m5')
        if (shand.includes('p5')) blandFives.push('p5')
        if (shand.includes('s5')) blandFives.push('s5')
        
        if (hand.includes(_tile.slice(0,1)+(Number(_tile.slice(1,2))+1))) {
            if (hand.includes(_tile.slice(0,1)+(Number(_tile.slice(1,2))+2))) {
                viable.push([_tile.slice(0,1)+(Number(_tile.slice(1,2))+1),_tile.slice(0,1)+(Number(_tile.slice(1,2))+2)])
            }
            if (hand.includes(_tile.slice(0,1)+(Number(_tile.slice(1,2))-1))) {
                viable.push([_tile.slice(0,1)+(Number(_tile.slice(1,2))+1),_tile.slice(0,1)+(Number(_tile.slice(1,2))-1)])
            }
        }
        if (hand.includes(_tile.slice(0,1)+(Number(_tile.slice(1,2))-1))) {
            if (hand.includes(_tile.slice(0,1)+(Number(_tile.slice(1,2))-2))) {
                viable.push([_tile.slice(0,1)+(Number(_tile.slice(1,2))-1),_tile.slice(0,1)+(Number(_tile.slice(1,2))-2)])
            }
        }
        redFives.forEach(_tile => {
            for (let i = 0; i < viable.length; i++) {
                const POSITION = Object.keys(viable[i]).find(POSITION => 
                    viable[i][POSITION] === _tile.slice(0,2));
                if (POSITION !== undefined) {
                    if (blandFives.includes(_tile.slice(0,2))) viable.push([...viable[i]])
                    viable[i][POSITION] = _tile;
                    break;
                }
            }
        })
        console.warn(viable)
        return viable
    }

    //
    //displayDiscards()
    //
    async displayDiscards() {
        const POSITION = Object.keys(this.#playOrder['playOrder']).find(POSITION => 
            this.#playOrder['playOrder'][POSITION] === this.#currentPlayer);
        document.querySelectorAll('.discards').forEach(_el => _el.remove())
        let discards = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/discards`)
        let discard = []
        for (let i = 0; i < 4; i++) {
            let currentPos = Number(POSITION) + i + 2
            if (currentPos > 4) currentPos-=4
            if (currentPos > 4) currentPos-=4
            let arr = []
            //console.log(discards,this.#playOrder['playOrder'][currentPos])
            //console.log(discards[this.#playOrder['playOrder'][currentPos]])
            if (discards != null) {
            if (discards[this.#playOrder['playOrder'][currentPos]] != null) {
            Object.values(discards[this.#playOrder['playOrder'][currentPos]])?.forEach(_tile => {
                //console.log(_tile)
                arr.push(this.makeElement('img',{src:`./mahjong_tiles/${_tile}.png`}))
            })}}
            //if (i == 3) arr.reverse()
            let call = `calls0`
            if (i == 1) call = `calls3`
            if (i == 2) call = `center`
            if (i == 3) call = `calls1`
            discard.push(this.makeElement('div',{class:'discardsjr',id:call}),
            this.makeElement('div',{class:'discardsjr',id:`discards${i}`},arr))
        }
        discard.push(this.makeElement('div',{class:'discardsjr',id:'calls2'}))
        let temp = discard[5]
        discard[5] = discard[7]
        discard[7] = temp
        //let tempEl = document.createElement('div')
        //tempEl.setAttribute('class','discardsjr')
        //let tempArr = [tempEl,discard[0],tempEl,discard[3],tempEl,discard[2],tempEl,discard[1],tempEl]
        document.getElementById('discardDiv').append(this.makeElement('div',{class:'discards'},discard))
        //document.getElementById('discards1').transformOrigin = "5% 5%";
        //document.getElementById('discards3').transformOrigin = "5% 5%";
        document.getElementById('discards1').childNodes.forEach(_el => _el.style.rotate="90deg")
        document.getElementById('discards3').childNodes.forEach(_el => _el.style.rotate="90deg")
        document.getElementById('discards0').style.rotate="180deg"
        //console.log(discard)
        this.displayCalls()
    }

    //
    //displayCalls()
    //
    async displayCalls() {
        const POSITION = Object.keys(this.#playOrder['playOrder']).find(POSITION => 
            this.#playOrder['playOrder'][POSITION] === this.#currentPlayer);
        let calls = await INSTANCES[FB_IO_INSTANCE].FB_Read(`${this.#currentLobby}/calls`)
        for (let i = 0; i < 4; i++) {
            let currentPos = Number(POSITION) + i + 2
            if (currentPos > 4) currentPos-=4
            if (currentPos > 4) currentPos-=4
            let arr = []
            if (calls != null) {
                if (calls[this.#playOrder['playOrder'][currentPos]] != undefined) {
                //console.log(calls,this.#playOrder['playOrder'][currentPos])
                //console.log(calls[this.#playOrder['playOrder'][currentPos]])
                Object.values(calls[this.#playOrder['playOrder'][currentPos]])?.forEach(_set => {
                    let call = []
                    //console.log(_set)
                    Object.values(_set).forEach(_tile => {
                        call.push(this.makeElement('img',{src:`./mahjong_tiles/${_tile}.png`}))
                    })
                    arr.push(this.makeElement('div',{class:'setHolder'},call))
                })
                let callEl = this.makeElement('div',{id:`call`},arr)
                //console.log(callEl,i)
                document.getElementById(`calls${i}`).append(callEl)
            }
            }

        }
    }

    /*****************************************************/
    //createGame()
    //
    //
    /*****************************************************/
    async createGame() {
        let playOrder = this.shuffleDeck(['player1','player2','player3','player4'])
        this.#playOrder = {playOrder:{1:playOrder[0],2:playOrder[1],3:playOrder[2],4:playOrder[3]}}
        INSTANCES[FB_IO_INSTANCE].FB_Write(this.#currentLobby,this.#playOrder)
        let deck = this.createDeck()
        let waits = {}
        this.shuffleDeck(deck)
        this.cutDeck(deck)
        let deadwall = this.deadWall(deck)
        let hands = this.deal(deck)
        INSTANCES[FB_IO_INSTANCE].FB_Write(this.#currentLobby,{deadwall:deadwall})
        INSTANCES[FB_IO_INSTANCE].FB_Write(this.#currentLobby,{deck:deck})
        INSTANCES[FB_IO_INSTANCE].FB_Write(this.#currentLobby,{hands:hands})
        INSTANCES[FB_IO_INSTANCE].FB_Write(this.#currentLobby,{turn:1,round:1,repeats:0,kanCount:0})
        INSTANCES[FB_IO_INSTANCE].FB_Remove(`${this.#currentLobby}/discards`)
        INSTANCES[FB_IO_INSTANCE].FB_Remove(`${this.#currentLobby}/calls`)
        Object.keys(hands).forEach(_hand => {
            waits[_hand] = this.manageHand(hands[_hand])
        })
        INSTANCES[FB_IO_INSTANCE].FB_Write(this.#currentLobby,{waits:waits})
        //this.displayHand()
        this.pickUp()
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
        return deck
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
        return _deck
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
        //console.log(_deck)
        return _deck
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
        //console.log('dora tiles: '+dora,'ura dora tiles: '+ura,'kan draw tiles: '+kan,'wall: '+_deck)
        return {kan:kan,dora:dora,ura:ura}
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
        return {player1:player1.sort(),player2:player2.sort(),player3:player3.sort(),player4:player4.sort()}
        //console.log(player1,player2,player3,player4,_deck)
        //console.log(player1.sort(),player2.sort(),player3.sort(),player4.sort(),_deck.sort())
        //this.manageHand(player1.sort())
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
        //_hand = ['Dr','Dr','Dw','Dw','m1','m2','m3','m4','m5','m6','m7','m8','m9']
        //this.#callCount = 3
        //_hand = ['Dr','Dr','Dw','Dw','m1','m2','m3','m4','m5','m6']
        //_hand = ['Dr','Dr','Dw','Dw','m1','m2','m3']
        //_hand = ['Dr','Dr','Dw','Dw']
        //_hand = ['Dr','Dr','Dr','Dw','Dw','m1','m3','m4','m5','m6','m7','m8','m9']
        let ponWaits = this.calculatePonWaits(_hand)
        let kanWaits = this.calculateKanWaits(ponWaits)
        let chiWaits = this.calculateChiWaits(_hand)
        let tenpai = this.isTenpai(_hand,ponWaits)
        console.log('hand: '+_hand)
        console.log('pon waits: '+ponWaits)
        console.log('kan waits: '+kanWaits)
        console.log('chi waits: '+chiWaits)
        console.log('win waits: '+tenpai)
        return {ponWaits:ponWaits,kanWaits:kanWaits,chiWaits:chiWaits,waits:tenpai}
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
        //let newSets = []
        // for (let _set of possibleSets) {
        //     let _sets = _set.slice()
        //     if (_sets.includes('m5')) {
        //         let index = _sets.indexOf('m5')
        //         _sets[index] = 'm5r'
        //         possibleSets.push(newSetssets)
        //     } else if (_sets.includes('p5')) {
        //         let index = _sets.indexOf('p5')
        //         _sets[index] = 'p5r'
        //         possibleSets.push(newSets)
        //     } else if (_sets.includes('s5')) {
        //         let index = _sets.indexOf('s5')
        //         _sets[index] = 's5r'
        //         possibleSets.push(newSets)
        //     }
        // }   
        // for (let i = 0;i < possibleSets; i++) {
        //     let _sets = possibleSets[i].slice()
        //     if (_sets.includes('m5')) {
        //         let index = _sets.indexOf('m5')
        //         _sets[index] = 'm5r'
        //         possibleSets.push(newSetssets)
        //     } else if (_sets.includes('p5')) {
        //         let index = _sets.indexOf('p5')
        //         _sets[index] = 'p5r'
        //         possibleSets.push(newSets)
        //     } else if (_sets.includes('s5')) {
        //         let index = _sets.indexOf('s5')
        //         _sets[index] = 's5r'
        //         possibleSets.push(newSets)
        //     }
        // }   
        // possibleSets.push(...newSets)
        //console.log(possibleSets)
        this.honorSetFinder(dragonCounts,'Dragon',possibleSets)
        this.honorSetFinder(windsCounts,'Winds',possibleSets)
        let pairWaits = this.calculatePairWaits(0,possibleSets,_hand)
        let setWaits = this.calculateSetWaits(0,possibleSets,_hand,_ponWaits)
        if (this.#callCount == 3) {
            let setWait = this.singleSetWait(_hand,_ponWaits)
            pairWaits.push(...setWait)
        }
        pairWaits.push(...setWaits)
        if (_hand.length == 1) pairWaits = _hand[0]
        //if (pairWaits.length > 0) alert(pairWaits)
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
                        if (this.#callCount <= 2) poss.push(...setb)
                        if (this.#callCount <= 1) poss.push(...setc)
                        if (this.#callCount == 0) poss.push(...setd)
                        if (poss.includes('m5') && _hand.includes('m5r')) poss[poss.indexOf('m5')] = 'm5r'
                        if (poss.includes('p5') && _hand.includes('p5r')) poss[poss.indexOf('p5')] = 'p5r'
                        if (poss.includes('s5') && _hand.includes('s5r')) poss[poss.indexOf('s5')] = 's5r'
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
                        poss.push(pairs[d],pairs[d])
                        if (this.#callCount <= 1) poss.push(...setb)
                        if (this.#callCount == 0) poss.push(...setc)
                        if (poss.includes('m5') && _hand.includes('m5r')) poss[poss.indexOf('m5')] = 'm5r'
                        if (poss.includes('p5') && _hand.includes('p5r')) poss[poss.indexOf('p5')] = 'p5r'
                        if (poss.includes('s5') && _hand.includes('s5r')) poss[poss.indexOf('s5')] = 's5r'
                        if (this.AsupersetB(_hand,poss)) {
                            if (this.AremoveB(_hand,poss).length == 1) {
                                arr2.push(this.AremoveB(_hand,poss))
                            } else {
                                arr2.push(...this.calculateChiWaits(this.AremoveB(_hand,poss)))
                                arr2.push(...this.calculatePonWaits(this.AremoveB(_hand,poss)))
                            }
                        }
                    }
                }
            }
        }
        return this.removeDuplicates(arr2)
    }

    /*****************************************************/
    //singleSetWait(_hand,_ponWaits) 
    //
    //input _hand
    //=the hand to calculate the waits for
    //input _ponWaits
    //=the possible pairs for the hand
    //
    //output
    //=all the set waits of the hand
    //
    //calculates the hands set wait 
    //exclusive for all other sets called
    /*****************************************************/
    singleSetWait(_hand,_ponWaits) {
        let pairs = this.removeDuplicates(_ponWaits).slice()
        let arr2 = []
        for (let d = 0; d < _ponWaits.length; d++) {
            let poss = [pairs[d],pairs[d]]
            if (poss.includes('m5') && _hand.includes('m5r')) poss[poss.indexOf('m5')] = 'm5r'
            if (poss.includes('p5') && _hand.includes('p5r')) poss[poss.indexOf('p5')] = 'p5r'
            if (poss.includes('s5') && _hand.includes('s5r')) poss[poss.indexOf('s5')] = 's5r'
            if (this.AsupersetB(_hand,poss)) {
                if (this.AremoveB(_hand,poss).length == 1) {
                    arr2.push(this.AremoveB(_hand,poss))
                } else {
                    arr2.push(...this.calculateChiWaits(this.AremoveB(_hand,poss)))
                    arr2.push(...this.calculatePonWaits(this.AremoveB(_hand,poss)))
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