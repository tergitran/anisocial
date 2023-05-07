import moment from "moment";

export const formatTime = (date: string) => {
    return moment(date).format("YYYY/MM/DD hh:mm");
}
export const fromNow = (date: string) => {
    return moment(date).fromNow();
}