(function (vc, vm) {

    vc.extends({
        data: {
            editRentingAppointmentInfo: {
                appointmentId: '',
                tenantName: '',
                tenantSex: '',
                tenantTel: '',
                appointmentTime: '',
                appointmentRoomId: '',
                remark: '',
            }
        },
        _initMethod: function () {
            $that._initEditAppointmentTime();
        },
        _initEvent: function () {
            vc.on('editRentingAppointment', 'openEditRentingAppointmentModal', function (_params) {
                vc.component.refreshEditRentingAppointmentInfo();
                $('#editRentingAppointmentModel').modal('show');
                vc.copyObject(_params, vc.component.editRentingAppointmentInfo);
                vc.component.editRentingAppointmentInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            _initEditAppointmentTime: function () {
                $('.editAppointmentTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true

                });
                $('.editAppointmentTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editAppointmentTime").val();
                        vc.component.editRentingAppointmentInfo.appointmentTime = value;
                    });
            },
            editRentingAppointmentValidate: function () {
                return vc.validate.validate({
                    editRentingAppointmentInfo: vc.component.editRentingAppointmentInfo
                }, {
                    'editRentingAppointmentInfo.tenantName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "????????????????????????64???"
                        },
                    ],
                    'editRentingAppointmentInfo.tenantSex': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "??????????????????"
                        },
                    ],
                    'editRentingAppointmentInfo.tenantTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "?????????????????????"
                        },
                    ],
                    'editRentingAppointmentInfo.appointmentTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                    ],
                    'editRentingAppointmentInfo.appointmentRoomId': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "????????????????????????"
                        },
                    ],
                    'editRentingAppointmentInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "??????????????????500???"
                        },
                    ],
                    'editRentingAppointmentInfo.appointmentId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "??????ID????????????"
                        }]

                });
            },
            editRentingAppointment: function () {
                if (!vc.component.editRentingAppointmentValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/rentingAppointment/updateRentingAppointment',
                    JSON.stringify(vc.component.editRentingAppointmentInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //??????model
                            $('#editRentingAppointmentModel').modal('hide');
                            vc.emit('rentingAppointmentManage', 'listRentingAppointment', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('??????????????????');

                        vc.message(errInfo);
                    });
            },
            refreshEditRentingAppointmentInfo: function () {
                vc.component.editRentingAppointmentInfo = {
                    appointmentId: '',
                    tenantName: '',
                    tenantSex: '',
                    tenantTel: '',
                    appointmentTime: '',
                    appointmentRoomId: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
