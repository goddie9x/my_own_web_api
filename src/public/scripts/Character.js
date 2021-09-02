class Character {
    constructor(container, characterName, characterCount) {
        this.curentContainer = $(container);
        this.positionX = Math.floor(this.curentContainer.width() / 2);
        this.positionY = 0;
        this.name = characterName;
        this.characterCount;
        this.curentContainer.append(`<div class="character-${characterCount} character"></div>`);
        this.currentCharacter = $(`.character-${characterCount}`);
        this.maxWidth = this.curentContainer.width();
        this.maxHeight = this.curentContainer.height();
        this.setOffset();
    }
    checkAndRestoreOffsetIfCharacterOutContainer() {
        if (this.positionX < 0) {
            this.positionX = 0;
        }
        if (this.positionY < 0) {
            this.positionY = 0;
        }
        if (this.positionX > this.maxWidth) {
            this.positionX = this.maxWidth;
        }
        if (this.positionY > this.maxHeight) {
            this.positionY = this.maxHeight;
        }
    }
    setOffset() {
        this.checkAndRestoreOffsetIfCharacterOutContainer();
        this.currentCharacter.css({
            left: this.positionX,
            top: this.positionY
        });
    }
    moveLeft() {
        this.positionX -= 5;
        this.setOffset();
    }
    moveRight() {
        this.positionX += 5;
        this.setOffset();
    }
    moveDown() {
        this.positionY += 5;
        this.setOffset();
    }
    moveUp() {
        this.positionY -= 5;
        this.setOffset();
    }
    talk(message) {
        let messageLength = message.length;
        let timeRemoveMessage = (messageLength < 30) ? (2000) : (Math.floor(messageLength / 15 * 1000));

        setTimeout(() => {
            this.currentCharacter.html('');
        }, timeRemoveMessage);
        this.currentCharacter.html(`<div class="message top">${message}</div>`);
    }
}