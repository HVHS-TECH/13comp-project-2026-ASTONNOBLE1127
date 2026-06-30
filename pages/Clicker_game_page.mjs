/*********************************************************/
//Clicker_game_page.mjs
//written by Aston Noble
//started 17/06/2026
//updated 17/06/2026
//clicker game class, makes the clicker game page
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

export default class Clicker_game_page extends Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //ID of the page
    static #PAGEID = "Clicker_game_page"
    //factory list 
    static #FACTORYLIST = [
        {name:'tim',cost:'15',production:'0.1'},
        {name:'jim',cost:'100',production:'1'}
    ]
    //count
    #count = 0
    //modifiers
    #modifier = 1
    //factorys
    #factorys = {}
    
    /*****************************************************/
    //prepareHTML()
    //
    //prepares the HTML for creation
    /*****************************************************/
    prepareHTML() {
        return this.makeElement('div',{id:'clicker_div'},[
            this.makeElement('h1',{
                id: 'title'
            }),
            this.makeElement('button',{
                id: 'save'
            }),
            this.makeElement('p',{
                id: 'description'
            },[
                this.makeElement('a',{
                    id:'count'
                }),
                this.makeElement('img',{
                    id:'click', src:'./images/unnamed.png'
                })
            ]),
            this.makeElement('div',{
                id: 'shop'
            })
        ])
    }

    /*****************************************************/
    //displayText()
    //
    //sets the text on the page and makes the buttons work
    /*****************************************************/
    async displayText() {
        Clicker_game_page.#FACTORYLIST.forEach(_fact => {
            document.getElementById('shop').append(
                this.makeElement('button',{id:_fact['name']})
            )
            document.getElementById(_fact['name']).innerHTML = _fact['name'] +' '+ _fact['cost']
            document.getElementById(_fact['name']).onclick = () => {
                if (this.#factorys[_fact['name']] == undefined) {
                    if (this.#count>=_fact['cost']) {
                        this.#count-= _fact['cost']
                        this.#factorys[_fact['name']] = _fact
                        this.#factorys[_fact['name']]['ammount'] = 1
                        document.getElementById(_fact['name']).innerHTML = _fact['name'] +' '+ this.makeReadable(Math.floor(_fact['cost']*(1.15**(this.#factorys[_fact['name']]['ammount']))))
                    }
                } else if (this.#count >= _fact['cost']*(1.15**(this.#factorys[_fact['name']]['ammount']))) {
                    this.#count -= (_fact['cost']*(1.15**this.#factorys[_fact['name']]['ammount']))
                    this.#factorys[_fact['name']]['ammount'] += 1
                    document.getElementById(_fact['name']).innerHTML = _fact['name'] +' '+ this.makeReadable(Math.floor(_fact['cost']*(1.15**(this.#factorys[_fact['name']]['ammount']))))
                }
            }
        })
        document.getElementById('title').innerHTML = 'Welcome to the clicker game'
        document.getElementById('save').innerHTML = 'save'
        const UID = INSTANCES[FB_IO_INSTANCE].getUID()
        let count = await INSTANCES[FB_IO_INSTANCE].FB_Read(`leaderboards/clicker/${UID}/wins`)
        if (count != null && count != undefined) this.#count = count
        document.getElementById('count').innerHTML = Math.floor(this.#count)
        document.getElementById('click').onclick = () => this.click()
        document.getElementById('save').onclick = () => this.save()
        const gametick = setInterval(this.tick.bind(this), 100)
    }

    /*****************************************************/
    //tick()
    /*****************************************************/
    tick() {
        Object.keys(this.#factorys).forEach(_fact => {
            this.#count+= this.#factorys[_fact]['production'] * this.#factorys[_fact]['ammount']/10
        })
        document.getElementById('count').innerHTML = this.makeReadable(Math.floor(this.#count))
    }

    /*****************************************************/
    //click()
    /*****************************************************/
    click() {
        this.#count+= 1 * this.#modifier
        document.getElementById('count').innerHTML = this.makeReadable(Math.floor(this.#count))

    }

    /*****************************************************/
    //save()
    /*****************************************************/
    save() {
        const UID = INSTANCES[FB_IO_INSTANCE].getUID()
        INSTANCES[FB_IO_INSTANCE].FB_Write(`leaderboards/clicker/${UID}`,{wins:this.#count,uid:UID})
    }

    makeReadable (_number) {
        const NUMBER = Number(_number)
        if (NUMBER >= 1.0e+12) {
            return (NUMBER/1.0e+12).toFixed(2) + 'Trillion'
        } else if (NUMBER >= 1.0e+9) {
            return (NUMBER/1.0e+9).toFixed(2) + 'Billion'
        } else if (NUMBER >= 1.0e+6) {
            return (NUMBER/1.0e+6).toFixed(2) + 'Million'
        } else return NUMBER
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
        return Clicker_game_page.#PAGEID
    }
}