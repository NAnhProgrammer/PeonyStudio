const FormatDateTime = (dateTime: Date) =>{
    const old = new Date(dateTime);
    const result = `${old.getDate() < 10 ? '0' + old.getDate() : old.getDate()}-${old.getMonth() + 1 < 10 ? '0' + old.getMonth() : old.getMonth()}-${old.getFullYear()}  ${old.getHours() < 10 ? '0' + old.getHours() : old.getHours()}:${old.getMinutes() < 10 ? '0' + old.getMinutes() : old.getMinutes()}:${old.getSeconds() < 10 ? '0' + old.getSeconds() : old.getSeconds()}`;
    return result
}

export default FormatDateTime