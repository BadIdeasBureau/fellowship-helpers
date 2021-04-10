import {PbtaUtility} from "../../../../AppData/Local/FoundryVTT/Data/systems/pbta/module/utility";

Hooks.once('ready', async function() {
    libWrapper.register("fellowship-helpers","game.pbta.PbtaRolls.rollMoveExecute", async function (wrapped, ...args){
        let formula = args[0];
        if (PbtaUtility.isEmpty(formula)) return await wrapped(...args); // if it's not a roll, don't ask for anything.
        const actor = this.actor;
        const oldRoll = actor.data.data?.resources?.rollFormula?.value ?? game.pbta.sheetConfig.rollFormula ?? "2d6";
        let isStatRoll = false;
        let parts;
        if (formula instanceof String){ //if a formula is defined as a string, it wants to roll that - but could be a stat roll.  Only way to tell is if it's picked up the rollFormula.
            parts = formula.split("+");
            if (parts[0] === oldRoll){
                isStatRoll = true;
            }
        }
        //todo: handle vigor and drunk (and both)
        const newRoll = await new Promise((resolve) => new Dialog({
            title: "Roll",
            buttons:{
                hope:{
                    icon: "<i class='fas fa-heart'></i>",
                    label: "Hope",
                    callback: () => resolve("3d6kh2")
                },
                normal:{
                    icon: "<i class='fa fa-circle'></i>",
                    label: "Normal",
                    callback: () => resolve("2d6")
                },
                despair:{
                    icon: "<i class='fas fa-heart-broken'></i>",
                    label: "Despair",
                    callback: () => resolve("3d6kl2")
                }
            },
            close: () => resolve(undefined)
        }).render(true));

        if (newRoll) {
            if (isStatRoll && parts){
                parts[0] = newRoll;
                args[0] = parts.join("+");
                return wrapped(...args);
            } else {
                await actor.update({"data.resources.rollFormula.value": newRoll});
                const result = wrapped(...args);
                await actor.update({"data.resources.rollFormula.value": oldRoll});
                return result;
            }
        }
    }, "MIXED");
});
