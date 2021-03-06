function CosCloud(t) {
    this.appid = t.appid, this.bucket = t.bucket, this.region = t.region, this.sign_url = t.sign_url, 
    t.getAppSign && (this.getAppSign = t.getAppSign), t.getAppSignOnce && (this.getAppSignOnce = t.getAppSignOnce);
}

function fixPath(t, e) {
    if (!t) return "";
    var o = this;
    return t = t.replace(/(^\/*)|(\/*$)/g, ""), t = "folder" == e ? encodeURIComponent(t + "/").replace(/%2F/g, "/") : encodeURIComponent(t).replace(/%2F/g, "/"), 
    o && (o.path = "/" + o.appid + "/" + o.bucket + "/" + t), t;
}

var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, SLICE_SIZE_512K = 524288, SLICE_SIZE_1M = 1048576, SLICE_SIZE_2M = 2097152, SLICE_SIZE_3M = 3145728, MAX_UNSLICE_FILE_SIZE = 20971520;

CosCloud.prototype.cosapi_cgi_url = "https://REGION.file.myqcloud.com/files/v2/", 
CosCloud.prototype.sliceSize = 3145728, CosCloud.prototype.getExpired = function(t) {
    return parseInt(Date.now() / 1e3) + (t || 60);
}, CosCloud.prototype.set = function(t) {
    t && (this.appid = t.appid, this.bucket = t.bucket, this.region = t.region, this.sign_url = t.sign_url, 
    t.getAppSign && (this.getAppSign = t.getAppSign), t.getAppSignOnce && (this.getAppSignOnce = t.getAppSignOnce));
}, CosCloud.prototype.getCgiUrl = function(t) {
    var e = this.region, o = this.bucket, i = this.cosapi_cgi_url;
    return (i = i.replace("REGION", e)) + this.appid + "/" + o + "/" + t;
}, CosCloud.prototype.updateFolder = function(t, e, o, i, r) {
    i = fixPath.call(this, i, "folder"), this.updateBase(t, e, o, i, r);
}, CosCloud.prototype.updateFile = function(t, e, o, i, r) {
    i = fixPath.call(this, i), this.updateBase(t, e, o, i, r);
}, CosCloud.prototype.updateBase = function(t, e, o, i, r, s, a) {
    var n = this;
    n.getAppSignOnce(function(o) {
        var p = n.getCgiUrl(i), u = {
            op: "update"
        };
        r && (u.biz_attr = r), s && (u.authority = s), a && (a = JSON.stringify(a), u.customHeaders = a), 
        wx.request({
            method: "POST",
            url: p,
            header: {
                Authorization: o
            },
            data: u,
            success: t,
            fail: e
        });
    });
}, CosCloud.prototype.deleteFolder = function(t, e, o, i) {
    i = fixPath.call(this, i, "folder"), this.deleteBase(t, e, o, i);
}, CosCloud.prototype.deleteFile = function(t, e, o, i) {
    i = fixPath.call(this, i), this.deleteBase(t, e, o, i);
}, CosCloud.prototype.deleteBase = function(t, e, o, i) {
    if ("/" == i) return void e({
        code: 10003,
        message: "不能删除Bucket"
    });
    var r = this;
    this.getAppSignOnce(function(o) {
        var s = r.getCgiUrl(i), a = {
            op: "delete"
        };
        wx.request({
            method: "POST",
            url: s,
            header: {
                Authorization: o
            },
            data: a,
            success: t,
            fail: e
        });
    });
}, CosCloud.prototype.getFolderStat = function(t, e, o, i) {
    i = fixPath(i, "folder"), this.statBase(t, e, o, i);
}, CosCloud.prototype.getFileStat = function(t, e, o, i) {
    i = fixPath(i), this.statBase(t, e, o, i);
}, CosCloud.prototype.statBase = function(t, e, o, i) {
    var r = this;
    this.getAppSign.call(r, function(o) {
        var s = r.getCgiUrl(i), a = {
            op: "stat"
        };
        wx.request({
            url: s,
            method: "GET",
            header: {
                Authorization: o
            },
            data: a,
            success: t,
            fail: e
        });
    });
}, CosCloud.prototype.createFolder = function(t, e, o, i, r) {
    var s = this;
    this.getAppSign(function(o) {
        i = fixPath(i, "folder");
        var a = s.getCgiUrl(i), n = {
            op: "create",
            biz_attr: r || ""
        };
        wx.request({
            method: "POST",
            url: a,
            header: {
                Authorization: o
            },
            data: n,
            success: t,
            fail: e
        });
    });
}, CosCloud.prototype.copyFile = function(t, e, o, i, r, s) {
    var a = this;
    this.getAppSign(function(o) {
        i = fixPath(i);
        var n = a.getCgiUrl(i), p = {
            op: "copy",
            dest_fileid: r,
            to_over_write: s
        };
        wx.request({
            method: "POST",
            url: n,
            header: {
                Authorization: o
            },
            data: p,
            success: t,
            fail: e
        });
    });
}, CosCloud.prototype.moveFile = function(t, e, o, i, r, s) {
    var a = this;
    this.getAppSign(function(o) {
        i = fixPath(i);
        var n = a.getCgiUrl(i), p = {
            op: "move",
            dest_fileid: r,
            to_over_write: s
        };
        wx.request({
            method: "POST",
            url: n,
            header: {
                Authorization: o
            },
            data: p,
            success: t,
            fail: e
        });
    });
}, CosCloud.prototype.getFolderList = function(t, e, o, i, r, s, a, n, p) {
    var u = this;
    i = fixPath(i, "folder"), u.listBase(t, e, o, i, r, s, a, n);
}, CosCloud.prototype.listBase = function(t, e, o, i, r, s, a, n, p) {
    var u = this;
    u.getAppSign(function(o) {
        var p = u.getCgiUrl(i);
        r = r || 20, s = s || "", a = a || 0, n = n || "eListBoth";
        var l = {
            op: "list",
            num: r,
            context: s,
            order: a,
            pattern: n
        };
        wx.request({
            url: p,
            method: "GET",
            header: {
                Authorization: o
            },
            data: l,
            success: t,
            fail: e
        });
    });
}, CosCloud.prototype.uploadFile = function(t, e, o, i, r, s) {
    if ("object" == (void 0 === t ? "undefined" : _typeof(t))) {
        var a = t;
        t = a.success, e = a.error, a.bucket, i = a.path, r = a.filepath, s = a.insertOnly;
        var n = a.bizAttr;
    }
    var p = this;
    i = fixPath(i), p.getAppSign(function(o) {
        var a = p.getCgiUrl(i), u = {
            op: "upload"
        };
        s >= 0 && (u.insertOnly = s), n && (u.biz_attr = n), wx.uploadFile({
            url: a,
            filePath: r,
            name: "fileContent",
            header: {
                Authorization: o
            },
            formData: u,
            success: function(e) {
                e.data = JSON.parse(e.data), t.call(this, e);
            },
            fail: e
        });
    });
}, module.exports = CosCloud;