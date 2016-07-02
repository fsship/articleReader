(function() {
    'use strict';
    const articles = document.getElementsByTagName('article');
    if (!articles.length) {
        console.log('no article found!');
        return ;
    }

    const theArticle = articles[0];
    document.body.innerHTML = '';

    let classToRemove = ['content__secondary-column', 'content__meta-container', 'submeta', 'ad-slot', 'element-rich-link'];
    //let classToRemove = [];
    classToRemove.forEach((className) => {
        let theElement = theArticle.getElementsByClassName(className)[0];
        if (theElement) {
            theElement.remove();
        }
    });

    let reader = new Reader(theArticle);
    window.reader = reader;
})();