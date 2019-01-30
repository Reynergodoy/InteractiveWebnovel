class Novel {
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
        if (!requirements) return true;
        
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
    
    validMoves () { // gets all valid moves
        const { choices } = this.scene;
        const list = [];
        for (const choice in choices) {
            if (this.canMove(choice)) {
                list.push(choice);
            }
        }
        return list;
    }
    
    move (id) { // moves but first tests if can move
        if (this.canMove(id)) {
            this.scene = id;
            if (this.scenes[id].rewards) { // gives rewards if any
                // not yet implemented
            }
        } else {
            return false;
        }
    }
    
    forceMove (id) { // forces a move without any checks or giving any rewards
        this.scene = id;
    }
    
    moveRandom () { // moves randomly
        const choices = this.scenes[this.scene].choices;
        const choicesArray = Object.keys(choices);
        this.scene = choicesArray[Math.floor(Math.random() * choices.length)];
    }
    
    novelValidity () {
        const { scenes, scene } = this;
        const sceneType = typeof scene;
        
        if (sceneType !== 'string' && sceneType !== 'number') return [false, `Scene ${scene} id is not a string or number`]; // checks for the current scene id name
        
        let valid = true;
        let error = `ERROR: Scene `;
        
        for (const _scene in scenes) { // checks for every scene in scenes
            const sceneObj = scenes[_scene];
            
            for (const prop in sceneObj) { // checks if it only has valid properties
                if (prop !== 'requirements' && prop !== 'choices' && prop !== 'description') {
                    valid = false;
                    error += `${_scene} has an invalid property named ${prop}`;
                    break;
                }
            }
            if (!valid) break;
            
            const { requirements, choices, description } = sceneObj;
            
            if (typeof requirements !== 'object' ||
                typeof choices !== 'object'      ||
                typeof description !== 'string'  ||
                Array.isArray(choices)           ||
                choices === null) { // check if any of the fields are undefined
                valid = false;
                error += `${_scene} has one or more of its 4 properties undefined or in the wrong type`;
                break;
            }
            if (!valid) break;
            
            for (const choice in choices) {
                const choiceType = typeof choices[choice];
                if (choiceType !== 'string' && choiceType !== 'number') { // check choices id
                    valid = false;
                    error += `${_scene} choice number ${i+1} is not a string or number`;
                    break;
                }
            }
                  
            if (!valid) break;
            
            for (const requirement in requirements) { // check scene requirements
                const type = typeof requirements[requirement];
                if (type !== 'string' && type !== 'number') {
                    valid = false;
                    error += `${_scene} requirement ${requirement} value is not a string or a number`;
                    break;
                }
            }
            
            if (!valid) break;
            
        }
        if (!valid) {
            return [valid, error];
        } else {
            return [true, 'SUCCESSFUL']
        }
    }
    
    checkValidity () { // checks for the entire instance validity
        const { items, scenes } = this;
        let valid = true;
        let error = `ERROR: Item `
        
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
    
    cleanItem (item) { // clean items
        delete this.items[item];
    }
            
    getChoices () { // get ALL choices
        return this.scenes[this.scene].choices;
    }
    
    getProperties (props) { // get constructor properties
        const propsLen = props.length;
        const res = {};
        for (let i = 0; i < propsLen; i++) {
            const prop = this[props[i]];
            if (typeof prop !== 'undefined') res[props[i]] = prop;
        }
        return res;
    }
}
