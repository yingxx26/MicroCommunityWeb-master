(function (vc, vm) {
    vc.extends({
        data: {
            editResourceStoreInfo: {
                resId: '',
                resName: '',
                resCode: '',
                rstId: '',
                rssId: '',
                price: '',
                description: '',
                rstIds: [],
                unitCode: '',
                miniUnitCode: '',
                miniUnitStock: '',
                unitCodes: [],
                outLowPrice: '',
                outHighPrice: '',
                showMobile: 'N',
                fileUrls: [],
                resourceStoreTypes: [],
                remark: '',
                warningStock: '',
                resourceStoreSpecifications: [],
                shType: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editResourceStore', 'openEditResourceStoreModal', function (_params) {
                $('#editResourceStoreModel').modal('show');
                vc.component.refreshEditResourceStoreInfo();
                $that._listEditResourceStoreType();
                vc.copyObject(_params, vc.component.editResourceStoreInfo);
                vc.component.editResourceStoreInfo.fileUrls = _params.fileUrls
                if (_params.fileUrls) {
                    vc.component._freshPhoto(vc.component.editResourceStoreInfo.fileUrls);
                }
                //与字典表单位关联
                vc.getDict('resource_store', "unit_code", function (_data) {
                    vc.component.editResourceStoreInfo.unitCodes = _data;
                });
                vc.component.editResourceStoreInfo.communityId = vc.getCurrentCommunity().communityId;
                $that._loadResourceStoreSpecificationEdit();
            });
            vc.on("editResourceStore", "notifyUploadImage", function (_param) {
                vc.component.editResourceStoreInfo.fileUrls = _param;
            });
        },
        methods: {
            editResourceStoreValidate: function () {
                return vc.validate.validate({
                    editResourceStoreInfo: vc.component.editResourceStoreInfo
                }, {
                    'editResourceStoreInfo.resName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,100",
                            errInfo: "物品名称长度为2至100"
                        },
                    ],
                    'editResourceStoreInfo.resCode': [
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "物品编码不能超过50位"
                        },
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品编码不能为空"
                        }
                    ],
                    'editResourceStoreInfo.price': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品价格不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "物品价格格式错误"
                        },
                    ],

                    'editResourceStoreInfo.warningStock': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "警告库存不能为空"
                        },
                    ],
                    'editResourceStoreInfo.description': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "描述不能为空"
                        },
                    ],
                    'editResourceStoreInfo.resId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品ID不能为空"
                        }
                    ],
                    'editResourceStoreInfo.showMobile': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机端显示不能为空"
                        },
                    ],
                    'editResourceStoreInfo.outLowPrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "最低收费标准不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "收费标准格式错误"
                        },
                    ],
                    'editResourceStoreInfo.outHighPrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "最高收费标准不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "收费标准格式错误"
                        },
                    ],
                    'editResourceStoreInfo.unitCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "单位不能为空"
                        },
                    ],
                    'editResourceStoreInfo.miniUnitCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "最小计量单位不能为空"
                        },
                    ],
                    'editResourceStoreInfo.miniUnitStock': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "最小计量单位数量不能为空"
                        },
                    ],
                    'editResourceStoreInfo.rstId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品类型不能为空"
                        },
                    ],
                });
            },
            decide: function () {
                if ($that.editResourceStoreInfo.outLowPrice > $that.editResourceStoreInfo.outHighPrice) {
                    vc.toast("最高收费标准不能小于最低收费标准！")
                    $that.editResourceStoreInfo.outHighPrice = "";
                }
            },
            editResourceStore: function () {
                if (!vc.component.editResourceStoreValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.post(
                    'editResourceStore',
                    'update',
                    JSON.stringify(vc.component.editResourceStoreInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editResourceStoreModel').modal('hide');
                            vc.emit('resourceStoreManage', 'listResourceStore', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _freshPhoto: function (_photos) {
                vc.emit('editResourceStore', 'uploadImage', 'notifyPhotos', _photos);
            },
            //查询物品类型
            _listEditResourceStoreType: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.get('resourceStoreTypeManage',
                    'list',
                    param,
                    function (json, res) {
                        var _resourceStoreType = JSON.parse(json);
                        vc.component.editResourceStoreInfo.rstIds = _resourceStoreType.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 分类改变事件
            resourceStoreTypesOnChangeEdit: function () {
                if (vc.component.editResourceStoreInfo.rstId == '') {
                    vc.component.resourceStoreSpecification = [];
                    return;
                }
                vc.component._loadResourceStoreSpecificationEdit();
            },
            // 根据分类查询规格
            _loadResourceStoreSpecificationEdit: function () {
                if (!vc.component.editResourceStoreInfo.rstId) return;
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        rstId: vc.component.editResourceStoreInfo.rstId
                    }
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json, res) {
                        var _editResourceStoreInfo = JSON.parse(json);
                        console.log('res', _editResourceStoreInfo.data);
                        vc.component.editResourceStoreInfo.resourceStoreSpecifications = _editResourceStoreInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            refreshEditResourceStoreInfo: function () {
                vc.component.editResourceStoreInfo = {
                    resId: '',
                    resName: '',
                    resCode: '',
                    rstId: '',
                    rssId: '',
                    price: '',
                    description: '',
                    rstIds: [],
                    unitCode: '',
                    miniUnitCode: '',
                    miniUnitStock: '',
                    unitCodes: [],
                    outLowPrice: '',
                    outHighPrice: '',
                    showMobile: '',
                    remark: '',
                    warningStock: '',
                    resourceStoreSpecifications: [],
                    shType: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
