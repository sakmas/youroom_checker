$(function(){
        var bgPage = chrome.extension.getBackgroundPage();
    var $auth_area = $("#auth_area");

    function createAuthArea(){
        if (bgPage.oauth.hasToken()) {
            setVerified();
        }else{
            setVerifyBtn();
        }
    };
    
    function setVerifyBtn(){
        $auth_area.empty();
        $auth_area.append($("<input/>").attr({id: "btn_auth", type: "button", value: "youRoomにログインする"}));    
    };
    
    function setVerified(){
        $auth_area.empty();
        $auth_area.append($("<div/>").html("認証済みです"));
    };
    
    $("#btn_auth").live("click", function(){
        if (bgPage.oauth.hasToken()){
            setVerified();
        }else{
            bgPage.oauth.authorize(function(){
                setVerified();
                bgPage.setIcon();
                bgPage.startCheck();
            });
        }
    });
    
    createAuthArea();
});