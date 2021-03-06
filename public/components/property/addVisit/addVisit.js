/**
 权限组
 **/
(function(vc){

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data:{
            addVisitInfo:{
                vName:'',
                visitGender:'',
                phoneNumber:'',
                visitTime:'',
                departureTime:''
            }
        },
        _initMethod:function(){
                vc.component._initAddVisitInfo();
        },
        _initEvent:function(){
            vc.on('addVisit','openAddVisitAppModal',function(_app){
                $("#addNewVisitModel").modal("show");
            });

            vc.on('addVisit', 'onIndex', function(_index){
                // vc.component.newVisitInfo.index = _index;
                vc.emit('addVisitSpace', 'notify', _index);
            });

        },
        methods:{
            addAppValidate() {
                return vc.validate.validate({
                    addVisitInfo: vc.component.addVisitInfo
                }, {
                    'addVisitInfo.vName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客姓名不能为空"
                        }
                    ],
                    'addVisitInfo.visitGender': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客性别不能为空"
                        }
                    ],
                    'addVisitInfo.phoneNumber': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客手机号不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "访客手机号不正确"
                        },
                    ],
                    'addVisitInfo.visitTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "访客时间格式错误"
                        },
                    ],
                    'addVisitInfo.departureTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "访客时间格式错误"
                        },
                    ]
                });
            },

            _addNewVisitInfo(){
                if (!vc.component.addAppValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }
                vc.component.addVisitInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.emit("viewVisitInfo", "addNewVisit", vc.component.addVisitInfo);
                $('#addNewVisitModel').modal('hide');
            },
            _openAddAppInfoModel(){
                vc.emit('addApp','openAddAppModal',{});
            },
            _loadAppInfoData:function(){

            },
            _initAddVisitInfo:function(){
                vc.component.addVisitInfo.visitTime = vc.dateTimeFormat(new Date().getTime());
                 $('.addVisitTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true

                });
                $('.addVisitTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addVisitTime").val();
                        vc.component.addVisitInfo.visitTime = value;
                        let start = Date.parse(new Date(vc.component.addVisitInfo.visitTime))
                        let end = Date.parse(new Date(vc.component.addVisitInfo.departureTime))
                        if (end != 0 && start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间")
                            vc.component.addVisitInfo.visitTime = '';
                        }
                    });
                $('.addDepartureTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addDepartureTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addDepartureTime").val();
                        vc.component.addVisitInfo.departureTime = value;
                        let start = Date.parse(new Date(vc.component.addVisitInfo.visitTime))
                        let end = Date.parse(new Date(vc.component.addVisitInfo.departureTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            vc.component.addVisitInfo.departureTime = '';
                        }
                    });
            }
        }

    });

})(window.vc);