window.onload = function() {
    window.document.designMode = "On";

    document.getElementById("copy_link").onclick = copy_link;

    function copy_link() {

        console.log('copy link detected');

        text_version.select();

        document.execCommand("copy", false, null);

        document.getElementById("url_image").focus();

        document.getElementById("copy_link").innerText = 'Link copied :-)';

    };

    document.getElementById("copy_link_and_close").onclick = function() {

        copy_link();

        window.close();

    };

    document.getElementById("test_link").onclick = function() {
        console.log("test link has been clicked: " + this.innerText);
    }

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-39946375-1']);
    _gaq.push(['_trackPageview']);

    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();

}
