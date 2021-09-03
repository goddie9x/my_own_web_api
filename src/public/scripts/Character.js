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
        this.maxHeight = this.curentContainer.height() - this.currentCharacter.height();
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
        this.handlerTalkMessageDisplay();
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
        //block script or any esle code we do not expect
        let entities = { '<': '&lt;', '>': '&gt;' };

        message = message.slice(0, 540);
        message = message.replace(
            /[<>]/g,
            function(s) {
                return entities[s];
            }
        );
        let messageLength = message.length;
        let timeRemoveMessage = (messageLength < 30) ? (2000) : (Math.floor(messageLength / 15 * 1000));

        setTimeout(() => {
            this.currentCharacter.html('');
        }, timeRemoveMessage);
        this.currentCharacter.html(`<div class="message ">${message}</div>`);
        this.handlerTalkMessageDisplay();
    }
    handlerTalkMessageDisplay() {
        let messageElement = this.currentCharacter.find('.message');
        if (messageElement) {
            let messageHeight = messageElement.height();
            let messageWidth = messageElement.width();

            //message dinamic display up or down, left or right to be comletely inside container
            if (messageHeight > this.positionY && messageHeight + this.positionY < this.maxHeight) {
                messageElement.addClass('bottom').removeClass('top');
            } else {
                messageElement.addClass('top').removeClass('bottom');
            }
            if (messageWidth > this.positionX && messageWidth + this.positionX < this.maxWidth) {
                messageElement.addClass('left').removeClass('right');
            } else {
                messageElement.addClass('right').removeClass('left');
            }
        }


    }
}