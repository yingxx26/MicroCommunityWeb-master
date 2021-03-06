/**
 导航栏
 **/
(function (vc) {
    let DEFAULT_PAGE = 1;
    let DEFAULT_ROW = 10;
    var vm = new Vue({
        el: '#nav',
        data: {
            nav: {
                moreNoticeUrl: '/admin.html#/pages/common/noticeManage',
                notices: [],
                total: 0,
                _currentCommunity: '',
                communityInfos: []
            },
            logo: '',
            userName: "",

        },
        mounted: function () {
            this._initSysInfo();
            this.getNavCommunity(1, 3);
            this.getNavData();
            //this.getUserInfo();
        },
        methods: {
            _initSysInfo: function () {
                var sysInfo = vc.getData("_sysInfo");
                if (sysInfo == null) {
                    this.logo = "HC";
                    return;
                }
                this.logo = sysInfo.logo;
            },
            getNavData: function () {

                var param = {
                    params: {
                        page: 1,
                        row: 3,
                        communityId: vc.getCurrentCommunity().communityId
                    }

                };

                //发送get请求
                vc.http.get('nav',
                    'getNavData',
                    param,
                    function (json) {
                        var _noticeObj = JSON.parse(json);
                        vm.nav.notices = _noticeObj.msgs;
                        vm.nav.total = _noticeObj.total;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );

            },
            logout: function () {
                var param = {
                    msg: 123
                };
                //发送get请求
                vc.http.post('nav',
                    'logout',
                    JSON.stringify(param),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {
                            vc.jumpToPage("/user.html#/pages/frame/login");
                            return;
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            getUserInfo: function () {
                //                var _userInfo = vc.getData("_userInfo");
                //                //浏览器缓存中能获取到
                //                if(_userInfo != null && _userInfo != undefined){
                //                    vm.userName = _userInfo.name;
                //                    return ;
                //                }
                //获取用户名
                var param = {
                    msg: '123',
                };

                //发送get请求
                vc.http.get('nav',
                    'getUserInfo',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            var tmpUserInfo = JSON.parse(json);
                            console.log(vm, tmpUserInfo);
                            vm.userName = tmpUserInfo.name;
                            //加个水印
                            if (tmpUserInfo.watermark == 'true') {
                                vc.watermark({ watermark_txt: vc.i18n('systemName') + ":" + tmpUserInfo.name });
                            }
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            getNavCommunity: function (_page, _row) {
                var _tmpCurrentCommunity = vc.getCurrentCommunity();
                //浏览器缓存中能获取到
                if (_tmpCurrentCommunity != null && _tmpCurrentCommunity != undefined) {
                    this.nav._currentCommunity = _tmpCurrentCommunity;
                    this.nav.communityInfos = vc.getCommunitys();

                    return;
                }

                //说明缓存中没有数据
                //发送get请求
                /**
                 [{community:"123123",name:"测试1小区"},{community:"223123",name:"测试2小区"}]
                 **/
                var param = {
                    params: {
                        _uid: '123mlkdinkldldijdhuudjdjkkd',
                        page: _page,
                        row: _row
                    }
                };
                vc.http.get('nav',
                    'getCommunitys',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            vm.nav.communityInfos = JSON.parse(json).communitys;

                            if (vm.nav.communityInfos == null || vm.nav.communityInfos.length == 0) {
                                vm.nav._currentCommunity = {
                                    name: "还没有入驻小区"
                                };
                                return;
                            }

                            vm.nav._currentCommunity = vm.nav.communityInfos[0];
                            vc.setCurrentCommunity(vm.nav._currentCommunity);
                            vc.setCommunitys(vm.nav.communityInfos);

                            //对首页做特殊处理，因为首页在加载数据时还没有小区信息 会报错
                            if (vm.nav.communityInfos != null && vm.nav.communityInfos.length > 0) {
                                vc.emit("indexContext", "_queryIndexContextData", {});
                                vc.emit("indexArrears", "_listArrearsData", {});
                            }

                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );

            },
            changeCommunity: function (_community) {
                vc.setCurrentCommunity(_community);
                vm.nav._currentCommunity = _community;
                //中心加载当前页
                location.reload();
            },
            _noticeDetail: function (_msg) {
                //console.log(_notice.noticeId);
                //vc.jumpToPage("/admin.html#/noticeDetail?noticeId="+_notice.noticeId);

                //标记为消息已读
                vc.http.post('nav',
                    'readMsg',
                    JSON.stringify(_msg),
                    function (json, res) {
                        if (res.status == 200) {
                            vc.jumpToPage(_msg.url);
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _doMenu: function () {
                let body = document.getElementsByTagName("body")[0];

                let className = body.className;

                if (className.indexOf("mini-navbar") != -1) {
                    body.className = className.replace(/mini-navbar/g, "");
                    return;
                }
                body.className = className + " mini-navbar";
            },
            _chooseMoreCommunity: function () {
                vc.emit('chooseEnterCommunity', 'openChooseEnterCommunityModel', {});
            },
            _viewDocument: function () {
                vc.emit('document', 'openDocument', {});
            }
        }
    });

    vm.getUserInfo();

    //建立websocket 消息连接
    let _userId = vc.getData('/nav/getUserInfo').userId;

    let _protocol = window.location.protocol;
    let url = '';
    if (_protocol.startsWith('https')) {
        url =
            "wss://" + window.location.host + "/app/message/" +
            _userId;
    } else {
        url =
            "ws://" + window.location.host + "/app/message/" +
            _userId;
    }


    if ("WebSocket" in window) {
        websocket = new WebSocket(url);
    } else if ("MozWebSocket" in window) {
        websocket = new MozWebSocket(url);
    } else {
        websocket = new SockJS(url);
    }

    //连接发生错误的回调方法
    websocket.onerror = function () {
        console.log("初始化失败");
        this.$notify.error({
            title: "错误",
            message: "连接失败，请检查网络"
        });
    };

    //连接成功建立的回调方法
    websocket.onopen = function () {
        console.log("ws初始化成功");
    };

    //接收到消息的回调方法
    websocket.onmessage = function (event) {
        console.log("event", event);
        //let _data = event.data;
        let _data = JSON.parse(_data);
        if (_data.code == 200) {
            toastr.info(_data.msg);
        } else {
            toastr.error(_data.msg);
        }
    };

    //连接关闭的回调方法
    websocket.onclose = function () {
        console.log("初始化失败");
        this.$notify.error({
            title: "错误",
            message: "连接关闭，请刷新浏览器"
        });
    };

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
        websocket.close();
    };

})(window.vc);