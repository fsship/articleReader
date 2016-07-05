(function() {
    function Card() {
        console.log('card init')
        this.audio = '';
        this.element = document.createElement('div');
        this.element.classList.add('articleReader-card');
        document.body.appendChild(this.element);
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = chrome.extension.getURL('css/card.css');
        document.head.appendChild(link);

        this.element.addEventListener('click', (e) => {
            if (e.target.id === 'audioPlay') {
                this.audio.play();
            }
            if (e.target.id === 'close') {
                this.close();
            }
        });
    }

    Card.prototype.showWord = function(word, mousePosition) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.shanbay.com/bdc/search/?word=${word}`);
        let soundImg = chrome.extension.getURL('icon/sound.png');
        xhr.send();
        let that = this;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                let content;
                let display = 'block';
                if (data.status_code === 0) {
                    content = data.data.definition.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br/>' + '$2');
                    that.audio = new Audio(data.data.audio);
                } else {
                    content = data.msg;
                    display = 'none';
                }
                that.element.innerHTML = `
                    <h4>${word}</h4>
                    <img id="audioPlay" src="${soundImg}" alt="" style="display: ${display}"/>
                    <p>${content}</p>
                    <a href="#" id="close">关闭</a>
                `;
                that.element.style.display = 'block';
                that.setPosition(mousePosition);
            }
        };
    };

    Card.prototype.close = function() {
        this.element.style.display = 'none';
    };

    Card.prototype.setPosition = function(mousePosition) {
        let left = mousePosition.x - 100;
        let top = mousePosition.y + 5;

        let computedStyle = window.getComputedStyle(this.element);

        if (left < 5) {
            left = 5;
        }
        if (left + parseInt(computedStyle.width) > window.innerWidth) {
            left = document.body.clientWidth - parseInt(computedStyle.width);
        }
        if (top + parseInt(computedStyle.height) > window.innerHeight) {
            console.log('changing top');
            console.log(top + parseInt(computedStyle.height));
            top -= parseInt(computedStyle.height) + 5;
        }
        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';
    };

    function Dict(element) {
        this.card = new Card();

        element.addEventListener('click', (e) => {
            this.card.close();
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            let node = selection.anchorNode;
            let re = /^[A-Za-z]+$/;
            while((re.test(range.toString()) || range.toString() === '') && range.startOffset > 0) {
                range.setStart(node, (range.startOffset - 1));
            }
            if (range.startOffset || !re.test(range.toString())) {
                console.log('fired');
                range.setStart(node, range.startOffset + 1);
            }
            do{
                range.setEnd(node, range.endOffset + 1);
            } while(re.test(range.toString()) && range.toString().trim() != '');
            range.setEnd(node, range.endOffset - 1);
            let word = range.toString().trim();
            if (!re.test(word)) {
                return ;
            }
            this.card.showWord(word, {x: e.pageX, y: e.pageY});
        });
    }

    window.Dict = Dict;
})();