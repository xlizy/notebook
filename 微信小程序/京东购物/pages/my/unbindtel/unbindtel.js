var e = require("../../page.js"), i = require("../../../common/fe_report/usability.js");

new e({
    onLoad: function(e) {
        i.umpBiz({
            bizid: "744",
            operation: 1,
            result: "1",
            message: "/pages/my/unbindtel/unbindtel"
        }), this.$goto("/pages/my_pages/unbindtel/unbindtel", e, "redirectTo");
    }
});