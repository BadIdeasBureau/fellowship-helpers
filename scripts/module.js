Hooks.once('ready', async function() {
    libWrapper.register("fellowship-helpers","game.pbta.PbtaRolls.rollMoveExecute", async function (wrapped, ...args){
        const actor = this.actor;
        //todo: handle vigor and drunk (and both)
        const d = new Dialog({
            title: Roll,
            buttons:{
                hope:{
                    icon: "<i class='fas fa-heart'></i>",
                    label: "Hope",
                    callback: async () => await doRoll("3d6kh2")
                },
                normal:{
                    icon: "<i class='fa fa-circle'></i>",
                    label: "Normal",
                    callback: async () => await doRoll("2d6")
                },
                despair:{
                    icon: "<i class='fas fa-heart-broken'></i>",
                    label: "Despair",
                    callback: async () => await doRoll("3d6kl2")
                }
            }
        })
        d.render(true);
        //do dialog to grab new roll
        async function doRoll(newRoll) {
            const oldRoll = actor.data.data?.resources?.rollFormula?.value;
            await actor.update({"data.resources.rollFormula.value": newRoll});
            await wrapped(...args);
            await actor.update({"data.resources.rollFormula.value": oldRoll})
        }
    }, "MIXED")
});
