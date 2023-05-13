import { PaginateInfo } from './axios';

export default function paginationButtons(paginateInfo: PaginateInfo) {
    let buttons = [];
    buttons.push(1);
    if (paginateInfo.current_page > 3 && paginateInfo.current_page <= paginateInfo.last_page) {
        buttons.push("...");
    }
    if (paginateInfo.current_page > 2 && paginateInfo.current_page <= paginateInfo.last_page) {
        buttons.push(paginateInfo.current_page - 1);
    }
    if (paginateInfo.current_page > 1 && paginateInfo.current_page <= paginateInfo.last_page) {
        buttons.push(paginateInfo.current_page);
    }
    if (paginateInfo.current_page < paginateInfo.last_page - 1 && paginateInfo.current_page >= 1) {
        buttons.push(paginateInfo.current_page + 1)
    }
    if (paginateInfo.current_page < paginateInfo.last_page - 2 && paginateInfo.current_page >= 1) {
        buttons.push("...");
    }
    if (paginateInfo.current_page !== paginateInfo.last_page && paginateInfo.current_page < paginateInfo.last_page) {
        buttons.push(paginateInfo.last_page);
    }
    return buttons;
}