(function() {
    'use strict';

    function Reader(article) {
        //document.body.appendChild(article);
        this.currentPage = 1;
        this.maxPage = 1;
        this.article = article;

        let xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.extension.getURL('html/page.html'), false);
        xhr.send();

        document.body.innerHTML = xhr.responseText;
        this.readerElement = document.getElementById('articleReader-reader');
        this.pagingElement = document.getElementById('articleReader-paging');
        this.articleEndMarker = document.createElement('span');
        this.articleEndMarker.id = 'articleEnd';
        this.readerElement.appendChild(this.article);
        this.article.style.height = '100%';
        this.article.style.position = 'relative';
        this.article.appendChild(this.articleEndMarker);
        this.setPageWidth();

        this.pagingElement.addEventListener('click', (e) => {
            let page = parseInt(e.target.innerHTML);
            if (page > 0) {
                this.setPage(page);
            }
        });
    }

    Reader.prototype.setPageWidth = function() {
        this.article.style.columnWidth = this.readerElement.clientWidth + 'px';
        this.article.style.columnGap = '0';
        this.maxPage = Math.ceil(this.articleEndMarker.offsetLeft/this.readerElement.clientWidth) + 1;
        let pages = document.getElementById('pages');
        pages.innerHTML = '';
        let pageElements = '';
        for (let i = 0; i < this.maxPage; i++) {
            pageElements += `<li><a href="#">${i+1}</a></li>`
        }
        pages.innerHTML = pageElements;
        this.setPage(1);
    };

    Reader.prototype.setPage = function(page) {
        if (page > this.maxPage) {
            return ;
        }
        this.currentPage = page;
        let newLeft = -(page - 1) * (this.readerElement.clientWidth);
        this.article.style.left = newLeft + 'px';
    };

    window.Reader = Reader;
})();