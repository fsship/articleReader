(function() {
    'use strict';

    function removeClass(className) {
        let elements = document.getElementsByClassName(className);
        for (let i = 0; i < elements.length;i++) {
            elements[i].classList.remove(className);
        }
    }

    function Reader(article) {
        this.currentPage = 1;
        this.maxPage = 1;
        this.article = article;
        this.dict = '';

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
            this.dict.card.close();
            let page = parseInt(e.target.innerHTML);
            if (page > 0) {
                this.setPage(page);
            }
            if (e.target.id === 'pageUp' && this.currentPage > 1) {
                this.setPage(this.currentPage - 1);
            }
            if (e.target.id === 'pageDown' && this.currentPage < this.maxPage) {
                this.setPage(this.currentPage + 1);
            }
        });
    }

    Reader.prototype.setPageWidth = function() {
        this.article.style.columnWidth = this.readerElement.clientWidth + 'px';
        this.article.style.columnGap = '0';
        this.maxPage = Math.ceil(this.articleEndMarker.offsetLeft/this.readerElement.clientWidth) + 1;
        console.log(this.maxPage);
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
        removeClass('paging-active');
        removeClass('paging-disabled');
        let pages = document.getElementById('pages');
        pages.childNodes[page-1].firstChild.classList.add('paging-active');
        if (page === this.maxPage) {
            document.getElementById('pageDown').classList.add('paging-disabled');
        }
        if (page === 1) {
            document.getElementById('pageUp').classList.add('paging-disabled');
        }
    };

    Reader.prototype.setDict = function(dict) {
        this.dict = dict;
    };

    window.Reader = Reader;
})();