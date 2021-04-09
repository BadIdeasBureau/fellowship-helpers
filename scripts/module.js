Hooks.once('ready', async function() {
    libWrapper.register("fellowship-helpers","game.pbta.PbtaRolls.rollMoveExecute", async function (wrapped, ...args){
        const actor = this.actor;
        console.log("Pre-dialog")
        //todo: handle vigor and drunk (and both)
        const oldRoll = actor.data.data?.resources?.rollFormula?.value ?? "2d6";
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
            await actor.update({ "data.resources.rollFormula.value": newRoll });
            const result = wrapped(...args);
            await actor.update({ "data.resources.rollFormula.value": oldRoll });
            return result;
        }
    }, "MIXED");
});
