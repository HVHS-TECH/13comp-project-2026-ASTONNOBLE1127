/*********************************************************/
//Leaderboards_page.mjs
//written by Aston Noble
//started 23/03/2026
//updated 09/06/2026
//leaderboards page class, makes the leaderboards page
/*********************************************************/

/*********************************************************/
//imports
/*********************************************************/
import Page from "./Page.mjs"
import Registration_page from "./Registration_page.mjs";
import {
    INSTANCES,
    CONTENT_MANAGER_INSTANCE,
    FB_IO_INSTANCE
} from "../controllers/Instance_vault.mjs"

export default class Leaderboards_page extends Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //ID of the page
    static #PAGEID = "Leaderboards_page"

    /*****************************************************/
    //prepareHTML()
    //
    //prepares the HTML for creation
    /*****************************************************/
    prepareHTML() {
        return this.makeElement('div',{id:'leaderboards_div'},[
            this.makeElement('h1',{
                id: 'title'
            }),
            this.makeElement('p',{
                id: 'description'
            }),
            this.makeElement('select',{
                id: 'leaderboard'
            },[
                this.makeElement('option',{id:'--select--'})
            ]),
            this.makeElement('div',{
                id: 'boarddiv'
            })
        ])
    }

    /*****************************************************/
    //displayText()
    //
    //sets the text on the page and makes the buttons work
    /*****************************************************/
    async displayText() {
        document.getElementById('title').textContent = "Welcome to the Leaderboards Page!";
        document.getElementById('description').textContent = "view the player rankings here";
        document.getElementById('--select--').innerHTML = '--select--'
        let leaderboardref = await INSTANCES[FB_IO_INSTANCE].FB_Read('leaderboards')
        Object.keys(leaderboardref).forEach(_key => {
            document.getElementById('leaderboard').append(this.makeElement('option',{id:_key}))
            document.getElementById(_key).innerHTML = _key
        })
        document.getElementById('leaderboard').addEventListener("change", async (_event) => {
            _event.preventDefault();
            let current = document.getElementById('leaderboard').value
            document.getElementById('boarddiv').innerHTML = ''
            let arr = []
            let sortedRaw = await INSTANCES[FB_IO_INSTANCE].FB_SortedRead(`leaderboards/${current}`,true,10,true,'wins')
            sortedRaw.forEach(_score => {
                arr.push(_score.val())
            })
            arr.reverse()
            let sorted = sortedRaw.val()
            for (let i = 0; i < Object.keys(sorted).length;i++) {
                document.getElementById('boarddiv').append(this.makeElement('div',{id:`placmentDiv${i}`,class:'placementDiv'},[
                    this.makeElement('a',{id:`placment${i}`,class:'placement'}),
                    this.makeElement('a',{id:`placmentName${i}`,class:'placementName'}),
                    this.makeElement('a',{id:`placmentScore${i}`,class:'placementScore'})
                ]))
                document.getElementById(`placment${i}`).innerHTML = (i + 1)+': '
                let player = await INSTANCES[FB_IO_INSTANCE].FB_Read(`users/${arr[i]['uid']}/public/username`)
                document.getElementById(`placmentName${i}`).innerHTML = player
                document.getElementById(`placmentScore${i}`).innerHTML = (arr[i]['wins'])+' wins'
            }
        })
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
        return Leaderboards_page.#PAGEID
    }
}