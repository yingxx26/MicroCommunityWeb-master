(function (vc) {
    vc.extends({
        data: {
            editFeeInfo: {
                feeId: '',
                startTime: '',
                endTime: ''
            }
        },
        _initMethod: function () {
            vc.component._initEditFeeDateInfo();
        },
        _initEvent: function () {
            vc.on('editFee', 'openEditFeeModal',
                function (_fee) {
                    vc.copyObject(_fee, $that.editFeeInfo);
                    if (_fee.startTime.indexOf(":") == -1) {
                        $that.editFeeInfo.startTime = $that.editFeeInfo.startTime + " 00:00:00";
                    }
                    /*if (_fee.endTime.indexOf(":") == -1) {
                        $that.editFeeInfo.endTime = $that.editFeeInfo.endTime;
                    }*/
                    $that.editFeeInfo.endTime = _fee.endTime.split(' ')[0];
                    $('#editFeeModel').modal('show');
                });
        },
        methods: {
            _initEditFeeDateInfo: function () {
                $('.editFeeStartTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editFeeStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editFeeStartTime").val();
                        vc.component.editFeeInfo.startTime = value;
                    });
                $('.editFeeEndTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editFeeEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editFeeEndTime").val();
                        var start = Date.parse(new Date(vc.component.editFeeInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("??????????????????????????????????????????")
                            $(".editFeeEndTime").val('')
                        } else {
                            vc.component.editFeeInfo.endTime = value;
                        }
                    });
                //??????????????????????????????????????????
                document.getElementsByClassName("form-control editFeeStartTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control editFeeEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            editFeeValidate() {
                return vc.validate.validate({
                        editFeeInfo: vc.component.editFeeInfo
                    },
                    {
                        'editFeeInfo.startTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                            {
                                limit: "dateTime",
                                param: "",
                                errInfo: "???????????????????????????????????????"
                            },
                        ],
                        'editFeeInfo.endTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "??????????????????????????????"
                        },
                        ]
                    });
            },
            _doEidtFee: function () {
                if (!vc.component.editFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editFeeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost('fee.updateFee', JSON.stringify(vc.component.editFeeInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //??????model
                            $('#editFeeModel').modal('hide');
                            vc.component.clearAddFeeConfigInfo();
                            vc.emit('listRoomFee', 'notify', {});
                            vc.emit('listParkingSpaceFee', 'notify', {});
                            vc.emit('listContractFee', 'notify', {});
                            vc.emit('simplifyRoomFee', 'notify', {});
                            vc.emit('simplifyCarFee', 'notify', {});
                            vc.emit('simplifyContractFee', 'notify', {});
                            vc.toast("????????????");
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('??????????????????');
                        vc.toast(errInfo);
                    });
            },
            clearAddFeeConfigInfo: function () {
                vc.component.editFeeInfo = {
                    feeId: '',
                    startTime: '',
                    endTime: ''
                };
            }
        }
    });
})(window.vc);