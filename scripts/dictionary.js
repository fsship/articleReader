(function() {
    function Dict(element) {
        element.addEventListener('click', (e) => {
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            let node = selection.anchorNode;
            let re = /^[A-Za-z]+$/;
            while(re.test(range.toString()) || range.toString() === '') {
                range.setStart(node, (range.startOffset - 1));
            }
            range.setStart(node, range.startOffset + 1);
            do{
                range.setEnd(node, range.endOffset + 1);
            } while(re.test(range.toString()) && range.toString().trim() != '');
            range.setEnd(node, range.endOffset - 1);
            let str = range.toString().trim();
            console.log(str);
        });
    }

    window.Dict = Dict;
})();