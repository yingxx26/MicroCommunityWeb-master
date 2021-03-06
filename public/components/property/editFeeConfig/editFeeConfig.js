(function (vc, vm) {
    vc.extends({
        data: {
            editFeeConfigInfo: {
                configId: '',
                feeTypeCd: '',
                feeName: '',
                feeFlag: '',
                startTime: '',
                endTime: '',
                computingFormula: '',
                squarePrice: '',
                additionalAmount: '0.00',
                isDefault: '',
                feeTypeCds: [],
                computingFormulas: [],
                feeFlags: [],
                billTypes: [],
                paymentCds: [],
                billType: '',
                paymentCycle: '',
                paymentCd: '',
                computingFormulaText: ''
            }
        },
        _initMethod: function () {
            vc.component._initEditFeeConfigDateInfo();
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                vc.component.editFeeConfigInfo.feeTypeCds = _data;
            });
            vc.getDict('pay_fee_config', "computing_formula", function (_data) {
                vc.component.editFeeConfigInfo.computingFormulas = _data;
            });
            vc.getDict('pay_fee_config', 'fee_flag', function (_data) {
                vc.component.editFeeConfigInfo.feeFlags = _data;
            });
            vc.getDict('pay_fee_config', 'bill_type', function (_data) {
                vc.component.editFeeConfigInfo.billTypes = _data;
            });
            vc.getDict('pay_fee_config', 'payment_cd', function (_data) {
                vc.component.editFeeConfigInfo.paymentCds = _data;
            });
        },
        _initEvent: function () {
            vc.on('editFeeConfig', 'openEditFeeConfigModal',
                function (_params) {
                    vc.component.refreshEditFeeConfigInfo();
                    $('#editFeeConfigModel').modal('show');
                    vc.copyObject(_params, vc.component.editFeeConfigInfo);
                    vc.component.editFeeConfigInfo.communityId = vc.getCurrentCommunity().communityId;
                });
        },
        methods: {
            _initEditFeeConfigDateInfo: function () {
                //vc.component.editFeeConfigInfo.startTime = vc.dateTimeFormat(new Date().getTime());
                $('.editFeeConfigStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editFeeConfigStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editFeeConfigStartTime").val();
                        vc.component.editFeeConfigInfo.startTime = value;
                    });
                $('.editFeeConfigEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editFeeConfigEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editFeeConfigEndTime").val();
                        var start = Date.parse(new Date(vc.component.editFeeConfigInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("????????????????????????????????????????????????")
                            $(".editFeeConfigEndTime").val('')
                        } else {
                            vc.component.editFeeConfigInfo.endTime = value;
                        }
                    });
                //??????????????????????????????????????????
                document.getElementsByClassName("form-control editFeeConfigStartTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control editFeeConfigEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            editFeeConfigValidate: function () {
                return vc.validate.validate({
                    editFeeConfigInfo: vc.component.editFeeConfigInfo
                },
                    {
                        'editFeeConfigInfo.feeTypeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        ],
                        'editFeeConfigInfo.feeName': [{
                            limit: "required",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        {
                            limit: "maxin",
                            param: "1,100",
                            errInfo: "????????????????????????100???"
                        },
                        ],
                        'editFeeConfigInfo.feeFlag': [{
                            limit: "required",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        ],
                        'editFeeConfigInfo.startTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "??????????????????????????????"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "?????????????????????????????????????????????"
                        },
                        ],
                        'editFeeConfigInfo.endTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "??????????????????????????????"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "?????????????????????????????????????????????"
                        },
                        ],
                        'editFeeConfigInfo.computingFormula': [{
                            limit: "required",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        ],
                        'editFeeConfigInfo.squarePrice': [{
                            limit: "required",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        {
                            limit: "moneyModulus",
                            param: "",
                            errInfo: "??????????????????????????????1.5000"
                        },
                        ],
                        'editFeeConfigInfo.additionalAmount': [{
                            limit: "required",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        {
                            limit: "moneyModulus",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        ],
                        'editFeeConfigInfo.configId': [{
                            limit: "required",
                            param: "",
                            errInfo: "?????????ID????????????"
                        }],
                        'editFeeConfigInfo.billType': [{
                            limit: "required",
                            param: "",
                            errInfo: "????????????????????????"
                        }],
                        'editFeeConfigInfo.paymentCycle': [{
                            limit: "required",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "??????????????????????????? ?????????"
                        },
                        ],
                        'editFeeConfigInfo.paymentCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        ]
                    });
            },
            editFeeConfig: function () {
                
                //????????????
                if (vc.component.editFeeConfigInfo.computingFormula == '2002') {
                    vc.component.editFeeConfigInfo.squarePrice = "0.00";
                }
                //???????????????
                if (vc.component.editFeeConfigInfo.computingFormula == '7007'
                || vc.component.editFeeConfigInfo.computingFormula == '4004'
                || vc.component.editFeeConfigInfo.computingFormula == '1101'
                || vc.component.editFeeConfigInfo.computingFormula == '9009') {
                    vc.component.editFeeConfigInfo.squarePrice = "0.00";
                    vc.component.editFeeConfigInfo.additionalAmount = "0.00";
                }
                if (vc.component.editFeeConfigInfo.feeFlag == '2006012') {
                    vc.component.editFeeConfigInfo.paymentCycle = '1';
                }
                //??????????????????
                vc.component.editFeeConfigInfo.feeName = vc.component.editFeeConfigInfo.feeName.trim();
                //??????????????????
                vc.component.editFeeConfigInfo.squarePrice = vc.component.editFeeConfigInfo.squarePrice.trim();
                //??????????????????
                vc.component.editFeeConfigInfo.additionalAmount = vc.component.editFeeConfigInfo.additionalAmount.trim();
                //??????????????????
                vc.component.editFeeConfigInfo.paymentCycle = vc.component.editFeeConfigInfo.paymentCycle.trim();
                if (!vc.component.editFeeConfigValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.post('editFeeConfig', 'update', JSON.stringify(vc.component.editFeeConfigInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //??????model
                            $('#editFeeConfigModel').modal('hide');
                            vc.emit('feeConfigManage', 'listFeeConfig', {});
                            vc.toast("????????????");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('??????????????????');
                        vc.toast(errInfo);
                    });
            },
            refreshEditFeeConfigInfo: function () {
                var _feeTypeCds = vc.component.editFeeConfigInfo.feeTypeCds;
                var _computingFormulas = vc.component.editFeeConfigInfo.computingFormulas;
                var _feeFlags = vc.component.editFeeConfigInfo.feeFlags;
                var _billTypes = vc.component.editFeeConfigInfo.billTypes;
                var _paymentCds = vc.component.editFeeConfigInfo.paymentCds;
                vc.component.editFeeConfigInfo = {
                    configId: '',
                    feeTypeCd: '',
                    feeName: '',
                    feeFlag: '',
                    startTime: '',
                    endTime: '',
                    computingFormula: '',
                    squarePrice: '',
                    additionalAmount: '',
                    isDefault: '',
                    paymentCycle: '',
                    paymentCd: '',
                    billType: '',
                    computingFormulaText: ''
                };
                vc.component.editFeeConfigInfo.feeTypeCds = _feeTypeCds;
                vc.component.editFeeConfigInfo.computingFormulas = _computingFormulas;
                vc.component.editFeeConfigInfo.feeFlags = _feeFlags;
                vc.component.editFeeConfigInfo.billTypes = _billTypes;
                vc.component.editFeeConfigInfo.paymentCds = _paymentCds;
            }
        }
    });
})(window.vc, window.vc.component);