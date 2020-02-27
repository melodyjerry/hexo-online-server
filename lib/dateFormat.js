function dateFormat(fmt, date=new Date()) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),
        "M+": (date.getMonth() + 1).toString(),
        "D+": date.getDate().toString(),
        "H+": date.getHours().toString(),
        "m+": date.getMinutes().toString(),
        "s+": date.getSeconds().toString()
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
module.exports = dateFormat;