
export function checkAccessHelper(group: any, func: any, action: any) {
    let metrix: any = localStorage.getItem('ACCESS_METRIX');
    if (!metrix) return false;
    if (metrix === "undefined") return false;

    metrix = JSON.parse(metrix);

    if (!metrix[group]) return false;
    let foundObject = metrix[group].filter((e: any) => e.prfuncde === func);
    if (foundObject.length === 0) return false;

    let accessable = foundObject[0].prfunacs;
    if (!action || !Boolean(accessable)) {
        return Boolean(accessable);
    }

    if (!foundObject[0].actions) return false;
    let foundActionObject = foundObject[0].actions.filter((e: any) => e.key === action);
    if (foundActionObject.length === 0) return false;

    let accessableAction = foundActionObject[0].checked;
    return Boolean(accessableAction);
}
