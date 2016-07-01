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
        this.readerElement.appendChild(this.article);
        this.setPageWidth();
    }

    Reader.prototype.setPageWidth = function() {
        this.article.style.columnWidth = this.readerElement.clientWidth;
        this.maxPage = this.article.style.columnCount;
        let pages = document.getElementById('pages');
        pages.innerHTML = '';
        let pageElements = '';
        for (let i = 0; i < this.maxPage; i++) {
            pageElements += `<li><a href="#">{i+1}</a></li>`
        }
        console.log(pageElements);
        pages.innerHTML = pageElements;
    };

    Reader.prototype.setPage = function(page) {
        if (page > this.maxPage) {
            return ;
        }
    };

    window.Reader = Reader;
})();