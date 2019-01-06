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
        return list;
    }
    
    move (id) {
        const movability = this.canMove(id);
        if (movability) {
            this.scene = id;
            if (this.scene.properties.rewards) { // gives rewards if any
                // not yet implemented
            }
        } else {
            return false;
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
    
    novelValidity () {
        const { scenes, scene } = this;
        const sceneType = typeof scene;
        
        if (sceneType !== 'string' && sceneType !== 'number') return false; // checks for the current scene id name
        
        let valid = true;
        let error = `Scene ${scene} `;
        
        for (const scene in scenes) { // checks for every scene in scenes
            const { requirements, choices, description, choicesDescriptions } = scenes[scene];
            
            if (typeof requirements === 'undefined' ||
                typeof choices === 'undefined'      ||
                typeof description === 'undefined'  ||
                typeof choicesDescriptions === 'undefined') { // check if any of the fields are undefined
                valid = false;
                error += 'has one or more of its 4 properties undefined';
                break;
            }
            
            if (!valid) return [false, error];
            
            if (typeof description !== 'string') return [false, error + 'description is undefined'];
            
            const cLen = choices.length;
            
            if (choicesDescriptions.length !== cLen) return [false, error + 'choices description length is different than choices length'];
            
            for (let i = 0; i < cLen; i++) {
                const choiceType = typeof choices[i];
                const descType = typeof choicesDescriptions[i];
                if (choiceType !== 'string' && choiceType !== 'number') { // check choices id
                    valid = false;
                    error += `choice number ${i+1} is not a string or number`;
                    break;
                }
                if (descType !== 'string' && choiceType !== 'number') { // check choices description
                    valid = false;
                    error += `choice description number ${i+1} is not a string or number`;
                    break;
                }
            }
            
            if (!valid) return [false, error];
            
            for (const requirement in requirements) { // check scene requirements
                const type = typeof requirements[requirement];
                if (type !== 'string' && type !== 'number') {
                    valid = false;
                    error += `requirement ${requirement} value is not a string or a number`;
                    break;
                }
            }
            
            if (valid === false) break;
            
        }
        return [valid, error];
    }
    
    checkValidity () { // checks for the entire instance validity
        const { items, scenes } = this;
        let valid = true;
        let error = `Item `
        
        // checks for any invalid item
        for (const item in items) {
            const type = typeof items[item];
            if (type !== 'string' && type !== 'number') { // check if its string or integer
                valid = false;
                error += `${item} value is not a string or a number`;
                break;
            } else {
                continue;
            }
        }
        
        if (!valid) return [false, error];
        
        return this.novelValidity();
    }
    
    cleanItem (item) {
        delete this.items[item];
    }
            
    getChoices () {
        return this.scenes[this.scene].choices;
    }
    
    getState () {
        return { scene: this.scene, scenes: this.scenes, items: this.items };
    }
    
    getNovel () {
        return {scene: this.scene, scenes: this.scenes};
    }
}
