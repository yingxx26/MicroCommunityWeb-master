/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            parkingAreaControlVideoInfo: {
                paId: '',
                inMachineId: '',
                outMachineId: '',
                inMachines: [],
                outMachines: []

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('parkingAreaControlVideo', 'notify', function (param) {
                if (param.hasOwnProperty('paId')) {
                    $that.parkingAreaControlVideoInfo.paId = param.paId;
                    $that._listMachines();
                }
            })
        },
        methods: {
            _listMachines: function () {
                let param = {
                    params: {
                        locationObjId: $that.parkingAreaControlVideoInfo.paId,
                        page: 1,
                        row: 100,
                        machineTypeCd: '9996',
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                //发送get请求
                vc.http.get('machineManage',
                    'list',
                    param,
                    function (json, res) {
                        let _machineManageInfo = JSON.parse(json);
                        let _machines = _machineManageInfo.machines;
                        _machines.forEach(item => {
                            if (item.direction == '3306') {
                                $that.parkingAreaControlVideoInfo.inMachines.push(item);
                            } else {
                                $that.parkingAreaControlVideoInfo.outMachines.push(item);
                            }
                        });

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _swatchVedio: function () {
                //创建一个socket实例
                let wsUrl = "";
                let _enterMachineId = $that.parkingAreaControlVideoInfo.inMachineId;
                $that.parkingAreaControlVideoInfo.inMachines.forEach((item) => {
                    if (item.machineId == _enterMachineId) {
                        wsUrl = item.machineIp;
                        if (item.machineVersion.indexOf('300') > -1) {
                            wsUrl += "/ws.flv"
                        } else {
                            wsUrl += "/ws"
                        }
                    }
                });

                wsUrl = wsUrl.replace(':8131', ':9080');
                let _protocol = window.location.protocol;
                if (_protocol.startsWith('https')) {
                    wsUrl =
                        "wss://" + wsUrl;
                } else {
                    wsUrl =
                        "ws://" + wsUrl;
                }
                let image = document.getElementById("receiver1");
                if (wsUrl.endsWith(".flv")) {
                    image = document.getElementById("receiver1Div");
                    let jessibuca = new Jessibuca({
                        container: image,
                        videoBuffer: 0.2,
                        isResize: false,
                    });
                    jessibuca.onLoad = function () {
                        this.play(wsUrl);
                    };
                    return;
                }
                let receiver_socket = new WebSocket(wsUrl);
                // 监听消息
                receiver_socket.onmessage = function (data) {
                    let reader = new FileReader();
                    reader.onload = function (evt) {
                        if (evt.target.readyState == FileReader.DONE) {
                            let url = evt.target.result;
                            image.src = "data:image/png;" + url;
                        }
                    };
                    reader.readAsDataURL(data.data);
                };
            },
            _swatchOutVedio: function () {
                //创建一个socket实例
                let wsUrl = "";
                let _outMachineId = $that.parkingAreaControlVideoInfo.outMachineId;
                let paId = "";
                $that.parkingAreaControlVideoInfo.outMachines.forEach((item) => {
                    if (item.machineId == _outMachineId) {
                        wsUrl = item.machineIp;
                        paId = item.locationObjId;
                        if (item.machineVersion.indexOf('300') > -1) {
                            wsUrl += "/ws.flv"
                        } else {
                            wsUrl += "/ws"
                        }
                    }
                });
                wsUrl = wsUrl.replace(':8131', ':9080')
                let _protocol = window.location.protocol;
                if (_protocol.startsWith('https')) {
                    wsUrl =
                        "wss://" + wsUrl;
                } else {
                    wsUrl =
                        "ws://" + wsUrl;
                }

                let image = document.getElementById("receiver2");
                if (wsUrl.endsWith(".flv")) {
                    image = document.getElementById("receiver2Div");
                    let jessibuca = new Jessibuca({
                        container: image,
                        videoBuffer: 0.2,
                        isResize: false,
                    });
                    jessibuca.onLoad = function () {
                        this.play(wsUrl);
                    };
                    return;
                }
                let receiver_socket = new WebSocket(wsUrl);
                // 监听消息
                receiver_socket.onmessage = function (data) {
                    //image.src = 'data:image/png;' + data.data;
                    let reader = new FileReader();
                    reader.onload = function (evt) {
                        if (evt.target.readyState == FileReader.DONE) {
                            let url = evt.target.result;
                            image.src = "data:image/png;" + url;
                        }
                    };
                    reader.readAsDataURL(data.data);
                };
            },
            _openDoor: function (_inOut) {
                let _machines = [];
                let _machineId = "";
                if (_inOut == 'in') {
                    _machines = $that.parkingAreaControlVideoInfo.inMachines;
                    _machineId = $that.parkingAreaControlVideoInfo.inMachineId;
                } else {
                    _machines = $that.parkingAreaControlVideoInfo.outMachines;
                    _machineId = $that.parkingAreaControlVideoInfo.outMachineId;
                }

                if (_machines.length == 0) {
                    vc.toast('请先选择设备');
                    return;
                }
                let _machineCode = '';
                _machines.forEach(item => {
                    if (item.machineId == _machineId) {
                        _machineCode = item.machineCode;
                    }
                })
                let _data = {
                    "machineCode": _machineCode,
                    "stateName": "开门",
                    "state": "1500",
                    "url": "/machine/openDoor",
                    "userRole": "staff",
                    "communityId": vc.getCurrentCommunity().communityId
                };
                vc.http.apiPost('/machine/openDoor',
                    JSON.stringify(_data),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _data = JSON.parse(json);
                        if (_data.code != 0) {
                            vc.toast(_data.msg);
                        } else {
                            vc.toast('已请求设备');
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            customCarIn: function (_type) {
                vc.emit('parkingAreaControlCustomCarInout', 'open', {
                    type: _type
                })
            }

        }
    });
})(window.vc);