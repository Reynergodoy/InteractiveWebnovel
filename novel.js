export class Novel {
    constructor (start, scenes, items) {
        this.scene = start || 0;
        this.scenes = scenes || {};
        this.items = items || {};
    }
    
    setStart (id) {
        this.scene = id;
    }
    
    addScene (id, properties) { // adds a scene to the novel
        this.scenes[id] = properties;
    }
    
    deleteScene (id) {
        delete this.scenes[id];
    }
    
    move (id) {
        const properties = this.scenes[id];
        const requirements = properties.requirements;
        const reqList = Object.keys(requirements);
        const reqLen = reqList.length;
        let canPass = true;
        for (let i = 0; i < reqLen; i++) {
            const item = reqList[i];
            if (this.items[item] === undefined) {
                canPass = false;
                break;
            } else if (this.items[item] < requirements[item]) {
                canPass = false;
                break;
            } else {
                continue;
            }
        }
        if (canPass) {
            this.scene = id;
            return true;
        } else {
            if (properties.bypass) {
                
            } else {
                
            }
        }
    }
    
    moveRandom () {
        const choices = this.scenes[this.scene].choices;
        this.scene = choices[Math.floor(Math.random() * choices.length)];
    }
    
    getState () {
        return { scene: this.scene, scenes: this.scenes, items = this.items };
    }
    
    getNovel () {
        return this.scenes;
    }
}
