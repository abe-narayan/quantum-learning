/**
 * The DOM id of the search dialog, shared by the trigger and the overlay.
 *
 * `SearchTrigger` advertises `aria-haspopup="dialog"` + `aria-expanded`; to
 * complete that contract it also has to point `aria-controls` at the element
 * it opens, and `aria-controls` may only ever name an id that actually exists
 * in the document — so the trigger sets it *only while open*, and the overlay
 * stamps the same constant on its `role="dialog"` element. Declared here, in
 * neither file, so the two can never drift apart.
 */
export const SEARCH_DIALOG_ID = "site-search-dialog";
