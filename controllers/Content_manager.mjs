/*********************************************************/
//Content_manager.mjs
//written by Aston Noble
//started 22/03/2026
//updated 22/03/2026
//manages the page changes
/*********************************************************/

export default class Content_manager {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //#root is to reference the root element
    #root
    //#currentPage is to reference the active page
    #currentPage

    /*****************************************************/
    //constructor(_root)
    //
    //input _root
    //=the element that pages get appended to
    //
    //sets the private #root to the root element
    /*****************************************************/
    constructor(_root){
        this.#root = _root
    }

    /*****************************************************/
    //changePage(_page)
    //
    //input _page
    //=the new class of the new page displayed
    //
    //orders the removal of the old page
    //orders the creation of the new page
    /*****************************************************/
    async changePage(_page){
        const PAGE = await new _page();
        if (this.#currentPage) await this.#currentPage.cull()
        this.#currentPage = PAGE
        await PAGE.pageChangeHandler(this.#root)
    }
}