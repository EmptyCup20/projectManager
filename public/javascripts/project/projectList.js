$(function () {

    var ProjectList = function () {
        this.user = document.cookie.split('=')[1];
        if(!this.user){
            window.location.href = '/';
        }
        this.$table = $('#table');
        this.$saveProject = $('#saveProject');
        this.$projectName = $('#projectName');
        this.$projectDecUrl = $('#projectDecUrl');
        this.$projectUploader = $('#projectUploader');
        this.$addProjectModal = $('#addProjectModal');
        this.initGrid();
        this.initEvent();
    };

    ProjectList.prototype.initGrid = function () {
        var _that = this;
        this.$table.bootstrapTable({
            url: '/api/getProjectList',
            queryParams: function (params) {
                return $.extend(params, {
                    pageSize: 15,
                    pageNumber: 1
                })
            },
            responseHandler: function (res) {
                return res.rows
            },
            pageNumber: 1,
            pageSize: 13,
            pagination: true,
            columns: [{
                field: 'title',
                title: '项目名称',
                formatter: function (v, rowData) {
                    return '<a href="' + rowData.detailUrl + '">' + rowData.title + '</a>'
                }
            },{
                field:'projectFile',
                title:'源文件',
                formatter: function (v, rowData) {
                    return '<a href="' + rowData.projectFile + '">下载</a>'
                }
            }, {
                field: 'score',
                title: '分数',
                formatter: function(value){
                    var m = 0;
                    if(value.length){
                        value.forEach(function(n){
                            m += Number(n.score);
                        });
                        value = m/value.length
                    }else{
                        value = m;
                    }
                    return "<strong>"+value.toFixed(2)+"</strong>"
                }
            }/*, {
                title: "操作",
                formatter: function (v, rowData) {
                    return "<button class='btn btn-sm btn-icon btn-flat btn-default' type='button' data-action='del' data-rowid='" + rowData._id + "'>" +
                        "<i class='glyphicon glyphicon-remove'></i>" +
                        "</button>";
                }
            }*/, {
                title: '',
                formatter: function (v,rowData) {
                    var html = '';
                    rowData.score.forEach(function(n){
                        if(n.username === _that.user){
                            html = "<input type='text' value='"+ n.score +"' style='width: 40px;height:22px; text-align: center;margin-right: 10px;' disabled/> <button class='btn btn-primary btn-xs' disabled class='submitScore'>提交</button>"
                        }
                    });
                    return html ? html : "<input type='text' value='0' style='width: 40px;height:22px; text-align: center;margin-right: 10px;'/> <button class='btn btn-primary btn-xs' class='submitScore'>提交</button>"
                },
                events: {
                    "click button": function (event, value, row) {
                        $.ajax({
                            url: '/api/score',
                            type: 'post',
                            data: {
                                projectId: row._id,
                                username: _that.user,
                                score: +$(this).closest('td').find('input').val()
                            }
                        }).done(function (data) {
                            if(data.success){
                                alertify.success(data.message);
                                _that.$table.bootstrapTable('refresh',{silent: true});
                            }else{
                                alertify.error(data.message);
                            }

                        })
                    }
                }
            }]
        });
    };

    ProjectList.prototype.initEvent = function () {
        var _that = this;
        /**
         * 文件上传
         */
        this.$projectUploader.fileupload({
            url: "/api/fileUploader",
            formData: {
                name: "file"
            },
            done: function (t, result) {
                var res = result.result;
                if (res.success) {
                    alertify.success(res.message);
                    _that.fileDownUrl = res.data.downloadUrl;
                } else {
                    alertify.error(res.message);
                }
            }
        });

        /**
         * 保存新增项目事件
         */
        this.$saveProject.on('click', function () {
            if (!_that.$projectName.val() || !_that.$projectDecUrl.val() || !_that.fileDownUrl) {
                alert('填写信息不完成');
                return;
            }
            $.ajax({
                url: "/api/addProject",
                type: 'post',
                data: {
                    title: _that.$projectName.val(),
                    detailUrl: _that.$projectDecUrl.val(),
                    projectFile: _that.fileDownUrl
                }
            }).done(function (data) {
                if(data.success){
                    alertify.success(data.message);
                    _that.$addProjectModal.modal('hide');
                    _that.$table.bootstrapTable('refresh',{silent: true});
                }else{
                    alertify.error(data.message);
                }
            })
        });
    };
    new ProjectList();
});