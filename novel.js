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
    
    canMove (id) {
        const properties = this.scenes[id];
        const requirements = properties.requirements;
        const reqList = Object.keys(requirements);
        const choices = Object.keys(this.scenes[this.scene].choices);
        const reqLen = reqList.length;
        const choicesLen = choices.length;
        let canPass = true;
        let hasChoice = false;
        
        for (let i = 0; i < choicesLen; i++) { // check if there is actually this choice
            if (choices[i] === id) {
                hasChoice = true;
                break;
            } else {
                continue;
            }
        }
        
        if (!hasChoice) return false;
        
        for (let i = 0; i < reqLen; i++) { // check for any requirement to enter the scene
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
        
        if (canPass) { // check if can pass
            if (properties.rewards) { // gives rewards if any
                // not yet implemented
            }
            return true;
        } else {
            if (properties.bypass) { // check if the user has any bypass item
                // not yet implemented
                return false;
            } else {
                // not yet implemented
                return false;
            }
        }
    }
    
    allMoves () {
        const { choices } = this.scene;
        const list = [];
        for (const choice in choices) {
            if (this.canMove(choice)) {
                list.push(choice);
            }
        }
    }
    
    move (id) {
        const movability = this.canMove(id);
        if (movability) {
            this.scene = id;
            // give reward if any
        } else {
            return 0;
        }
    }
    
    forceMove (id) {
        this.scene = id;
    }
    
    moveRandom () {
        const choices = this.scenes[this.scene].choices;
        const choicesArray = Object.keys(choices);
        this.scene = choicesArray[Math.floor(Math.random() * choices.length)];
    }
    
    checkValidity () {
        const items = this.items;
        const scenes = this.scenes;
        let valid = true;
        
        // checks for any invalid item
        for (const item in items) {
            const type = typeof item;
            if (type !== 'string' && type !== 'integer') { // check if its string or integer
                valid = false;
                break;
            } else {
                continue;
            }
        }
        
        if (!valid) return false;
        
        for (const scene in scenes) {
            const { requirements, choices } = scene;
            if (typeof requirements === 'undefined' || typeof choices === 'undefined') {
                valid = false;
                break;
            }
            const cLen = choices.length;
            for (let i = 0; i < cLen; i++) {
                const type = typeof choices[i];
                if (type !== 'string' && type !== 'integer') {
                    valid = false;
                    break;
                }
            }
            for (const requirement in requirements) {
                const type = typeof requirement;
                if (type !== 'string' && type !== 'integer') {
                    valid = false;
                    break;
                }
            }
            if (valid === false) break;
        }
        return valid;
    }
            
    getChoices () {
        return this.scenes[this.scene].choices;
    }
    
    getState () {
        return { scene: this.scene, scenes: this.scenes, items: this.items };
    }
    
    getNovel () {
        return this.scenes;
    }
}
